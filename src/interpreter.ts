export const keywords = [
  'A',
  'AR',
  'S',
  'SR',
  'M',
  'MR',
  'D',
  'DR',
  'C',
  'CR',
  'L',
  'LR',
  'ST',
  'LA',
  'J',
  'JP',
  'JZ',
  'JN',
  'DC',
  'DS',
];

const MAX_LINES = 1000;

// Register-register instructions
const rrKeywords = ['AR', 'SR', 'MR', 'DR', 'CR', 'LR'];

// Register-memory instructions
const rmKeywords = ['A', 'S', 'M', 'D', 'C', 'L', 'ST', 'LA'];

// Opcode byte values shown in the memory panel. DC/DS aren't executable, so
// they never appear here. There's no opcode table in the lectures - this is
// this interpreter's own convention (1-indexed by declaration order in
// `keywords`), purely to illustrate how a real assembler would pack an
// instruction into bytes.
export const opcodes: Record<string, number> = Object.fromEntries(
  keywords
    .filter((keyword) => keyword !== 'DC' && keyword !== 'DS')
    .map((keyword, i) => [keyword, i + 1]),
);

type byteType =
  | 'INSTRUCTION_OPCODE'
  | 'INSTRUCTION_OPERAND'
  | 'INSTRUCTION_UNUSED'
  | 'DATA'
  | 'DATA_HIDDEN';

export type byte = {
  val: number;
  type: byteType;
};

export const FLAGS = {
  ZF: 6,
  SF: 7,
};

type Statment = {
  val: string;
  byteSize: number;
};

type Label = {
  label: string;
  line: number;
  address: number;
};

export class PreprocessingError extends Error {
  line?: number;

  constructor(message: string, line?: number) {
    super(message);
    this.name = 'PreprocessingError';
    this.line = line;
  }
}

export class RuntimeError extends Error {
  line?: number;

  constructor(message: string, line?: number) {
    super(message);
    this.name = 'RuntimeError';
    this.line = line;
  }
}
class Interpreter {
  statements: Statment[];
  registers: Int32Array;
  isRegisterInitialized: boolean[];
  eflags: number;
  bytes: byte[];
  labels: Label[];
  currentLine: number;
  executedLines: number;
  currentMemoryAddress: number;
  // False until interpretNextLine() has actually run at least once (i.e.
  // execution has begun - stepping or a full run). preprocess() alone
  // doesn't set this: it runs continuously just from typing (see
  // syncMemoryWithEditor in main.ts) to keep the memory panel live, but
  // that's not "the program has started" - callers displaying
  // currentMemoryAddress as a program counter (the playground's PC
  // register) shouldn't treat it as a real value until execution itself
  // has begun.
  hasStarted: boolean;
  constructor(code: string) {
    this.registers = new Int32Array(16);
    this.statements = [...code.split('\n')].map((val) => ({
      val: val,
      byteSize: 0,
    }));
    this.labels = [];
    this.executedLines = 0;
    this.currentLine = 0;
    this.currentMemoryAddress = 0;
    this.eflags = 0;
    this.bytes = [];
    this.isRegisterInitialized = new Array(16).fill(false);
    this.hasStarted = false;
  }

  isAtEnd() {
    return this.statements.length <= this.currentLine;
  }

  // Every error tied to a specific source line is reported the same way -
  // "[Line N] ..." in the message (for display) plus a structured `line`
  // field (so callers like the editor's error-line highlight don't have to
  // parse it back out of the message).
  preprocessingError(message: string): PreprocessingError {
    const line = this.currentLine + 1;
    return new PreprocessingError(`[Line ${line}] ${message}`, line);
  }

  runtimeError(message: string): RuntimeError {
    const line = this.currentLine + 1;
    return new RuntimeError(`[Line ${line}] ${message}`, line);
  }

  interpret() {
    this.preprocess();
    while (!this.isAtEnd() && this.executedLines < MAX_LINES)
      this.interpretNextLine();
    if (this.executedLines >= MAX_LINES) {
      throw new RuntimeError(
        `Program halted after exceeding the execution limit of ${MAX_LINES} instructions. Possible infinite loop detected.`,
      );
    }
  }

