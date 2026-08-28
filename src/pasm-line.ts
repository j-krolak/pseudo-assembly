import { keywords } from './interpreter';

export const keywordSet = new Set(keywords);

export type LineHead = {
  leading: number;
  word: string;
  looksLikeLabel: boolean;
};

// Classifies the first word of a pseudo-assembly source line: is it a
// label, or the line's instruction? A word matching an instruction
// keyword is normally the instruction itself, unless it's immediately
// followed by ANOTHER keyword (e.g. "A DC INTEGER(7)") - a label is
// always followed by the line's real instruction, so that pattern means
// this word is the label instead. A comma right after the word (e.g.
// "3, ZERO", a stray/mid-edit operand list) or a purely numeric word are
// never valid labels either. Returns null for blank or comment lines.
export function classifyLineHead(text: string): LineHead | null {
  const leading = text.match(/^\s*/)?.[0].length ?? 0;
  const rest = text.slice(leading);

  if (rest.startsWith('#') || rest.length === 0) return null;

  const wordMatch = rest.match(/^[^\s,]+/);
  if (!wordMatch) return null;
  const word = wordMatch[0];
  const nextWord = rest.slice(word.length).match(/^[ \t]+([^\s,]+)/)?.[1];

  const looksLikeLabel =
    (!keywordSet.has(word) || (nextWord !== undefined && keywordSet.has(nextWord))) &&
    rest[word.length] !== ',' &&
    !/^-?\d+$/.test(word);

  return { leading, word, looksLikeLabel };
}
