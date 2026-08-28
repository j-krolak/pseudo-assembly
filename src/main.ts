import { Interpreter, PreprocessingError } from './interpreter';
import { RuntimeError, type byte } from './interpreter';

import {
  Compartment,
  EditorState,
  type Extension,
  StateEffect,
  StateField,
} from '@codemirror/state';
import { Decoration, EditorView as View, keymap } from '@codemirror/view';
import { defaultKeymap, indentWithTab } from '@codemirror/commands';
import { basicSetup, EditorView } from 'codemirror';
import { boysAndGirls } from 'thememirror';
import { vim } from '@replit/codemirror-vim';
import { examples } from './examples';
import { createDropdown, type DropdownOption } from './dropdown';
import { pasmLanguage, pasmSyntaxHighlighting } from './pasm-language';
import { pasmLabelAlign } from './pasm-align';

// Local storage keys
const CODE_LS_KEY = 'code';
const VIM_MODE_LS_KEY = 'vimMode';
const SYNTAX_HIGHLIGHT_LS_KEY = 'syntaxHighlight';
const LABEL_ALIGN_LS_KEY = 'labelAlign';
const CUSTOM_FILES_LS_KEY = 'customFiles';
const CURRENT_FILE_LS_KEY = 'currentFile';

// HTML elements
const runBtn = document.getElementById('run-btn');
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const registersDiv = document.getElementById('registers');
const memoryDiv = document.getElementById('memory');
const codeDiv = document.getElementById('code') as Element;
const errorsDiv = document.getElementById('errors') as HTMLDivElement;
const examplesDropdown = document.getElementById('examples-select');
const registersFormatDropdown = document.getElementById('registers-format');
const memoryFormatDropdown = document.getElementById('memory-format');
const vimModeToggle = document.getElementById(
  'vim-mode-toggle',
) as HTMLInputElement;
const syntaxHighlightToggle = document.getElementById(
  'syntax-highlight-toggle',
) as HTMLInputElement;
const labelAlignToggle = document.getElementById(
  'label-align-toggle',
) as HTMLInputElement;

type DisplayNumberFormat = 'bin' | 'hex';
let registersFormat: DisplayNumberFormat = 'bin';
let memoryFormat: DisplayNumberFormat = 'bin';

// CodeMirror
let executingLineByLine = false;
const editableCompartment = new Compartment();

// Each toggle below (vim mode, syntax highlighting, label alignment) is a
// feature that can be switched on/off at runtime via its own Compartment,
// remembers its state in local storage, and is wired up the same way -
// see wireToggle() further down.
const vimCompartment = new Compartment();
const vimModeEnabled = localStorage.getItem(VIM_MODE_LS_KEY) === 'true';

const syntaxCompartment = new Compartment();
const syntaxHighlightEnabled =
  localStorage.getItem(SYNTAX_HIGHLIGHT_LS_KEY) !== 'false';
const syntaxExtensions = [pasmLanguage, pasmSyntaxHighlighting];

const labelAlignCompartment = new Compartment();
const labelAlignEnabled = localStorage.getItem(LABEL_ALIGN_LS_KEY) !== 'false';
const labelAlignExtensions = [pasmLabelAlign];

// Files shown in the "files" dropdown: the built-in examples (immutable),
// plus any user-added files, saved to and loaded from local storage.
type FileRef = { kind: 'example'; index: number } | { kind: 'custom'; name: string };

const fileRefToId = (ref: FileRef): string =>
  ref.kind === 'example' ? `example:${ref.index}` : `custom:${ref.name}`;

const parseFileId = (id: string): FileRef | null => {
  if (id.startsWith('example:')) {
    const index = Number(id.slice('example:'.length));
    return Number.isInteger(index) ? { kind: 'example', index } : null;
  }
  if (id.startsWith('custom:')) {
    return { kind: 'custom', name: id.slice('custom:'.length) };
  }
  return null;
};

const loadCustomFiles = (): Record<string, string> => {
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_FILES_LS_KEY) ?? '{}');
  } catch {
    return {};
  }
};

const saveCustomFiles = (files: Record<string, string>) => {
  localStorage.setItem(CUSTOM_FILES_LS_KEY, JSON.stringify(files));
};

let customFiles = loadCustomFiles();

const defaultFileRef: FileRef = { kind: 'example', index: 0 };

let currentFile: FileRef = (() => {
  const stored = localStorage.getItem(CURRENT_FILE_LS_KEY);
  const parsed = stored ? parseFileId(stored) : null;
  if (!parsed) return defaultFileRef;
  if (parsed.kind === 'custom' && !(parsed.name in customFiles)) {
    return defaultFileRef;
  }
  if (parsed.kind === 'example' && !examples[parsed.index]) {
    return defaultFileRef;
  }
  return parsed;
})();