  splitStatment(stmt: string): string[] {
    const tokens: string[] = [];
    const rawTokens = stmt.split(',').join(' , ').split(' ');
    rawTokens.forEach((rawToken) => {
      const token = rawToken.trim();
      if (token.length > 0) tokens.push(token);
    });
    return tokens;
  }

  isLabelDefined(label: string): boolean {
    return (
      this.labels.findIndex((currentLabel) => currentLabel.label == label) !==
      -1
    );
  }

  getNumberInParen(val: string): number {
    const match = val.match(/^INTEGER\((-?\d+)\)$/);
    if (!match) {
      throw this.preprocessingError(`Expected "INTEGER(<value>)", got "${val}".`);
    }

    return Number(match[1]);
  }

  bytesToNumber(bytes: byte[]): number {
    const [d, c, b, a] = [
      bytes[3].val,
      bytes[2].val,
      bytes[1].val,
      bytes[0].val,
    ];
    const res = (a << 24) | (b << 16) | (c << 8) | d;
    return res;
  }

  // big-endian
  numberToBytes(n: number): byte[] {
    const res: byte[] = [];
    res.push({ val: (n >> 24) & 0xff, type: 'DATA' });
    res.push({ val: (n >> 16) & 0xff, type: 'DATA' });
    res.push({ val: (n >> 8) & 0xff, type: 'DATA' });
    res.push({ val: n & 0xff, type: 'DATA' });
    return res;
  }

  preprocess() {
    let isDataSection = true;
    while (!this.isAtEnd()) {
      const tokens = this.splitStatment(
        this.removeComments(this.statements[this.currentLine].val),
      );
      if (tokens.length === 0) {
        this.currentLine += 1;
        continue;
      }

      const previousMemoryAddress = this.currentMemoryAddress;

      // Add label to environment
      if (tokens.length > 1 && keywords.includes(tokens[1])) {
        if (this.isLabelDefined(tokens[0])) {
          throw this.preprocessingError(
            `Label "${tokens[0]}" is defined more than once.`,
          );
        }

        if (!this.isAlphaNumeric(tokens[0])) {
          throw this.preprocessingError(
            `Label "${tokens[0]}" name must be alpha numberic name.'`,
          );
        }

        this.labels.push({
          label: tokens[0],
          line: this.currentLine,
          address: this.currentMemoryAddress,
        });
      }

      let currentIndex = 0;
      let instruction = tokens[0];

      currentIndex += 1;
      if (tokens.length > 1 && keywords.includes(tokens[1])) {
        instruction = tokens[1];
        currentIndex += 1;
      }

      if (!keywords.includes(instruction)) {
        throw this.preprocessingError(
          `Unrecognized instruction name "${instruction}".`,
        );
      }

      if (tokens.length <= currentIndex) {
        throw this.preprocessingError(
          `Data declarations (DC/DS) must specify a data type. Use format: LABEL DC INTEGER(value) or LABEL DS INTEGER`,
        );
      }

      const args = tokens[currentIndex].split('*');
      if (instruction === 'DC' || instruction == 'DS') {
        if (!isDataSection) {
          throw this.preprocessingError(
            `Data declarations (labels with DC/DS) must precede executable instructions. Move label "${tokens[0]}" at the top of the program.`,
          );
        }
      } else {
        isDataSection = false;
      }
      switch (instruction) {
        case 'DC':
          if (args.length === 2) {
            const numberOfMemoryCells = Number(args[0]) * 4;
            const number = this.getNumberInParen(args[1]);
            this.currentMemoryAddress += numberOfMemoryCells;

            const numberInBytes = this.numberToBytes(number).map(
              ({ val }): byte => ({
                type: 'DATA',
                val: val,
              }),
            );

            for (let i = 0; i < numberOfMemoryCells / 4; i++) {
              this.bytes = [...this.bytes, ...numberInBytes];
            }
          } else if (args.length === 1) {
            const number = this.getNumberInParen(args[0]);
            this.bytes = [...this.bytes, ...this.numberToBytes(number)];
            this.currentMemoryAddress += 4;
          }
          break;
        case 'DS':
          let numberOfMemoryCells = 4;
          if (args.length === 2) {
            if (args[1] !== 'INTEGER') {
              throw this.preprocessingError(`Expected "INTEGER", got "${args[1]}".`);
            }
            numberOfMemoryCells = Number(args[0]) * 4;
          } else if (args[0] !== 'INTEGER') {
            throw this.preprocessingError(`Expected "INTEGER", got "${args[0]}".`);
          }
          this.bytes = [
            ...this.bytes,
            ...new Array(numberOfMemoryCells).fill({
              val: 0,
              type: 'DATA_HIDDEN',
            }),
          ];

          this.currentMemoryAddress += numberOfMemoryCells;
          break;
        default:
          const instructionSize = this.getSizeOfInstruction(instruction);
          this.currentMemoryAddress += instructionSize;
          this.bytes = [
            ...this.bytes,
            ...this.layoutInstructionBytes(instruction),
          ];
          break;
      }
      this.statements[this.currentLine].byteSize =
        this.currentMemoryAddress - previousMemoryAddress;
      this.currentLine += 1;
    }

    this.currentLine = 0;
    this.currentMemoryAddress = 0;
    this.resolveInstructionOperands();
    this.skipNonExecutableLines();
  }

