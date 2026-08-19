import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import { CalcMode, AngleUnit, BaseNType } from '../utils/mathEngine';
import { useTheme } from '../ThemeContext';

interface DisplayProps {
  input: string;
  result: string;
  isShift: boolean;
  isAlpha: boolean;
  mode: CalcMode;
  angleUnit: AngleUnit;
  baseN: BaseNType;
  hasMemory: boolean;
  isModeMenuVisible: boolean;
  isPoweredOff?: boolean;
  isShuttingDown?: boolean;
  onCloseModeMenu: () => void;
  onSelectMode: (mode: CalcMode) => void;
  tableData?: { x: number; fx: number }[];
  statSummary?: string[];
  matrixInfo?: string;
  equationResult?: string[];
}

const MODES: { id: string; name: string; mode: CalcMode; badge: string }[] = [
  { id: '1', name: 'Calculate', mode: 'CALCULATE', badge: 'COMP' },
  { id: '2', name: 'Complex', mode: 'COMPLEX', badge: 'CMPLX' },
  { id: '3', name: 'Base-N', mode: 'BASE_N', badge: 'BASE' },
  { id: '4', name: 'Matrix', mode: 'MATRIX', badge: 'MAT' },
  { id: '5', name: 'Vector', mode: 'VECTOR', badge: 'VCT' },
  { id: '6', name: 'Statistics', mode: 'STATISTICS', badge: 'STAT' },
  { id: '7', name: 'Distribution', mode: 'DISTRIBUTION', badge: 'DIST' },
  { id: '8', name: 'Spreadsheet', mode: 'SPREADSHEET', badge: 'SHEET' },
  { id: '9', name: 'Table', mode: 'TABLE', badge: 'TABLE' },
  { id: 'A', name: 'Equation/Func', mode: 'EQUATION', badge: 'EQN' },
  { id: 'B', name: 'Inequality', mode: 'INEQUALITY', badge: 'INEQ' },
  { id: 'C', name: 'Ratio', mode: 'RATIO', badge: 'RATIO' },
];

