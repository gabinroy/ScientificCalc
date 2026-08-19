export type AngleMode = 'DEG' | 'RAD' | 'GRAD';

export interface MemoryState {
  M: number;
  Ans: number;
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  x: number;
  y: number;
}

export const initialMemory: MemoryState = {
  M: 0,
  Ans: 0,
  A: 0,
  B: 0,
  C: 0,
  D: 0,
  E: 0,
  F: 0,
  x: 0,
  y: 0,
};

type TokenType = 'NUMBER' | 'OPERATOR' | 'FUNCTION' | 'LPAREN' | 'RPAREN' | 'COMMA' | 'POSTFIX';

interface Token {
  type: TokenType;
  value: string;
  args?: number;
}

const OPERATOR_PRECEDENCE: Record<string, { prec: number; assoc: 'L' | 'R' }> = {
  '+': { prec: 2, assoc: 'L' },
  '-': { prec: 2, assoc: 'L' },
  '×': { prec: 3, assoc: 'L' },
  '*': { prec: 3, assoc: 'L' },
  '÷': { prec: 3, assoc: 'L' },
  '/': { prec: 3, assoc: 'L' },
  '%': { prec: 3, assoc: 'L' },
  'P': { prec: 4, assoc: 'L' }, // nPr
  'C': { prec: 4, assoc: 'L' }, // nCr
  '^': { prec: 5, assoc: 'R' },
  'NEG': { prec: 6, assoc: 'R' }, // Unary minus
};

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error('Math Error');
  if (n > 170) return Infinity;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function nPr(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Math Error');
  return factorial(n) / factorial(n - r);
}

function nCr(n: number, r: number): number {
  if (n < 0 || r < 0 || r > n || !Number.isInteger(n) || !Number.isInteger(r)) throw new Error('Math Error');
  return factorial(n) / (factorial(r) * factorial(n - r));
}

function toRadians(angle: number, mode: AngleMode): number {
  if (mode === 'DEG') return (angle * Math.PI) / 180;
  if (mode === 'GRAD') return (angle * Math.PI) / 200;
  return angle;
}

function fromRadians(rad: number, mode: AngleMode): number {
  if (mode === 'DEG') return (rad * 180) / Math.PI;
  if (mode === 'GRAD') return (rad * 200) / Math.PI;
  return rad;
}

