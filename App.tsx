import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IntroScreen, FIRST_LAUNCH_KEY } from './screens/IntroScreen';
import { CalculatorScreen } from './screens/CalculatorScreen';
import { ThemeProvider } from './ThemeContext';
import { WebDeviceFrame } from './components/WebDeviceFrame';

/**
 * App.tsx
 *
 * Root component and state provider for OpenCalc 99X.
 *
 * Constraints implemented:
 * 1. Strict portrait mode locking using expo-screen-orientation.
 * 2. First-launch tutorial check persisted via AsyncStorage.
 * 3. SafeAreaProvider for cross-platform modern layout.
 * 4. ThemeProvider wrapping for automatic and user-selected Light/Dark theming.
 * 5. WebDeviceFrame wrapping on desktop web browsers with iOS & Android frame simulation.
 */
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);

  useEffect(() => {
    // 1. Lock screen strictly to portrait mode. Landscape orientation is forbidden.
    async function lockOrientation() {
      try {
        await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
      } catch (err) {
        console.warn('Screen orientation lock error:', err);
      }
    }

    // 2. Check AsyncStorage for first launch state
    async function checkFirstLaunch() {
      try {
        const value = await AsyncStorage.getItem(FIRST_LAUNCH_KEY);
        if (value === null) {
          setIsFirstLaunch(true);
        } else {
          setIsFirstLaunch(false);
        }
      } catch (e) {
        console.warn('Failed to read launch status from AsyncStorage', e);
        setIsFirstLaunch(false);
      } finally {
        setIsLoading(false);
      }
    }

    lockOrientation();
    checkFirstLaunch();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#61dafb" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <WebDeviceFrame>
          {isFirstLaunch ? (
            <IntroScreen onDismiss={() => setIsFirstLaunch(false)} />
          ) : (
            <CalculatorScreen />
          )}
        </WebDeviceFrame>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0d1117',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
