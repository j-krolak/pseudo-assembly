type ExpectedValue = {
  labelName: string;
  value: number;
};

export type TutorialStep = {
  id: number;
  expectedCode: RegExp[] | RegExp;
  expectedValues: ExpectedValue[];
  solution: string;
  successMessage: string;
};

export const tutorialSteps: TutorialStep[] = [
  {
    id: 1,
    expectedCode: /NUMBER\s+DC\s+INTEGER\s*\(\s*42\s*\)/i,
    expectedValues: [
      {
        labelName: 'NUMBER',
        value: 42,
      },
    ],
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
    expectedValues: [
      {
        labelName: 'RESULT',
        value: 100,
      },
      {
        labelName: 'VALUE',
        value: 100,
      },
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
    expectedValues: [
      {
        labelName: 'RESULT',
        value: 45,
      },
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
    expectedValues: [
      {
        labelName: 'RESULT',
        value: 5,
      },
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
      /\w+\s*/i, // Label for loop
      /(M|MR)\s+\d+\s*,/i, // Multiply instruction
      /(S|SR)\s+\d+\s*,/i, // Subtract instruction
      /(JZ|JN)\s+\w+/i, // Conditional jump to end
    ],
    expectedValues: [
      {
        labelName: 'FACTORIAL',
        value: 24,
      },
    ],
    solution: `N DC INTEGER(4)
ONE DC INTEGER(1)
RESULT DC INTEGER(1)
FACTORIAL DS INTEGER

L 1, RESULT
L 2, N

LOOP MR 1, 2
S 2, ONE
C 2, ONE
JN END
J LOOP

END ST 1, FACTORIAL`,
    successMessage:
      "🎉 Amazing! You've successfully calculated 4! = 24. You're now ready for advanced pseudo assembly programming!",
  },
];
