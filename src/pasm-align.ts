import {
  Decoration,
  type DecorationSet,
  EditorView,
  ViewPlugin,
  type ViewUpdate,
  WidgetType,
} from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { classifyLineHead } from './pasm-line';

class LabelGapWidget extends WidgetType {
  width: number;

  constructor(width: number) {
    super();
    this.width = width;
  }

  eq(other: LabelGapWidget) {
    return other.width === this.width;
  }

  toDOM(view: EditorView) {
    const span = document.createElement('span');
    span.style.display = 'inline-block';
    span.style.width = `${this.width}ch`;
    span.style.borderRight = '1px solid #2E2E2E';
    // Clicking anywhere in this gap should land the cursor at the start of
    // the label column, not wherever the browser's default hit-testing
    // happens to snap to (which tends to be the far edge, right up against
    // the instruction that follows).
    span.addEventListener('mousedown', (event) => {
      event.preventDefault();
      const pos = view.posAtDOM(span);
      view.dispatch({ selection: { anchor: pos } });
      view.focus();
    });
    return span;
  }

  get estimatedHeight() {
    return -1;
  }

  ignoreEvent() {
    return true;
  }
}

type LineInfo =
  | { hasLabel: true; gapFrom: number; gapTo: number; labelLen: number }
  | { hasLabel: false; gapFrom: number; gapTo: number };

function computeLabelColumnDecorations(view: EditorView): DecorationSet {
  const doc = view.state.doc;
  const builder = new RangeSetBuilder<Decoration>();

  const lines: LineInfo[] = [];
  let maxLabelLen = 0;

  for (let i = 1; i <= doc.lines; i++) {
    const line = doc.line(i);
    const text = line.text;
    const info = classifyLineHead(text);

    if (info === null) {
      if (text.trimStart().startsWith('#')) continue;
      // Blank (or not-yet-typed) line: keep it pinned to the instruction
      // column instead of snapping back to the left edge while editing.
      const leading = text.match(/^\s*/)?.[0].length ?? 0;
      lines.push({
        hasLabel: false,
        gapFrom: line.from,
        gapTo: line.from + leading,
      });
      continue;
    }

    const { leading, word, looksLikeLabel } = info;

    if (!looksLikeLabel) {
      // Instruction (or unrecognized/mid-edit fragment) with no label on
      // this line: align it as if it had a zero-length label by collapsing
      // the leading indentation.
      lines.push({
        hasLabel: false,
        gapFrom: line.from,
        gapTo: line.from + leading,
      });
    } else {
      const labelEnd = line.from + leading + word.length;
      // Only match whitespace within this line - matching into doc.sliceString
      // past the end of the line would swallow the line break itself, which
      // CodeMirror rejects for plugin-provided replace decorations.
      const gap = text.slice(leading + word.length).match(/^[ \t]*/)?.[0].length ?? 0;
      maxLabelLen = Math.max(maxLabelLen, word.length);
      lines.push({
        hasLabel: true,
        gapFrom: labelEnd,
        gapTo: labelEnd + gap,
        labelLen: word.length,
      });
    }
  }

  if (maxLabelLen === 0) return Decoration.none;

  for (const info of lines) {
    const width = info.hasLabel ? maxLabelLen - info.labelLen + 1 : maxLabelLen + 1;
    if (width === 0) continue;
    if (info.gapFrom === info.gapTo) {
      // No real whitespace to collapse here (e.g. a label-less line with no
      // indentation yet, or a label immediately followed by an instruction).
      // Use an inserted widget rather than a replace decoration so the spot
      // stays a normal, typeable position - like an empty label the user can
      // click into and write - instead of an atomic block that fights with
      // the cursor while editing.
      builder.add(
        info.gapFrom,
        info.gapFrom,
        Decoration.widget({ widget: new LabelGapWidget(width), side: 1 }),
      );
    } else {
      builder.add(
        info.gapFrom,
        info.gapTo,
        Decoration.replace({ widget: new LabelGapWidget(width) }),
      );
    }
  }

  return builder.finish();
}

const pasmLabelAlignPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;

    constructor(view: EditorView) {
      this.decorations = computeLabelColumnDecorations(view);
    }

    update(update: ViewUpdate) {
      if (update.docChanged) {
        this.decorations = computeLabelColumnDecorations(update.view);
      }
    }
  },
  {
    decorations: (plugin) => plugin.decorations,
  },
);

// Typing directly at the start of an instruction line (before any label
// exists) would otherwise insert the typed characters right up against the
// instruction's keyword, merging them into a single word instead of forming
// a separate label. Detect that exact spot - the reserved "empty label"
// column - and insert a trailing space along with the typed text so the
// instruction keyword stays intact as the user keeps typing the label.
const pasmLabelInsertHandler = EditorView.inputHandler.of(
  (view, from, to, insertText) => {
    if (from !== to || !insertText || /\s/.test(insertText)) return false;

    const line = view.state.doc.lineAt(from);
    const info = classifyLineHead(line.text);
    if (!info || info.looksLikeLabel) return false;
    if (line.from + info.leading !== from) return false;

    view.dispatch({
      changes: { from, to, insert: insertText + ' ' },
      selection: { anchor: from + insertText.length },
      userEvent: 'input.type',
    });
    return true;
  },
);

export const pasmLabelAlign = [pasmLabelAlignPlugin, pasmLabelInsertHandler];
