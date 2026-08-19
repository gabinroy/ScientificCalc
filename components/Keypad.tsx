import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../ThemeContext';

export interface KeypadProps {
  onKeyPress: (keyId: string) => void;
  isShift: boolean;
  isAlpha: boolean;
}

interface KeyConfig {
  id: string;
  label: string;
  shiftLabel?: string;
  alphaLabel?: string;
  subLabel?: string;
  type?: 'func' | 'num' | 'action' | 'accent' | 'nav';
}

/**
 * components/Keypad.tsx
 *
 * Casio fx-991EX ClassWiz Proportional Key Grid.
 * 
 * CLEAN ACTIVE COLOR SWITCHING:
 * - When SHIFT is active, all shift secondary text turns to a brighter high-visibility color.
 * - When ALPHA is active, all alpha secondary text turns to a brighter high-visibility color.
 * - Clean text rendering without artificial blur/glow shadows.
 */
export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  isShift,
  isAlpha,
}) => {
  const { theme } = useTheme();

  const renderKey = (key: KeyConfig, customStyle?: any) => {
    let keyCapBg = theme.keyCapFuncBg;
    let keyCapBorder = theme.keyCapFuncBorder;
    let labelColor = theme.labelFunc;
    let fontSize = 13.5;

    if (key.type === 'num') {
      keyCapBg = theme.keyCapNumBg;
      keyCapBorder = theme.keyCapNumBorder;
      labelColor = theme.labelNum;
      fontSize = 17;
    } else if (key.type === 'action') {
      keyCapBg = theme.keyCapActionBg;
      keyCapBorder = theme.keyCapActionBorder;
      labelColor = theme.labelAction;
      fontSize = 12.5;
    } else if (key.type === 'accent') {
      keyCapBg = theme.keyCapAccentBg;
      keyCapBorder = theme.keyCapAccentBorder;
      labelColor = theme.labelAccent;
      fontSize = 11.5;
    }

    return (
      <View key={key.id} style={[styles.keyCell, customStyle]}>
        {/* Secondary shift/alpha labels with clean bright font color switching */}
        <View style={styles.badgeRow}>
          <Text
            style={[
              styles.badgeText,
              { color: isShift ? theme.shiftActive : theme.shiftText },
              isShift && { fontWeight: '900' },
            ]}
            numberOfLines={1}
          >
            {key.shiftLabel || ''}
          </Text>
          <Text
            style={[
              styles.badgeText,
              { color: isAlpha ? theme.alphaActive : theme.alphaText },
              isAlpha && { fontWeight: '900' },
            ]}
            numberOfLines={1}
          >
            {key.alphaLabel || ''}
          </Text>
        </View>

        {/* Physical Key Button */}
        <TouchableOpacity
          activeOpacity={0.65}
          style={[
            styles.keyCap,
            {
              backgroundColor: keyCapBg,
              borderColor: keyCapBorder,
            },
          ]}
          onPress={() => onKeyPress(key.id)}
        >
          <Text style={[styles.keyLabel, { color: labelColor, fontSize }]}>
            {key.label}
          </Text>
          {key.subLabel && (
            <Text style={[styles.subLabelText, { color: theme.subLabelText }]}>
              {key.subLabel}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.keypadBackground }]}>
      {/* 1. Upper Functional Navigation Row & Circular D-Pad */}
      <View style={styles.topControlRow}>
        {/* Top Left Quadrant: SHIFT, ALPHA, OPTN, CALC */}
        <View style={styles.controlSubGrid}>
          <View style={styles.navRow}>
            {renderKey({ id: 'SHIFT', label: 'SHIFT', type: 'accent' })}
            {renderKey({ id: 'ALPHA', label: 'ALPHA', type: 'accent' })}
          </View>
          <View style={styles.navRow}>
            {renderKey({ id: 'OPTN', label: 'OPTN', shiftLabel: 'QR' })}
            {renderKey({ id: 'CALC', label: 'CALC', shiftLabel: 'SOLVE', alphaLabel: '=' })}
          </View>
        </View>

        {/* Center Circular D-Pad Controller */}
        <View
          style={[
            styles.dpadOuter,
            {
              backgroundColor: theme.dpadOuterBg,
              borderColor: theme.dpadBorder,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.dpadBtn, styles.dpadUp]}
            onPress={() => onKeyPress('NAV_UP')}
          >
            <Text style={[styles.dpadArrow, { color: theme.dpadArrow }]}>▲</Text>
          </TouchableOpacity>
          <View style={styles.dpadMiddleRow}>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.dpadBtn, styles.dpadLeft]}
              onPress={() => onKeyPress('NAV_LEFT')}
            >
              <Text style={[styles.dpadArrow, { color: theme.dpadArrow }]}>◀</Text>
            </TouchableOpacity>
            <View style={styles.dpadCenterHub}>
              <Text style={[styles.casioLogoText, { color: theme.dpadCenterText }]}>99X</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.6}
              style={[styles.dpadBtn, styles.dpadRight]}
              onPress={() => onKeyPress('NAV_RIGHT')}
            >
              <Text style={[styles.dpadArrow, { color: theme.dpadArrow }]}>▶</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            activeOpacity={0.6}
            style={[styles.dpadBtn, styles.dpadDown]}
            onPress={() => onKeyPress('NAV_DOWN')}
          >
            <Text style={[styles.dpadArrow, { color: theme.dpadArrow }]}>▼</Text>
          </TouchableOpacity>
        </View>

        {/* Top Right Quadrant: MENU, ON, INTEGRAL, X_INV */}
        <View style={styles.controlSubGrid}>
          <View style={styles.navRow}>
            {renderKey({ id: 'MENU', label: 'MENU', shiftLabel: 'SETUP' })}
            {renderKey({ id: 'ON', label: 'ON', type: 'accent' })}
          </View>
          <View style={styles.navRow}>
            {renderKey({ id: 'INTEGRAL', label: '∫dx', shiftLabel: 'd/dx' })}
            {renderKey({ id: 'X_INV', label: 'x⁻¹', shiftLabel: 'x!' })}
          </View>
        </View>
      </View>

      {/* 2. Scientific Section (3 Rows - 6 Keys Each) */}
      <View style={styles.scientificSection}>
        <View style={styles.keyRow}>
          {renderKey({ id: 'FRAC', label: '■/□', shiftLabel: '■■/□' })}
          {renderKey({ id: 'SQRT', label: '√■', shiftLabel: '³√■' })}
          {renderKey({ id: 'SQUARE', label: 'x²', shiftLabel: 'x³' })}
          {renderKey({ id: 'POWER', label: 'x■', shiftLabel: '■√■' })}
          {renderKey({ id: 'LOG_BASE', label: 'log_■', shiftLabel: 'log' })}
          {renderKey({ id: 'LN', label: 'ln', shiftLabel: 'e■' })}
        </View>

        <View style={styles.keyRow}>
          {renderKey({ id: 'NEG', label: '(-)', alphaLabel: 'A' })}
          {renderKey({ id: 'DEG_MIN', label: '° \' "', alphaLabel: 'B', shiftLabel: 'FACT' })}
          {renderKey({ id: 'HYP', label: 'hyp', alphaLabel: 'C' })}
          {renderKey({ id: 'SIN', label: 'sin', shiftLabel: 'sin⁻¹', alphaLabel: 'D' })}
          {renderKey({ id: 'COS', label: 'cos', shiftLabel: 'cos⁻¹', alphaLabel: 'E' })}
          {renderKey({ id: 'TAN', label: 'tan', shiftLabel: 'tan⁻¹', alphaLabel: 'F' })}
        </View>

        <View style={styles.keyRow}>
          {renderKey({ id: 'STO', label: 'STO', shiftLabel: 'RECALL' })}
          {renderKey({ id: 'ENG', label: 'ENG', shiftLabel: '←' })}
          {renderKey({ id: 'LPAREN', label: '(', alphaLabel: 'x' })}
          {renderKey({ id: 'RPAREN', label: ')', alphaLabel: 'y', shiftLabel: ',' })}
          {renderKey({ id: 'SD', label: 'S⇔D', shiftLabel: '≈' })}
          {renderKey({ id: 'M_PLUS', label: 'M+', shiftLabel: 'M-', alphaLabel: 'M' })}
        </View>
      </View>

      {/* 3. Standard Number & Action Keypad (4 Rows - 5 Keys Each) */}
      <View style={styles.standardSection}>
        <View style={styles.keyRow}>
          {renderKey({ id: '7', label: '7', type: 'num', shiftLabel: 'CONST' })}
          {renderKey({ id: '8', label: '8', type: 'num', shiftLabel: 'CONV' })}
          {renderKey({ id: '9', label: '9', type: 'num', shiftLabel: 'RESET' })}
          {renderKey({ id: 'DEL', label: 'DEL', type: 'action', shiftLabel: 'INS' })}
          {renderKey({ id: 'AC', label: 'AC', type: 'action', shiftLabel: 'OFF' })}
        </View>

        <View style={styles.keyRow}>
          {renderKey({ id: '4', label: '4', type: 'num', shiftLabel: 'MATRIX' })}
          {renderKey({ id: '5', label: '5', type: 'num', shiftLabel: 'VECTOR' })}
          {renderKey({ id: '6', label: '6', type: 'num' })}
          {renderKey({ id: 'MUL', label: '×', shiftLabel: 'nPr' })}
          {renderKey({ id: 'DIV', label: '÷', shiftLabel: 'nCr' })}
        </View>

        <View style={styles.keyRow}>
          {renderKey({ id: '1', label: '1', type: 'num', shiftLabel: 'STAT' })}
          {renderKey({ id: '2', label: '2', type: 'num', shiftLabel: 'CMPLX' })}
          {renderKey({ id: '3', label: '3', type: 'num', shiftLabel: 'BASE' })}
          {renderKey({ id: 'ADD', label: '+', shiftLabel: 'Pol' })}
          {renderKey({ id: 'SUB', label: '-', shiftLabel: 'Rec' })}
        </View>

        <View style={styles.keyRow}>
          {renderKey({ id: '0', label: '0', type: 'num', shiftLabel: 'Rnd' })}
          {renderKey({ id: 'DOT', label: '.', type: 'num', shiftLabel: 'Ran#' })}
          {renderKey({ id: 'EXP', label: '×10ˣ', shiftLabel: 'π', alphaLabel: 'e' })}
          {renderKey({ id: 'ANS', label: 'Ans', shiftLabel: 'PreAns' })}
          {renderKey({ id: 'EQUALS', label: '=', type: 'num' })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 10,
    justifyContent: 'space-between',
  },
  topControlRow: {
    flex: 1.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  controlSubGrid: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-between',
  },
  navRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dpadOuter: {
    width: 88,
    height: '92%',
    maxHeight: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  dpadMiddleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  dpadCenterHub: {
    width: 44,
    alignItems: 'center',
  },
  casioLogoText: {
    fontSize: 8.5,
    fontFamily: 'monospace',
    fontWeight: '900',
  },
  dpadBtn: {
    padding: 4,
  },
  dpadUp: {
    marginTop: -2,
  },
  dpadDown: {
    marginBottom: -2,
  },
  dpadLeft: {},
  dpadRight: {},
  dpadArrow: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  scientificSection: {
    flex: 3,
    justifyContent: 'space-between',
    marginVertical: 3,
  },
  standardSection: {
    flex: 4,
    justifyContent: 'space-between',
    marginTop: 3,
  },
  keyRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  keyCell: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2.5,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 2,
    height: 14,
    alignItems: 'center',
    marginBottom: 2,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  keyCap: {
    width: '100%',
    flex: 1,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  keyLabel: {
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  subLabelText: {
    fontSize: 7,
  },
});
