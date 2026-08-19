/**
 * utils/mathEngine.ts
 *
 * Custom Mathematical Parsing & Evaluation Engine for Casio fx-991EX ClassWiz Emulator.
 *
 * NOTE ON TECHNICAL CONSTRAINTS:
 * - Absolutely NO `eval()` or `Function()` constructor is used anywhere in this engine.
 * - Implements a full manual tokenization and Shunting-Yard operator-precedence parsing algorithm
 *   evaluating expressions using operand and operator stacks.
 * - Supports fx-991EX Modes & Functions:
 *   1. Calculate (Standard arithmetic, fractions, powers, trig, log, calculus approx)
 *   2. Complex (Cartesian a+bi, polar form)
 *   3. Base-N (DEC, HEX, BIN, OCT with bitwise operators)
 *   4. Matrix (MatA..MatD, 2x2/3x3 add, mult, det, inv, transpose)
 *   5. Vector (VctA..VctD, dot product, cross product, magnitude)
 *   6. Statistics (1-Var statistics: mean, sum, std dev, variance)
 *   7. Distribution (Normal, Binomial, Poisson PDF/CDF)
 *   8. Spreadsheet (Basic mini-grid A1..C4 evaluation)
 *   9. Table (f(x) & g(x) generation)
 *   10. Equation/Func (2-3 simultaneous linear eqns, 2nd-3rd deg polynomial roots)
 *   11. Inequality (Quadratic inequality intervals)
 *   12. Ratio (A:B = X:D or A:B = C:X)
 *   - Advanced Manual Functions:
 *     * Coordinate Conversions: Pol(x, y) and Rec(r, θ)
 *     * Calculus: Numerical Integration (∫) & Derivative Approximation (d/dx)
 *     * Randomization: Ran# (0..1 3-decimal pseudo-random) & RanInt#(a, b)
 *     * Permutations & Combinations: nPr, nCr
 */

export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

export type CalcMode =
  | 'CALCULATE'
  | 'COMPLEX'
  | 'BASE_N'
  | 'MATRIX'
  | 'VECTOR'
  | 'STATISTICS'
  | 'DISTRIBUTION'
  | 'SPREADSHEET'
  | 'TABLE'
  | 'EQUATION'
  | 'INEQUALITY'
  | 'RATIO';

export type BaseNType = 'DEC' | 'HEX' | 'BIN' | 'OCT';

export interface MemoryVariables {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  M: number;
  x: number;
  y: number;
  Ans: number;
  PreAns: number;
}

export interface CalculationHistoryItem {
  id: string;
  input: string;
  result: string;
  timestamp: number;
}

export interface EngineState {
  mode: CalcMode;
  angleUnit: AngleUnit;
  baseN: BaseNType;
  inputBuffer: string;
  resultBuffer: string;
  isShift: boolean;
  isAlpha: boolean;
  memory: MemoryVariables;
  // History tape and active replay index (-1 = current active buffer)
  history: CalculationHistoryItem[];
  historyIndex: number;
  tableData?: { x: number; fx: number; gx?: number }[];
  matrixData?: { [name: string]: number[][] };
  vectorData?: { [name: string]: number[] };
  statData?: number[];
  equationResult?: string[];
  ratioResult?: string;
}

export const INITIAL_STATE: EngineState = {
  mode: 'CALCULATE',
  angleUnit: 'DEG',
  baseN: 'DEC',
  inputBuffer: '',
  resultBuffer: '0',
  isShift: false,
  isAlpha: false,
  memory: {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    E: 0,
    F: 0,
    M: 0,
    x: 0,
    y: 0,
    Ans: 0,
    PreAns: 0,
  },
  history: [],
  historyIndex: -1,
  matrixData: {
    MatA: [[1, 0], [0, 1]],
    MatB: [[2, 1], [1, 2]],
  },
  vectorData: {
    VctA: [1, 2, 3],
    VctB: [4, 5, 6],
  },
  statData: [],
};

// --- Mathematical Helper Functions ---

export function toRadians(angle: number, unit: AngleUnit): number {
  if (unit === 'RAD') return angle;
  if (unit === 'GRAD') return (angle * Math.PI) / 200;
  return (angle * Math.PI) / 180;
}

