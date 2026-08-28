import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';
import { classifyLineHead, keywordSet } from './pasm-line';

// A word can share its spelling with an instruction mnemonic in two ways
// that must NOT be colored as a keyword: as a label (e.g. "A DC
// INTEGER(7)" - "A" is the label, not the add instruction) or as an
// operand referencing such a label (e.g. "L 0, A"). Only one word per line
// is ever the actual instruction - the first word, unless it's a label (in
// which case the second word is, per classifyLineHead), and every other
// identifier on the line is either that label or a plain operand. Track
// which word index is the instruction slot per line to tell them apart.
type LineState = { wordIndex: number; instructionWordIndex: number | null };

export const pasmLanguage = StreamLanguage.define<LineState>({
  startState() {
    return { wordIndex: 0, instructionWordIndex: null };
  },

  token(stream, state) {
    if (stream.sol()) {
      state.wordIndex = 0;
      const head = classifyLineHead(stream.string);
      state.instructionWordIndex = head === null ? null : head.looksLikeLabel ? 1 : 0;
    }

    if (stream.eatSpace()) return null;

    if (stream.match('#')) {
      stream.skipToEnd();
      return 'comment';
    }

    if (stream.match(/^-?\d+/)) return 'number';
    if (stream.match(',')) return 'punctuation';
    if (stream.match('*')) return 'operator';
    if (stream.match(/^[()]/)) return 'bracket';

    if (stream.match(/^[A-Za-z_][A-Za-z0-9_]*/)) {
      const word = stream.current();
      const wordIndex = state.wordIndex;
      state.wordIndex += 1;

      if (word === 'INTEGER') return 'typeName';

      if (wordIndex === state.instructionWordIndex && keywordSet.has(word)) {
        return 'keyword';
      }
      return 'labelName';
    }

    stream.next();
    return null;
  },
});

const pasmHighlightStyle = HighlightStyle.define([
  { tag: t.keyword, color: '#44aa00ff', fontWeight: 'bold' },
  { tag: t.typeName, color: '#00d8ff' },
  { tag: t.comment, color: '#666' },
]);

export const pasmSyntaxHighlighting = syntaxHighlighting(pasmHighlightStyle);