  // Lays out an executable instruction's bytes with an opcode byte first
  // (filled in immediately from the `opcodes` table, since it never depends
  // on a label), followed by an operand byte per register/address argument
  // the instruction takes. Those operand bytes get filled in with real
  // register/address values once every label is known, in
  // resolveInstructionOperands().
  layoutInstructionBytes(instruction: string): byte[] {
    const opcodeByte: byte = {
      val: opcodes[instruction],
      type: 'INSTRUCTION_OPCODE',
    };

    if (this.isInstructionRR(instruction)) {
      // opcode, packed-registers (reg1 high nibble, reg2 low nibble)
      return [opcodeByte, { val: 0, type: 'INSTRUCTION_OPERAND' }];
    }
    if (this.isInstructionRM(instruction)) {
      // opcode, register, mode byte, 4-byte address (as wide as a register)
      return [
        opcodeByte,
        { val: 0, type: 'INSTRUCTION_OPERAND' },
        { val: 0, type: 'INSTRUCTION_OPERAND' },
        { val: 0, type: 'INSTRUCTION_OPERAND' },
        { val: 0, type: 'INSTRUCTION_OPERAND' },
        { val: 0, type: 'INSTRUCTION_OPERAND' },
        { val: 0, type: 'INSTRUCTION_OPERAND' },
      ];
    }
    // Jump instructions (J/JP/JZ/JN) take only an address, no register -
    // opcode, mode byte, 4-byte address.
    return [
      opcodeByte,
      { val: 0, type: 'INSTRUCTION_OPERAND' },
      { val: 0, type: 'INSTRUCTION_OPERAND' },
      { val: 0, type: 'INSTRUCTION_OPERAND' },
      { val: 0, type: 'INSTRUCTION_OPERAND' },
      { val: 0, type: 'INSTRUCTION_OPERAND' },
    ];
  }

  // Second pass over the statements, run after every label is registered,
  // so forward references (a jump/address to a label defined further down)
  // can be resolved. Fills in the INSTRUCTION_OPERAND bytes laid out by
  // layoutInstructionBytes() with real register/address values - this is
  // purely for the memory panel display and never read back by
  // interpretNextLine(), which still re-parses source text at runtime.
  resolveInstructionOperands() {
    let addr = 0;
    for (let line = 0; line < this.statements.length; line++) {
      const tokens = this.splitStatment(
        this.removeComments(this.statements[line].val),
      );
      if (tokens.length === 0) continue;

      let currentIndex = 0;
      let instruction = tokens[0];
      if (tokens.length > 1 && keywords.includes(tokens[1])) {
        instruction = tokens[1];
        currentIndex += 1;
      }
      currentIndex += 1;

      if (this.isInstructionRR(instruction)) {
        const r1 = Number(tokens[currentIndex]);
        const r2 = Number(tokens[currentIndex + 2]);
        this.bytes[addr + 1].val = ((r1 & 0xf) << 4) | (r2 & 0xf);
      } else if (this.isInstructionRM(instruction)) {
        const r1 = Number(tokens[currentIndex]);
        this.bytes[addr + 1].val = r1 & 0xff;
        this.writeAddrField(addr + 2, tokens[currentIndex + 2]);
      } else if (this.isInstructionJump(instruction)) {
        this.writeAddrField(addr + 1, tokens[currentIndex]);
      }

      addr += this.statements[line].byteSize;
    }
  }