export const Display: React.FC<DisplayProps> = ({
  input,
  result,
  isShift,
  isAlpha,
  mode,
  angleUnit,
  baseN,
  hasMemory,
  isModeMenuVisible,
  isPoweredOff = false,
  isShuttingDown = false,
  onCloseModeMenu,
  onSelectMode,
  tableData,
  statSummary,
  matrixInfo,
  equationResult,
}) => {
  const { theme } = useTheme();
  const currentModeInfo = MODES.find((m) => m.mode === mode);

  // 1. If currently displaying the shutdown banner (OPENCALC 99X animation)
  if (isShuttingDown) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.lcdBackground,
            borderColor: theme.lcdBorder,
          },
        ]}
      >
        <View style={styles.statusBar}>
          <View style={styles.statusGroup} />
          <View style={styles.solarPanel}>
            <View style={styles.solarCell} />
            <View style={styles.solarCell} />
            <View style={styles.solarCell} />
          </View>
        </View>
        <View style={[styles.screenInner, styles.bannerInner]}>
          <Text style={[styles.bannerBrandText, { color: theme.lcdText }]}>
            OPENCALC 99X
          </Text>
          <Text style={[styles.bannerSubText, { color: theme.lcdText }]}>
            CLASSWIZ EMULATOR
          </Text>
        </View>
      </View>
    );
  }

  // 2. If calculator is powered off into standby
  if (isPoweredOff) {
    return (
      <View
        style={[
          styles.container,
          styles.poweredOffContainer,
          {
            backgroundColor: theme.isDark ? '#1a1d1a' : '#a8b5a0',
            borderColor: theme.lcdBorder,
          },
        ]}
      >
        <View style={styles.statusBar}>
          <View style={styles.statusGroup} />
          <View style={styles.solarPanel}>
            <View style={styles.solarCell} />
            <View style={styles.solarCell} />
            <View style={styles.solarCell} />
          </View>
        </View>
        <View style={[styles.screenInner, styles.poweredOffInner]}>
          <Text style={[styles.offHintText, { color: theme.isDark ? '#3d443d' : '#6f7a6a' }]}>
            [PRESS ON]
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.lcdBackground,
          borderColor: theme.lcdBorder,
        },
      ]}
    >
      {/* Top LCD Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusGroup}>
          <Text
            style={[
              styles.statusBadge,
              { color: theme.lcdStatusDefault },
              isShift && { color: theme.shiftActive, fontWeight: '900' },
            ]}
          >
            S
          </Text>
          <Text
            style={[
              styles.statusBadge,
              { color: theme.lcdStatusDefault },
              isAlpha && { color: theme.alphaActive, fontWeight: '900' },
            ]}
          >
            A
          </Text>
          <Text
            style={[
              styles.statusBadge,
              { color: theme.lcdStatusDefault },
              hasMemory && { color: theme.lcdStatusActive, fontWeight: '900' },
            ]}
          >
            M
          </Text>
          <Text style={[styles.statusBadgeActive, { color: theme.lcdStatusActive }]}>
            {angleUnit === 'DEG' ? 'D' : angleUnit === 'RAD' ? 'R' : 'G'}
          </Text>
          <Text style={[styles.statusBadgeActive, { color: theme.lcdStatusActive }]}>
            {mode === 'BASE_N' ? baseN : currentModeInfo?.badge || 'COMP'}
          </Text>
        </View>

        {/* Photovoltaic Solar Panel */}
        <View style={styles.solarPanel}>
          <View style={styles.solarCell} />
          <View style={styles.solarCell} />
          <View style={styles.solarCell} />
        </View>
      </View>

      {/* Main Dual-Line Dot Matrix Screen */}
      <View style={styles.screenInner}>
        {/* Mode-Specific Sub-Display Views */}
        {mode === 'TABLE' && tableData && tableData.length > 0 ? (
          <ScrollView style={styles.tableScrollView}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderText, { color: theme.lcdText }]}>x</Text>
              <Text style={[styles.tableHeaderText, { color: theme.lcdText }]}>f(x)</Text>
            </View>
            {tableData.map((row, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.tableCell, { color: theme.lcdText }]}>{row.x}</Text>
                <Text style={[styles.tableCell, { color: theme.lcdText }]}>
                  {isNaN(row.fx) ? 'ERROR' : row.fx}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : mode === 'STATISTICS' && statSummary && statSummary.length > 0 ? (
          <ScrollView style={styles.tableScrollView}>
            {statSummary.map((line, idx) => (
              <Text key={idx} style={[styles.tableCell, { color: theme.lcdText }]}>
                {line}
              </Text>
            ))}
          </ScrollView>
        ) : mode === 'EQUATION' && equationResult && equationResult.length > 0 ? (
          <ScrollView style={styles.tableScrollView}>
            {equationResult.map((res, idx) => (
              <Text key={idx} style={[styles.eqnResultText, { color: theme.lcdText }]}>
                {res}
              </Text>
            ))}
          </ScrollView>
        ) : (
          <>
            {/* Input Expression Line */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.inputScrollContent}
              style={styles.inputScrollView}
            >
              <Text style={[styles.inputText, { color: theme.lcdText }]}>
                {input || ' '}
                <Text style={[styles.cursor, { color: theme.lcdText }]}>▌</Text>
              </Text>
            </ScrollView>

            {/* Evaluation Result Line */}
            <View style={styles.resultContainer}>
              <Text
                style={[
                  styles.resultText,
                  { color: theme.lcdResult },
                  result.includes('ERROR') && { color: theme.lcdError },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {result}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* fx-991EX Mode Menu Modal */}
      <Modal
        visible={isModeMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={onCloseModeMenu}
      >
        <View style={[styles.modalBackdrop, { backgroundColor: theme.modalOverlay }]}>
          <View
            style={[
              styles.menuCard,
              {
                backgroundColor: theme.modalCardBg,
                borderColor: theme.modalCardBorder,
              },
            ]}
          >
            <Text style={[styles.menuTitle, { color: theme.modalText }]}>OpenCalc 99X Modes</Text>
            <FlatList
              data={MODES}
              keyExtractor={(item) => item.id}
              numColumns={2}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modeButton,
                    {
                      backgroundColor: theme.modalCardInner,
                      borderColor: theme.modalCardBorder,
                    },
                    mode === item.mode && styles.modeButtonSelected,
                  ]}
                  onPress={() => {
                    onSelectMode(item.mode);
                    onCloseModeMenu();
                  }}
                >
                  <Text style={[styles.modeNumber, { color: theme.modalText }]}>{item.id}:</Text>
                  <Text style={[styles.modeLabel, { color: theme.modalText }]}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={onCloseModeMenu}>
              <Text style={styles.cancelButtonText}>[AC] Exit Menu</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 3.5,
    padding: 8,
    marginHorizontal: 12,
    marginTop: 6,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 4,
  },
  poweredOffContainer: {
    opacity: 0.7,
  },
  poweredOffInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerInner: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  bannerBrandText: {
    fontFamily: 'monospace',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  bannerSubText: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    opacity: 0.8,
  },
  offHintText: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(30, 40, 30, 0.2)',
    paddingBottom: 3,
    marginBottom: 3,
  },
  statusGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  statusBadge: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadgeActive: {
    fontFamily: 'monospace',
    fontSize: 10,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.06)',
    paddingHorizontal: 2.5,
    borderRadius: 2,
  },
  solarPanel: {
    flexDirection: 'row',
    backgroundColor: '#1f1311',
    borderRadius: 3,
    padding: 2,
    gap: 2,
    borderWidth: 1,
    borderColor: '#3a2723',
  },
  solarCell: {
    width: 13,
    height: 9,
    backgroundColor: '#38221d',
    borderRadius: 1,
  },
  screenInner: {
    minHeight: 78,
    maxHeight: 96,
    justifyContent: 'space-between',
  },
  inputScrollView: {
    maxHeight: 38,
  },
  inputScrollContent: {
    alignItems: 'center',
  },
  inputText: {
    fontFamily: 'monospace',
    fontSize: 19,
    letterSpacing: 0.5,
  },
  cursor: {
    fontSize: 15,
  },
  resultContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginTop: 1,
  },
  resultText: {
    fontFamily: 'monospace',
    fontSize: 26,
    fontWeight: '700',
  },
  tableScrollView: {
    maxHeight: 84,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#334433',
    paddingBottom: 2,
  },
  tableHeaderText: {
    fontFamily: 'monospace',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 1.5,
  },
  tableCell: {
    fontFamily: 'monospace',
    fontSize: 11.5,
  },
  eqnResultText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: 'bold',
    marginVertical: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  menuCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 8,
    padding: 16,
    borderWidth: 2,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'monospace',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    margin: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  modeButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#2563eb',
  },
  modeNumber: {
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 6,
    fontFamily: 'monospace',
  },
  modeLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  cancelButton: {
    marginTop: 12,
    backgroundColor: '#3a3e3a',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f0f0f0',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
});
