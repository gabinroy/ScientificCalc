import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ThemeColors } from '../theme/colors';
import { AngleMode } from '../engine/calculator';

interface LcdDisplayProps {
  expression: string;
  result: string;
  isShift: boolean;
  isAlpha: boolean;
  hasMemory: boolean;
  angleMode: AngleMode;
  theme: ThemeColors;
  errorMessage?: string | null;
}

export const LcdDisplay: React.FC<LcdDisplayProps> = ({
  expression,
  result,
  isShift,
  isAlpha,
  hasMemory,
  angleMode,
  theme,
  errorMessage,
}) => {
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
      {/* Top Status Indicators Bar (ClassWiz LCD top bar) */}
      <View style={styles.statusBar}>
        <View style={styles.indicatorsGroup}>
          <Text
            style={[
              styles.indicator,
              { color: isShift ? theme.indicatorActive : theme.indicatorInactive },
            ]}
          >
            [S]
          </Text>
          <Text
            style={[
              styles.indicator,
              { color: isAlpha ? theme.labelAlpha : theme.indicatorInactive },
            ]}
          >
            [A]
          </Text>
          <Text
            style={[
              styles.indicator,
              { color: hasMemory ? theme.indicatorActive : theme.indicatorInactive },
            ]}
          >
            [M]
          </Text>
          <Text
            style={[
              styles.indicator,
              styles.activeIndicator,
              { color: theme.indicatorActive },
            ]}
          >
            {angleMode}
          </Text>
          <Text
            style={[
              styles.indicator,
              { color: theme.indicatorInactive },
            ]}
          >
            MATH
          </Text>
        </View>
        <Text style={[styles.modelTag, { color: theme.lcdSubText }]}>
          OPENCALC 99X
        </Text>
      </View>

      {/* Primary Multi-line Input Display */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.expressionContainer}
      >
        <Text
          style={[
            styles.expressionText,
            { color: theme.lcdText },
          ]}
          selectable
        >
          {expression || ' '}
        </Text>
        <View
          style={[
            styles.cursor,
            { backgroundColor: theme.lcdCursor },
          ]}
        />
      </ScrollView>

      {/* Result Display Line */}
      <View style={styles.resultContainer}>
        {errorMessage ? (
          <Text style={[styles.errorText, { color: '#EF4444' }]}>
            {errorMessage}
          </Text>
        ) : (
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.resultText,
              { color: theme.lcdText },
            ]}
          >
            {result || '0'}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 10,
    marginHorizontal: 4,
    marginBottom: 8,
    minHeight: 120,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.6,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 4,
  },
  indicatorsGroup: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  indicator: {
    fontSize: 9.5,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
  activeIndicator: {
    fontWeight: '900',
  },
  modelTag: {
    fontSize: 9.5,
    fontWeight: '600',
    opacity: 0.8,
    fontFamily: 'monospace',
  },
  expressionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    minHeight: 36,
  },
  expressionText: {
    fontSize: 21,
    fontWeight: '600',
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
  cursor: {
    width: 2,
    height: 20,
    marginLeft: 2,
    borderRadius: 1,
    opacity: 0.85,
  },
  resultContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minHeight: 34,
  },
  resultText: {
    fontSize: 27,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: 'monospace',
  },
});
