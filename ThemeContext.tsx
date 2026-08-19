import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ActiveColorScheme = 'light' | 'dark';

export const THEME_PREF_KEY = '@opencalc_theme_preference_v1';

export interface ThemeColors {
  isDark: boolean;
  background: string;
  headerBackground: string;
  headerBorder: string;
  headerText: string;
  headerSubtext: string;
  headerButtonBg: string;
  headerButtonBorder: string;
  keypadBackground: string;
  
  // LCD Screen Colors
  lcdBackground: string;
  lcdBorder: string;
  lcdStatusDefault: string;
  lcdStatusActive: string;
  lcdStatusAlpha: string;
  lcdText: string;
  lcdResult: string;
  lcdError: string;
  
  // D-Pad
  dpadOuterBg: string;
  dpadBorder: string;
  dpadArrow: string;
  dpadCenterText: string;
  
  // Keycaps
  keyCapFuncBg: string;
  keyCapFuncBorder: string;
  keyCapNumBg: string;
  keyCapNumBorder: string;
  keyCapActionBg: string;
  keyCapActionBorder: string;
  keyCapAccentBg: string;
  keyCapAccentBorder: string;
  
  // Labels
  labelFunc: string;
  labelNum: string;
  labelAction: string;
  labelAccent: string;
  subLabelText: string;
  
  // Badges (Shift & Alpha) - clean, distinct normal and active brighter colors
  shiftText: string;
  shiftActive: string;
  alphaText: string;
  alphaActive: string;
  
  // History & Modals
  tapePanelBg: string;
  tapeBorder: string;
  tapeItemBorder: string;
  tapeExpr: string;
  tapeResult: string;
  modalOverlay: string;
  modalCardBg: string;
  modalCardBorder: string;
  modalText: string;
  modalSubtext: string;
  modalCardInner: string;
}

export const DarkTheme: ThemeColors = {
  isDark: true,
  background: '#121316',
  headerBackground: '#121316',
  headerBorder: '#202228',
  headerText: '#ffffff',
  headerSubtext: '#b0b6c2',
  headerButtonBg: '#20232b',
  headerButtonBorder: '#303644',
  keypadBackground: '#1b1b1d',
  
  lcdBackground: '#9fae92',
  lcdBorder: '#242426',
  lcdStatusDefault: 'rgba(20, 30, 20, 0.25)',
  lcdStatusActive: '#1a261a',
  lcdStatusAlpha: '#b91c1c',
  lcdText: '#111e11',
  lcdResult: '#0d1a0d',
  lcdError: '#7a1212',
  
  dpadOuterBg: '#2b2c30',
  dpadBorder: '#42454a',
  dpadArrow: '#cbd0de',
  dpadCenterText: '#8e929b',
  
  keyCapFuncBg: '#303238',
  keyCapFuncBorder: '#191a1d',
  keyCapNumBg: '#e3e6eb',
  keyCapNumBorder: '#9ca1aa',
  keyCapActionBg: '#1f5f8b',
  keyCapActionBorder: '#0f3148',
  keyCapAccentBg: '#40434b',
  keyCapAccentBorder: '#24252a',
  
  labelFunc: '#f0f2f5',
  labelNum: '#1a1c1e',
  labelAction: '#ffffff',
  labelAccent: '#f1f1f1',
  subLabelText: '#9aa0a6',
  
  // Normal muted vs Active bright solid font color
  shiftText: '#a38a35',
  shiftActive: '#ffea00',
  alphaText: '#a84444',
  alphaActive: '#ff4050',
  
  tapePanelBg: '#1a1d24',
  tapeBorder: '#388bfd',
  tapeItemBorder: '#262a33',
  tapeExpr: '#cbd2e0',
  tapeResult: '#7ee787',
  modalOverlay: 'rgba(0,0,0,0.75)',
  modalCardBg: '#18191d',
  modalCardBorder: '#30343f',
  modalText: '#f0f3f8',
  modalSubtext: '#9aa0b4',
  modalCardInner: '#20232c',
};

export const LightTheme: ThemeColors = {
  isDark: false,
  background: '#e9edf2',
  headerBackground: '#dbe0e8',
  headerBorder: '#c4cbda',
  headerText: '#16191f',
  headerSubtext: '#4d5360',
  headerButtonBg: '#cfd6e2',
  headerButtonBorder: '#b0bacb',
  keypadBackground: '#d5dae2',
  
  lcdBackground: '#c5d3bd',
  lcdBorder: '#9da5b2',
  lcdStatusDefault: 'rgba(30, 45, 30, 0.25)',
  lcdStatusActive: '#0f1f0f',
  lcdStatusAlpha: '#c51010',
  lcdText: '#0f1c0f',
  lcdResult: '#081208',
  lcdError: '#8b1212',
  
  dpadOuterBg: '#b8c0cc',
  dpadBorder: '#96a0b2',
  dpadArrow: '#2d3340',
  dpadCenterText: '#444d5c',
  
  keyCapFuncBg: '#444852',
  keyCapFuncBorder: '#2e3138',
  keyCapNumBg: '#ffffff',
  keyCapNumBorder: '#b3bac6',
  keyCapActionBg: '#1d6fa5',
  keyCapActionBorder: '#12486c',
  keyCapAccentBg: '#595e6b',
  keyCapAccentBorder: '#3d414a',
  
  labelFunc: '#ffffff',
  labelNum: '#111418',
  labelAction: '#ffffff',
  labelAccent: '#ffffff',
  subLabelText: '#727986',
  
  // Normal muted vs Active bright solid font color for light theme
  shiftText: '#997500',
  shiftActive: '#d98200',
  alphaText: '#aa2a2a',
  alphaActive: '#e60000',
  
  tapePanelBg: '#f3f6fa',
  tapeBorder: '#0969da',
  tapeItemBorder: '#d0d7de',
  tapeExpr: '#24292f',
  tapeResult: '#1a7f37',
  modalOverlay: 'rgba(0,0,0,0.5)',
  modalCardBg: '#ffffff',
  modalCardBorder: '#d0d7de',
  modalText: '#1f2328',
  modalSubtext: '#57606a',
  modalCardInner: '#f6f8fa',
};

interface ThemeContextType {
  theme: ThemeColors;
  colorScheme: ActiveColorScheme;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: DarkTheme,
  colorScheme: 'dark',
  themePreference: 'system',
  setThemePreference: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    async function loadThemePref() {
      try {
        const savedPref = await AsyncStorage.getItem(THEME_PREF_KEY);
        if (savedPref === 'light' || savedPref === 'dark' || savedPref === 'system') {
          setThemePreferenceState(savedPref);
        }
      } catch (err) {
        console.warn('Failed to load theme preference from AsyncStorage', err);
      }
    }
    loadThemePref();
  }, []);

  const setThemePreference = async (pref: ThemePreference) => {
    setThemePreferenceState(pref);
    try {
      await AsyncStorage.setItem(THEME_PREF_KEY, pref);
    } catch (err) {
      console.warn('Failed to save theme preference', err);
    }
  };

  const activeColorScheme: ActiveColorScheme = useMemo(() => {
    if (themePreference === 'light') return 'light';
    if (themePreference === 'dark') return 'dark';
    return systemColorScheme === 'light' ? 'light' : 'dark';
  }, [themePreference, systemColorScheme]);

  const theme = useMemo(() => {
    return activeColorScheme === 'light' ? LightTheme : DarkTheme;
  }, [activeColorScheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme: activeColorScheme,
        themePreference,
        setThemePreference,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
