import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  EngineState,
  INITIAL_STATE,
  evaluateExpression,
  evaluateBaseN,
  calculate1VarStats,
  generateTableValues,
  solvePolynomial,
  solveRatio,
  AngleUnit,
  CalculationHistoryItem,
} from '../utils/mathEngine';
import { Display } from '../components/Display';
import { Keypad } from '../components/Keypad';
import { HelpModal } from '../components/HelpModal';
import { AboutModal } from '../components/AboutModal';
import { useTheme } from '../ThemeContext';

const EXIT_APP_PREF_KEY = '@opencalc_exit_on_power_off';

/**
 * screens/CalculatorScreen.tsx
 *
 * Main application screen:
 * - SHIFT + AC: Shows "OPENCALC 99X" banner on LCD and either exits the app or puts the device into standby (configurable in SHIFT + MENU).
 * - SHIFT + MENU: Opens SETUP / App Bio, Creator Information, Theme Selector (System, Light, Dark), Exit Preference toggle & Buy Me a Coffee modal.
 * - ON: Turns calculator back ON from standby.
 */
export const CalculatorScreen: React.FC = () => {
  const { theme, colorScheme } = useTheme();
  const [state, setState] = useState<EngineState>(INITIAL_STATE);
  const [isModeMenuVisible, setIsModeMenuVisible] = useState(false);
  const [isHelpModalVisible, setIsHelpModalVisible] = useState(false);
  const [isAboutModalVisible, setIsAboutModalVisible] = useState(false);
  const [isHistoryTapeOpen, setIsHistoryTapeOpen] = useState(false);
  const [isWaitingForStoreVar, setIsWaitingForStoreVar] = useState(false);
  
  // Power Off & Shutdown States
  const [isPoweredOff, setIsPoweredOff] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);
  const [exitAppOnPowerOff, setExitAppOnPowerOff] = useState(true);

  // Mode-specific data states
  const [statDataList] = useState<number[]>([12, 15, 14, 18, 20]);
  const [tableDataRows, setTableDataRows] = useState<{ x: number; fx: number }[]>([]);
  const [eqnOutputs, setEqnOutputs] = useState<string[]>([]);

  // Load user exit preference from AsyncStorage
  useEffect(() => {
    async function loadPref() {
      try {
        const val = await AsyncStorage.getItem(EXIT_APP_PREF_KEY);
        if (val !== null) {
          setExitAppOnPowerOff(val === 'true');
        }
      } catch (err) {
        console.warn('Failed to load exit preference:', err);
      }
    }
    loadPref();
  }, []);

  const handleToggleExitAppPref = async (val: boolean) => {
    setExitAppOnPowerOff(val);
    try {
      await AsyncStorage.setItem(EXIT_APP_PREF_KEY, val ? 'true' : 'false');
    } catch (err) {
      console.warn('Failed to save exit preference:', err);
    }
  };

  // Compute Expression via mathEngine without eval
  const computeCurrentExpression = useCallback(() => {
    if (isPoweredOff || isShuttingDown) return;
    setState((prev) => {
      try {
        if (prev.mode === 'BASE_N') {
          const { result } = evaluateBaseN(prev.inputBuffer, prev.baseN);
          return {
            ...prev,
            resultBuffer: result,
            isShift: false,
            isAlpha: false,
          };
        }

        if (prev.mode === 'TABLE') {
          const rows = generateTableValues(prev.inputBuffer || 'x^2', -3, 3, 1, prev);
          setTableDataRows(rows);
          return {
            ...prev,
            resultBuffer: `Generated ${rows.length} rows`,
            isShift: false,
            isAlpha: false,
          };
        }

        if (prev.mode === 'EQUATION') {
          const res = solvePolynomial([1, -3, 2]);
          setEqnOutputs(res);
          return {
            ...prev,
            resultBuffer: res[0] || 'Solved',
            isShift: false,
            isAlpha: false,
          };
        }

        if (prev.mode === 'RATIO') {
          const xVal = solveRatio(2, 3, null, 6);
          return {
            ...prev,
            resultBuffer: `X = ${xVal}`,
            isShift: false,
            isAlpha: false,
          };
        }

        // Standard / Complex / Scientific Calculation
        const resultVal = evaluateExpression(prev.inputBuffer, prev);
        
        let resultStr = `${resultVal}`;
        if (/Pol\s*\(/i.test(prev.inputBuffer)) {
          resultStr = `r=${resultVal}, θ=${prev.memory.y}°`;
        } else if (/Rec\s*\(/i.test(prev.inputBuffer)) {
          resultStr = `X=${resultVal}, Y=${prev.memory.y}`;
        }

        const newHistoryItem: CalculationHistoryItem = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          input: prev.inputBuffer,
          result: resultStr,
          timestamp: Date.now(),
        };

        const updatedHistory = [...prev.history, newHistoryItem];

        return {
          ...prev,
          resultBuffer: resultStr,
          memory: {
            ...prev.memory,
            Ans: resultVal,
            PreAns: prev.memory.Ans,
          },
          history: updatedHistory,
          historyIndex: -1,
          isShift: false,
          isAlpha: false,
        };
      } catch (err: any) {
        return {
          ...prev,
          resultBuffer: err.message || 'Math ERROR',
          isShift: false,
          isAlpha: false,
        };
      }
    });
  }, [isPoweredOff, isShuttingDown]);

  // Master Keypad Dispatcher
  const handleKeyPress = useCallback((keyId: string) => {
    // If shutting down, ignore inputs
    if (isShuttingDown) return;

    // If powered off in standby, allow ON to wake
    if (isPoweredOff) {
      if (keyId === 'ON') {
        setIsPoweredOff(false);
        setState((prev) => ({
          ...prev,
          inputBuffer: '',
          resultBuffer: '0',
          isShift: false,
          isAlpha: false,
        }));
      }
      return;
    }

    setState((prev) => {
      const isShift = prev.isShift;
      const isAlpha = prev.isAlpha;

      if (isWaitingForStoreVar) {
        setIsWaitingForStoreVar(false);
        const targetVar = keyId.toUpperCase();
        if (targetVar in prev.memory) {
          const valToStore = parseFloat(prev.resultBuffer) || prev.memory.Ans;
          return {
            ...prev,
            memory: { ...prev.memory, [targetVar]: valToStore },
            resultBuffer: `${valToStore} → ${targetVar}`,
            isShift: false,
            isAlpha: false,
          };
        }
      }

      switch (keyId) {
        // --- D-Pad History & Cursor Navigation ---
        case 'NAV_UP': {
          if (prev.history.length === 0) return prev;
          const nextIndex =
            prev.historyIndex === -1
              ? prev.history.length - 1
              : Math.max(0, prev.historyIndex - 1);
          const historyEntry = prev.history[nextIndex];
          return {
            ...prev,
            historyIndex: nextIndex,
            inputBuffer: historyEntry.input,
            resultBuffer: historyEntry.result,
          };
        }

        case 'NAV_DOWN': {
          if (prev.history.length === 0 || prev.historyIndex === -1) return prev;
          const nextIndex = prev.historyIndex + 1;
          if (nextIndex >= prev.history.length) {
            return {
              ...prev,
              historyIndex: -1,
              inputBuffer: '',
              resultBuffer: '0',
            };
          }
          const historyEntry = prev.history[nextIndex];
          return {
            ...prev,
            historyIndex: nextIndex,
            inputBuffer: historyEntry.input,
            resultBuffer: historyEntry.result,
          };
        }

        case 'NAV_LEFT':
        case 'NAV_RIGHT': {
          if (prev.historyIndex !== -1 && prev.history[prev.historyIndex]) {
            const entry = prev.history[prev.historyIndex];
            return {
              ...prev,
              inputBuffer: entry.input,
              resultBuffer: entry.result,
              historyIndex: -1,
            };
          }
          return prev;
        }

        // --- Modes & System Controls ---
        case 'SHIFT':
          return { ...prev, isShift: !prev.isShift, isAlpha: false };

        case 'ALPHA':
          return { ...prev, isAlpha: !prev.isAlpha, isShift: false };

        case 'MENU':
          if (isShift) {
            // SHIFT + MENU = SETUP / About, Theme Selector & Settings Modal
            setIsAboutModalVisible(true);
            return { ...prev, isShift: false, isAlpha: false };
          }
          setIsModeMenuVisible(true);
          return { ...prev, isShift: false, isAlpha: false };

        case 'ON':
          return {
            ...prev,
            inputBuffer: '',
            resultBuffer: '0',
            historyIndex: -1,
            isShift: false,
            isAlpha: false,
          };

        case 'AC':
          if (isShift) {
            // SHIFT + AC = Power Off with "OPENCALC 99X" banner sequence
            setIsShuttingDown(true);
            setTimeout(() => {
              setIsShuttingDown(false);
              if (exitAppOnPowerOff) {
                if (Platform.OS === 'android') {
                  BackHandler.exitApp();
                } else {
                  setIsPoweredOff(true);
                }
              } else {
                setIsPoweredOff(true);
              }
            }, 1200);

            return {
              ...prev,
              inputBuffer: '',
              resultBuffer: '',
              isShift: false,
              isAlpha: false,
            };
          }
          return {
            ...prev,
            inputBuffer: '',
            resultBuffer: '0',
            historyIndex: -1,
            isShift: false,
            isAlpha: false,
          };

        case 'DEL':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer.slice(0, -1),
            isShift: false,
            isAlpha: false,
          };

        case 'EQUALS':
          computeCurrentExpression();
          return prev;

        // --- Calculus Tools (INTEGRAL & DERIVATIVE) ---
        case 'INTEGRAL':
          if (isShift) {
            return {
              ...prev,
              inputBuffer: prev.inputBuffer + 'd/dx(',
              isShift: false,
            };
          }
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + '∫(',
            isShift: false,
          };

        // --- Memory & Constants ---
        case 'M_PLUS':
          if (isShift) {
            const val = parseFloat(prev.resultBuffer) || prev.memory.Ans;
            return {
              ...prev,
              memory: { ...prev.memory, M: prev.memory.M - val },
              resultBuffer: `M = ${prev.memory.M - val}`,
              isShift: false,
            };
          }
          if (isAlpha) {
            return { ...prev, inputBuffer: prev.inputBuffer + 'M', isAlpha: false };
          }
          {
            const val = parseFloat(prev.resultBuffer) || prev.memory.Ans;
            return {
              ...prev,
              memory: { ...prev.memory, M: prev.memory.M + val },
              resultBuffer: `M = ${prev.memory.M + val}`,
              isShift: false,
            };
          }

        case 'STO':
          if (isShift) {
            return {
              ...prev,
              resultBuffer: `M:${prev.memory.M} A:${prev.memory.A} B:${prev.memory.B}`,
              isShift: false,
            };
          }
          setIsWaitingForStoreVar(true);
          return { ...prev, resultBuffer: 'STO → [A-F, M, x, y]', isShift: false };

        case 'ANS':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? 'PreAns' : 'Ans'),
            isShift: false,
          };

        // --- Scientific & Mathematical Operations ---
        case 'SIN':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'D' : prev.inputBuffer + (isShift ? 'asin(' : 'sin('),
            isShift: false,
            isAlpha: false,
          };

        case 'COS':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'E' : prev.inputBuffer + (isShift ? 'acos(' : 'cos('),
            isShift: false,
            isAlpha: false,
          };

        case 'TAN':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'F' : prev.inputBuffer + (isShift ? 'atan(' : 'tan('),
            isShift: false,
            isAlpha: false,
          };

        case 'HYP':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'C' : prev.inputBuffer + 'sinh(',
            isShift: false,
            isAlpha: false,
          };

        case 'LN':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? 'exp(' : 'ln('),
            isShift: false,
          };

        case 'LOG_BASE':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? 'log(' : 'log('),
            isShift: false,
          };

        case 'SQRT':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? 'cbrt(' : 'sqrt('),
            isShift: false,
          };

        case 'SQUARE':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? '^3' : '^2'),
            isShift: false,
          };

        case 'POWER':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + '^',
            isShift: false,
          };

        case 'X_INV':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? '!' : '^-1'),
            isShift: false,
          };

        case 'EXP':
          if (isShift) return { ...prev, inputBuffer: prev.inputBuffer + 'π', isShift: false };
          if (isAlpha) return { ...prev, inputBuffer: prev.inputBuffer + 'e', isAlpha: false };
          return { ...prev, inputBuffer: prev.inputBuffer + '×10^' };

        case 'LPAREN':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'x' : prev.inputBuffer + '(',
            isAlpha: false,
          };

        case 'RPAREN':
          if (isShift) return { ...prev, inputBuffer: prev.inputBuffer + ',', isShift: false };
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'y' : prev.inputBuffer + ')',
            isAlpha: false,
          };

        case 'NEG':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'A' : prev.inputBuffer + '-',
            isAlpha: false,
          };

        case 'DEG_MIN':
          return {
            ...prev,
            inputBuffer: isAlpha ? prev.inputBuffer + 'B' : prev.inputBuffer + '°',
            isAlpha: false,
          };

        case 'FRAC':
          return { ...prev, inputBuffer: prev.inputBuffer + '÷' };

        case 'ADD':
          if (isShift) {
            return { ...prev, inputBuffer: prev.inputBuffer + 'Pol(', isShift: false };
          }
          return { ...prev, inputBuffer: prev.inputBuffer + '+' };

        case 'SUB':
          if (isShift) {
            return { ...prev, inputBuffer: prev.inputBuffer + 'Rec(', isShift: false };
          }
          return { ...prev, inputBuffer: prev.inputBuffer + '-' };

        case 'MUL':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? 'P' : '×'),
            isShift: false,
          };

        case 'DIV':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + (isShift ? 'C' : '÷'),
            isShift: false,
          };

        case 'DOT':
          if (isShift) {
            return { ...prev, inputBuffer: prev.inputBuffer + 'Ran#', isShift: false };
          }
          if (isAlpha) {
            return { ...prev, inputBuffer: prev.inputBuffer + 'RanInt(', isAlpha: false };
          }
          return { ...prev, inputBuffer: prev.inputBuffer + '.' };

        // --- Digits ---
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          return {
            ...prev,
            inputBuffer: prev.inputBuffer + keyId,
            isShift: false,
            isAlpha: false,
          };

        default:
          return prev;
      }
    });
  }, [computeCurrentExpression, isWaitingForStoreVar, isPoweredOff, isShuttingDown, exitAppOnPowerOff]);

  // Handle restoring an item from visual history tape
  const handleSelectTapeItem = (item: CalculationHistoryItem) => {
    if (isPoweredOff || isShuttingDown) return;
    setState((prev) => ({
      ...prev,
      inputBuffer: item.input,
      resultBuffer: item.result,
      historyIndex: -1,
    }));
    setIsHistoryTapeOpen(false);
  };

  const statStats = calculate1VarStats(statDataList);
  const statSummary = [
    `n = ${statStats.n}`,
    `x̄ (mean) = ${statStats.mean.toFixed(4)}`,
    `Σx = ${statStats.sumX.toFixed(4)}`,
    `σx = ${statStats.sigmaX.toFixed(4)}`,
    `sx = ${statStats.sX.toFixed(4)}`,
    `minX = ${statStats.minX}, maxX = ${statStats.maxX}`,
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={colorScheme === 'light' ? 'dark-content' : 'light-content'}
        backgroundColor={theme.background}
      />

      {/* Top Header Bar with Discrete Info (i) and Tape Toggle */}
      <View
        style={[
          styles.topHeaderBar,
          {
            backgroundColor: theme.headerBackground,
            borderBottomColor: theme.headerBorder,
          },
        ]}
      >
        <View style={styles.headerBrandRow}>
          <Text style={[styles.headerCasio, { color: theme.headerText }]}>OPENCALC</Text>
          <Text style={[styles.headerModel, { color: theme.headerSubtext }]}>99X</Text>
        </View>

        <View style={styles.headerActions}>
          {/* Toggle History Tape Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.headerIconButton,
              {
                backgroundColor: theme.headerButtonBg,
                borderColor: theme.headerButtonBorder,
              },
              isHistoryTapeOpen && styles.headerIconButtonActive,
            ]}
            onPress={() => setIsHistoryTapeOpen((prev) => !prev)}
          >
            <Text style={[styles.headerIconText, { color: theme.headerText }]}>
              📜 Tape ({state.history.length})
            </Text>
          </TouchableOpacity>

          {/* Discrete (i) Info Help Guide Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.infoCircleButton,
              {
                backgroundColor: theme.headerButtonBg,
                borderColor: theme.headerButtonBorder,
              },
            ]}
            onPress={() => setIsHelpModalVisible(true)}
          >
            <Text style={styles.infoCircleText}>ⓘ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visual Slide-Down History Tape (Dropdown) */}
      {isHistoryTapeOpen && (
        <View
          style={[
            styles.historyTapePanel,
            {
              backgroundColor: theme.tapePanelBg,
              borderColor: theme.tapeBorder,
            },
          ]}
        >
          <View style={styles.tapeHeaderRow}>
            <Text style={[styles.tapeTitle, { color: theme.modalSubtext }]}>
              Calculation History Tape
            </Text>
            <TouchableOpacity onPress={() => setIsHistoryTapeOpen(false)}>
              <Text style={styles.tapeCloseText}>✕ Close</Text>
            </TouchableOpacity>
          </View>
          {state.history.length === 0 ? (
            <Text style={[styles.tapeEmptyText, { color: theme.modalSubtext }]}>
              No previous calculations yet.
            </Text>
          ) : (
            <ScrollView style={styles.tapeList} showsVerticalScrollIndicator={false}>
              {state.history
                .slice()
                .reverse()
                .map((item, idx) => (
                  <TouchableOpacity
                    key={item.id || idx}
                    style={[styles.tapeItem, { borderBottomColor: theme.tapeItemBorder }]}
                    onPress={() => handleSelectTapeItem(item)}
                  >
                    <Text style={[styles.tapeExpr, { color: theme.tapeExpr }]}>{item.input}</Text>
                    <Text style={[styles.tapeResult, { color: theme.tapeResult }]}>
                      = {item.result}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          )}
        </View>
      )}

      {/* Main Screen Layout Container (flex: 1) */}
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* LCD Dot Matrix Display */}
        <View style={styles.displayWrapper}>
          <Display
            input={state.inputBuffer}
            result={state.resultBuffer}
            isShift={state.isShift}
            isAlpha={state.isAlpha}
            mode={state.mode}
            angleUnit={state.angleUnit}
            baseN={state.baseN}
            hasMemory={state.memory.M !== 0}
            isModeMenuVisible={isModeMenuVisible}
            isPoweredOff={isPoweredOff}
            isShuttingDown={isShuttingDown}
            onCloseModeMenu={() => setIsModeMenuVisible(false)}
            onSelectMode={(newMode) => {
              setState((prev) => ({
                ...prev,
                mode: newMode,
                inputBuffer: '',
                resultBuffer: '0',
                historyIndex: -1,
              }));
            }}
            tableData={tableDataRows}
            statSummary={statSummary}
            equationResult={eqnOutputs}
          />
        </View>

        {/* Keypad Component */}
        <View style={styles.keypadWrapper}>
          <Keypad
            onKeyPress={handleKeyPress}
            isShift={state.isShift}
            isAlpha={state.isAlpha}
          />
        </View>
      </View>

      {/* Interactive Quick Help & Reference Guide Modal */}
      <HelpModal
        visible={isHelpModalVisible}
        onClose={() => setIsHelpModalVisible(false)}
      />

      {/* SHIFT + MENU: SETUP / App Bio, Creator Information, Theme Selector & Support Modal */}
      <AboutModal
        visible={isAboutModalVisible}
        exitAppOnPowerOff={exitAppOnPowerOff}
        onToggleExitAppOnPowerOff={handleToggleExitAppPref}
        onClose={() => setIsAboutModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
  headerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerCasio: {
    fontWeight: '900',
    fontFamily: 'monospace',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  headerModel: {
    fontWeight: '700',
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  headerIconButtonActive: {
    backgroundColor: '#1f3d5c',
    borderColor: '#388bfd',
  },
  headerIconText: {
    fontSize: 11,
    fontWeight: '600',
  },
  infoCircleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  infoCircleText: {
    color: '#61dafb',
    fontSize: 14,
    fontWeight: 'bold',
  },
  historyTapePanel: {
    borderBottomWidth: 2,
    padding: 12,
    maxHeight: 180,
    zIndex: 10,
  },
  tapeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tapeTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  tapeCloseText: {
    fontSize: 11,
    color: '#388bfd',
    fontWeight: 'bold',
  },
  tapeEmptyText: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 10,
  },
  tapeList: {
    maxHeight: 140,
  },
  tapeItem: {
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  tapeExpr: {
    fontFamily: 'monospace',
    fontSize: 13,
  },
  tapeResult: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  container: {
    flex: 1,
  },
  displayWrapper: {
    flexShrink: 0,
  },
  keypadWrapper: {
    flex: 1,
  },
});