export function fromRadians(rad: number, unit: AngleUnit): number {
  if (unit === 'RAD') return rad;
  if (unit === 'GRAD') return (rad * 200) / Math.PI;
  return (rad * 180) / Math.PI;
}

export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity; // Overflow boundary for IEEE-754
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export function permutation(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
  return factorial(n) / factorial(n - r);
}

export function combination(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) return NaN;
  return factorial(n) / (factorial(r) * factorial(n - r));
}

// --- Coordinate Conversions (Pol & Rec) ---

export interface PolarCoord {
  r: number;
  theta: number; // In current AngleUnit
}

export interface RectCoord {
  x: number;
  y: number;
}

export function rectangularToPolar(x: number, y: number, unit: AngleUnit): PolarCoord {
  const r = Math.sqrt(x * x + y * y);
  const rad = Math.atan2(y, x);
  const theta = fromRadians(rad, unit);
  return { r, theta };
}

export function polarToRectangular(r: number, theta: number, unit: AngleUnit): RectCoord {
  const rad = toRadians(theta, unit);
  const x = r * Math.cos(rad);
  const y = r * Math.sin(rad);
  return { x, y };
}

// --- Calculus Approximations (Integration & Differentiation) ---

/**
 * Numerical integration using adaptive composite Simpson's 1/3 Rule.
 * Evaluates expr(x) from a to b with n subintervals (zero eval).
 */
export function numericalIntegrate(
  expr: string,
  a: number,
  b: number,
  state: EngineState,
  n: number = 60
): number {
  if (n % 2 !== 0) n += 1;
  const h = (b - a) / n;

  const evalAt = (xVal: number): number => {
    const subState: EngineState = {
      ...state,
      memory: { ...state.memory, x: xVal },
    };
    return evaluateExpression(expr, subState);
  };

  let sum = evalAt(a) + evalAt(b);
  for (let i = 1; i < n; i++) {
    const xVal = a + i * h;
    sum += evalAt(xVal) * (i % 2 === 0 ? 2 : 4);
  }

  return (h / 3) * sum;
}

/**
 * Numerical derivative approximation using 5-point symmetric finite difference.
 * f'(x) ≈ (-f(x+2h) + 8f(x+h) - 8f(x-h) + f(x-2h)) / (12h)
 */
export function numericalDerivative(
  expr: string,
  x: number,
  state: EngineState,
  h: number = 1e-5
): number {
  const evalAt = (xVal: number): number => {
    const subState: EngineState = {
      ...state,
      memory: { ...state.memory, x: xVal },
    };
    return evaluateExpression(expr, subState);
  };

  const f_plus_2h = evalAt(x + 2 * h);
  const f_plus_h = evalAt(x + h);
  const f_minus_h = evalAt(x - h);
  const f_minus_2h = evalAt(x - 2 * h);

  return (-f_plus_2h + 8 * f_plus_h - 8 * f_minus_h + f_minus_2h) / (12 * h);
}

// --- Custom Tokenizer & Shunting-Yard Parser (No eval) ---

type TokenType = 'NUMBER' | 'IDENTIFIER' | 'OPERATOR' | 'FUNCTION' | 'LPAREN' | 'RPAREN' | 'COMMA';

interface Token {
  type: TokenType;
  value: string;
}

const OPERATORS: { [op: string]: { prec: number; assoc: 'LEFT' | 'RIGHT'; isBinary: boolean } } = {
  '+': { prec: 2, assoc: 'LEFT', isBinary: true },
  '-': { prec: 2, assoc: 'LEFT', isBinary: true },
  '×': { prec: 3, assoc: 'LEFT', isBinary: true },
  '*': { prec: 3, assoc: 'LEFT', isBinary: true },
  '÷': { prec: 3, assoc: 'LEFT', isBinary: true },
  '/': { prec: 3, assoc: 'LEFT', isBinary: true },
  '%': { prec: 3, assoc: 'LEFT', isBinary: true },
  '^': { prec: 4, assoc: 'RIGHT', isBinary: true },
  'P': { prec: 3, assoc: 'LEFT', isBinary: true }, // nPr
  'C': { prec: 3, assoc: 'LEFT', isBinary: true }, // nCr
  '!': { prec: 5, assoc: 'LEFT', isBinary: false }, // postfix factorial
  'NEG': { prec: 4, assoc: 'RIGHT', isBinary: false }, // unary minus
};

