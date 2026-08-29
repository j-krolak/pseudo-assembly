import { FLAGS, Interpreter, PreprocessingError } from './interpreter';
import { RuntimeError, type byte } from './interpreter';

import {
  Compartment,
  EditorState,
  type Extension,
  Prec,
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
const MEMORY_VIEW_LS_KEY = 'memoryView';

// HTML elements
const runBtn = document.getElementById('run-btn');
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;
const stopBtn = document.getElementById('stop-btn');
const playBtn = document.getElementById('play-btn') as HTMLButtonElement | null;
const registersDiv = document.getElementById('registers');
const memoryDiv = document.getElementById('memory');
const codeDiv = document.getElementById('code') as Element;
const errorsDiv = document.getElementById('errors') as HTMLDivElement;
const examplesDropdown = document.getElementById('examples-select');
const registersFormatDropdown = document.getElementById('registers-format');
const memoryFormatDropdown = document.getElementById('memory-format');
const memoryViewDropdown = document.getElementById('memory-view');
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

type MemoryView = 'raw' | 'sections' | 'sections-labels';
const memoryViewOptions: MemoryView[] = ['raw', 'sections', 'sections-labels'];
const storedMemoryView = localStorage.getItem(MEMORY_VIEW_LS_KEY);
let memoryView: MemoryView = memoryViewOptions.includes(
  storedMemoryView as MemoryView,
)
  ? (storedMemoryView as MemoryView)
  : 'sections-labels';

// CodeMirror
let executingLineByLine = false;
// True after a full (non-line-by-line) run has finished - the run button
// turns into a "reset" button so the registers/memory state left behind
// can be cleared before running again. See setRunBtnLabel().
let hasRunFully = false;
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

// The byte range (in interpreter.bytes) that the current text selection
// compiles to, or null when nothing (or just a cursor) is selected.
let selectedByteRange: { from: number; to: number } | null = null;

// Keeps the memory panel in sync with the editor: re-preprocessing on
// every edit (while not actively executing, since the editor is
// non-editable then anyway) so memory reflects what's being typed, and
// recomputing the selection's byte range so it can be highlighted.
const syncMemoryWithEditor = EditorView.updateListener.of((update) => {
  if (!update.docChanged && !update.selectionSet) return;

  if (update.docChanged && !executingLineByLine) {
    try {
      const fresh = new Interpreter(update.state.doc.toString());
      fresh.preprocess();
      interpreter = fresh;
    } catch {
      // Mid-edit code is often invalid (e.g. an unfinished
      // "INTEGER(..."), so keep showing the last valid state rather than
      // clearing the panel on every keystroke.
    }
    // Editing already discards the previous run's state above, so the
    // run button no longer needs to offer a reset.
    if (hasRunFully) {
      hasRunFully = false;
      setRunBtnLabel('run');
    }
  }

  const { from, to } = update.state.selection.main;
  if (from === to) {
    selectedByteRange = null;
  } else {
    const startLine = update.state.doc.lineAt(from).number - 1;
    const endLine = update.state.doc.lineAt(to).number - 1;
    selectedByteRange = {
      from: interpreter.getLineAddress(startLine),
      to: interpreter.getLineAddress(endLine + 1),
    };
  }

  displayState();
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

const executionHighlighter = createLineHighlighter('rgba(37, 99, 235, 0.35)');
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

// Vim mode draws its own "fat" block cursor in normal mode instead of the
// thin caret above, with its own (pink) default color that needs
// !important to override. In insert mode it falls back to that same thin
// caret ("pipe") - keep that one at its normal (white) color rather than
// the block cursor's green, so the two modes stay visually distinct.
// Prec.highest guarantees this wins over blackBackground's `.cm-cursor`
// rule regardless of extension order. Its command-line panel also has no
// background of its own by default, letting the page behind it show
// through.
const vimCursorTheme = Prec.highest(
  EditorView.theme({
    '.cm-fat-cursor': {
      background: '#44aa00ff !important',
    },
    '&:not(.cm-focused) .cm-fat-cursor': {
      background: 'none',
      outline: 'solid 1px #44aa00ff !important',
    },
    '.cm-cursor': {
      borderLeftColor: '#fff !important',
    },
    '.cm-vim-panel': {
      backgroundColor: '#000 !important',
      color: '#fff !important',
      borderTop: '1px solid #2E2E2E',
    },
  }),
);

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
    syncMemoryWithEditor,
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

// Lets the registers/code/memory panels be hidden entirely (display:
// none, via the "hidden" class). A sidebar (#panel-sidebar) holds one
// button per panel, shown only while that panel is hidden, to bring it
// back.
const PANEL_COLLAPSED_LS_KEY_PREFIX = 'panelCollapsed:';

const wirePanelHide = (panelId: string, hideButtonId: string, showButtonId: string) => {
  const panel = document.getElementById(panelId);
  const hideButton = document.getElementById(hideButtonId);
  const showButton = document.getElementById(showButtonId);
  if (!panel || !hideButton || !showButton) return;

  const lsKey = PANEL_COLLAPSED_LS_KEY_PREFIX + panelId;
  const setHidden = (isHidden: boolean) => {
    panel.classList.toggle('hidden', isHidden);
    showButton.classList.toggle('hidden', !isHidden);
    localStorage.setItem(lsKey, String(isHidden));
  };

  setHidden(localStorage.getItem(lsKey) === 'true');

  hideButton.addEventListener('click', () => setHidden(true));
  showButton.addEventListener('click', () => setHidden(false));
};

wirePanelHide('registers-panel', 'registers-collapse-btn', 'show-registers-btn');
wirePanelHide('code-editor', 'code-collapse-btn', 'show-code-btn');
wirePanelHide('memory-panel', 'memory-collapse-btn', 'show-memory-btn');

let interpreter = new Interpreter(view.state.doc.toString());
try {
  // Preprocess whatever code loaded initially (an example, a saved file)
  // so the memory panel already reflects it, matching what typing does.
  interpreter.preprocess();
} catch {
  // Invalid starting code just leaves the panel empty, same as any other
  // preprocessing failure.
}

// nextBtn's label switches between "run line by line" and "next line", but
// its f10 shortcut hint span must survive that swap - plain innerHTML
// assignment would otherwise wipe it out.
const setNextBtnLabel = (label: string) => {
  nextBtn.innerHTML = `${label} <span class="text-gray-500 group-hover:text-black">f10</span>`;
};

// runBtn's label switches between "run" and "reset" (see hasRunFully) -
// same innerHTML-survives-the-f5-hint-span concern as setNextBtnLabel.
const setRunBtnLabel = (label: string) => {
  if (!runBtn) return;
  runBtn.innerHTML = `${label} <span class="text-gray-500 group-hover:text-black">f5</span>`;
  runBtn.title = `${label} (F5)`;
};

let autoPlayTimer: ReturnType<typeof setInterval> | null = null;

const pauseAutoPlay = () => {
  if (autoPlayTimer !== null) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
  if (playBtn) playBtn.textContent = 'play';
  stopBtn?.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
};

const startAutoPlay = () => {
  if (playBtn) playBtn.textContent = 'stop';
  stopBtn?.classList.add('hidden');
  nextBtn.classList.add('hidden');
  autoPlayTimer = setInterval(() => nextBtn.click(), 500);
};

playBtn?.addEventListener('click', () => {
  if (autoPlayTimer !== null) {
    pauseAutoPlay();
  } else {
    startAutoPlay();
  }
});

const resetInterpreter = () => {
  interpreter.currentLine = 0;
  executingLineByLine = false;
  view.dispatch({
    effects: editableCompartment.reconfigure([EditorView.editable.of(true)]),
  });
  executionHighlighter.clear(view);

  setNextBtnLabel('run line by line');
  nextBtn.classList.remove('hidden');
  stopBtn?.classList.add('hidden');
  runBtn?.classList.remove('hidden');
  playBtn?.classList.add('hidden');
  if (autoPlayTimer !== null) {
    clearInterval(autoPlayTimer);
    autoPlayTimer = null;
  }
  if (playBtn) playBtn.textContent = 'play';

  // Stepping/stopping starts from a fresh Interpreter, so any leftover
  // state from an earlier full run no longer needs its own reset button.
  hasRunFully = false;
  setRunBtnLabel('run');
};

nextBtn?.addEventListener('click', () => {
  errorsDiv.innerHTML = '';
  errorHighlighter.clear(view);
  if (!executingLineByLine) {
    try {
      const code = view.state.doc.toString();
      interpreter = new Interpreter(code);
      interpreter.preprocess();
      executionHighlighter.highlight(view, interpreter.currentLine + 1);
      executingLineByLine = true;
      view.dispatch({
        effects: editableCompartment.reconfigure([
          EditorView.editable.of(false),
        ]),
      });
      setNextBtnLabel('next line');
      stopBtn?.classList.remove('hidden');
      runBtn?.classList.add('hidden');
      playBtn?.classList.remove('hidden');

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
  // Mid-step, "run" continues one line at a time instead of restarting the
  // whole program from scratch.
  if (executingLineByLine) {
    nextBtn.click();
    return;
  }

  errorsDiv.innerHTML = '';
  errorHighlighter.clear(view);
  const code = view.state.doc.toString();

  // After a full run this button turns into "reset": clear the
  // registers/memory state the run left behind, back to what a fresh
  // load of this code looks like, instead of running again straight away.
  if (hasRunFully) {
    hasRunFully = false;
    setRunBtnLabel('run');
    interpreter = new Interpreter(code);
    try {
      interpreter.preprocess();
    } catch {
      // Same as the initial-load case: invalid code just leaves the
      // panel empty rather than erroring on a reset click.
    }
    displayState();
    return;
  }

  resetInterpreter();
  interpreter = new Interpreter(code);
  try {
    interpreter.interpret();
    hasRunFully = true;
    setRunBtnLabel('reset');
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

stopBtn?.addEventListener('click', () => {
  errorsDiv.innerHTML = '';
  errorHighlighter.clear(view);
  resetInterpreter();
});

// Match the run shortcuts used by Rider/VS Code/Visual Studio: F5 runs,
// F10 steps line by line, shift+F5 stops. Both keys have browser default
// actions (page reload, menu-bar focus) that need to be suppressed.
window.addEventListener('keydown', (event) => {
  if (event.key === 'F5' && event.shiftKey) {
    event.preventDefault();
    stopBtn?.click();
  } else if (event.key === 'F5') {
    event.preventDefault();
    runBtn?.click();
  } else if (event.key === 'F10') {
    event.preventDefault();
    nextBtn?.click();
  }
});

const displayState = () => {
  registersDiv?.replaceChildren(
    ...createProgramCounterNode(
      interpreter.currentMemoryAddress,
      interpreter.hasStarted,
    ),
    ...createFlagNodes(interpreter.eflags),
    ...createRegistersNodes(interpreter.registers),
  );

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

if (memoryViewDropdown) {
  createDropdown(
    memoryViewDropdown,
    [
      { value: 'raw', label: 'raw' },
      { value: 'sections', label: 'sections' },
      { value: 'sections-labels', label: 'sections + labels' },
    ],
    memoryView,
    (value) => {
      memoryView = value as MemoryView;
      localStorage.setItem(MEMORY_VIEW_LS_KEY, memoryView);
      displayState();
    },
  );
}

const createProgramCounterNode = (address: number, isSet: boolean): Node[] => {
  const pcHTML = document.createElement('div');
  pcHTML.className = 'register flex justify-between';

  const label = document.createElement('div');
  label.innerHTML = '<span class="register-name">PC</span>';

  const width = registersFormat === 'hex' ? 8 : 32;
  const formattedValue = isSet
    ? (registersFormat === 'hex' ? '0x' : '0b') +
      address
        .toString(registersFormat === 'hex' ? 16 : 2)
        .padStart(width, '0')
    : (registersFormat === 'hex' ? '0x' : '0b') + '~'.repeat(width);

  const values = document.createElement('div');
  values.innerHTML = formattedValue;

  pcHTML.append(label, values);
  return [pcHTML];
};

const createFlagNodes = (eflags: number): Node[] => {
  const zf = (eflags >> FLAGS.ZF) & 1;
  const sf = (eflags >> FLAGS.SF) & 1;

  const flagHTML = document.createElement('div');
  flagHTML.className = 'register flex justify-between';

  const label = document.createElement('div');
  label.innerHTML = '<span class="register-name">EFLAGS</span>';

  const values = document.createElement('div');
  values.innerHTML =
    `<span class="register-name">ZF</span> ${zf}  ` +
    `<span class="register-name">SF</span> ${sf}`;

  flagHTML.append(label, values);
  return [flagHTML];
};

const createRegistersNodes = (registers: Int32Array): Node[] => {
  const registersHTML: Node[] = [];
  registers.forEach((register, i) => {
    const registerHTML = document.createElement('div');
    const registerData = document.createElement('div');

    registerHTML.className = 'register';
    const registerName = 'R' + i.toString();
    registerData.innerHTML =
      `<span class="register-name">${registerName}</span>` +
      (i < 10 ? '&nbsp;' : '');

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

const addMemorySectionLabel = (
  memoryNodes: Node[],
  text: string,
  className: string,
) => {
  const label = document.createElement('div');
  label.className = `memory-section-label ${className}`;
  label.textContent = text;
  memoryNodes.push(label);
};

const createMemoryDiv = (bytes: byte[]): Node[] => {
  const memoryNodes: Node[] = [];
  const width = memoryFormat === 'hex' ? 2 : 8;
  const showSections = memoryView !== 'raw';
  const showLabels = memoryView === 'sections-labels';

  // Every row (header, section dividers, data rows) is laid out as cells
  // in this same grid, so they can never drift out of alignment with
  // each other the way independently-sized flex rows did.
  if (memoryDiv) {
    memoryDiv.style.gridTemplateColumns =
      (showLabels ? '12ch ' : '') + `7ch repeat(4, ${width}ch) auto`;
  }

  const codeStart = bytes.findIndex(
    (byte) => byte.type !== 'DATA' && byte.type !== 'DATA_HIDDEN',
  );
  const hasData = showSections && bytes.length > 0 && codeStart !== 0;
  const hasCode = showSections && codeStart !== -1;

  if (bytes.length > 0) {
    const headerRow = document.createElement('div');
    headerRow.className = 'byte-record';

    if (showLabels) {
      const labelHeader = document.createElement('div');
      labelHeader.className = 'memory-header-cell';
      headerRow.appendChild(labelHeader);
    }

    const addressHeader = document.createElement('div');
    addressHeader.className = 'memory-header-cell';
    addressHeader.textContent = 'address';
    headerRow.appendChild(addressHeader);

    for (let k = 0; k < 4; k += 1) {
      const spacer = document.createElement('div');
      spacer.className = 'memory-header-cell';
      headerRow.appendChild(spacer);
    }

    const valueHeader = document.createElement('div');
    valueHeader.className = 'memory-header-cell';
    valueHeader.textContent = 'value';
    headerRow.appendChild(valueHeader);

    memoryNodes.push(headerRow);

    const headerRule = document.createElement('div');
    headerRule.className = 'memory-header-rule';
    memoryNodes.push(headerRule);
  }

  if (hasData) {
    addMemorySectionLabel(memoryNodes, '.data', 'section-data');
  }

  const labelForRow = (rowStart: number): string =>
    interpreter.labels.find(
      (label) => label.address >= rowStart && label.address < rowStart + 4,
    )?.label ?? '';

  for (let i = 0; i < bytes.length; i += 4) {
    if (hasCode && i === codeStart) {
      addMemorySectionLabel(memoryNodes, '.text', 'section-text');
    }

    const record = document.createElement('div');
    record.className = 'byte-record';

    if (showLabels) {
      const labelHTML = document.createElement('div');
      labelHTML.className = 'memory-label';
      labelHTML.textContent = labelForRow(i);
      record.appendChild(labelHTML);
    }

    const addressHTML = document.createElement('div');
    addressHTML.className = 'memory-address';
    addressHTML.textContent = `0x${i.toString(16).padStart(4, '0')}:`;
    record.appendChild(addressHTML);

    for (let j = i; j < i + 4; j += 1) {
      const byteHTML = document.createElement('div');
      if (j >= interpreter.bytes.length) {
        byteHTML.innerHTML = '&nbsp;'.repeat(width);
        record.appendChild(byteHTML);
        continue;
      }

      const classNames: string[] = [];
      if (
        executingLineByLine &&
        j >= interpreter.currentMemoryAddress &&
        j <
          interpreter.currentMemoryAddress +
            interpreter.statements[interpreter.currentLine].byteSize &&
        interpreter.statements[interpreter.currentLine].byteSize > 0
      ) {
        classNames.push('current-memory');
      }

      if (
        selectedByteRange &&
        j >= selectedByteRange.from &&
        j < selectedByteRange.to
      ) {
        classNames.push('selected-memory');
      }

      const byte = bytes[j];
      switch (byte.type) {
        case 'DATA':
          classNames.push('byte-data');
          byteHTML.innerHTML =
            memoryFormat === 'hex'
              ? byte.val.toString(16).padStart(2, '0')
              : byte.val.toString(2).padStart(8, '0');

          break;

        case 'INSTRUCTION_OPCODE':
          classNames.push('byte-instruction-opcode');
          byteHTML.innerHTML =
            memoryFormat === 'hex'
              ? byte.val.toString(16).padStart(2, '0')
              : byte.val.toString(2).padStart(8, '0');
          break;

        case 'INSTRUCTION_OPERAND':
          classNames.push('byte-instruction-operand');
          byteHTML.innerHTML =
            memoryFormat === 'hex'
              ? byte.val.toString(16).padStart(2, '0')
              : byte.val.toString(2).padStart(8, '0');
          break;

        case 'INSTRUCTION_UNUSED':
          classNames.push('byte-instruction-unused');
          byteHTML.innerHTML = 'x'.repeat(width);
          break;

        case 'DATA_HIDDEN':
          classNames.push('byte-data-hidden');
          byteHTML.innerHTML = '~'.repeat(width);
      }

      byteHTML.className = classNames.join(' ');
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
        : '';
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