  // Writes a real-assembler style operand: a dedicated mode byte (0 =
  // direct address, 1 = indirect via register) followed by a full,
  // undiminished 4-byte address - the resolved address (direct) or the
  // register number to dereference (indirect). This keeps the address
  // field exactly as wide as a register (Int32Array is 32-bit), the same
  // way real ISAs keep addressing-mode bits (x86's ModRM) entirely
  // separate from the displacement value rather than stealing bits from
  // it. If the operand can't be resolved yet (e.g. malformed input the
  // runtime will reject later), the field is left unused instead of
  // guessing.
  writeAddrField(byteAddr: number, param: string) {
    const resolved = this.tryResolveStaticOperand(param);
    if (!resolved) {
      for (let i = 0; i < 5; i += 1) {
        this.bytes[byteAddr + i].type = 'INSTRUCTION_UNUSED';
      }
      return;
    }

    this.bytes[byteAddr].val = resolved.mode === 'indirect' ? 1 : 0;
    const addressBytes = this.numberToBytes(resolved.value);
    for (let i = 0; i < 4; i += 1) {
      this.bytes[byteAddr + 1 + i].val = addressBytes[i].val;
    }
  }

  // Same operand forms as getMemoryAddr (direct literal, indirect "0(<reg>)",
  // or a label), but resolved statically at preprocess time - for indirect
  // operands that means the register number, not the runtime pointer value
  // it holds, since that isn't known until the instruction actually runs.
  tryResolveStaticOperand(
    param: string,
  ): { mode: 'direct' | 'indirect'; value: number } | null {
    if (/^\d+$/.test(param)) {
      return { mode: 'direct', value: Number(param) };
    }
    if (/^0\(\d+\)$/.test(param)) {
      return { mode: 'indirect', value: Number(param.slice(2, -1)) };
    }

    const label = this.labels.find((label) => label.label === param);
    return label ? { mode: 'direct', value: label.address } : null;
  }

  isAlphaNumeric(val: string): boolean {
    for (let c of val.split('')) {
      if (
        !(
          (c >= 'a' && c <= 'z') ||
          (c >= 'A' && c <= 'Z') ||
          (c >= '0' && c <= '9') ||
          c === '_'
        )
      ) {
        return false;
      }
    }
    return true;
  }

  getSizeOfInstruction(instruction: string): number {
    if (this.isInstructionRR(instruction)) return 2;
    // opcode + mode byte + a full, undiminished 4-byte address (same width
    // as a register) - a jump has no register operand, RM instructions do.
    if (this.isInstructionJump(instruction)) return 6;
    return 7;
  }

  getMemoryAddr(param: string): number {
    if (/^\d+$/.test(param)) {
      return Number(param);
    }
    if (/^0\(\d+\)$/.test(param)) {
      return this.registers[Number(param.slice(2, -1))];
    }

    const label = this.labels.find((label) => label.label === param);

    if (label === undefined) {
      throw this.runtimeError(`There isn't defined label "${param}."`);
    }

    return label.address;
  }

  // Check if instruction is register-regitser
  isInstructionRR(instruction: string): boolean {
    return rrKeywords.includes(instruction);
  }

  // Check if instruction is register-regitser
  isInstructionRM(instruction: string): boolean {
    return rmKeywords.includes(instruction);
  }

  // Check if instruction is a jump (J/JP/JZ/JN)
  isInstructionJump(instruction: string): boolean {
    return instruction.length > 0 && instruction[0] === 'J';
  }

  getNumberFromMemory(addr: number): number {
    return this.bytesToNumber([
      this.bytes[addr],
      this.bytes[addr + 1],
      this.bytes[addr + 2],
      this.bytes[addr + 3],
    ]);
  }
  setNumberInMemory(addr: number, num: number) {
    const data = this.numberToBytes(num);
    data.map((val, i) => {
      this.bytes[addr + i] = val;
      this.bytes[addr + i].type = 'DATA';
    });
  }

