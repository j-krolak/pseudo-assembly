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

type byteType = 'INSTRUCTION' | 'DATA';

export type byte = {
  val: number;
  type: byteType;
};

const FLAGS = {
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
  constructor(message: string) {
    super(message);
    this.name = 'PreprocessingError';
  }
}

export class RuntimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RuntimeError';
  }
}
class Interpreter {
  statements: Statment[];
  registers: Int32Array;
  eflags: number;
  bytes: byte[];
  labels: Label[];
  currentLine: number;
  executedLines: number;
  currentMemoryAddress: number;
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
  }

  isAtEnd() {
    return this.statements.length <= this.currentLine;
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
    const res = val.match(/-?\d+/);
    if (val.length < 1) {
      throw new PreprocessingError('there isnt number.');
    }

    return Number(res?.[0]);
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
          throw new PreprocessingError(
            `[Line ${this.currentLine + 1}] Label "${
              tokens[0]
            }" is defined more than once.`,
          );
        }

        if (!this.isAlphaNumeric(tokens[0])) {
          throw new PreprocessingError(
            `[Line ${this.currentLine + 1}] Label "${
              tokens[0]
            }" name must be alpha numberic name.'`,
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
        throw new PreprocessingError(
          `[Line ${
            this.currentLine + 1
          }] Unrecognized instruction name "${instruction}".`,
        );
      }

      const args = tokens[currentIndex].split('*');
      if (instruction === 'DC' || instruction == 'DS') {
        if (!isDataSection) {
          throw new PreprocessingError(
            `[Line ${
              this.currentLine + 1
            }] Data declarations (labels with DC/DS) must precede executable instructions. Move label "${
              tokens[0]
            }" at the top of the program.`,
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
            numberOfMemoryCells = Number(args[0]) * 4;
          }
          this.bytes = [
            ...this.bytes,
            ...new Array(numberOfMemoryCells).fill({
              val: 0,
              type: 'DATA',
            }),
          ];

          this.currentMemoryAddress += numberOfMemoryCells;
          break;
        default:
          const instructionSize = this.getSizeOfInstruction(instruction);
          this.currentMemoryAddress += instructionSize;
          this.bytes = [
            ...this.bytes,
            ...new Array(instructionSize).fill({
              val: 0,
              type: 'INSTRUCTION',
            }),
          ];
          break;
      }
      this.statements[this.currentLine].byteSize =
        this.currentMemoryAddress - previousMemoryAddress;
      this.currentLine += 1;
    }

    this.currentLine = 0;
    this.currentMemoryAddress = 0;
  }

  isAlphaNumeric(val: string): boolean {
    for (let c in val.split('')) {
      if (
        !(
          (c >= 'a' && c <= 'z') ||
          (c >= 'A' && c <= 'Z') ||
          (c >= '0' && c <= '9')
        )
      ) {
        return false;
      }
    }
    return true;
  }

  getSizeOfInstruction(instruction: string): number {
    return this.isInstructionRR(instruction) ? 2 : 4;
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
      throw new RuntimeError(
        `[Line ${this.currentLine + 1}] There isn't defined label "${param}."`,
      );
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
    this.bytes[addr] = data[0];
    this.bytes[addr + 1] = data[1];
    this.bytes[addr + 2] = data[2];
    this.bytes[addr + 3] = data[3];
  }

  getStatmentLine(addr: number): number {
    let stmtAddr = 0;

    for (let i = 0; i < this.statements.length; i++) {
      if (this.statements[i].byteSize > 0 && addr === stmtAddr) {
        return i;
      }

      if (addr < stmtAddr) {
        throw new RuntimeError(
          `[Line ${
            this.currentLine + 1
          }] InvalidJumpTarget - attempted to jump to address 0x${addr
            .toString(16)
            .padStart(32, '0')}, which is not executable.`,
        );
      }

      stmtAddr += this.statements[i].byteSize;
    }
    throw new RuntimeError(
      `[Line ${
        this.currentLine + 1
      }] InvalidJumpTarget - attempted to jump to address 0x${addr
        .toString(16)
        .padStart(32, '0')}, which is not executable.`,
    );
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

  interpretNextLine() {
    this.executedLines += 1;
    if (this.isAtEnd()) return;
    const tokens = this.splitStatment(
      this.removeComments(this.statements[this.currentLine].val),
    );
    if (tokens.length === 0) {
      this.currentLine += 1;
      return;
    }
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
          throw new RuntimeError(
            `[Line ${
              this.currentLine + 1
            }] To many argument for instruction "${instruction}" .`,
          );
        }
        const r1 = Number(tokens[currentIndex]);
        currentIndex += 1;
        if (tokens[currentIndex] != ',') {
          throw new RuntimeError(
            `[Line ${
              this.currentLine + 1
            }] Expected "," between arguments of instruction ${instruction}.`,
          );
        }
        currentIndex += 1;
        const r2 = Number(tokens[currentIndex]);

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
          throw new RuntimeError(
            `[Line ${
              this.currentLine + 1
            }] To many argument for instruction "${instruction}" .`,
          );
        }
        const r1 = Number(tokens[currentIndex]);
        currentIndex += 1;
        if (tokens[currentIndex] != ',') {
          throw new RuntimeError(
            `[Line ${
              this.currentLine + 1
            }] Expected "," between arguments of instruction ${instruction}.`,
          );
        }
        currentIndex += 1;
        const addr = this.getMemoryAddr(tokens[currentIndex]);
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
            this.eflags ^= (1 << FLAGS.ZF) | (1 << FLAGS.SF);
            this.eflags |= this.registers[r1] === 0 ? 1 << FLAGS.ZF : 0;
            this.eflags |= this.registers[r1] < 0 ? 1 << FLAGS.SF : 0;

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

      if (instruction.length > 0 && instruction[0] === 'J') {
        if (tokens.length - currentIndex != 1) {
          throw new RuntimeError(
            `[Line ${
              this.currentLine + 1
            }] Instruction "${instruction}" accept only one argument "${instruction} <memmory address>".`,
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
            if (!(this.eflags & (1 << FLAGS.SF))) {
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
      throw new RuntimeError(
        `[Line ${
          this.currentLine + 1
        }] Unrecognized instruction name "${instruction}".`,
      );
    }
    this.currentMemoryAddress += this.statements[this.currentLine].byteSize;
    this.currentLine += 1;
  }
}
export { Interpreter };
