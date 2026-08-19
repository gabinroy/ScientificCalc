import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, ThemePreference } from '../ThemeContext';

interface AboutModalProps {
  visible: boolean;
  exitAppOnPowerOff: boolean;
  onToggleExitAppOnPowerOff: (val: boolean) => void;
  onClose: () => void;
}

/**
 * components/AboutModal.tsx
 *
 * App Bio, Creator Information, Theme Selector (System / Light / Dark),
 * Power-Off Exit App Behavior Toggle, and Open-Source Support Modal (Invoked via SHIFT + MENU).
 */
export const AboutModal: React.FC<AboutModalProps> = ({
  visible,
  exitAppOnPowerOff,
  onToggleExitAppOnPowerOff,
  onClose,
}) => {
  const { theme, themePreference, setThemePreference } = useTheme();
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleBuyCoffee = () => {
    setCoffeeCount((prev) => prev + 1);
    setShowThankYou(true);
    setTimeout(() => {
      setShowThankYou(false);
    }, 3500);
  };

  const handleOpenGithub = () => {
    Linking.openURL('https://github.com').catch((err) =>
      console.warn('Failed to open URL:', err)
    );
  };

  const THEME_OPTIONS: { id: ThemePreference; label: string; icon: string }[] = [
    { id: 'system', label: 'System', icon: '📱' },
    { id: 'light', label: 'Light', icon: '☀️' },
    { id: 'dark', label: 'Dark', icon: '🌙' },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}>
        <SafeAreaView
          style={[
            styles.modalContent,
            {
              backgroundColor: theme.modalCardBg,
              borderColor: theme.modalCardBorder,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.headerBorder }]}>
            <View>
              <Text style={[styles.headerTitle, { color: theme.headerText }]}>
                OPENCALC 99X
              </Text>
              <Text style={[styles.headerSubtitle, { color: theme.headerSubtext }]}>
                fx-991EX ClassWiz Open-Source Emulator
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[styles.closeButton, { backgroundColor: theme.headerButtonBg }]}
              onPress={onClose}
            >
              <Text style={[styles.closeButtonText, { color: theme.headerText }]}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Body */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Appearance & Theming Selector Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.modalCardInner,
                  borderColor: theme.modalCardBorder,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardIcon}>🎨</Text>
                <Text style={[styles.cardTitle, { color: theme.modalText }]}>
                  App Appearance & Theme
                </Text>
              </View>

              <Text style={[styles.cardBody, { color: theme.modalSubtext, marginBottom: 8 }]}>
                Choose between Automatic System Theme, Light Casio Hardware Theme, or Dark OLED Theme.
              </Text>

              {/* Theme Option Segment Buttons */}
              <View style={styles.themeSegmentRow}>
                {THEME_OPTIONS.map((opt) => {
                  const isSelected = themePreference === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      activeOpacity={0.75}
                      style={[
                        styles.themeOptionBtn,
                        {
                          backgroundColor: isSelected
                            ? theme.isDark
                              ? '#388bfd'
                              : '#1f6feb'
                            : theme.headerButtonBg,
                          borderColor: isSelected ? '#58a6ff' : theme.headerButtonBorder,
                        },
                      ]}
                      onPress={() => setThemePreference(opt.id)}
                    >
                      <Text style={styles.themeOptionIcon}>{opt.icon}</Text>
                      <Text
                        style={[
                          styles.themeOptionText,
                          {
                            color: isSelected ? '#ffffff' : theme.headerText,
                            fontWeight: isSelected ? '800' : '600',
                          },
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Power-Off [SHIFT + AC] Settings Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.modalCardInner,
                  borderColor: theme.modalCardBorder,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardIcon}>⚡</Text>
                <Text style={[styles.cardTitle, { color: theme.modalText }]}>
                  Power Off Behavior [SHIFT + AC]
                </Text>
              </View>

              <View style={styles.toggleRow}>
                <View style={styles.toggleTextContainer}>
                  <Text style={[styles.toggleLabel, { color: theme.modalText }]}>
                    Exit App on Power Off
                  </Text>
                  <Text style={[styles.toggleDescription, { color: theme.modalSubtext }]}>
                    {exitAppOnPowerOff
                      ? 'Plays "OPENCALC 99X" banner and exits the application.'
                      : 'Shows "OPENCALC 99X" banner, then puts screen into standby until [ON] is pressed.'}
                  </Text>
                </View>
                <Switch
                  value={exitAppOnPowerOff}
                  onValueChange={onToggleExitAppOnPowerOff}
                  trackColor={{ false: '#767577', true: '#388bfd' }}
                  thumbColor={exitAppOnPowerOff ? '#ffffff' : '#f4f3f4'}
                />
              </View>
            </View>

            {/* Creator Bio Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.modalCardInner,
                  borderColor: theme.modalCardBorder,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardIcon}>👨‍💻</Text>
                <Text style={[styles.cardTitle, { color: theme.modalText }]}>
                  About the Developer
                </Text>
              </View>
              <Text style={[styles.cardBody, { color: theme.modalSubtext }]}>
                Created by <Text style={[styles.boldText, { color: theme.modalText }]}>G Abin Roy</Text>.
              </Text>
              <Text style={[styles.cardBody, { color: theme.modalSubtext, marginTop: 4 }]}>
                Built as a high-fidelity, zero-compromise scientific calculator emulator for STEM students, researchers, and engineers who demand mathematical precision with zero ad tracking.
              </Text>
            </View>

            {/* Support / Buy Me a Coffee Demo Card */}
            <View
              style={[
                styles.coffeeCard,
                {
                  backgroundColor: theme.isDark ? '#231c12' : '#fff9e6',
                  borderColor: theme.isDark ? '#59441a' : '#ffd591',
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardIcon}>☕</Text>
                <Text
                  style={[
                    styles.cardTitle,
                    { color: theme.isDark ? '#ffd591' : '#b36b00' },
                  ]}
                >
                  Support Open-Source Work
                </Text>
              </View>
              <Text
                style={[
                  styles.cardBody,
                  { color: theme.isDark ? '#e0d2bd' : '#734600' },
                ]}
              >
                If OpenCalc 99X helps you in your studies or engineering workflow, consider supporting ongoing maintenance and open-source updates!
              </Text>

              {showThankYou && (
                <View
                  style={[
                    styles.thankYouBanner,
                    { backgroundColor: theme.isDark ? '#1a3826' : '#d4f7db' },
                  ]}
                >
                  <Text
                    style={[
                      styles.thankYouText,
                      { color: theme.isDark ? '#7ee787' : '#1a7f37' },
                    ]}
                  >
                    🎉 Thank you for supporting the developer! (Coffees gifted: {coffeeCount})
                  </Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.coffeeButton,
                  { backgroundColor: '#ff9900' },
                ]}
                onPress={handleBuyCoffee}
              >
                <Text style={styles.coffeeButtonText}>
                  ☕ Buy Me a Coffee {coffeeCount > 0 ? `(${coffeeCount})` : ''}
                </Text>
              </TouchableOpacity>
            </View>

            {/* License & Specifications Card */}
            <View
              style={[
                styles.card,
                {
                  backgroundColor: theme.modalCardInner,
                  borderColor: theme.modalCardBorder,
                },
              ]}
            >
              <View style={styles.cardHeaderRow}>
                <Text style={styles.cardIcon}>📜</Text>
                <Text style={[styles.cardTitle, { color: theme.modalText }]}>
                  License & Attribution
                </Text>
              </View>
              <Text style={[styles.cardBody, { color: theme.modalSubtext }]}>
                • <Text style={styles.boldText}>License:</Text> GNU General Public License v3.0 (GPL-3.0)
              </Text>
              <Text style={[styles.cardBody, { color: theme.modalSubtext, marginTop: 4 }]}>
                • <Text style={styles.boldText}>Engine:</Text> Pure Shunting-Yard Parser (Zero `eval()`)
              </Text>
              <Text style={[styles.cardBody, { color: theme.modalSubtext, marginTop: 4 }]}>
                • <Text style={styles.boldText}>Modes:</Text> 12 Modes (Calculate, Matrix, Vector, Stats, Base-N, Calculus, Complex)
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.githubButton,
                  {
                    backgroundColor: theme.headerButtonBg,
                    borderColor: theme.headerButtonBorder,
                  },
                ]}
                onPress={handleOpenGithub}
              >
                <Text style={[styles.githubButtonText, { color: theme.headerText }]}>
                  ⭐ View on GitHub
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Bottom Close Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.doneButton, { backgroundColor: '#238636' }]}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Back to Calculator</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    marginBottom: 12,
  },
  scrollContent: {
    gap: 12,
  },
  card: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
  },
  coffeeCard: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  cardIcon: {
    fontSize: 18,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  cardBody: {
    fontSize: 12.5,
    lineHeight: 18,
  },
  themeSegmentRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  themeOptionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  themeOptionIcon: {
    fontSize: 14,
  },
  themeOptionText: {
    fontSize: 12.5,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  toggleTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  toggleLabel: {
    fontSize: 13,
    fontWeight: '700',
  },
  toggleDescription: {
    fontSize: 11.5,
    marginTop: 2,
    lineHeight: 15,
  },
  boldText: {
    fontWeight: 'bold',
  },
  thankYouBanner: {
    marginTop: 10,
    padding: 8,
    borderRadius: 6,
  },
  thankYouText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  coffeeButton: {
    marginTop: 12,
    paddingVertical: 11,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  coffeeButtonText: {
    color: '#000000',
    fontWeight: 'bold',
    fontSize: 13.5,
  },
  githubButton: {
    marginTop: 12,
    paddingVertical: 9,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  githubButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  doneButton: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