export function tokenize(expr: string, memory: MemoryState): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (ch === ' ' || ch === '\t') {
      i++;
      continue;
    }

    // Numbers (including decimals and scientific notation like 1e-5 or constant constants)
    if (/[0-9.]/.test(ch)) {
      let numStr = '';
      while (i < expr.length && /[0-9.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      tokens.push({ type: 'NUMBER', value: numStr });
      continue;
    }

    // Constants & Memory variables
    if (expr.startsWith('π', i)) {
      tokens.push({ type: 'NUMBER', value: Math.PI.toString() });
      i += 1;
      continue;
    }
    if (expr.startsWith('e', i) && (i + 1 >= expr.length || !/[a-zA-Z]/.test(expr[i + 1]))) {
      tokens.push({ type: 'NUMBER', value: Math.E.toString() });
      i += 1;
      continue;
    }
    if (expr.startsWith('Ans', i)) {
      tokens.push({ type: 'NUMBER', value: memory.Ans.toString() });
      i += 3;
      continue;
    }

    // Postfix operators: !, %
    if (ch === '!') {
      tokens.push({ type: 'POSTFIX', value: '!' });
      i++;
      continue;
    }
    if (ch === '%') {
      tokens.push({ type: 'POSTFIX', value: '%' });
      i++;
      continue;
    }

    // Permutation and Combination operators (nPr, nCr)
    if (ch === 'P' || ch === 'C') {
      const prev = tokens[tokens.length - 1];
      // If preceded by a number, parenthesis, or postfix, treat as operator
      if (prev && (prev.type === 'NUMBER' || prev.type === 'RPAREN' || prev.type === 'POSTFIX')) {
        tokens.push({ type: 'OPERATOR', value: ch });
        i++;
        continue;
      }
    }

    // Memory variables check (A-F, x, y, M)
    const varMatches = ['A', 'B', 'C', 'D', 'E', 'F', 'x', 'y', 'M'];
    const matchedVar = varMatches.find(v => expr.startsWith(v, i) && (i + 1 >= expr.length || !/[a-zA-Z0-9]/.test(expr[i + 1])));
    if (matchedVar) {
      const val = (memory as any)[matchedVar] ?? 0;
      tokens.push({ type: 'NUMBER', value: val.toString() });
      i += matchedVar.length;
      continue;
    }

    // Parentheses
    if (ch === '(') {
      tokens.push({ type: 'LPAREN', value: '(' });
      i++;
      continue;
    }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN', value: ')' });
      i++;
      continue;
    }
    if (ch === ',') {
      tokens.push({ type: 'COMMA', value: ',' });
      i++;
      continue;
    }

    // Operators
    if (['+', '-', '×', '*', '÷', '/', '^'].includes(ch)) {
      // Check if minus is unary negation
      if (ch === '-') {
        const prev = tokens[tokens.length - 1];
        if (!prev || prev.type === 'OPERATOR' || prev.type === 'LPAREN' || prev.type === 'COMMA') {
          tokens.push({ type: 'OPERATOR', value: 'NEG' });
          i++;
          continue;
        }
      }
      tokens.push({ type: 'OPERATOR', value: ch });
      i++;
      continue;
    }

    // Multi-character functions
    const funcList = [
      'sin⁻¹', 'cos⁻¹', 'tan⁻¹', 'sinh⁻¹', 'cosh⁻¹', 'tanh⁻¹',
      'asin', 'acos', 'atan', 'asinh', 'acosh', 'atanh',
      'sin', 'cos', 'tan', 'sinh', 'cosh', 'tanh',
      'log₁₀', 'log', 'ln', 'sqrt', 'cbrt', '√', '∛',
      'abs', 'floor', 'ceil', 'round', 'recip', 'sqr', 'cube'
    ];

    const matchedFunc = funcList.find(f => expr.startsWith(f, i));
    if (matchedFunc) {
      tokens.push({ type: 'FUNCTION', value: matchedFunc });
      i += matchedFunc.length;
      continue;
    }

    // If unrecognized character, advance to avoid infinite loop
    i++;
  }

  // Insert implicit multiplication e.g., 2(3), (2)(3), 2π, 2sin(30)
  const expanded: Token[] = [];
  for (let idx = 0; idx < tokens.length; idx++) {
    const curr = tokens[idx];
    expanded.push(curr);

    const next = tokens[idx + 1];
    if (!next) break;

    const currIsVal = curr.type === 'NUMBER' || curr.type === 'RPAREN' || curr.type === 'POSTFIX';
    const nextIsVal = next.type === 'NUMBER' || next.type === 'LPAREN' || next.type === 'FUNCTION';

    if (currIsVal && nextIsVal) {
      expanded.push({ type: 'OPERATOR', value: '×' });
    }
  }

  return expanded;
}

