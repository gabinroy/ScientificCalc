import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';

export type DeviceFrameType = 'iphone' | 'pixel' | 'none';

interface WebDeviceFrameProps {
  children: React.ReactNode;
}

/**
 * components/WebDeviceFrame.tsx
 *
 * Provides a responsive container across all form factors:
 * 1. Mobile Phones (iOS/Android native & mobile web <500px): Pure native full-screen.
 * 2. Tablets (iPads, Android Tablets & tablet web): Clean hardware-centered chassis (maxWidth: 480px) without fake phone notches.
 * 3. Desktop Web Browsers: Interactive device simulator with iOS Dynamic Island, Android Pixel Punch-Hole & Borderless toggles.
 */
export const WebDeviceFrame: React.FC<WebDeviceFrameProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();
  const { theme } = useTheme();
  const [deviceType, setDeviceType] = useState<DeviceFrameType>('iphone');

  // Detect tablet or wide screen
  const isTabletOrWide = width >= 500;
  const isPadNative = Platform.OS === 'ios' && Platform.isPad;
  const isAndroidTablet = Platform.OS === 'android' && width >= 600;

  // 1. Mobile Phones: Render standard native layout
  if (!isTabletOrWide && !isPadNative && !isAndroidTablet) {
    return <View style={styles.nativeContainer}>{children}</View>;
  }

  // 2. Native iPad or Android Tablet (Installed App):
  // Renders a sleek, centered calculator column with authentic physical hardware ergonomics
  if (isPadNative || isAndroidTablet) {
    return (
      <View style={[styles.tabletBackdrop, { backgroundColor: theme.isDark ? '#0b0c10' : '#d0d6e0' }]}>
        <View
          style={[
            styles.tabletChassis,
            {
              backgroundColor: theme.background,
              borderColor: theme.isDark ? '#262a34' : '#b8c0cc',
            },
          ]}
        >
          {children}
        </View>
      </View>
    );
  }

  // 3. Desktop Web Simulator (when on web browser width >= 500)
  const calculatedHeight = Math.min(850, Math.max(720, height - 80));

  return (
    <View style={styles.webBackdrop}>
      {/* Top Floating Web Toolbar */}
      <View style={styles.toolbarWrapper}>
        <View style={styles.toggleButtonGroup}>
          {/* iOS iPhone Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.toggleBtn,
              deviceType === 'iphone' && styles.toggleBtnActive,
            ]}
            onPress={() => setDeviceType('iphone')}
          >
            <Ionicons
              name="logo-apple"
              size={14}
              color={deviceType === 'iphone' ? '#ffffff' : '#8b949e'}
            />
            <Text
              style={[
                styles.toggleBtnText,
                deviceType === 'iphone' && styles.toggleBtnTextActive,
              ]}
            >
              iOS
            </Text>
          </TouchableOpacity>

          {/* Android Pixel Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.toggleBtn,
              deviceType === 'pixel' && styles.toggleBtnActive,
            ]}
            onPress={() => setDeviceType('pixel')}
          >
            <Ionicons
              name="logo-android"
              size={15}
              color={deviceType === 'pixel' ? '#ffffff' : '#8b949e'}
            />
            <Text
              style={[
                styles.toggleBtnText,
                deviceType === 'pixel' && styles.toggleBtnTextActive,
              ]}
            >
              Android
            </Text>
          </TouchableOpacity>

          {/* Borderless Button */}
          <TouchableOpacity
            activeOpacity={0.75}
            style={[
              styles.toggleBtn,
              deviceType === 'none' && styles.toggleBtnActive,
            ]}
            onPress={() => setDeviceType('none')}
          >
            <MaterialCommunityIcons
              name="cellphone"
              size={15}
              color={deviceType === 'none' ? '#ffffff' : '#8b949e'}
            />
            <Text
              style={[
                styles.toggleBtnText,
                deviceType === 'none' && styles.toggleBtnTextActive,
              ]}
            >
              Borderless
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Outer Phone Hardware Chassis with Ambient Glow */}
      <View
        style={[
          styles.deviceFrame,
          { height: calculatedHeight },
          deviceType === 'iphone' && styles.iphoneFrame,
          deviceType === 'pixel' && styles.pixelFrame,
          deviceType === 'none' && styles.borderlessFrame,
        ]}
      >
        {/* Dynamic Island / Punch Hole Notch */}
        {deviceType === 'iphone' && (
          <View style={styles.islandWrapper}>
            <View style={styles.dynamicIsland}>
              <View style={styles.islandCameraLens} />
            </View>
          </View>
        )}

        {deviceType === 'pixel' && (
          <View style={styles.punchHoleWrapper}>
            <View style={styles.punchHole} />
          </View>
        )}

        {/* Screen Content */}
        <View style={styles.screenInner}>{children}</View>

        {/* Bottom Gesture Navigation Bar */}
        {deviceType === 'iphone' && (
          <View style={styles.homeIndicatorWrapper} pointerEvents="none">
            <View style={styles.iosHomeIndicator} />
          </View>
        )}

        {deviceType === 'pixel' && (
          <View style={styles.homeIndicatorWrapper} pointerEvents="none">
            <View style={styles.androidHomeIndicator} />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  nativeContainer: {
    flex: 1,
  },
  tabletBackdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletChassis: {
    width: '100%',
    maxWidth: 480,
    flex: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  webBackdrop: {
    flex: 1,
    backgroundColor: '#07090e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  toolbarWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  toggleButtonGroup: {
    flexDirection: 'row',
    backgroundColor: '#161b22',
    padding: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#30363d',
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#1f6feb',
    shadowColor: '#1f6feb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  toggleBtnText: {
    color: '#8b949e',
    fontSize: 12,
    fontWeight: '600',
  },
  toggleBtnTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  deviceFrame: {
    width: 395,
    backgroundColor: '#000000',
    overflow: 'hidden',
    shadowColor: '#388bfd',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.18,
    shadowRadius: 36,
    elevation: 25,
  },
  iphoneFrame: {
    borderRadius: 50,
    borderWidth: 10,
    borderColor: '#24292f',
  },
  pixelFrame: {
    borderRadius: 36,
    borderWidth: 9,
    borderColor: '#1c2128',
  },
  borderlessFrame: {
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#30363d',
  },
  islandWrapper: {
    position: 'absolute',
    top: 7,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  dynamicIsland: {
    width: 96,
    height: 22,
    backgroundColor: '#000000',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 8,
  },
  islandCameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0d1117',
    borderWidth: 1,
    borderColor: '#1f242c',
  },
  punchHoleWrapper: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  punchHole: {
    width: 11,
    height: 11,
    backgroundColor: '#000000',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#1c2128',
  },
  screenInner: {
    flex: 1,
  },
  homeIndicatorWrapper: {
    position: 'absolute',
    bottom: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  iosHomeIndicator: {
    width: 110,
    height: 3.5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  androidHomeIndicator: {
    width: 55,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 2,
  },
});
