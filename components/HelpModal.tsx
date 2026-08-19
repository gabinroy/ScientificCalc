import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface HelpModalProps {
  visible: boolean;
  onClose: () => void;
}

/**
 * components/HelpModal.tsx
 *
 * Interactive Quick Guide & Reference for OpenCalc 99X.
 * Explains D-pad History Navigation, SHIFT/ALPHA secondary logic, and 12 calculation modes.
 */
export const HelpModal: React.FC<HelpModalProps> = ({ visible, onClose }) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <SafeAreaView style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>OpenCalc 99X Guide</Text>
              <Text style={styles.headerSubtitle}>Quick-Start & Operation Manual</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.closeButton}
              onPress={onClose}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Guide Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Section 1: D-Pad History & Replay */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionIcon}>🕹️</Text>
                <Text style={styles.sectionTitle}>History Tape & D-Pad Replay</Text>
              </View>
              <Text style={styles.sectionBody}>
                The calculator automatically tracks your calculation history in real time:
              </Text>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletBold}>▲ Up / ▼ Down:</Text>
                <Text style={styles.bulletText}>
                  Scroll backward and forward through previous expressions.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletBold}>◀ Left / ▶ Right:</Text>
                <Text style={styles.bulletText}>
                  Load the selected history entry directly into the active input line for editing.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletBold}>📜 History Tape:</Text>
                <Text style={styles.bulletText}>
                  Tap the Tape button (top header) to open a slide-down visual log of all past calculations.
                </Text>
              </View>
            </View>

            {/* Section 2: SHIFT & ALPHA Secondary Keys */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionIcon}>⌨️</Text>
                <Text style={styles.sectionTitle}>SHIFT & ALPHA Secondary Functions</Text>
              </View>
              <Text style={styles.sectionBody}>
                Access alternate functions marked above each physical keycap:
              </Text>
              <View style={styles.bulletItem}>
                <Text style={[styles.bulletBold, { color: '#ffd700' }]}>[SHIFT] (Yellow):</Text>
                <Text style={styles.bulletText}>
                  Activates inverse trigonometry (sin⁻¹, cos⁻¹, tan⁻¹), factorial (x!), permutations (nPr), combinations (nCr), cube roots (³√), and π.
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={[styles.bulletBold, { color: '#ff6b6b' }]}>[ALPHA] (Red):</Text>
                <Text style={styles.bulletText}>
                  Types memory variables (A, B, C, D, E, F, M, x, y) and Euler's constant (e).
                </Text>
              </View>
              <View style={styles.bulletItem}>
                <Text style={styles.bulletBold}>[STO] / [M+]:</Text>
                <Text style={styles.bulletText}>
                  Store results into variables (e.g. STO → A) or accumulate totals with M+ / M-.
                </Text>
              </View>
            </View>

            {/* Section 3: 12 Calculation Modes */}
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionIcon}>⚙️</Text>
                <Text style={styles.sectionTitle}>12 Supported Modes (Press [MENU])</Text>
              </View>
              <View style={styles.modeGrid}>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>1. Calculate:</Text> Standard scientific & fraction arithmetic</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>2. Complex:</Text> Complex numbers (a+bi & polar)</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>3. Base-N:</Text> Binary, Octal, Decimal, Hexadecimal conversion</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>4. Matrix:</Text> 2x2 & 3x3 Determinants & operations</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>5. Vector:</Text> Dot product & vector calculations</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>6. Statistics:</Text> 1-variable stats (mean, Σx, σx, sx)</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>7. Distribution:</Text> Normal / Binomial / Poisson distributions</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>8. Spreadsheet:</Text> Mini grid evaluation</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>9. Table:</Text> f(x) number table generation</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>A. Equation:</Text> Simultaneous linear & polynomial roots</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>B. Inequality:</Text> Polynomial inequality solutions</Text>
                <Text style={styles.modeItem}><Text style={styles.modeBold}>C. Ratio:</Text> A:B = X:D proportions</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Close Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.doneButton}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Close Guide</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#18191d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '88%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderColor: '#30343f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2b2f3a',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8e94a5',
    marginTop: 2,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#262933',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    marginBottom: 12,
  },
  scrollContent: {
    gap: 14,
  },
  sectionCard: {
    backgroundColor: '#20232c',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2f3442',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f0f3f8',
  },
  sectionBody: {
    fontSize: 12,
    color: '#9aa0b4',
    lineHeight: 18,
    marginBottom: 8,
  },
  bulletItem: {
    marginBottom: 6,
  },
  bulletBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#61dafb',
  },
  bulletText: {
    fontSize: 12,
    color: '#cbd2e1',
    lineHeight: 16,
    marginTop: 1,
  },
  modeGrid: {
    gap: 6,
  },
  modeItem: {
    fontSize: 11.5,
    color: '#c0c7d6',
    lineHeight: 16,
  },
  modeBold: {
    fontWeight: 'bold',
    color: '#58a6ff',
  },
  doneButton: {
    backgroundColor: '#238636',
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
