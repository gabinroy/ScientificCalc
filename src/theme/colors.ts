export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  mode: ThemeMode;
  background: string[];
  glassBackground: string;
  glassBorder: string;
  glassHighlight: string;
  lcdBackground: string;
  lcdBorder: string;
  lcdText: string;
  lcdSubText: string;
  lcdCursor: string;
  indicatorActive: string;
  indicatorInactive: string;
  
  // Button categories
  btnNumberBg: string;
  btnNumberBorder: string;
  btnNumberText: string;
  
  btnFunctionBg: string;
  btnFunctionBorder: string;
  btnFunctionText: string;
  
  btnShiftBg: string;
  btnShiftText: string;
  btnAlphaBg: string;
  btnAlphaText: string;
  
  btnActionBg: string;
  btnActionBorder: string;
  btnActionText: string;
  
  btnDeleteBg: string;
  btnDeleteText: string;
  
  btnEqualsBg: string;
  btnEqualsText: string;
  
  // Secondary labels
  labelShift: string;
  labelAlpha: string;
  labelOption: string;
  
  modalOverlay: string;
  cardBg: string;
  cardBorder: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}

export const darkTheme: ThemeColors = {
  mode: 'dark',
  background: ['#0A0E17', '#101726', '#1A1429'],
  glassBackground: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassHighlight: 'rgba(255, 255, 255, 0.2)',
  
  lcdBackground: 'rgba(15, 25, 20, 0.85)',
  lcdBorder: 'rgba(52, 211, 153, 0.25)',
  lcdText: '#A7F3D0',
  lcdSubText: '#6EE7B7',
  lcdCursor: '#34D399',
  indicatorActive: '#FBBF24',
  indicatorInactive: 'rgba(255, 255, 255, 0.2)',
  
  btnNumberBg: 'rgba(255, 255, 255, 0.08)',
  btnNumberBorder: 'rgba(255, 255, 255, 0.14)',
  btnNumberText: '#F8FAFC',
  
  btnFunctionBg: 'rgba(30, 41, 59, 0.7)',
  btnFunctionBorder: 'rgba(71, 85, 105, 0.4)',
  btnFunctionText: '#CBD5E1',
  
  btnShiftBg: 'rgba(245, 158, 11, 0.25)',
  btnShiftText: '#FBBF24',
  btnAlphaBg: 'rgba(239, 68, 68, 0.25)',
  btnAlphaText: '#F87171',
  
  btnActionBg: 'rgba(14, 165, 233, 0.2)',
  btnActionBorder: 'rgba(56, 189, 248, 0.4)',
  btnActionText: '#7DD3FC',
  
  btnDeleteBg: 'rgba(239, 68, 68, 0.3)',
  btnDeleteText: '#FEF2F2',
  
  btnEqualsBg: 'rgba(16, 185, 129, 0.4)',
  btnEqualsText: '#ECFDF5',
  
  labelShift: '#FBBF24',
  labelAlpha: '#F87171',
  labelOption: '#94A3B8',
  
  modalOverlay: 'rgba(0, 0, 0, 0.75)',
  cardBg: 'rgba(15, 23, 42, 0.92)',
  cardBorder: 'rgba(255, 255, 255, 0.15)',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  accent: '#38BDF8',
};

export const lightTheme: ThemeColors = {
  mode: 'light',
  background: ['#E0E7FF', '#F1F5F9', '#E2E8F0'],
  glassBackground: 'rgba(255, 255, 255, 0.65)',
  glassBorder: 'rgba(255, 255, 255, 0.8)',
  glassHighlight: 'rgba(255, 255, 255, 0.95)',
  
  lcdBackground: 'rgba(236, 253, 245, 0.9)',
  lcdBorder: 'rgba(16, 185, 129, 0.35)',
  lcdText: '#064E3B',
  lcdSubText: '#047857',
  lcdCursor: '#059669',
  indicatorActive: '#D97706',
  indicatorInactive: 'rgba(0, 0, 0, 0.2)',
  
  btnNumberBg: 'rgba(255, 255, 255, 0.85)',
  btnNumberBorder: 'rgba(203, 213, 225, 0.8)',
  btnNumberText: '#0F172A',
  
  btnFunctionBg: 'rgba(241, 245, 249, 0.85)',
  btnFunctionBorder: 'rgba(203, 213, 225, 0.8)',
  btnFunctionText: '#334155',
  
  btnShiftBg: 'rgba(251, 191, 36, 0.3)',
  btnShiftText: '#B45309',
  btnAlphaBg: 'rgba(254, 202, 202, 0.5)',
  btnAlphaText: '#B91C1C',
  
  btnActionBg: 'rgba(224, 242, 254, 0.9)',
  btnActionBorder: 'rgba(125, 211, 252, 0.8)',
  btnActionText: '#0369A1',
  
  btnDeleteBg: 'rgba(254, 226, 226, 0.95)',
  btnDeleteText: '#991B1B',
  
  btnEqualsBg: 'rgba(209, 250, 229, 0.95)',
  btnEqualsText: '#065F46',
  
  labelShift: '#D97706',
  labelAlpha: '#DC2626',
  labelOption: '#64748B',
  
  modalOverlay: 'rgba(15, 23, 42, 0.45)',
  cardBg: 'rgba(255, 255, 255, 0.95)',
  cardBorder: 'rgba(255, 255, 255, 0.9)',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  accent: '#0284C7',
};
