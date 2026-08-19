import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  useColorScheme,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

import { darkTheme, lightTheme, ThemeColors } from './src/theme/colors';
import {
  AngleMode,
  MemoryState,
  initialMemory,
  calculateExpression,
  formatResult,
} from './src/engine/calculator';
import { LcdDisplay } from './src/components/LcdDisplay';
import { TopControlBar } from './src/components/TopControlBar';
import { GlassButton, CalcButtonConfig } from './src/components/GlassButton';
import { IntroModal } from './src/components/IntroModal';
import { GlassCard } from './src/components/GlassCard';

const STORAGE_KEY_SEEN_INTRO = '@casio_fx991ex_seen_intro_v1';

export default function App() {
  const systemColorScheme = useColorScheme();
  const [themeMode] = useState<'auto' | 'dark' | 'light'>('auto');

  // Enforce Portrait Orientation strictly (no landscape allowed)
  useEffect(() => {
    async function lockPortrait() {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
      } catch (err) {
        console.warn('Orientation lock error: ', err);
      }
    }
    lockPortrait();
  }, []);

  // Theme resolution
  const theme: ThemeColors = useMemo(() => {
    const isDark =
      themeMode === 'auto' ? systemColorScheme === 'dark' : themeMode === 'dark';
    return isDark ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  // Calculator State
  const [expression, setExpression] = useState<string>('');
  const [cursorPos, setCursorPos] = useState<number>(0);
  const [result, setResult] = useState<string>('0');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [angleMode, setAngleMode] = useState<AngleMode>('DEG');
  const [isShift, setIsShift] = useState<boolean>(false);
  const [isAlpha, setIsAlpha] = useState<boolean>(false);
  const [memory, setMemory] = useState<MemoryState>(initialMemory);
  const [showIntro, setShowIntro] = useState<boolean>(false);

  // Check Onboarding Intro Flag via AsyncStorage
  useEffect(() => {
    async function checkIntro() {
      try {
        const seen = await AsyncStorage.getItem(STORAGE_KEY_SEEN_INTRO);
        if (!seen) {
          setShowIntro(true);
        }
      } catch (e) {
        console.warn('Error reading storage for intro', e);
      }
    }
    checkIntro();
  }, []);

  const handleDismissIntro = async () => {
    setShowIntro(false);
    try {
      await AsyncStorage.setItem(STORAGE_KEY_SEEN_INTRO, 'true');
    } catch (e) {
      console.warn('Error saving intro flag', e);
    }
  };

  // Helper to insert input at current cursor position
  const insertText = (text: string) => {
    setErrorMessage(null);
    setExpression((prev) => {
      const before = prev.slice(0, cursorPos);
      const after = prev.slice(cursorPos);
      return before + text + after;
    });
    setCursorPos((prev) => prev + text.length);
    setIsShift(false);
    setIsAlpha(false);
  };

  // Live real-time evaluation preview (Pure Shunting-Yard, No eval())
  useEffect(() => {
    if (!expression.trim()) {
      setResult('0');
      setErrorMessage(null);
      return;
    }
    try {
      const val = calculateExpression(expression, memory, angleMode);
      setResult(formatResult(val));
      setErrorMessage(null);
    } catch (err) {
      // Intermediate expression
    }
  }, [expression, memory, angleMode]);

  // Execution (=) button
  const handleEquals = () => {
    if (!expression.trim()) return;
    try {
      const val = calculateExpression(expression, memory, angleMode);
      const formatted = formatResult(val);
      setResult(formatted);
      setMemory((prev) => ({ ...prev, Ans: val }));
      setExpression(formatted);
      setCursorPos(formatted.length);
      setErrorMessage(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Math Error');
    }
  };

  // All Clear (AC)
  const handleAllClear = () => {
    setExpression('');
    setCursorPos(0);
    setResult('0');
    setErrorMessage(null);
    setIsShift(false);
    setIsAlpha(false);
  };

  // Delete at cursor
  const handleDelete = () => {
    setErrorMessage(null);
    if (cursorPos === 0) return;

    setExpression((prev) => {
      const before = prev.slice(0, cursorPos);
      const after = prev.slice(cursorPos);

      // Check multi-character token endings before cursor
      let deleteCount = 1;
      if (before.endsWith('Ans')) deleteCount = 3;
      else if (before.endsWith('sin⁻¹(') || before.endsWith('cos⁻¹(') || before.endsWith('tan⁻¹(')) deleteCount = 6;
      else if (before.endsWith('sin(') || before.endsWith('cos(') || before.endsWith('tan(') || before.endsWith('log(')) deleteCount = 4;
      else if (before.endsWith('ln(')) deleteCount = 3;
      else if (before.endsWith('√(') || before.endsWith('∛(')) deleteCount = 2;
      else if (before.endsWith('×10^(')) deleteCount = 5;

      setCursorPos(Math.max(0, cursorPos - deleteCount));
      return before.slice(0, -deleteCount) + after;
    });
  };

  // Move Cursor Left
  const handleMoveCursorLeft = () => {
    setCursorPos((prev) => Math.max(0, prev - 1));
  };

  // Move Cursor Right
  const handleMoveCursorRight = () => {
    setCursorPos((prev) => Math.min(expression.length, prev + 1));
  };

  // Memory Operations (M+, M-, STO, RECALL)
  const handleMemoryAdd = () => {
    try {
      const val = expression.trim()
        ? calculateExpression(expression, memory, angleMode)
        : memory.Ans;
      setMemory((prev) => ({ ...prev, M: prev.M + val }));
    } catch {
      setErrorMessage('Math Error');
    }
  };

  const handleMemorySubtract = () => {
    try {
      const val = expression.trim()
        ? calculateExpression(expression, memory, angleMode)
        : memory.Ans;
      setMemory((prev) => ({ ...prev, M: prev.M - val }));
    } catch {
      setErrorMessage('Math Error');
    }
  };

  const toggleAngleMode = () => {
    setAngleMode((prev) => {
      if (prev === 'DEG') return 'RAD';
      if (prev === 'RAD') return 'GRAD';
      return 'DEG';
    });
  };

  // Grid row configurations for Casio fx-991EX ClassWiz
  const functionRows: CalcButtonConfig[][] = [
    // Row 1: x⁻¹, √, x², xⁿ, log, ln
    [
      {
        id: 'opt_1',
        label: 'x⁻¹',
        subShift: 'x!',
        type: 'function',
        onPress: () => {
          if (isShift) insertText('!');
          else insertText('^(-1)');
        },
      },
      {
        id: 'opt_sqrt',
        label: '√',
        subShift: '∛',
        subAlpha: 'A',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('A');
          else if (isShift) insertText('∛(');
          else insertText('√(');
        },
      },
      {
        id: 'opt_sqr',
        label: 'x²',
        subShift: 'x³',
        subAlpha: 'B',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('B');
          else if (isShift) insertText('^3');
          else insertText('^2');
        },
      },
      {
        id: 'opt_pow',
        label: 'xⁿ',
        subShift: 'ⁿ√x',
        subAlpha: 'C',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('C');
          else insertText('^(');
        },
      },
      {
        id: 'opt_log',
        label: 'log',
        subShift: '10ⁿ',
        subAlpha: 'D',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('D');
          else if (isShift) insertText('10^(');
          else insertText('log(');
        },
      },
      {
        id: 'opt_ln',
        label: 'ln',
        subShift: 'eⁿ',
        subAlpha: 'E',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('E');
          else if (isShift) insertText('e^(');
          else insertText('ln(');
        },
      },
    ],

    // Row 2: (-), °, hyp, sin, cos, tan
    [
      {
        id: 'opt_neg',
        label: '(-)',
        subShift: 'A',
        subAlpha: 'x',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('x');
          else insertText('-');
        },
      },
      {
        id: 'opt_deg_conv',
        label: '° \' "',
        subShift: '←',
        subAlpha: 'y',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('y');
          else insertText('°');
        },
      },
      {
        id: 'opt_hyp',
        label: 'hyp',
        subShift: 'abs',
        type: 'function',
        onPress: () => {
          if (isShift) insertText('abs(');
          else insertText('sinh(');
        },
      },
      {
        id: 'opt_sin',
        label: 'sin',
        subShift: 'sin⁻¹',
        subAlpha: 'F',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('F');
          else if (isShift) insertText('sin⁻¹(');
          else insertText('sin(');
        },
      },
      {
        id: 'opt_cos',
        label: 'cos',
        subShift: 'cos⁻¹',
        type: 'function',
        onPress: () => {
          if (isShift) insertText('cos⁻¹(');
          else insertText('cos(');
        },
      },
      {
        id: 'opt_tan',
        label: 'tan',
        subShift: 'tan⁻¹',
        type: 'function',
        onPress: () => {
          if (isShift) insertText('tan⁻¹(');
          else insertText('tan(');
        },
      },
    ],

    // Row 3: STO, ENG, (, ), S<=>D, M+
    [
      {
        id: 'opt_sto',
        label: 'STO',
        subShift: 'RCL',
        type: 'function',
        onPress: () => {
          if (isShift) {
            insertText(memory.M.toString());
          } else {
            handleMemoryAdd();
          }
        },
      },
      {
        id: 'opt_eng',
        label: 'ENG',
        subShift: '←',
        type: 'function',
        onPress: () => {
          try {
            const val = parseFloat(result);
            if (!isNaN(val) && val !== 0) {
              setResult(val.toExponential(3));
            }
          } catch {}
        },
      },
      {
        id: 'opt_lparen',
        label: '(',
        subShift: '%',
        type: 'function',
        onPress: () => {
          if (isShift) insertText('%');
          else insertText('(');
        },
      },
      {
        id: 'opt_rparen',
        label: ')',
        subShift: ',',
        type: 'function',
        onPress: () => {
          if (isShift) insertText(',');
          else insertText(')');
        },
      },
      {
        id: 'opt_sd',
        label: 'S⇔D',
        subShift: '≈',
        type: 'function',
        onPress: () => {
          try {
            const num = parseFloat(result);
            if (!isNaN(num)) {
              if (result.includes('.')) {
                const len = result.split('.')[1].length;
                const den = Math.pow(10, len);
                const numVal = Math.round(num * den);
                setResult(`${numVal}/${den}`);
              } else {
                setResult(num.toFixed(4));
              }
            }
          } catch {}
        },
      },
      {
        id: 'opt_mplus',
        label: 'M+',
        subShift: 'M-',
        subAlpha: 'M',
        type: 'function',
        onPress: () => {
          if (isAlpha) insertText('M');
          else if (isShift) handleMemorySubtract();
          else handleMemoryAdd();
        },
      },
    ],
  ];

  // Arithmetic Keypad (7-9 DEL AC, 4-6 × ÷, 1-3 + -, 0 . ×10^x Ans =)
  const keypadRows: CalcButtonConfig[][] = [
    // Row 1: 7, 8, 9, DEL, AC
    [
      { id: 'btn_7', label: '7', subShift: 'CONST', type: 'number', onPress: () => insertText('7') },
      { id: 'btn_8', label: '8', subShift: 'CONV', type: 'number', onPress: () => insertText('8') },
      { id: 'btn_9', label: '9', subShift: 'CLR', type: 'number', onPress: () => insertText('9') },
      { id: 'btn_del', label: 'DEL', subShift: 'INS', type: 'delete', onPress: handleDelete },
      { id: 'btn_ac', label: 'AC', subShift: 'OFF', type: 'delete', onPress: handleAllClear },
    ],
    // Row 2: 4, 5, 6, ×, ÷
    [
      { id: 'btn_4', label: '4', subShift: 'MATRIX', type: 'number', onPress: () => insertText('4') },
      { id: 'btn_5', label: '5', subShift: 'VECTOR', type: 'number', onPress: () => insertText('5') },
      { id: 'btn_6', label: '6', subShift: 'nPr', type: 'number', onPress: () => {
        if (isShift) insertText('P');
        else insertText('6');
      }},
      { id: 'btn_mul', label: '×', subShift: 'nCr', type: 'action', onPress: () => {
        if (isShift) insertText('C');
        else insertText('×');
      }},
      { id: 'btn_div', label: '÷', subShift: 'Pol', type: 'action', onPress: () => insertText('÷') },
    ],
    // Row 3: 1, 2, 3, +, -
    [
      { id: 'btn_1', label: '1', subShift: 'STAT', type: 'number', onPress: () => insertText('1') },
      { id: 'btn_2', label: '2', subShift: 'CMPLX', type: 'number', onPress: () => insertText('2') },
      { id: 'btn_3', label: '3', subShift: 'BASE-N', type: 'number', onPress: () => insertText('3') },
      { id: 'btn_add', label: '+', subShift: 'Rec', type: 'action', onPress: () => insertText('+') },
      { id: 'btn_sub', label: '-', subShift: 'Int', type: 'action', onPress: () => insertText('-') },
    ],
    // Row 4: 0, ., ×10ˣ, Ans, =
    [
      { id: 'btn_0', label: '0', subShift: 'Rnd', type: 'number', onPress: () => insertText('0') },
      { id: 'btn_dot', label: '.', subShift: 'Ran#', type: 'number', onPress: () => {
        if (isShift) insertText(Math.random().toFixed(3));
        else insertText('.');
      }},
      { id: 'btn_exp', label: '×10ˣ', subShift: 'π', subAlpha: 'e', type: 'action', onPress: () => {
        if (isAlpha) insertText('e');
        else if (isShift) insertText('π');
        else insertText('×10^(');
      }},
      { id: 'btn_ans', label: 'Ans', subShift: '%', subAlpha: 'PREV', type: 'action', onPress: () => {
        if (isShift) insertText('%');
        else insertText('Ans');
      }},
      { id: 'btn_eq', label: '=', subShift: '≈', type: 'equals', onPress: handleEquals },
    ],
  ];

  return (
    <View style={styles.outerContainer}>
      <StatusBar
        barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <LinearGradient
        colors={theme.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.calculatorFrame}>
          <GlassCard theme={theme} style={styles.glassContainer} intensity={25}>
            {/* ClassWiz High-Definition Liquid LCD */}
            <LcdDisplay
              expression={expression}
              result={result}
              isShift={isShift}
              isAlpha={isAlpha}
              hasMemory={memory.M !== 0}
              angleMode={angleMode}
              theme={theme}
              errorMessage={errorMessage}
            />

            {/* Top Function Navigation Bar */}
            <TopControlBar
              theme={theme}
              isShift={isShift}
              isAlpha={isAlpha}
              angleMode={angleMode}
              onToggleShift={() => setIsShift(!isShift)}
              onToggleAlpha={() => setIsAlpha(!isAlpha)}
              onToggleAngleMode={toggleAngleMode}
              onOpenHelp={() => setShowIntro(true)}
              onClearAll={handleAllClear}
              onCursorMoveLeft={handleMoveCursorLeft}
              onCursorMoveRight={handleMoveCursorRight}
              onParenthesesLeft={() => insertText('(')}
              onParenthesesRight={() => insertText(')')}
            />

            {/* Scientific Function Grid (Top 3 rows) */}
            <View style={styles.scientificGrid}>
              {functionRows.map((row, rIdx) => (
                <View key={`fn_row_${rIdx}`} style={styles.gridRow}>
                  {row.map((btn) => (
                    <GlassButton
                      key={btn.id}
                      config={btn}
                      theme={theme}
                    />
                  ))}
                </View>
              ))}
            </View>

            {/* Arithmetic & Number Keypad Grid (Bottom 4 rows) */}
            <View style={styles.keypadGrid}>
              {keypadRows.map((row, rIdx) => (
                <View key={`key_row_${rIdx}`} style={styles.gridRow}>
                  {row.map((btn) => (
                    <GlassButton
                      key={btn.id}
                      config={btn}
                      theme={theme}
                    />
                  ))}
                </View>
              ))}
            </View>
          </GlassCard>
        </View>
      </SafeAreaView>

      {/* Onboarding Intro Modal */}
      <IntroModal
        visible={showIntro}
        onDismiss={handleDismissIntro}
        theme={theme}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  calculatorFrame: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  glassContainer: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  scientificGrid: {
    marginVertical: 2,
  },
  keypadGrid: {
    marginVertical: 2,
  },
  gridRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
