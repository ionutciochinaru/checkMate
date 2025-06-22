import { Theme } from './types';
import { spacing, typography, elevation, borderRadius } from './base';

export const lightTheme: Theme = {
  colors: {
    background: '#f8f8f6',
    surface: '#ffffff',
    surfaceVariant: '#f0f0ee',
    border: '#c0c0c0',

    text: '#000000',
    textSecondary: '#333333',
    textMuted: '#666666',
    textInverse: '#ffffff',

    accent: '#000000',
    accentSecondary: '#333333',

    danger: '#800000',
    success: '#006400',
    warning: '#ff6600',
    info: '#0066cc',

    cardPrimary: [
      '#FF9025', // darker orange
      '#2185EA', // steel blue
      '#0C1922', // steel blue
      '#F24141', // dark pink
      '#3827FF', // goldenrod
    ],
    cardCompleted: '#6B7280', // dark gray for white text contrast
    cardText: '#313131',
    cardTextInverse: '#ffffff',
    cardTextDark: '#313131',
    cardTextInverseDark: '#ffffff'
  },
  spacing,
  typography,
  elevation,
  borderRadius,
  isDark: false,
  reducedMotion: false,
};