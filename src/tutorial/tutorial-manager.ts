import { Interpreter, PreprocessingError, RuntimeError } from '../interpreter';
import { Compartment, EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup } from 'codemirror';
import { boysAndGirls } from 'thememirror';
import { vim } from '@replit/codemirror-vim';
import { tutorialSteps, type TutorialStep } from './tutorial-steps';

const VIM_MODE_LS_KEY = 'vimMode';

const tutorialTheme = EditorView.theme(
  {
    '&': {
      backgroundColor: '#000 !important',
      color: '#ffffff',
      fontSize: '14px',
      minHeight: '120px',
    },
    '.cm-cursor': {
      borderLeftColor: '#44aa00ff !important',
    },
    '&.cm-focused': {
      outline: 'none',
      border: 'none',
    },
    '.cm-editor': {
      border: '1px solid #2E2E2E',
    },
    '.cm-fat-cursor': {
      background: '#44aa00ff !important',
    },
    '&:not(.cm-focused) .cm-fat-cursor': {
      background: 'none',
      outline: 'solid 1px #44aa00ff !important',
    },
  },
  { dark: true },
);

class TutorialManager {
  private currentStep: number = 1;
  private editors: { [key: number]: EditorView } = {};
  private vimCompartments: { [key: number]: Compartment } = {};
  private readonly totalSteps = 6;

  constructor() {
    this.initializeEditors();
    this.setupEventListeners();
  }

  private initializeEditors() {
    const vimModeEnabled = localStorage.getItem(VIM_MODE_LS_KEY) === 'true';

    for (let i = 1; i <= this.totalSteps; i++) {
      const editorElement = document.getElementById(`tutorial-editor-${i}`);
      if (editorElement) {
        const vimCompartment = new Compartment();
        this.vimCompartments[i] = vimCompartment;

        const state = EditorState.create({
          doc: '',
          extensions: [
            vimCompartment.of(vimModeEnabled ? [vim()] : []),
            keymap.of(defaultKeymap),
            basicSetup,
            boysAndGirls,
            tutorialTheme,
          ],
        });

        this.editors[i] = new EditorView({
          state: state,
          parent: editorElement,
        });
      }
    }
  }

  private setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.prev-step').forEach((btn) => {
      btn.addEventListener('click', () => this.previousStep());
    });

    document.querySelectorAll('.next-step').forEach((btn) => {
      btn.addEventListener('click', () => this.nextStep());
    });

    // Load example buttons
    document.querySelectorAll('.load-example').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const step = parseInt((e.target as HTMLElement).dataset.step || '1');
        this.loadExample(step);
      });
    });

    // Check answer buttons
    document.querySelectorAll('.check-answer').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const step = parseInt((e.target as HTMLElement).dataset.step || '1');
        this.checkAnswer(step);
      });
    });

    // Vim mode toggles (shared across every editor)
    const vimToggles = document.querySelectorAll<HTMLInputElement>(
      '.vim-toggle',
    );
    const vimModeEnabled = localStorage.getItem(VIM_MODE_LS_KEY) === 'true';
    vimToggles.forEach((toggle) => {
      toggle.checked = vimModeEnabled;
      toggle.addEventListener('change', () => {
        const enabled = toggle.checked;
        localStorage.setItem(VIM_MODE_LS_KEY, String(enabled));
        vimToggles.forEach((t) => (t.checked = enabled));
        Object.entries(this.vimCompartments).forEach(([step, compartment]) => {
          this.editors[Number(step)]?.dispatch({
            effects: compartment.reconfigure(enabled ? [vim()] : []),
          });
        });
      });
    });
  }

  private showStep(stepNumber: number) {
    // Hide all steps
    for (let i = 1; i <= this.totalSteps; i++) {
      const step = document.getElementById(`step-${i}`);
      if (step) {
        step.style.display = 'none';
      }
    }

    // Show current step
    const currentStepElement = document.getElementById(`step-${stepNumber}`);
    if (currentStepElement) {
      currentStepElement.style.display = 'block';
    }

    this.currentStep = stepNumber;
  }

  private nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.showStep(this.currentStep + 1);
    }
  }

  private previousStep() {
    if (this.currentStep > 1) {
      this.showStep(this.currentStep - 1);
    }
  }

  private loadExample(step: number) {
    const stepData = tutorialSteps[step - 1];
    if (stepData && this.editors[step]) {
      const editor = this.editors[step];
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: stepData.solution,
        },
      });
    }
  }

  private checkAnswer(step: number) {
    const stepData = tutorialSteps[step - 1];
    const editor = this.editors[step];
    const feedbackElement = document.getElementById(`feedback-${step}`);

    if (!stepData || !editor || !feedbackElement) return;

    const userCode = editor.state.doc.toString();

    try {
      const interpreter = new Interpreter(userCode);
      interpreter.interpret();

      const isCorrect = this.validateCode(interpreter, userCode, stepData);

      if (isCorrect) {
        feedbackElement.innerHTML = `<span class="text-green-400">✓ ${stepData.successMessage}</span>`;
      } else {
        feedbackElement.innerHTML = `<span class="text-yellow-400">! Code runs but doesn't match the expected solution pattern. Try again!</span>`;
      }
    } catch (error) {
      if (
        error instanceof PreprocessingError ||
        error instanceof RuntimeError
      ) {
        feedbackElement.innerHTML = `<span class="text-red-400">✗ Error: ${error.message}</span>`;
      } else {
        feedbackElement.innerHTML = `<span class="text-red-400">✗ Unexpected error occurred</span>`;
      }
    }
  }

  private validateCode(
    interpret: Interpreter,
    code: string,
    step: TutorialStep,
  ): boolean {
    let isValid = true;
    const expectedCode = step.expectedCode;
    if (Array.isArray(expectedCode)) {
      isValid &&= expectedCode.every((pattern) => pattern.test(code));
    } else {
      isValid &&= expectedCode.test(code);
    }

    isValid =
      isValid &&
      step.expectedValues.every((label) => {
        try {
          return interpret.getValueByLabel(label.labelName) === label.value;
        } catch (err) {
          return false;
        }
      });
    return isValid;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new TutorialManager();
});
