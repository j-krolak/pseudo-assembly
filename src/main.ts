import { Interpreter } from './interpreter';

const textarea = document.getElementById('code') as HTMLTextAreaElement;
const runBtn = document.getElementById('run-btn');

runBtn?.addEventListener('click', () => {
  const code = textarea.value;
  const interprate = new Interpreter(code);
  interprate.interpret();
});
