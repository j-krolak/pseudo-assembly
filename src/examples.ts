export const examples: {
  name: string;
  code: string;
}[] = [
  {
    name: 'sum vector',
    code: `# sum all elements of VECTOR
VECTOR DC 20*INTEGER(2)
VECTOR_LEN DC INTEGER(20)

ONE DC INTEGER(1)
ZERO DC INTEGER(0)
WORD_SIZE DC INTEGER(4)

SUM DC INTEGER(0)

# R0=ptr, R1=index, R2=sum
LA 0, VECTOR
SR 1, 1
SR 2, 2

START A 2, 0(0)
A 0, WORD_SIZE
A 1, ONE
C 1, VECTOR_LEN
JZ END
J START

END ST 2,SUM
    `,
  },
  {
    name: 'gcd',
    code: `# gcd(A, B) via subtraction
# RES holds the result
A DC INTEGER(7)
B DC INTEGER(3)
RES DS INTEGER

L 0, A
L 1, B

START CR 0, 1
JZ END
JN LESS

SR 0, 1
J START

LESS SR 1, 0
J START

END ST 0, RES
`,
  },
  {
    name: 'palindrom',
    code: `# is PA a palindrome? RES=1 if so
ONE DC INTEGER(1)
FOUR DC INTEGER(4)

N DC INTEGER(3)

PA DC INTEGER(3)
DC INTEGER(4)
DC INTEGER(3)

RES DC INTEGER(1)

# R1=left ptr, R3=right ptr
LA 1, PA
L 3, N
S 3, ONE
M 3, FOUR
AR 3, 1

START CR 3, 1
JN END
JZ END

L 4, 0(1)
L 5, 0(3)
A 1, FOUR
S 3, FOUR
CR 4, 5
JZ START

SR 8,8
ST 8, RES

END SR 1,1
    `,
  },
  {
    name: 'bubble sort',
    code: `# bubble sort P (N elements) ascending
JEDEN DC INTEGER(1)
CZTERY DC INTEGER(4)

N DC INTEGER(3)

P DC INTEGER(12)
DC INTEGER(-4)
DC INTEGER(8)

# R7=P ptr, R1=inner idx, R2=pass limit
LA 7, P

L 1, JEDEN
L 2, N

START LR 3, 1
S 3, JEDEN
M 3, CZTERY
AR 3, 7

LR 4, 3
A 4,  CZTERY
L 5, 0(3)

L 6, 0(4)
CR 5, 6
JN KROK
ST 6, 0(3)
ST 5, 0(4)

KROK A 1, JEDEN
CR 1, 2
JN START
S 2, JEDEN
L 1, JEDEN
C 2, JEDEN
JP START 
    `,
  },
  {
    name: 'merge sort join',
    code: `# merge sorted arrays A, B into C
M DC INTEGER(2)
A DC INTEGER(1)
DC INTEGER(2)

N DC INTEGER(2)
B DC INTEGER(1)
DC INTEGER(2)

C DS 4*INTEGER
JEDEN DC INTEGER(1)

L 1, JEDEN
LR 2, 1

# R3=C ptr, R4=A ptr, R5=B ptr
LA 3, C
LA 4, A
LA 5, B
LR 8, 1
AR 8, 8
AR 8, 8

WARUNEK C 1, M
JP UZUPELNIJ_B 
C 2, N
JP UZUPELNIJ_A
L 6, 0(4)
L 7, 0(5)

CR 6, 7
JP WPP
ST 6, 0(3)
A 1, JEDEN
AR 4, 8
AR 3, 8
J WARUNEK

WPP ST 7, 0(3)
A 2, JEDEN
AR 5, 8
AR 3, 8


J WARUNEK

UZUPELNIJ_B C 2, N
JP KONIEC
L 7, 0(5)
ST 7, 0(3)
AR 3, 8
AR 5, 8
A 2, JEDEN
J UZUPELNIJ_B

UZUPELNIJ_A  C 1, M
JP KONIEC
L 6, 0(4)
ST 6, 0(3)
AR 4, 8
AR 3, 8
A 1, JEDEN
J UZUPELNIJ_A


KONIEC SR 1, 1

  `,
  },
  {
    name: 'fibonacci',
    code: `# first N fibonacci numbers, into FIB
N DC INTEGER(10)
FOUR DC INTEGER(4)
ONE DC INTEGER(1)

FIB DS 10*INTEGER

# R7=ptr, R1=prev, R2=curr, R3=count
LA 7, FIB
SR 1, 1
L 2, ONE
ST 1, 0(7)
A 7, FOUR
ST 2, 0(7)
A 7, FOUR
L 3, ONE
A 3, ONE

START C 3, N
JZ END
LR 4, 1
AR 4, 2
ST 4, 0(7)
A 7, FOUR
LR 1, 2
LR 2, 4
A 3, ONE
J START

END SR 0, 0
`,
  },
  {
    name: 'find max',
    code: `# max element of ARR, into MAX
ARR DC INTEGER(3)
DC INTEGER(7)
DC INTEGER(2)
DC INTEGER(9)
DC INTEGER(4)

N DC INTEGER(5)
FOUR DC INTEGER(4)
ONE DC INTEGER(1)

MAX DS INTEGER

# R7=ptr, R1=count, R2=current max
LA 7, ARR
L 2, 0(7)
L 1, ONE

START C 1, N
JZ END
A 7, FOUR
L 3, 0(7)
CR 3, 2
JN SKIP
LR 2, 3

SKIP A 1, ONE
J START

END ST 2, MAX
`,
  },
  {
    name: 'is prime',
    code: `# is NUM prime? RES=1 if so, else 0
NUM DC INTEGER(29)
ONE DC INTEGER(1)
TWO DC INTEGER(2)

RES DC INTEGER(0)

# R0=zero, R1=divisor, R2=NUM, R3/R4=scratch
SR 0, 0
L 2, NUM
L 1, TWO

START CR 1, 2
JZ ISPRIME

LR 3, 2
DR 3, 1
MR 3, 1
LR 4, 2
SR 4, 3
CR 4, 0
JZ NOTPRIME

A 1, ONE
J START

ISPRIME L 4, ONE
ST 4, RES
J END

NOTPRIME ST 0, RES

END SR 0, 0
`,
  },
  {
    name: 'digit sum',
    code: `# sum of decimal digits of NUM, into SUM
NUM DC INTEGER(4938)
TEN DC INTEGER(10)

SUM DC INTEGER(0)

# R0=zero, R1=num, R2=sum, R3=quotient, R4/R5=scratch
SR 0, 0
SR 2, 2
L 1, NUM

START CR 1, 0
JZ END

LR 3, 1
D 3, TEN
LR 4, 3
M 4, TEN
LR 5, 1
SR 5, 4
AR 2, 5
LR 1, 3

J START

END ST 2, SUM
`,
  },
  {
    name: 'matrix transpose',
    code: `# transpose MAT (ROWS x COLS) into MAT_T
MAT DC INTEGER(1)
DC INTEGER(2)
DC INTEGER(3)
DC INTEGER(4)
DC INTEGER(5)
DC INTEGER(6)

MAT_T DS 6*INTEGER

ROWS DC INTEGER(2)
COLS DC INTEGER(3)
FOUR DC INTEGER(4)
ONE DC INTEGER(1)

# R6=&MAT, R7=&MAT_T, R1=row, R2=col
LA 6, MAT
LA 7, MAT_T
SR 1, 1

ROW SR 2, 2

COL C 2, COLS
JZ ENDCOL

# src addr = MAT + (row*COLS + col)*4
LR 3, 1
M 3, COLS
AR 3, 2
M 3, FOUR
LR 8, 6
AR 8, 3
L 5, 0(8)

# dst addr = MAT_T + (col*ROWS + row)*4
LR 4, 2
M 4, ROWS
AR 4, 1
M 4, FOUR
LR 9, 7
AR 9, 4
ST 5, 0(9)

A 2, ONE
J COL

ENDCOL A 1, ONE
C 1, ROWS
JZ END
J ROW

END SR 0, 0
`,
  },
];