  getStatmentLine(addr: number): number {
    let stmtAddr = 0;

    for (let i = 0; i < this.statements.length; i++) {
      if (this.statements[i].byteSize > 0 && addr === stmtAddr) {
        return i;
      }

      if (addr < stmtAddr) {
        throw this.runtimeError(
          `InvalidJumpTarget - attempted to jump to address 0x${addr
            .toString(16)
            .padStart(32, '0')}, which is not executable.`,
        );
      }

      stmtAddr += this.statements[i].byteSize;
    }
    throw this.runtimeError(
      `InvalidJumpTarget - attempted to jump to address 0x${addr
        .toString(16)
        .padStart(32, '0')}, which is not executable.`,
    );
  }

  // The byte address the statement at `line` (0-indexed) starts at - the
  // sum of every earlier statement's byteSize. Blank/comment lines and
  // DC/DS contribute their real size (0 or a data declaration's size), so
  // this works for mapping an arbitrary source line back to where it lives
  // in memory, e.g. for highlighting a text selection's bytes.
  getLineAddress(line: number): number {
    let addr = 0;
    for (let i = 0; i < line && i < this.statements.length; i++) {
      addr += this.statements[i].byteSize;
    }
    return addr;
  }

  updateEflags(num: number) {
    this.eflags = 0;
    this.eflags |= num === 0 ? 1 << FLAGS.ZF : 0;
    this.eflags |= num < 0 ? 1 << FLAGS.SF : 0;
  }

  removeComments(val: string): string {
    if (val.trim()[0] === '#') return '';
    return val.trim().split('#')[0];
  }

  // Advances currentLine (and currentMemoryAddress, for statements that
  // occupy memory) past anything that isn't a real executable instruction -
  // blank/comment lines, and DC/DS data declarations. A real CPU's program
  // counter only ever points into .text; .data is set up before execution
  // starts, not stepped through one declaration at a time, so PC should
  // never appear to "visit" it. Called both before and after executing a
  // statement, so currentLine/currentMemoryAddress never dangle on a
  // non-executable line - callers like the UI's "next line" stepper
  // highlight currentLine (and display currentMemoryAddress as PC)
  // directly, and need them to always reflect the next real instruction.
  skipNonExecutableLines() {
    while (!this.isAtEnd()) {
      const tokens = this.splitStatment(
        this.removeComments(this.statements[this.currentLine].val),
      );
      if (tokens.length === 0) {
        this.currentLine += 1;
        continue;
      }

      const instruction =
        tokens.length > 1 && keywords.includes(tokens[1])
          ? tokens[1]
          : tokens[0];

      if (instruction !== 'DC' && instruction !== 'DS') return;

      this.currentMemoryAddress += this.statements[this.currentLine].byteSize;
      this.currentLine += 1;
    }
  }