const setCurrentFile = (ref: FileRef) => {
  currentFile = ref;
  localStorage.setItem(CURRENT_FILE_LS_KEY, fileRefToId(ref));
};

const persistOnChange = EditorView.updateListener.of((update) => {
  if (update.docChanged) {
    const code = update.state.doc.toString();
    localStorage.setItem(CODE_LS_KEY, code);
    if (currentFile.kind === 'custom') {
      customFiles[currentFile.name] = code;
      saveCustomFiles(customFiles);
    }
  }
});

// Shared machinery for "highlight one line a solid color" - used both for
// the current line during line-by-line execution (green) and for the line
// an error was reported on (red). Only one line is ever highlighted per
// instance at a time: setting a new one replaces the previous.
const createLineHighlighter = (color: string) => {
  const addHighlight = StateEffect.define<number>();
  const removeHighlight = StateEffect.define();
  const mark = Decoration.line({ attributes: { style: `background-color: ${color}` } });

  const field = StateField.define({
    create() {
      return Decoration.none;
    },
    update(lines, tr) {
      lines = lines.map(tr.changes);
      for (let e of tr.effects) {
        if (e.is(addHighlight)) {
          lines = Decoration.none;
          lines = lines.update({ add: [mark.range(e.value)] });
        }

        if (e.is(removeHighlight)) {
          lines = Decoration.none;
        }
      }
      return lines;
    },
    provide: (f) => EditorView.decorations.from(f),
  });

  const highlight = (view: EditorView, lineNumber: number) => {
    if (lineNumber < 1 || lineNumber > view.state.doc.lines) return;
    const docPosition = view.state.doc.line(lineNumber).from;
    view.dispatch({ effects: addHighlight.of(docPosition) });
  };

  const clear = (view: EditorView) => {
    view.dispatch({ effects: removeHighlight.of(null) });
  };

  return { field, highlight, clear };
};

const executionHighlighter = createLineHighlighter('#44aa00ff');
const errorHighlighter = createLineHighlighter('rgba(170, 34, 34, 0.35)');

const highlightError = (view: EditorView, error: RuntimeError | PreprocessingError) => {
  if (error.line !== undefined) errorHighlighter.highlight(view, error.line);
};

// Create a custom theme that only changes the background
const blackBackground = EditorView.theme(
  {
    '&': {
      backgroundColor: '#000 !important',
      color: '#ffffff',
    },
    '.cm-cursor': {
      borderLeftColor: '#44aa00ff !important',
    },
    '&.cm-focused': {
      outline: 'none',
      border: 'none',
    },
  },
  { dark: true },
);

// Vim mode draws its own "fat" block cursor instead of the thin caret above,
// with its own (pink) default color that needs !important to override. Its
// command-line panel also has no background of its own by default, letting
// the page behind it show through.
const vimCursorTheme = EditorView.theme({
  '.cm-fat-cursor': {
    background: '#44aa00ff !important',
  },
  '&:not(.cm-focused) .cm-fat-cursor': {
    background: 'none',
    outline: 'solid 1px #44aa00ff !important',
  },
  '.cm-vim-panel': {
    backgroundColor: '#000 !important',
    color: '#fff !important',
    borderTop: '1px solid #2E2E2E',
  },
});

const vimExtensions = [vim(), vimCursorTheme];

const loadCode = (view: View, code: string) => {
  localStorage.setItem(CODE_LS_KEY, code);
  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: code },
  });
};

// Keeps the cursor from scrolling underneath the sticky bars above and below
// the editor when CodeMirror auto-scrolls to reveal it.
const editorToolbarScrollMargin = EditorView.scrollMargins.of(() => {
  const toolbar = document.getElementById('editor-toolbar');
  const bottomBar = document.getElementById('editor-bottom-bar');
  return {
    top: toolbar?.getBoundingClientRect().height,
    bottom: bottomBar?.getBoundingClientRect().height,
  };
});

let initialCode = examples[0].code;
const item = localStorage.getItem(CODE_LS_KEY);
if (item) {
  initialCode = item;
}
let state = EditorState.create({
  doc: initialCode,
  extensions: [
    vimCompartment.of(vimModeEnabled ? vimExtensions : []),
    syntaxCompartment.of(syntaxHighlightEnabled ? syntaxExtensions : []),
    labelAlignCompartment.of(labelAlignEnabled ? labelAlignExtensions : []),
    keymap.of([...defaultKeymap, indentWithTab]),
    basicSetup,
    editableCompartment.of([EditorView.editable.of(!executingLineByLine)]),
    boysAndGirls,
    executionHighlighter.field,
    errorHighlighter.field,
    blackBackground,
    persistOnChange,
    editorToolbarScrollMargin,
  ],
});

