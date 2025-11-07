import { Interpreter, PreprocessingError, RuntimeError } from './interpreter';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';
import { basicSetup } from 'codemirror';
import { boysAndGirls } from 'thememirror';

// Tutorial step data
const tutorialSteps = [
  {
    id: 1,
    expectedCode: /NUMBER\s+DC\s+INTEGER\s*\(\s*42\s*\)/i,
    solution: `NUMBER DC INTEGER(42)`,
    successMessage:
      "Perfect! You've declared a variable with the DC instruction.",
  },
  {
    id: 2,
    expectedCode: [
      /VALUE\s+DC\s+INTEGER\s*\(\s*100\s*\)/i,
      /L\s+1\s*,\s*VALUE/i,
      /RESULT\s+DS\s+INTEGER/i,
      /ST\s+1\s*,\s*RESULT/i,
    ],
    solution: `VALUE DC INTEGER(100)
RESULT DS INTEGER

L 1, VALUE
ST 1, RESULT`,
    successMessage: "Excellent! You've mastered loading and storing data.",
  },
  {
    id: 3,
    expectedCode: [
      /DC\s+INTEGER\s*\(\s*10\s*\)/i,
      /DC\s+INTEGER\s*\(\s*5\s*\)/i,
      /DC\s+INTEGER\s*\(\s*3\s*\)/i,
      /A\s+\d+\s*,/i,
      /M\s+\d+\s*,/i,
    ],
    solution: `NUM1 DC INTEGER(10)
NUM2 DC INTEGER(5)
NUM3 DC INTEGER(3)
RESULT DS INTEGER

L 1, NUM1
A 1, NUM2
M 1, NUM3
ST 1, RESULT`,
    successMessage: 'Great! You calculated (10 + 5) * 3 = 45 successfully.',
  },
  {
    id: 4,
    expectedCode: [
      /(COUNTER|CTR|I)\s+DC\s+INTEGER\s*\(\s*[01]\s*\)/i,
      /(LIMIT|MAX|END_VAL)\s+DC\s+INTEGER\s*\(\s*5\s*\)/i,
      /(ONE|INC)\s+DC\s+INTEGER\s*\(\s*1\s*\)/i,
      /\w+\s*:/i, // Label
      /C\s+\d+\s*,/i, // Compare instruction
      /J[ZN]\s+\w+/i, // Conditional jump
      /J\s+\w+/i, // Unconditional jump
    ],
    solution: `COUNTER DC INTEGER(1)
LIMIT DC INTEGER(5)
ONE DC INTEGER(1)
RESULT DS INTEGER

L 1, COUNTER

LOOP A 1, ONE
C 1, LIMIT
JZ END
J LOOP

END ST 1, RESULT`,
    successMessage: "Fantastic! You've created a loop that counts from 1 to 5.",
  },
  {
    id: 5,
    expectedCode: [
      /(N|NUM)\s+DC\s+INTEGER\s*\(\s*4\s*\)/i,
      /(ONE|INC)\s+DC\s+INTEGER\s*\(\s*1\s*\)/i,
      /(FACTORIAL|RESULT|RES).*DS/i,
      /\w+\s*:/i, // Label for loop
      /M\s+\d+\s*,/i, // Multiply instruction
      /S\s+\d+\s*,/i, // Subtract instruction
      /(JZ|JN)\s+\w+/i, // Conditional jump to end
    ],
    solution: `N DC INTEGER(4)
ONE DC INTEGER(1)
RESULT DC INTEGER(1)
FACTORIAL DS INTEGER

L 1, RESULT
L 2, N

LOOP M 1, 2
S 2, ONE
C 2, ONE
JN END
J LOOP

END ST 1, FACTORIAL`,
    successMessage:
      "🎉 Amazing! You've successfully calculated 4! = 24. You're now ready for advanced pseudo assembly programming!",
  },
];

// Create a custom theme for tutorial editors
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
  private readonly totalSteps = 5;

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

    // Show completion message if on last step
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

      // Show check answer button
      const loadBtn = document.querySelector(
        `[data-step="${step}"].load-example`,
      ) as HTMLElement;
      const checkBtn = document.querySelector(
        `[data-step="${step}"].check-answer`,
      ) as HTMLElement;
      if (loadBtn && checkBtn) {
        loadBtn.style.display = 'none';
        checkBtn.style.display = 'inline-block';
      }
    }
  }

  private checkAnswer(step: number) {
    const stepData = tutorialSteps[step - 1];
    const editor = this.editors[step];
    const feedbackElement = document.getElementById(`feedback-${step}`);

    if (!stepData || !editor || !feedbackElement) return;

    const userCode = editor.state.doc.toString();

    try {
      // Try to run the code to see if it's valid
      const interpreter = new Interpreter(userCode);
      interpreter.interpret();

      // Check if code matches expected patterns
      const isCorrect = this.validateCode(userCode, stepData.expectedCode);

      if (isCorrect) {
        feedbackElement.innerHTML = `<span class="text-green-400">✓ ${stepData.successMessage}</span>`;

        // Enable next step if available
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

  private validateCode(code: string, expected: RegExp | RegExp[]): boolean {
    if (Array.isArray(expected)) {
      return expected.every((pattern) => pattern.test(code));
    } else {
      return expected.test(code);
    }
  }
}

// Initialize tutorial when page loads
document.addEventListener('DOMContentLoaded', () => {
  new TutorialManager();
});