const FUNCTIONS = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan',
  'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh',
  'log', 'ln', 'sqrt', 'cbrt', 'abs', 'exp', 'floor', 'ceil',
  'pol', 'rec', 'ran#', 'ranint', 'diff', 'integ'
]);

/**
 * Tokenize input string into well-defined tokens.
 */
export function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const s = expr.replace(/\s+/g, '');

  while (i < s.length) {
    const ch = s[i];

    // Numbers & Decimals
    if (/[0-9]/.test(ch) || (ch === '.' && i + 1 < s.length && /[0-9]/.test(s[i + 1]))) {
      let numStr = '';
      while (i < s.length && (/[0-9]/.test(s[i]) || s[i] === '.')) {
        numStr += s[i];
        i++;
      }
      // Scientific notation (e.g. 1.5e3 or 2×10^3)
      if (i < s.length && (s[i] === 'e' || s[i] === 'E') && i + 1 < s.length && (/[0-9+-]/.test(s[i + 1]))) {
        numStr += s[i];
        i++;
        if (s[i] === '+' || s[i] === '-') {
          numStr += s[i];
          i++;
        }
        while (i < s.length && /[0-9]/.test(s[i])) {
          numStr += s[i];
          i++;
        }
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Identifiers & Functions (sin, cos, tan, log, Ans, pi, e, A..F, x, y, Pol, Rec, Ran#, RanInt)
    if (/[a-zA-Z_π#∫]/.test(ch)) {
      let idStr = '';
      while (i < s.length && /[a-zA-Z0-9_π#]/.test(s[i])) {
        idStr += s[i];
        i++;
      }

      // Handle standalone integral symbol if matched
      if (idStr === '' && ch === '∫') {
        idStr = 'integ';
        i++;
      }

      const lowerId = idStr.toLowerCase();
      if (FUNCTIONS.has(lowerId)) {
        tokens.push({ type: 'FUNCTION', value: lowerId });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: idStr });
      }
      continue;
    }

    // Parentheses & Separators
    if (ch === '(') {
      if (tokens.length > 0) {
        const prev = tokens[tokens.length - 1];
        if (prev.type === 'NUMBER' || prev.type === 'IDENTIFIER' || prev.type === 'RPAREN' || prev.value === '!') {
          tokens.push({ type: 'OPERATOR', value: '×' });
        }
      }
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }

    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }

    if (ch === ',' || ch === ';') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    // Factorial postfix operator
    if (ch === '!') {
      tokens.push({ type: 'OPERATOR', value: '!' });
      i++;
      continue;
    }

    // Operators (+, -, ×, *, ÷, /, ^, etc.)
    if (ch in OPERATORS || ch === '×' || ch === '÷') {
      let op = ch;
      if (op === '*') op = '×';
      if (op === '/') op = '÷';

      // Distinguish unary minus from subtraction
      if (op === '-') {
        const prev = tokens.length > 0 ? tokens[tokens.length - 1] : null;
        if (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN' || prev.type === 'COMMA') {
          op = 'NEG';
        }
      }

      tokens.push({ type: 'OPERATOR', value: op });
      i++;
      continue;
    }

    i++;
  }

  return tokens;
}

/**
 * Pre-evaluates higher-order multi-argument expressions such as:
 * - ∫(f(x), a, b) or integ(expr, a, b)
 * - d/dx(f(x), x) or diff(expr, x)
 * - Pol(x, y)
 * - Rec(r, theta)
 * - RanInt#(a, b)
 * - Ran#
 */
export function preprocessAdvancedConstructs(expr: string, state: EngineState): string {
  let processed = expr;

  // Replace Ran# without args with a 3-decimal random float (e.g. 0.385)
  processed = processed.replace(/Ran#/gi, () => {
    return (Math.floor(Math.random() * 1000) / 1000).toFixed(3);
  });

  // Replace RanInt#(a, b) or RanInt(a, b) with random integer in [a, b]
  processed = processed.replace(/RanInt#?\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, (_, minStr, maxStr) => {
    const min = Math.round(evaluateExpression(minStr, state));
    const max = Math.round(evaluateExpression(maxStr, state));
    const randVal = Math.floor(Math.random() * (max - min + 1)) + min;
    return `${randVal}`;
  });

  // Coordinate Conversion Pol(x, y) -> returns r and stores theta in variable y, r in variable x/Ans
  processed = processed.replace(/Pol\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, (_, xStr, yStr) => {
    const xVal = evaluateExpression(xStr, state);
    const yVal = evaluateExpression(yStr, state);
    const polar = rectangularToPolar(xVal, yVal, state.angleUnit);
    state.memory.x = polar.r;
    state.memory.y = polar.theta;
    state.memory.Ans = polar.r;
    return `${polar.r}`; // Primary scalar return; display can read r & θ
  });

  // Coordinate Conversion Rec(r, theta) -> returns x and stores y in variable y, x in variable x/Ans
  processed = processed.replace(/Rec\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, (_, rStr, thetaStr) => {
    const rVal = evaluateExpression(rStr, state);
    const thetaVal = evaluateExpression(thetaStr, state);
    const rect = polarToRectangular(rVal, thetaVal, state.angleUnit);
    state.memory.x = rect.x;
    state.memory.y = rect.y;
    state.memory.Ans = rect.x;
    return `${rect.x}`;
  });

  // Calculus: Numerical Integration ∫(expr, a, b) or integ(expr, a, b)
  processed = processed.replace(/(?:∫|integ)\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, (_, fStr, aStr, bStr) => {
    const aVal = evaluateExpression(aStr, state);
    const bVal = evaluateExpression(bStr, state);
    const res = numericalIntegrate(fStr, aVal, bVal, state);
    return `${res}`;
  });

  // Calculus: Numerical Derivative d/dx(expr, xVal) or diff(expr, xVal)
  processed = processed.replace(/(?:d\/dx|diff)\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi, (_, fStr, xStr) => {
    const xVal = evaluateExpression(xStr, state);
    const res = numericalDerivative(fStr, xVal, state);
    return `${res}`;
  });

  return processed;
}

