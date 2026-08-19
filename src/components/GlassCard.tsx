import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeColors } from '../theme/colors';

interface GlassCardProps {
  theme: ThemeColors;
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  borderRadius?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  theme,
  children,
  style,
  intensity = 35,
  borderRadius = 24,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          borderColor: theme.glassBorder,
          backgroundColor: theme.glassBackground,
        },
        style,
      ]}
    >
      <BlurView
        intensity={intensity}
        tint={theme.mode === 'dark' ? 'dark' : 'light'}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      <LinearGradient
        colors={[theme.glassHighlight, 'transparent', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius, opacity: 0.5 }]}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1.2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
});