let view = new View({
  state: state,
  parent: codeDiv,
});

const wireToggle = (
  toggle: HTMLInputElement | null,
  lsKey: string,
  enabled: boolean,
  compartment: Compartment,
  extensions: Extension[],
) => {
  if (!toggle) return;
  toggle.checked = enabled;
  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    localStorage.setItem(lsKey, String(isEnabled));
    view.dispatch({
      effects: compartment.reconfigure(isEnabled ? extensions : []),
    });
  });
};

wireToggle(vimModeToggle, VIM_MODE_LS_KEY, vimModeEnabled, vimCompartment, vimExtensions);
wireToggle(
  syntaxHighlightToggle,
  SYNTAX_HIGHLIGHT_LS_KEY,
  syntaxHighlightEnabled,
  syntaxCompartment,
  syntaxExtensions,
);
wireToggle(
  labelAlignToggle,
  LABEL_ALIGN_LS_KEY,
  labelAlignEnabled,
  labelAlignCompartment,
  labelAlignExtensions,
);

let interpreter = new Interpreter(view.state.doc.toString());

const resetInterpreter = () => {
  interpreter.currentLine = 0;
  executingLineByLine = false;
  view.dispatch({
    effects: editableCompartment.reconfigure([EditorView.editable.of(true)]),
  });
  executionHighlighter.clear(view);

  nextBtn.innerHTML = 'run line by line';
};

nextBtn?.addEventListener('click', () => {
  errorsDiv.innerHTML = '';
  errorHighlighter.clear(view);
  if (!executingLineByLine) {
    try {
      const code = view.state.doc.toString();
      interpreter = new Interpreter(code);
      executionHighlighter.highlight(view, interpreter.currentLine + 1);
      interpreter.preprocess();
      executingLineByLine = true;
      view.dispatch({
        effects: editableCompartment.reconfigure([
          EditorView.editable.of(false),
        ]),
      });
      nextBtn.innerHTML = 'next line';

      displayState();
    } catch (error) {
      if (
        error instanceof RuntimeError ||
        error instanceof PreprocessingError
      ) {
        errorsDiv.innerHTML = error.message;
        highlightError(view, error);
      } else {
        console.error(error);
      }
      resetInterpreter();
    }

    return;
  }

  try {
    interpreter.interpretNextLine();
    executionHighlighter.highlight(view, interpreter.currentLine + 1);
    displayState();
  } catch (error) {
    if (error instanceof RuntimeError || error instanceof PreprocessingError) {
      errorsDiv.innerHTML = error.message;
      highlightError(view, error);
    } else {
      console.error(error);
    }
    resetInterpreter();
  }
  if (interpreter.isAtEnd()) {
    resetInterpreter();
  }
});

runBtn?.addEventListener('click', async () => {
  errorsDiv.innerHTML = '';
  errorHighlighter.clear(view);
  resetInterpreter();
  const code = view.state.doc.toString();
  interpreter = new Interpreter(code);
  try {
    interpreter.interpret();

    displayState();
  } catch (error) {
    if (error instanceof RuntimeError || error instanceof PreprocessingError) {
      errorsDiv.innerHTML = error.message;
      highlightError(view, error);
    } else {
      console.error(error);
    }
  }
});

// Match the run shortcuts used by Rider/VS Code/Visual Studio: F5 runs,
// F10 steps line by line. Both keys have browser default actions (page
// reload, menu-bar focus) that need to be suppressed.
window.addEventListener('keydown', (event) => {
  if (event.key === 'F5') {
    event.preventDefault();
    runBtn?.click();
  } else if (event.key === 'F10') {
    event.preventDefault();
    nextBtn?.click();
  }
});

const displayState = () => {
  registersDiv?.replaceChildren(...createRegistersNodes(interpreter.registers));

  memoryDiv?.replaceChildren(...createMemoryDiv(interpreter.bytes));
};

if (registersFormatDropdown) {
  createDropdown(
    registersFormatDropdown,
    [
      { value: 'bin', label: 'binary' },
      { value: 'hex', label: 'hex' },
    ],
    registersFormat,
    (value) => {
      registersFormat = value as DisplayNumberFormat;
      displayState();
    },
  );
}

if (memoryFormatDropdown) {
  createDropdown(
    memoryFormatDropdown,
    [
      { value: 'bin', label: 'binary' },
      { value: 'hex', label: 'hex' },
    ],
    memoryFormat,
    (value) => {
      memoryFormat = value as DisplayNumberFormat;
      displayState();
    },
  );
}