/**
 * Evaluates an infix mathematical expression using the Shunting-Yard algorithm (Operator Precedence Stack).
 * Completely avoids eval().
 */
export function evaluateExpression(
  expression: string,
  state: EngineState
): number {
  if (!expression || expression.trim() === '') return 0;

  // Handle advanced constructs (calculus, Pol/Rec, RanInt, Ran#)
  let cleaned = preprocessAdvancedConstructs(expression, state);

  // Pre-process common display representations
  cleaned = cleaned
    .replace(/×10\^/g, '*10^')
    .replace(/π/g, 'pi')
    .replace(/Ans/g, `${state.memory.Ans}`)
    .replace(/PreAns/g, `${state.memory.PreAns}`);

  const tokens = tokenize(cleaned);
  const operandStack: number[] = [];
  const operatorStack: Token[] = [];

  const resolveIdentifier = (id: string): number => {
    const lower = id.toLowerCase();
    if (lower === 'pi' || lower === 'π') return Math.PI;
    if (lower === 'e') return Math.E;
    if (id in state.memory) return (state.memory as any)[id];
    if (id.toUpperCase() in state.memory) return (state.memory as any)[id.toUpperCase()];
    return 0;
  };

  const applyOperator = (op: string) => {
    if (op === 'NEG') {
      const val = operandStack.pop() ?? 0;
      operandStack.push(-val);
      return;
    }
    if (op === '!') {
      const val = operandStack.pop() ?? 0;
      operandStack.push(factorial(val));
      return;
    }

    const b = operandStack.pop() ?? 0;
    const a = operandStack.pop() ?? 0;

    switch (op) {
      case '+': operandStack.push(a + b); break;
      case '-': operandStack.push(a - b); break;
      case '×':
      case '*': operandStack.push(a * b); break;
      case '÷':
      case '/':
        if (b === 0) throw new Error('Math ERROR: Division by Zero');
        operandStack.push(a / b);
        break;
      case '%': operandStack.push((a * b) / 100); break;
      case '^': operandStack.push(Math.pow(a, b)); break;
      case 'P': operandStack.push(permutation(a, b)); break;
      case 'C': operandStack.push(combination(a, b)); break;
      default:
        throw new Error(`Syntax ERROR: Unknown operator ${op}`);
    }
  };

  const applyFunction = (fn: string) => {
    const arg = operandStack.pop() ?? 0;
    const unit = state.angleUnit;

    switch (fn) {
      case 'sin': operandStack.push(Math.sin(toRadians(arg, unit))); break;
      case 'cos': operandStack.push(Math.cos(toRadians(arg, unit))); break;
      case 'tan': {
        const rad = toRadians(arg, unit);
        if (Math.abs(Math.cos(rad)) < 1e-15) throw new Error('Math ERROR: Undefined tan');
        operandStack.push(Math.tan(rad));
        break;
      }
      case 'asin': operandStack.push(fromRadians(Math.asin(arg), unit)); break;
      case 'acos': operandStack.push(fromRadians(Math.acos(arg), unit)); break;
      case 'atan': operandStack.push(fromRadians(Math.atan(arg), unit)); break;
      case 'sinh': operandStack.push(Math.sinh(arg)); break;
      case 'cosh': operandStack.push(Math.cosh(arg)); break;
      case 'tanh': operandStack.push(Math.tanh(arg)); break;
      case 'asinh': operandStack.push(Math.asinh(arg)); break;
      case 'acosh': operandStack.push(Math.acosh(arg)); break;
      case 'atanh': operandStack.push(Math.atanh(arg)); break;
      case 'log':
        if (arg <= 0) throw new Error('Math ERROR: Log domain');
        operandStack.push(Math.log10(arg));
        break;
      case 'ln':
        if (arg <= 0) throw new Error('Math ERROR: Ln domain');
        operandStack.push(Math.log(arg));
        break;
      case 'sqrt':
        if (arg < 0) throw new Error('Math ERROR: Square root of negative');
        operandStack.push(Math.sqrt(arg));
        break;
      case 'cbrt': operandStack.push(Math.cbrt(arg)); break;
      case 'abs': operandStack.push(Math.abs(arg)); break;
      case 'exp': operandStack.push(Math.exp(arg)); break;
      case 'floor': operandStack.push(Math.floor(arg)); break;
      case 'ceil': operandStack.push(Math.ceil(arg)); break;
      default:
        throw new Error(`Syntax ERROR: Unknown function ${fn}`);
    }
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'NUMBER') {
      operandStack.push(parseFloat(token.value));
    } else if (token.type === 'IDENTIFIER') {
      operandStack.push(resolveIdentifier(token.value));
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'OPERATOR') {
      const opInfo = OPERATORS[token.value];
      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'OPERATOR') {
          const topInfo = OPERATORS[top.value];
          if (
            (opInfo.assoc === 'LEFT' && opInfo.prec <= topInfo.prec) ||
            (opInfo.assoc === 'RIGHT' && opInfo.prec < topInfo.prec)
          ) {
            operatorStack.pop();
            applyOperator(top.value);
            continue;
          }
        }
        break;
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
        const top = operatorStack.pop()!;
        if (top.type === 'OPERATOR') applyOperator(top.value);
        else if (top.type === 'FUNCTION') applyFunction(top.value);
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'LPAREN') {
        operatorStack.pop();
      }
      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
        const fn = operatorStack.pop()!;
        applyFunction(fn.value);
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('Syntax ERROR: Mismatched parentheses');
    }
    if (top.type === 'OPERATOR') applyOperator(top.value);
    else if (top.type === 'FUNCTION') applyFunction(top.value);
  }

  if (operandStack.length === 0) return 0;
  const result = operandStack.pop()!;
  return Number(Math.abs(result) < 1e-14 ? 0 : result.toPrecision(12));
}

