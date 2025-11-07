import { Interpreter, PreprocessingError, RuntimeError } from '../interpreter';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup } from 'codemirror';
import { boysAndGirls } from 'thememirror';
import { tutorialSteps, type TutorialStep } from './tutorial-steps';

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
  },
  { dark: true },
);

class TutorialManager {
  private currentStep: number = 1;
  private editors: { [key: number]: EditorView } = {};
  private readonly totalSteps = 6;

  constructor() {
    this.initializeEditors();
    this.setupEventListeners();
    this.updateStepIndicator();
  }

  private initializeEditors() {
    for (let i = 1; i <= this.totalSteps; i++) {
      const editorElement = document.getElementById(`tutorial-editor-${i}`);
      if (editorElement) {
        const state = EditorState.create({
          doc: '',
          extensions: [
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
    const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

    prevBtn?.addEventListener('click', () => this.previousStep());
    nextBtn?.addEventListener('click', () => this.nextStep());

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
    this.updateStepIndicator();
    this.updateNavigationButtons();
  }

  private updateStepIndicator() {
    const indicator = document.getElementById('step-indicator');
    if (indicator) {
      indicator.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
    }
  }

  private updateNavigationButtons() {
    const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

    if (prevBtn) {
      prevBtn.disabled = this.currentStep === 1;
    }

    if (nextBtn) {
      nextBtn.style.display =
        this.currentStep === this.totalSteps ? 'none' : 'block';
    }

    const completionMessage = document.getElementById('completion-message');
    if (completionMessage) {
      completionMessage.style.display =
        this.currentStep === this.totalSteps ? 'block' : 'none';
    }
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

        if (step < this.totalSteps) {
          setTimeout(() => {
            const nextBtn = document.getElementById(
              'next-btn',
            ) as HTMLButtonElement;
            if (nextBtn) {
              nextBtn.click();
            }
          }, 2000);
        }
      } else {
        feedbackElement.innerHTML = `<span class="text-yellow-400">⚠ Code runs but doesn't match the expected solution pattern. Try again!</span>`;
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