// Convert Infix tokens to Reverse Polish Notation (RPN) via Shunting-Yard Algorithm
export function shuntingYard(tokens: Token[]): Token[] {
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];

  for (let idx = 0; idx < tokens.length; idx++) {
    const token = tokens[idx];

    if (token.type === 'NUMBER') {
      outputQueue.push(token);
    } else if (token.type === 'FUNCTION') {
      operatorStack.push(token);
    } else if (token.type === 'POSTFIX') {
      outputQueue.push(token);
    } else if (token.type === 'COMMA') {
      while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type !== 'LPAREN') {
        outputQueue.push(operatorStack.pop()!);
      }
      if (operatorStack.length === 0) throw new Error('Syntax Error: misplaced comma');
    } else if (token.type === 'OPERATOR') {
      const o1 = token.value;
      const o1Props = OPERATOR_PRECEDENCE[o1] || { prec: 0, assoc: 'L' };

      while (operatorStack.length > 0) {
        const top = operatorStack[operatorStack.length - 1];
        if (top.type === 'OPERATOR') {
          const o2 = top.value;
          const o2Props = OPERATOR_PRECEDENCE[o2] || { prec: 0, assoc: 'L' };

          if (
            (o1Props.assoc === 'L' && o1Props.prec <= o2Props.prec) ||
            (o1Props.assoc === 'R' && o1Props.prec < o2Props.prec)
          ) {
            outputQueue.push(operatorStack.pop()!);
            continue;
          }
        }
        break;
      }
      operatorStack.push(token);
    } else if (token.type === 'LPAREN') {
      operatorStack.push(token);
    } else if (token.type === 'RPAREN') {
      let foundLparen = false;
      while (operatorStack.length > 0) {
        const top = operatorStack.pop()!;
        if (top.type === 'LPAREN') {
          foundLparen = true;
          break;
        }
        outputQueue.push(top);
      }
      if (!foundLparen) throw new Error('Syntax Error: unmatched parenthesis');

      if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
        outputQueue.push(operatorStack.pop()!);
      }
    }
  }

  while (operatorStack.length > 0) {
    const top = operatorStack.pop()!;
    if (top.type === 'LPAREN' || top.type === 'RPAREN') {
      throw new Error('Syntax Error: unmatched parenthesis');
    }
    outputQueue.push(top);
  }

  return outputQueue;
}