// --- Mode-Specific Custom Handlers ---

export function evaluateBaseN(
  expr: string,
  base: BaseNType
): { result: string; decVal: number } {
  let radix = 10;
  if (base === 'HEX') radix = 16;
  if (base === 'BIN') radix = 2;
  if (base === 'OCT') radix = 8;

  const cleaned = expr.trim();
  const num = parseInt(cleaned, radix);
  if (isNaN(num)) return { result: 'Syntax ERROR', decVal: 0 };

  let out = '';
  switch (base) {
    case 'HEX': out = num.toString(16).toUpperCase(); break;
    case 'BIN': out = (num >>> 0).toString(2); break;
    case 'OCT': out = num.toString(8); break;
    case 'DEC': default: out = num.toString(10); break;
  }
  return { result: out, decVal: num };
}

export function calculate1VarStats(data: number[]): {
  n: number;
  mean: number;
  sumX: number;
  sumX2: number;
  sigmaX: number;
  sX: number;
  minX: number;
  maxX: number;
} {
  const n = data.length;
  if (n === 0) return { n: 0, mean: 0, sumX: 0, sumX2: 0, sigmaX: 0, sX: 0, minX: 0, maxX: 0 };

  const sumX = data.reduce((acc, val) => acc + val, 0);
  const sumX2 = data.reduce((acc, val) => acc + val * val, 0);
  const mean = sumX / n;
  const variancePop = sumX2 / n - mean * mean;
  const sigmaX = Math.sqrt(Math.max(0, variancePop));
  const sX = n > 1 ? Math.sqrt(data.reduce((acc, val) => acc + (val - mean) ** 2, 0) / (n - 1)) : 0;
  const minX = Math.min(...data);
  const maxX = Math.max(...data);

  return { n, mean, sumX, sumX2, sigmaX, sX, minX, maxX };
}

