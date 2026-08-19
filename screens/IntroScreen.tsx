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

export const FIRST_LAUNCH_KEY = '@opencalc_first_launch_done_v1';

interface IntroScreenProps {
  onDismiss: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onDismiss }) => {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem(FIRST_LAUNCH_KEY, 'true');
    } catch (e) {
      console.warn('Could not persist first launch flag', e);
    }
    onDismiss();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Badge */}
        <View style={styles.badgeWrapper}>
          <Text style={styles.badgeBrand}>OPENCALC</Text>
          <Text style={styles.badgeModel}>99X</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>
          Welcome to OpenCalc 99X
        </Text>

        <Text style={styles.subtitle}>
          An independent, open-source scientific calculator emulator engineered with an authentic dot-matrix LCD, liquid glass UI styling, and a zero-eval mathematical engine.
        </Text>

        {/* Origin & Educational Purpose Card */}
        <View style={styles.originCard}>
          <Text style={styles.originTitle}>🏛️ Project Origins & Disclaimer</Text>
          <Text style={styles.originText}>
            OpenCalc 99X was created as an educational open-source project to commemorate the legacy and workflow of the popular, discontinued fx-991EX series.
          </Text>
          <Text style={styles.originDisclaimer}>
            * This project is completely independent and is not affiliated with, endorsed by, or associated with Casio Computer Co., Ltd.
          </Text>
        </View>

        {/* Feature Highlights */}
        <View style={styles.featureCard}>
          <Text style={styles.featureCardTitle}>Key Capabilities</Text>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔢</Text>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>12 Calculation Modes</Text>
              <Text style={styles.featureDesc}>
                Calculate, Complex, Base-N, Matrix, Vector, Statistics, Distribution, Spreadsheet, Table, Equation, Inequality, & Ratio.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔄</Text>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>Full SHIFT & ALPHA Logic</Text>
              <Text style={styles.featureDesc}>
                Tap SHIFT for yellow secondary functions (d/dx, x!, nPr, nCr, π) or ALPHA for red variables (A–F, M, x, y, e).
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>💾</Text>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>Dedicated Memory & STO/RCL</Text>
              <Text style={styles.featureDesc}>
                Store values into registers A-F, M, x, y with STO or run continuous accumulators via M+ and M-.
              </Text>
            </View>
          </View>

          <View style={styles.featureRow}>
            <Text style={styles.featureIcon}>🔒</Text>
            <View style={styles.featureTextCol}>
              <Text style={styles.featureHeading}>Strict Portrait Lock & No eval()</Text>
              <Text style={styles.featureDesc}>
                Pure Shunting-Yard token stack parser ensuring deterministic, secure mathematical calculation.
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Instructions */}
        <View style={styles.quickTipBox}>
          <Text style={styles.quickTipTitle}>Quick Tips:</Text>
          <Text style={styles.quickTipText}>• Press [MENU] at any time to choose one of the 12 calculation modes.</Text>
          <Text style={styles.quickTipText}>• Press [AC] to clear current expression or exit menus.</Text>
          <Text style={styles.quickTipText}>• Press [=] to compute expressions using the operator stack.</Text>
        </View>

        {/* Start Button */}
        <TouchableOpacity style={styles.getStartedButton} onPress={handleGetStarted}>
          <Text style={styles.getStartedText}>Get Started with OpenCalc 99X</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  container: {
    padding: 24,
    alignItems: 'center',
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 16,
    marginTop: 8,
  },
  badgeBrand: {
    color: '#ffffff',
    fontWeight: '900',
    fontFamily: 'monospace',
    fontSize: 14,
    marginRight: 6,
    letterSpacing: 1,
  },
  badgeModel: {
    color: '#58a6ff',
    fontWeight: '800',
    fontSize: 13,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  subtitle: {
    fontSize: 14,
    color: '#8b949e',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  originCard: {
    backgroundColor: 'rgba(56, 139, 253, 0.08)',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(56, 139, 253, 0.25)',
    marginBottom: 16,
  },
  originTitle: {
    color: '#58a6ff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  originText: {
    color: '#c9d1d9',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 6,
  },
  originDisclaimer: {
    color: '#8b949e',
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 14,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    marginBottom: 16,
  },
  featureCardTitle: {
    color: '#f0f6fc',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  featureRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  featureTextCol: {
    flex: 1,
  },
  featureHeading: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  featureDesc: {
    color: '#8b949e',
    fontSize: 12,
    lineHeight: 16,
  },
  quickTipBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 10,
    padding: 14,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#388bfd',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    marginBottom: 24,
  },
  quickTipTitle: {
    color: '#58a6ff',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
  },
  quickTipText: {
    color: '#c9d1d9',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  getStartedButton: {
    backgroundColor: '#238636',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#238636',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  getStartedText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
