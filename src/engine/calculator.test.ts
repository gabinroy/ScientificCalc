import {
  calculateExpression,
  formatResult,
  initialMemory,
  MemoryState,
} from './calculator';

function assertEqual(actual: any, expected: any, desc: string) {
  if (Math.abs(actual - expected) < 1e-9 || actual === expected) {
    console.log(`✓ PASS: ${desc} -> got ${actual}`);
  } else {
    console.error(`✗ FAIL: ${desc} -> expected ${expected}, got ${actual}`);
    process.exit(1);
  }
}

console.log('--- Testing Scientific Calculation Engine (Pure Shunting-Yard, No eval()) ---');

const memory: MemoryState = { ...initialMemory };

// 1. Basic Arithmetic & Precedence
assertEqual(calculateExpression('2+3*4', memory, 'DEG'), 14, 'Operator precedence 2+3*4 = 14');
assertEqual(calculateExpression('(2+3)*4', memory, 'DEG'), 20, 'Parentheses (2+3)*4 = 20');
assertEqual(calculateExpression('10-4-2', memory, 'DEG'), 4, 'Left associativity 10-4-2 = 4');
assertEqual(calculateExpression('20/4/2', memory, 'DEG'), 2.5, 'Division chain 20/4/2 = 2.5');

// 2. Trigonometry (DEG & RAD)
assertEqual(calculateExpression('sin(30)', memory, 'DEG'), 0.5, 'sin(30 deg) = 0.5');
assertEqual(calculateExpression('cos(60)', memory, 'DEG'), 0.5, 'cos(60 deg) = 0.5');
assertEqual(calculateExpression('tan(45)', memory, 'DEG'), 1, 'tan(45 deg) = 1');
assertEqual(calculateExpression('sin⁻¹(0.5)', memory, 'DEG'), 30, 'asin(0.5) in DEG = 30');

// 3. Powers, Roots, Logs
assertEqual(calculateExpression('2^3', memory, 'DEG'), 8, '2^3 = 8');
assertEqual(calculateExpression('√(16)', memory, 'DEG'), 4, 'sqrt(16) = 4');
assertEqual(calculateExpression('log(100)', memory, 'DEG'), 2, 'log10(100) = 2');
assertEqual(calculateExpression('ln(e)', memory, 'DEG'), 1, 'ln(e) = 1');

// 4. Factorial & Permutations / Combinations
assertEqual(calculateExpression('5!', memory, 'DEG'), 120, '5! = 120');
assertEqual(calculateExpression('5 P 2', memory, 'DEG'), 20, '5 P 2 = 20');
assertEqual(calculateExpression('5 C 2', memory, 'DEG'), 10, '5 C 2 = 10');

// 5. Implicit Multiplication & Constants
assertEqual(calculateExpression('2(3+4)', memory, 'DEG'), 14, 'Implicit multiplication 2(3+4) = 14');
assertEqual(calculateExpression('2π', memory, 'DEG'), 2 * Math.PI, '2π = 2*PI');

// 6. Formatting test
assertEqual(formatResult(0.5), '0.5', 'Format 0.5');
assertEqual(formatResult(14.0000000000), '14', 'Format 14');

console.log('All calculator engine verification tests passed successfully!');