  interpretNextLine() {
    this.hasStarted = true;
    this.executedLines += 1;
    this.skipNonExecutableLines();
    if (this.isAtEnd()) return;

    const tokens = this.splitStatment(
      this.removeComments(this.statements[this.currentLine].val),
    );

    let currentIndex: number = 0;
    let instruction = tokens[0];

    if (tokens.length > 1 && keywords.includes(tokens[1])) {
      instruction = tokens[1];
      currentIndex += 1;
    }

    if (keywords.includes(instruction)) {
      currentIndex += 1;

      // Register-register instructions
      if (this.isInstructionRR(instruction)) {
        if (tokens.length - currentIndex != 3) {
          throw this.runtimeError(
            `To many argument for instruction "${instruction}" .`,
          );
        }
        const r1 = Number(tokens[currentIndex]);
        currentIndex += 1;
        if (tokens[currentIndex] != ',') {
          throw this.runtimeError(
            `Expected "," between arguments of instruction ${instruction}.`,
          );
        }
        currentIndex += 1;
        const r2 = Number(tokens[currentIndex]);

        this.isRegisterInitialized[r1] = true;
        switch (instruction) {
          case 'AR':
            this.registers[r1] += this.registers[r2];
            this.updateEflags(this.registers[r1]);
            break;
          case 'SR':
            this.registers[r1] -= this.registers[r2];
            this.updateEflags(this.registers[r1]);
            break;
          case 'MR':
            this.registers[r1] *= this.registers[r2];
            this.updateEflags(this.registers[r1]);
            break;
          case 'DR':
            this.registers[r1] = Math.floor(
              this.registers[r1] / this.registers[r2],
            );
            this.updateEflags(this.registers[r1]);
            break;
          case 'CR':
            this.updateEflags(this.registers[r1] - this.registers[r2]);
            break;
          case 'LR':
            this.registers[r1] = this.registers[r2];
            this.updateEflags(this.registers[r1]);
            break;
        }
      }

      // Register-memory instructions
      if (this.isInstructionRM(instruction)) {
        if (tokens.length - currentIndex != 3) {
          throw this.runtimeError(
            `To many argument for instruction "${instruction}" .`,
          );
        }
        const r1 = Number(tokens[currentIndex]);
        currentIndex += 1;
        if (tokens[currentIndex] != ',') {
          throw this.runtimeError(
            `Expected "," between arguments of instruction ${instruction}.`,
          );
        }
        currentIndex += 1;
        const addr = this.getMemoryAddr(tokens[currentIndex]);
        this.isRegisterInitialized[r1] = true;
        switch (instruction) {
          case 'A':
            this.registers[r1] += this.getNumberFromMemory(addr);
            this.updateEflags(this.registers[r1]);
            break;
          case 'S':
            this.registers[r1] -= this.getNumberFromMemory(addr);
            this.updateEflags(this.registers[r1]);
            break;
          case 'M':
            this.registers[r1] *= this.getNumberFromMemory(addr);
            this.updateEflags(this.registers[r1]);
            break;
          case 'D':
            this.registers[r1] = Math.floor(
              this.registers[r1] / this.getNumberFromMemory(addr),
            );
            this.updateEflags(this.registers[r1]);
            break;
          case 'C':
            this.updateEflags(
              this.registers[r1] - this.getNumberFromMemory(addr),
            );
            // this.eflags ^= (1 << FLAGS.ZF) | (1 << FLAGS.SF);
            // this.eflags |= this.registers[r1] === 0 ? 1 << FLAGS.ZF : 0;
            // this.eflags |= this.registers[r1] < 0 ? 1 << FLAGS.SF : 0;

            break;
          case 'L':
            this.registers[r1] = this.getNumberFromMemory(addr);
            this.updateEflags(this.registers[r1]);
            break;
          case 'ST':
            this.setNumberInMemory(addr, this.registers[r1]);
            this.updateEflags(this.registers[r1]);
            break;
          case 'LA':
            this.registers[r1] = addr;
            this.updateEflags(this.registers[r1]);
            break;
        }
      }

      if (this.isInstructionJump(instruction)) {
        if (tokens.length - currentIndex != 1) {
          throw this.runtimeError(
            `Instruction "${instruction}" accept only one argument "${instruction} <memmory address>".`,
          );
        }
        const addr = this.getMemoryAddr(tokens[currentIndex]);
        const statmentLine = this.getStatmentLine(addr);
        switch (instruction) {
          case 'J':
            this.currentLine = statmentLine;
            this.currentMemoryAddress = addr;
            return;
          case 'JP':
            if (
              !(this.eflags & (1 << FLAGS.SF) || this.eflags & (1 << FLAGS.ZF))
            ) {
              this.currentLine = statmentLine;
              this.currentMemoryAddress = addr;
              return;
            }
            break;
          case 'JN':
            if (this.eflags & (1 << FLAGS.SF)) {
              this.currentLine = statmentLine;
              this.currentMemoryAddress = addr;
              return;
            }
            break;
          case 'JZ':
            if (this.eflags & (1 << FLAGS.ZF)) {
              this.currentLine = statmentLine;
              this.currentMemoryAddress = addr;
              return;
            }
            break;
        }
      }
    } else {
      throw this.runtimeError(`Unrecognized instruction name "${instruction}".`);
    }
    this.currentMemoryAddress += this.statements[this.currentLine].byteSize;
    this.currentLine += 1;
    this.skipNonExecutableLines();
  }

  getValueByLabel(label: string): number {
    console.log(label);
    const foundedLabel = this.labels.find((item) => item.label === label);
    if (!foundedLabel) throw Error(`Label "${label}" doesn't exist.`);
    return this.getNumberFromMemory(foundedLabel.address);
  }
}
export { Interpreter };