// Evaluate RPN Tokens with pure math stack operations (NO eval())
export function evaluateRPN(rpn: Token[], angleMode: AngleMode): number {
  const stack: number[] = [];

  for (const token of rpn) {
    if (token.type === 'NUMBER') {
      const val = parseFloat(token.value);
      if (isNaN(val)) throw new Error('Math Error');
      stack.push(val);
    } else if (token.type === 'POSTFIX') {
      if (stack.length < 1) throw new Error('Syntax Error');
      const val = stack.pop()!;
      if (token.value === '!') {
        stack.push(factorial(val));
      } else if (token.value === '%') {
        stack.push(val / 100);
      }
    } else if (token.type === 'OPERATOR') {
      if (token.value === 'NEG') {
        if (stack.length < 1) throw new Error('Syntax Error');
        stack.push(-stack.pop()!);
        continue;
      }

      if (stack.length < 2) throw new Error('Syntax Error');
      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '×':
        case '*':
          stack.push(a * b);
          break;
        case '÷':
        case '/':
          if (b === 0) throw new Error('Math Error: Division by zero');
          stack.push(a / b);
          break;
        case '^':
          stack.push(Math.pow(a, b));
          break;
        case 'P':
          stack.push(nPr(a, b));
          break;
        case 'C':
          stack.push(nCr(a, b));
          break;
        default:
          throw new Error(`Unknown operator: ${token.value}`);
      }
    } else if (token.type === 'FUNCTION') {
      if (stack.length < 1) throw new Error('Syntax Error');
      const arg = stack.pop()!;

      switch (token.value) {
        case 'sin': {
          const rad = toRadians(arg, angleMode);
          // Handle precise values like sin(180) = 0
          const res = Math.sin(rad);
          stack.push(Math.abs(res) < 1e-15 ? 0 : res);
          break;
        }
        case 'cos': {
          const rad = toRadians(arg, angleMode);
          const res = Math.cos(rad);
          stack.push(Math.abs(res) < 1e-15 ? 0 : res);
          break;
        }
        case 'tan': {
          const rad = toRadians(arg, angleMode);
          const cosVal = Math.cos(rad);
          if (Math.abs(cosVal) < 1e-15) throw new Error('Math Error');
          const res = Math.tan(rad);
          stack.push(Math.abs(res) < 1e-15 ? 0 : res);
          break;
        }
        case 'sin⁻¹':
        case 'asin': {
          if (arg < -1 || arg > 1) throw new Error('Math Error');
          stack.push(fromRadians(Math.asin(arg), angleMode));
          break;
        }
        case 'cos⁻¹':
        case 'acos': {
          if (arg < -1 || arg > 1) throw new Error('Math Error');
          stack.push(fromRadians(Math.acos(arg), angleMode));
          break;
        }
        case 'tan⁻¹':
        case 'atan': {
          stack.push(fromRadians(Math.atan(arg), angleMode));
          break;
        }
        case 'sinh':
          stack.push(Math.sinh(arg));
          break;
        case 'cosh':
          stack.push(Math.cosh(arg));
          break;
        case 'tanh':
          stack.push(Math.tanh(arg));
          break;
        case 'sinh⁻¹':
        case 'asinh':
          stack.push(Math.asinh(arg));
          break;
        case 'cosh⁻¹':
        case 'acosh':
          if (arg < 1) throw new Error('Math Error');
          stack.push(Math.acosh(arg));
          break;
        case 'tanh⁻¹':
        case 'atanh':
          if (arg <= -1 || arg >= 1) throw new Error('Math Error');
          stack.push(Math.atanh(arg));
          break;
        case 'log₁₀':
        case 'log':
          if (arg <= 0) throw new Error('Math Error');
          stack.push(Math.log10(arg));
          break;
        case 'ln':
          if (arg <= 0) throw new Error('Math Error');
          stack.push(Math.log(arg));
          break;
        case 'sqrt':
        case '√':
          if (arg < 0) throw new Error('Math Error');
          stack.push(Math.sqrt(arg));
          break;
        case 'cbrt':
        case '∛':
          stack.push(Math.cbrt(arg));
          break;
        case 'abs':
          stack.push(Math.abs(arg));
          break;
        case 'floor':
          stack.push(Math.floor(arg));
          break;
        case 'ceil':
          stack.push(Math.ceil(arg));
          break;
        case 'round':
          stack.push(Math.round(arg));
          break;
        case 'recip':
          if (arg === 0) throw new Error('Math Error');
          stack.push(1 / arg);
          break;
        case 'sqr':
          stack.push(arg * arg);
          break;
        case 'cube':
          stack.push(arg * arg * arg);
          break;
        default:
          throw new Error(`Unknown function: ${token.value}`);
      }
    }
  }

  if (stack.length !== 1) throw new Error('Syntax Error');
  const result = stack[0];
  if (!isFinite(result)) throw new Error('Math Error');
  return result;
}

// Master evaluation function with sanitization and auto-closing parentheses
export function calculateExpression(expr: string, memory: MemoryState, angleMode: AngleMode): number {
  let clean = expr.trim();
  if (!clean) return 0;

  // Auto-close unbalanced open parentheses
  let openCount = 0;
  for (const c of clean) {
    if (c === '(') openCount++;
    if (c === ')') openCount--;
  }
  while (openCount > 0) {
    clean += ')';
    openCount--;
  }

  const tokens = tokenize(clean, memory);
  if (tokens.length === 0) return 0;

  const rpn = shuntingYard(tokens);
  return evaluateRPN(rpn, angleMode);
}

// Format scientific results into clean string with sensible precision
export function formatResult(val: number): string {
  if (isNaN(val)) return 'Error';
  if (!isFinite(val)) return val > 0 ? 'Infinity' : '-Infinity';

  // Fix small floating point rounding issues
  const rounded = Number(Math.round(Number(val + 'e12')) + 'e-12');

  // If very large or very small nonzero, use scientific notation
  const abs = Math.abs(rounded);
  if (abs !== 0 && (abs >= 1e11 || abs < 1e-9)) {
    return rounded.toExponential(8).replace(/\.?0+e/, 'e');
  }

  // Regular standard float representation
  const str = rounded.toString();
  if (str.includes('.')) {
    // Trim trailing zeroes
    return rounded.toFixed(10).replace(/\.?0+$/, '');
  }
  return str;
}
