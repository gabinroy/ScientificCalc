import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ThemeColors } from '../theme/colors';
import { AngleMode } from '../engine/calculator';

interface TopControlBarProps {
  theme: ThemeColors;
  isShift: boolean;
  isAlpha: boolean;
  angleMode: AngleMode;
  onToggleShift: () => void;
  onToggleAlpha: () => void;
  onToggleAngleMode: () => void;
  onOpenHelp: () => void;
  onClearAll: () => void;
  onCursorMoveLeft: () => void;
  onCursorMoveRight: () => void;
  onParenthesesLeft: () => void;
  onParenthesesRight: () => void;
}

export const TopControlBar: React.FC<TopControlBarProps> = ({
  theme,
  isShift,
  isAlpha,
  angleMode,
  onToggleShift,
  onToggleAlpha,
  onToggleAngleMode,
  onOpenHelp,
  onClearAll,
  onCursorMoveLeft,
  onCursorMoveRight,
  onParenthesesLeft,
  onParenthesesRight,
}) => {
  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  return (
    <View style={styles.container}>
      {/* Top action keys: SHIFT, ALPHA, Left/Right D-pad, MODE/UNIT, HELP/ON */}
      <View style={styles.row}>
        {/* SHIFT Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            onToggleShift();
          }}
          style={[
            styles.roundBtn,
            {
              backgroundColor: isShift ? theme.labelShift : theme.btnShiftBg,
              borderColor: theme.labelShift,
            },
          ]}
        >
          <Text
            style={[
              styles.btnText,
              { color: isShift ? '#000000' : theme.btnShiftText, fontWeight: '800' },
            ]}
          >
            SHIFT
          </Text>
        </TouchableOpacity>

        {/* ALPHA Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            onToggleAlpha();
          }}
          style={[
            styles.roundBtn,
            {
              backgroundColor: isAlpha ? theme.labelAlpha : theme.btnAlphaBg,
              borderColor: theme.labelAlpha,
            },
          ]}
        >
          <Text
            style={[
              styles.btnText,
              { color: isAlpha ? '#FFFFFF' : theme.btnAlphaText, fontWeight: '800' },
            ]}
          >
            ALPHA
          </Text>
        </TouchableOpacity>

        {/* Center Replay/D-Pad Controls */}
        <View
          style={[
            styles.dpadContainer,
            {
              backgroundColor: theme.glassBackground,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              triggerHaptic();
              onCursorMoveLeft();
            }}
            style={styles.dpadBtn}
          >
            <Ionicons
              name="chevron-back"
              size={17}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.replayLabel, { color: theme.textSecondary }]}>REPLAY</Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              triggerHaptic();
              onCursorMoveRight();
            }}
            style={styles.dpadBtn}
          >
            <Ionicons
              name="chevron-forward"
              size={17}
              color={theme.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* Angle Mode Selector */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            onToggleAngleMode();
          }}
          style={[
            styles.roundBtn,
            {
              backgroundColor: theme.btnActionBg,
              borderColor: theme.btnActionBorder,
            },
          ]}
        >
          <Text style={[styles.btnText, { color: theme.btnActionText }]}>
            {angleMode}
          </Text>
        </TouchableOpacity>

        {/* Help / Intro Modal trigger */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            triggerHaptic();
            onOpenHelp();
          }}
          style={[
            styles.roundBtn,
            {
              backgroundColor: theme.glassBackground,
              borderColor: theme.glassBorder,
            },
          ]}
        >
          <Ionicons
            name="help-circle-outline"
            size={18}
            color={theme.textPrimary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  roundBtn: {
    minWidth: 54,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  btnText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  dpadContainer: {
    flex: 1,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  dpadBtn: {
    padding: 4,
  },
  replayLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