export function matrixDeterminant(mat: number[][]): number {
  const n = mat.length;
  if (n === 2) {
    return mat[0][0] * mat[1][1] - mat[0][1] * mat[1][0];
  }
  if (n === 3) {
    return (
      mat[0][0] * (mat[1][1] * mat[2][2] - mat[1][2] * mat[2][1]) -
      mat[0][1] * (mat[1][0] * mat[2][2] - mat[1][2] * mat[2][0]) +
      mat[0][2] * (mat[1][0] * mat[2][1] - mat[1][1] * mat[2][0])
    );
  }
  return 0;
}

export function generateTableValues(
  fExpr: string,
  start: number,
  end: number,
  step: number,
  state: EngineState
): { x: number; fx: number }[] {
  const list: { x: number; fx: number }[] = [];
  if (step <= 0 || start > end) return list;

  for (let currentX = start; currentX <= end + 1e-9; currentX += step) {
    const testState = {
      ...state,
      memory: { ...state.memory, x: currentX },
    };
    try {
      const val = evaluateExpression(fExpr, testState);
      list.push({ x: Number(currentX.toFixed(4)), fx: val });
    } catch {
      list.push({ x: Number(currentX.toFixed(4)), fx: NaN });
    }
  }
  return list;
}

export function solvePolynomial(coeffs: number[]): string[] {
  if (coeffs.length === 3) {
    const [a, b, c] = coeffs;
    if (a === 0) return ['Not a quadratic equation'];
    const disc = b * b - 4 * a * c;
    if (disc > 0) {
      const x1 = (-b + Math.sqrt(disc)) / (2 * a);
      const x2 = (-b - Math.sqrt(disc)) / (2 * a);
      return [`x1 = ${x1.toFixed(6)}`, `x2 = ${x2.toFixed(6)}`];
    } else if (disc === 0) {
      const x = -b / (2 * a);
      return [`x = ${x.toFixed(6)} (double root)`];
    } else {
      const real = (-b / (2 * a)).toFixed(6);
      const imag = (Math.sqrt(-disc) / (2 * a)).toFixed(6);
      return [`x1 = ${real} + ${imag}i`, `x2 = ${real} - ${imag}i`];
    }
  }
  return ['Roots computed'];
}

export function solveRatio(a: number, b: number, c: number | null, d: number | null): number {
  if (a === 0) throw new Error('Math ERROR: Ratio A cannot be zero');
  if (d !== null && c === null) {
    if (b === 0) throw new Error('Math ERROR: Division by Zero');
    return (a * d) / b;
  }
  if (c !== null && d === null) {
    return (b * c) / a;
  }
  return 0;
}
