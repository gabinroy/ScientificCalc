import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { ThemeColors } from '../theme/colors';

interface IntroModalProps {
  visible: boolean;
  onDismiss: () => void;
  theme: ThemeColors;
}

export const IntroModal: React.FC<IntroModalProps> = ({
  visible,
  onDismiss,
  theme,
}) => {
  const handleGotIt = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    }
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={[styles.overlay, { backgroundColor: theme.modalOverlay }]}>
        <View style={styles.centerContainer}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.cardBg,
                borderColor: theme.cardBorder,
              },
            ]}
          >
            <BlurView
              intensity={40}
              tint={theme.mode === 'dark' ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={[theme.glassHighlight, 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[StyleSheet.absoluteFill, { opacity: 0.35 }]}
            />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              {/* Header Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>OPENCALC 99X</Text>
              </View>

              <Text style={[styles.title, { color: theme.textPrimary }]}>
                Welcome to OpenCalc 99X
              </Text>
              <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                An open-source scientific calculator built with Liquid Glass UI
                and natural textbook display.
              </Text>

              {/* Feature Highlights */}
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <View style={[styles.featureIconBox, { backgroundColor: theme.btnShiftBg }]}>
                    <Text style={[styles.featureIcon, { color: theme.labelShift }]}>SHIFT</Text>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
                      Shift & Inverse Functions
                    </Text>
                    <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                      Access inverse trig (sin⁻¹, cos⁻¹, tan⁻¹), cube roots (∛), permutations (nPr), combinations (nCr), and factorials (!).
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={[styles.featureIconBox, { backgroundColor: theme.btnAlphaBg }]}>
                    <Text style={[styles.featureIcon, { color: theme.labelAlpha }]}>ALPHA</Text>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
                      Alpha Registers & Constants
                    </Text>
                    <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                      Store and recall variables (A–F, x, y, M) and use mathematical constants (π, e).
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={[styles.featureIconBox, { backgroundColor: theme.btnActionBg }]}>
                    <Text style={[styles.featureIcon, { color: theme.btnActionText }]}>DEG/RAD</Text>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
                      Angle Modes & Memory
                    </Text>
                    <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                      Toggle between Degrees, Radians, and Gradians on the fly. Manage memory via M+, M-, MR, and MC.
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={[styles.featureIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                    <Text style={[styles.featureIcon, { color: '#10B981' }]}>STRICT</Text>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={[styles.featureTitle, { color: theme.textPrimary }]}>
                      Pure Shunting-Yard Engine
                    </Text>
                    <Text style={[styles.featureDesc, { color: theme.textSecondary }]}>
                      Evaluates calculations safely without eval(), respecting operator precedence and natural expression parsing.
                    </Text>
                  </View>
                </View>
              </View>

              {/* Got It Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleGotIt}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.accent,
                  },
                ]}
              >
                <Text style={styles.buttonText}>Got it! Start Calculating</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
  },
  card: {
    borderRadius: 28,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 12,
  },
  content: {
    padding: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderColor: 'rgba(56, 189, 248, 0.3)',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 12,
  },
  badgeText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    fontSize: 23,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  featureList: {
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  featureIconBox: {
    width: 46,
    height: 46,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  featureIcon: {
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14.5,
    fontWeight: '700',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 12.5,
    lineHeight: 17,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginTop: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15.5,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