const createRegistersNodes = (registers: Int32Array): Node[] => {
  const registersHTML: Node[] = [];
  registers.forEach((register, i) => {
    const registerHTML = document.createElement('div');
    const registerData = document.createElement('div');

    registerHTML.className = 'register';
    const registerName = 'R' + i.toString();
    registerData.innerHTML = registerName + (i < 10 ? '&nbsp;' : '');

    const formattedValue =
      registersFormat === 'hex'
        ? '0x' + (register >>> 0).toString(16).padStart(8, '0')
        : '0b' + (register >>> 0).toString(2).padStart(32, '0');
    const emptyPrefix = registersFormat === 'hex' ? ' 0x' : ' 0b';
    const emptyWidth = registersFormat === 'hex' ? 11 : 35;

    registerData.innerHTML += interpreter.isRegisterInitialized[i]
      ? ' ' + formattedValue + ' ' + register.toString()
      : emptyPrefix.padEnd(emptyWidth, '~');

    registerHTML.appendChild(registerData);
    registersHTML.push(registerHTML);
  });
  return registersHTML;
};

const createMemoryDiv = (bytes: byte[]): Node[] => {
  const memoryNodes: Node[] = [];
  const width = memoryFormat === 'hex' ? 2 : 8;
  for (let i = 0; i < bytes.length; i += 4) {
    const record = document.createElement('div');
    record.className = 'byte-record';
    record.innerHTML = `0x${i.toString(16).padStart(4, '0')}: `;
    for (let j = i; j < i + 4; j += 1) {
      const byteHTML = document.createElement('div');
      if (j >= interpreter.bytes.length) {
        byteHTML.innerHTML = '&nbsp;'.repeat(width);
        record.appendChild(byteHTML);
        continue;
      }

      if (
        executingLineByLine &&
        j >= interpreter.currentMemoryAddress &&
        j <
          interpreter.currentMemoryAddress +
            interpreter.statements[interpreter.currentLine].byteSize &&
        interpreter.statements[interpreter.currentLine].byteSize > 0
      ) {
        byteHTML.className = 'current-memory';
      }

      const byte = bytes[j];
      switch (byte.type) {
        case 'DATA':
          byteHTML.innerHTML =
            memoryFormat === 'hex'
              ? byte.val.toString(16).padStart(2, '0')
              : byte.val.toString(2).padStart(8, '0');

          break;

        case 'INSTRUCTION':
          byteHTML.innerHTML = 'x'.repeat(width);
          break;
        case 'DATA_HIDDEN':
          byteHTML.innerHTML = '~'.repeat(width);
      }

      record.appendChild(byteHTML);
    }
    const numRepresntation =
      bytes[i].type === 'DATA'
        ? interpreter.bytesToNumber([
            bytes[i],
            bytes[i + 1],
            bytes[i + 2],
            bytes[i + 3],
          ])
        : 'x';
    const repHTML = document.createElement('div');
    repHTML.innerHTML = numRepresntation.toString();
    repHTML.className = 'rep-data';
    record.appendChild(repHTML);
    memoryNodes.push(record);
  }
  return memoryNodes;
};
displayState();

const initFilesDropdown = () => {
  if (!examplesDropdown) return;

  const options: DropdownOption[] = [
    ...examples.map(({ name }, i) => ({
      value: fileRefToId({ kind: 'example', index: i }),
      label: name,
    })),
    ...Object.keys(customFiles)
      .sort()
      .map((name) => ({
        value: fileRefToId({ kind: 'custom', name }),
        label: name,
        deletable: true,
      })),
  ];

  createDropdown(
    examplesDropdown,
    options,
    fileRefToId(currentFile),
    (value) => {
      const ref = parseFileId(value);
      if (!ref) return;
      const code =
        ref.kind === 'example'
          ? examples[ref.index]?.code
          : customFiles[ref.name];
      if (code === undefined) return;

      setCurrentFile(ref);
      loadCode(view, code);
    },
    {
      onDelete: (value) => {
        const ref = parseFileId(value);
        if (!ref || ref.kind !== 'custom') return;
        if (!confirm(`delete "${ref.name}"?`)) return;

        delete customFiles[ref.name];
        saveCustomFiles(customFiles);

        if (currentFile.kind === 'custom' && currentFile.name === ref.name) {
          setCurrentFile(defaultFileRef);
          loadCode(view, examples[0].code);
        }

        initFilesDropdown();
      },
      addItem: {
        label: '+ add file',
        onClick: () => {
          const name = prompt('file name:')?.trim();
          if (!name) return;
          if (name in customFiles) {
            alert(`a file named "${name}" already exists.`);
            return;
          }

          customFiles[name] = view.state.doc.toString();
          saveCustomFiles(customFiles);
          setCurrentFile({ kind: 'custom', name });

          initFilesDropdown();
        },
      },
    },
  );
};

initFilesDropdown();
