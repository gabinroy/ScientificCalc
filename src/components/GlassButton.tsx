import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { ThemeColors } from '../theme/colors';

export interface CalcButtonConfig {
  id: string;
  label: string;
  subShift?: string;
  subAlpha?: string;
  subOption?: string;
  type?: 'number' | 'function' | 'action' | 'shift' | 'alpha' | 'delete' | 'equals';
  onPress: () => void;
  flex?: number;
  width?: number | string;
  height?: number;
  isActive?: boolean;
}

interface GlassButtonProps {
  config: CalcButtonConfig;
  theme: ThemeColors;
  style?: ViewStyle;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  config,
  theme,
  style,
}) => {
  const {
    label,
    subShift,
    subAlpha,
    subOption,
    type = 'number',
    onPress,
    isActive = false,
  } = config;

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    onPress();
  };

  let bgColor = theme.btnNumberBg;
  let borderColor = theme.btnNumberBorder;
  let textColor = theme.btnNumberText;

  if (type === 'function') {
    bgColor = theme.btnFunctionBg;
    borderColor = theme.btnFunctionBorder;
    textColor = theme.btnFunctionText;
  } else if (type === 'shift') {
    bgColor = isActive ? theme.labelShift : theme.btnShiftBg;
    borderColor = theme.labelShift;
    textColor = isActive ? '#000000' : theme.btnShiftText;
  } else if (type === 'alpha') {
    bgColor = isActive ? theme.labelAlpha : theme.btnAlphaBg;
    borderColor = theme.labelAlpha;
    textColor = isActive ? '#FFFFFF' : theme.btnAlphaText;
  } else if (type === 'action') {
    bgColor = theme.btnActionBg;
    borderColor = theme.btnActionBorder;
    textColor = theme.btnActionText;
  } else if (type === 'delete') {
    bgColor = theme.btnDeleteBg;
    borderColor = 'rgba(239, 68, 68, 0.5)';
    textColor = theme.btnDeleteText;
  } else if (type === 'equals') {
    bgColor = theme.btnEqualsBg;
    borderColor = 'rgba(16, 185, 129, 0.6)';
    textColor = theme.btnEqualsText;
  }

  return (
    <View style={[styles.wrapper, style]}>
      {/* Secondary Shift/Alpha Labels Above Button */}
      <View style={styles.subLabelsRow}>
        {subShift ? (
          <Text
            numberOfLines={1}
            style={[styles.subShiftText, { color: theme.labelShift }]}
          >
            {subShift}
          </Text>
        ) : (
          <View style={styles.subSpacer} />
        )}
        {subAlpha ? (
          <Text
            numberOfLines={1}
            style={[styles.subAlphaText, { color: theme.labelAlpha }]}
          >
            {subAlpha}
          </Text>
        ) : null}
        {subOption ? (
          <Text
            numberOfLines={1}
            style={[styles.subOptionText, { color: theme.labelOption }]}
          >
            {subOption}
          </Text>
        ) : null}
      </View>

      {/* Main Glass Button */}
      <TouchableOpacity
        activeOpacity={0.65}
        onPress={handlePress}
        style={[
          styles.button,
          {
            backgroundColor: bgColor,
            borderColor: borderColor,
          },
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.labelText,
            { color: textColor },
            type === 'number' && styles.numberText,
            type === 'equals' && styles.equalsText,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 2.5,
    marginVertical: 2,
    alignItems: 'stretch',
  },
  subLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
    minHeight: 11,
    alignItems: 'center',
    marginBottom: 1,
  },
  subShiftText: {
    fontSize: 9,
    fontWeight: '700',
    flex: 1,
    textAlign: 'left',
  },
  subAlphaText: {
    fontSize: 9,
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  subOptionText: {
    fontSize: 8.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  subSpacer: {
    flex: 1,
  },
  button: {
    minHeight: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  labelText: {
    fontSize: 14.5,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  numberText: {
    fontSize: 18,
    fontWeight: '700',
  },
  equalsText: {
    fontSize: 20,
    fontWeight: '700',
  },
});
