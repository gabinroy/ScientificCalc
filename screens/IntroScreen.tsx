import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';

export const FIRST_LAUNCH_KEY = '@opencalc_first_launch_done_v1';

interface IntroScreenProps {
  onDismiss: () => void;
}

/**
 * screens/IntroScreen.tsx
 *
 * Premium Onboarding & Tutorial Welcome Screen:
 * - Liquid glassmorphism cards with subtle glow borders
 * - Dynamic color-scheme harmony with ThemeContext
 * - Clean hidden scrollbars and modern typography
 */
export const IntroScreen: React.FC<IntroScreenProps> = ({ onDismiss }) => {
  const { theme } = useTheme();

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    } catch (e) {
      console.warn('Could not persist first launch flag', e);
    }
    onDismiss();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Top Header Badge */}
        <View
          style={[
            styles.badgeWrapper,
            {
              backgroundColor: theme.isDark ? 'rgba(56, 139, 253, 0.12)' : 'rgba(31, 111, 235, 0.08)',
              borderColor: theme.isDark ? 'rgba(56, 139, 253, 0.35)' : 'rgba(31, 111, 235, 0.25)',
            },
          ]}
        >
          <Text style={[styles.badgeBrand, { color: theme.headerText }]}>OPENCALC</Text>
          <Text style={[styles.badgeModel, { color: '#388bfd' }]}>99X</Text>
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: theme.headerText }]}>
          Welcome to OpenCalc 99X
        </Text>

        <Text style={[styles.subtitle, { color: theme.modalSubtext }]}>
          An authentic, zero-compromise scientific calculator emulator engineered with physical ClassWiz key ergonomics and a zero-eval math engine.
        </Text>

        {/* Origin & Educational Purpose Card */}
        <View
          style={[
            styles.card,
            styles.originCard,
            {
              backgroundColor: theme.isDark ? '#161d2b' : '#edf3fc',
              borderColor: theme.isDark ? '#263854' : '#cce0fc',
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>🏛️</Text>
            <Text style={[styles.cardTitle, { color: theme.isDark ? '#58a6ff' : '#0969da' }]}>
              Project Origins & Disclaimer
            </Text>
          </View>
          <Text style={[styles.originText, { color: theme.isDark ? '#c9d1d9' : '#24292f' }]}>
            OpenCalc 99X was created as an educational open-source project to commemorate the legacy and workflow of the popular, discontinued fx-991EX series.
          </Text>
          <Text style={[styles.originDisclaimer, { color: theme.modalSubtext }]}>
            * This project is completely independent and is not affiliated with, endorsed by, or associated with Casio Computer Co., Ltd.
          </Text>
        </View>

        {/* Feature Highlights Card */}
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.modalCardInner,
              borderColor: theme.modalCardBorder,
            },
          ]}
        >
          <Text style={[styles.sectionHeading, { color: theme.headerText }]}>
            Key Capabilities
          </Text>

          <View style={styles.featureRow}>
            <View style={[styles.iconPill, { backgroundColor: theme.isDark ? '#21262d' : '#e1e4e8' }]}>
              <Text style={styles.pillIcon}>🔢</Text>
            </View>
            <View style={styles.featureTextCol}>
              <Text style={[styles.featureHeading, { color: theme.headerText }]}>
                12 Calculation Modes
              </Text>
              <Text style={[styles.featureDesc, { color: theme.modalSubtext }]}>
                Calculate, Complex, Base-N, Matrix, Vector, Statistics, Distribution, Spreadsheet, Table, Equation, Inequality, & Ratio.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.iconPill, { backgroundColor: theme.isDark ? '#21262d' : '#e1e4e8' }]}>
              <Text style={styles.pillIcon}>🔄</Text>
            </View>
            <View style={styles.featureTextCol}>
              <Text style={[styles.featureHeading, { color: theme.headerText }]}>
                Full SHIFT & ALPHA Logic
              </Text>
              <Text style={[styles.featureDesc, { color: theme.modalSubtext }]}>
                Tap SHIFT for yellow calculus, conversions, permutations & constants; tap ALPHA for red variables (A–F, M, x, y, e).
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.iconPill, { backgroundColor: theme.isDark ? '#21262d' : '#e1e4e8' }]}>
              <Text style={styles.pillIcon}>💾</Text>
            </View>
            <View style={styles.featureTextCol}>
              <Text style={[styles.featureHeading, { color: theme.headerText }]}>
                Dedicated Memory & STO/RCL
              </Text>
              <Text style={[styles.featureDesc, { color: theme.modalSubtext }]}>
                Store values into registers A-F, M, x, y with STO or run continuous accumulators via M+ and M-.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <View style={[styles.iconPill, { backgroundColor: theme.isDark ? '#21262d' : '#e1e4e8' }]}>
              <Text style={styles.pillIcon}>🔒</Text>
            </View>
            <View style={styles.featureTextCol}>
              <Text style={[styles.featureHeading, { color: theme.headerText }]}>
                Strict Portrait Lock & No eval()
              </Text>
              <Text style={[styles.featureDesc, { color: theme.modalSubtext }]}>
                Pure Shunting-Yard token stack parser ensuring deterministic, secure mathematical calculation.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Instructions */}
        <View
          style={[
            styles.card,
            styles.quickTipBox,
            {
              backgroundColor: theme.isDark ? 'rgba(35, 134, 54, 0.08)' : 'rgba(46, 160, 67, 0.08)',
              borderColor: theme.isDark ? 'rgba(35, 134, 54, 0.3)' : 'rgba(46, 160, 67, 0.3)',
            },
          ]}
        >
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardIcon}>💡</Text>
            <Text style={[styles.cardTitle, { color: theme.isDark ? '#7ee787' : '#1a7f37' }]}>
              Quick Tips
            </Text>
          </View>
          <Text style={[styles.quickTipText, { color: theme.isDark ? '#c9d1d9' : '#24292f' }]}>
            • Press <Text style={styles.boldMono}>[MENU]</Text> to switch between calculation modes.
          </Text>
          <Text style={[styles.quickTipText, { color: theme.isDark ? '#c9d1d9' : '#24292f' }]}>
            • Press <Text style={styles.boldMono}>[SHIFT] + [AC]</Text> to power off the calculator.
          </Text>
          <Text style={[styles.quickTipText, { color: theme.isDark ? '#c9d1d9' : '#24292f' }]}>
            • Press <Text style={styles.boldMono}>[SHIFT] + [MENU]</Text> to open the About & Theme setup modal.
          </Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedText}>Get Started with OpenCalc 99X →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 40,
    alignItems: 'center',
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  badgeBrand: {
    fontWeight: '900',
    fontFamily: 'monospace',
    fontSize: 13,
    marginRight: 5,
    letterSpacing: 1,
  },
  badgeModel: {
    fontWeight: '800',
    fontSize: 13,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 18,
    paddingHorizontal: 6,
  },
  card: {
    width: '100%',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  originCard: {},
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  originText: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 6,
  },
  originDisclaimer: {
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 15,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  pillIcon: {
    fontSize: 15,
  },
  featureTextCol: {
    flex: 1,
  },
  featureHeading: {
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 11.5,
    lineHeight: 16,
  },
  quickTipBox: {
    borderLeftWidth: 4,
    borderLeftColor: '#2ea043',
  },
  quickTipText: {
    fontSize: 11.5,
    lineHeight: 17,
    marginBottom: 3,
  },
  boldMono: {
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  getStartedButton: {
    backgroundColor: '#238636',
    width: '100%',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#238636',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 4,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: 'bold',
    letterSpacing: 0.3,
  },
});
