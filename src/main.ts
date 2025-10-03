import { Interpreter } from './interpreter';
import type { byte } from './interpreter';

import {
  Compartment,
  EditorState,
  StateEffect,
  StateField,
} from '@codemirror/state';
import { Decoration, EditorView as View, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup, EditorView } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';

const runBtn = document.getElementById('run-btn');
const nextBtn = document.getElementById('next-btn');
const registersDiv = document.getElementById('registers');
const memoryDiv = document.getElementById('memory');
const codeDiv = document.getElementById('code') as Element;

// CodeMirror
let executingLineByLine = false;
let currentLine = 0;
const editableCompartment = new Compartment();

const addLineHighlight = StateEffect.define();
const removeLineHighlight = StateEffect.define();

const lineHighlightField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(lines, tr) {
    lines = lines.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(addLineHighlight)) {
        lines = Decoration.none;
        //@ts-ignore
        lines = lines.update({ add: [lineHighlightMark.range(e.value)] });
      }

      if (e.is(removeLineHighlight)) {
        lines = Decoration.none;
      }
    }
    return lines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const lineHighlightMark = Decoration.line({
  attributes: { style: 'background-color: #005F5A' },
});

const highlightLine = (view: EditorView, lineNumber: number) => {
  if (lineNumber < 1 || lineNumber > view.state.doc.lines) return;
  const docPosition = view.state.doc.line(lineNumber).from;
  view.dispatch({
    //@ts-ignore
    effects: addLineHighlight.of(docPosition),
  });
};

const removeHighlight = (view: EditorView) => {
  view.dispatch({
    effects: removeLineHighlight.of(null),
  });
};

let state = EditorState.create({
  doc: 'ONE DC INTEGER(10)\nA 0, ONE',
  extensions: [
    keymap.of(defaultKeymap),
    basicSetup,
    editableCompartment.of([EditorView.editable.of(!executingLineByLine)]),
    oneDark,
    lineHighlightField,
  ],
});

let view = new View({
  state: state,
  parent: codeDiv,
});

let interprater = new Interpreter(view.state.doc.toString());

nextBtn?.addEventListener('click', () => {
  if (!executingLineByLine) {
    highlightLine(view, currentLine + 1);
    const code = view.state.doc.toString();
    interprater = new Interpreter(code);
    interprater.preprocess();

    executingLineByLine = true;
    view.dispatch({
      effects: editableCompartment.reconfigure([EditorView.editable.of(false)]),
    });
    nextBtn.innerHTML = 'Next line';

    displayState();
    return;
  }
  currentLine += 1;
  highlightLine(view, currentLine + 1);
  interprater.interpretNextLine();
  displayState();
  if (interprater.isAtEnd()) {
    currentLine = 0;
    executingLineByLine = false;
    view.dispatch({
      effects: editableCompartment.reconfigure([EditorView.editable.of(true)]),
    });
    removeHighlight(view);

    nextBtn.innerHTML = 'Execute line by line';
  }
});

runBtn?.addEventListener('click', () => {
  const code = view.state.doc.toString();
  interprater = new Interpreter(code);
  interprater.interpret();
  displayState();
});

const displayState = () => {
  registersDiv?.replaceChildren(...createRegistersNodes(interprater.registers));

  memoryDiv?.replaceChildren(...createMemoryDiv(interprater.bytes));
};

const createRegistersNodes = (registers: Int32Array): Node[] => {
  const registersHTML: Node[] = [];
  registers.forEach((register, i) => {
    const registerHTML = document.createElement('div');
    const registerData = document.createElement('div');

    registerHTML.className = 'register';
    const registerName = 'R' + i.toString();
    registerData.innerHTML =
      registerName.padStart(4, '\t') +
      ' 0b' +
      (register >>> 0).toString(2).padStart(32, '0') +
      ' ' +
      register.toString();

    registerHTML.appendChild(registerData);
    registersHTML.push(registerHTML);
  });
  return registersHTML;
};

const createMemoryDiv = (bytes: byte[]): Node[] => {
  const memoryNodes: Node[] = [];
  for (let i = 0; i < bytes.length; i += 4) {
    const record = document.createElement('div');
    record.className = 'byte-record';
    for (let j = i; j < i + 4; j += 1) {
      const byte = bytes[j];
      const byteHTML = document.createElement('div');
      if (
        executingLineByLine &&
        j >= interprater.currentMemoryAddress &&
        j <
          interprater.currentMemoryAddress +
            interprater.statements[currentLine].byteSize
      )
        byteHTML.className = 'current-memory';
      byteHTML.innerHTML =
        byte.type === 'DATA'
          ? byte.val.toString(2).padStart(8, '0')
          : 'xxxxxxxx';
      record.appendChild(byteHTML);
    }
    memoryNodes.push(record);
  }
  return memoryNodes;
};
displayState();
