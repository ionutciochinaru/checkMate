import { Theme } from './types';
import { spacing, typography, elevation, borderRadius } from './base';

export const darkTheme: Theme = {
  colors: {
    background: '#000000',
    surface: '#111111',
    surfaceVariant: '#1a1a1a',
    border: '#333333',
    
    text: '#ff4444',
    textSecondary: '#cc3333',
    textMuted: '#882222',
    textInverse: '#000000',
    
    accent: '#ff4444',
    accentSecondary: '#cc3333',
    
    danger: '#ff6666',
    success: '#ff4444',
    warning: '#ffaa44',
    info: '#4488ff',
    
    cardPrimary: [
      '#2a2a2a', // dark gray variation 1
      '#252525', // dark gray variation 2
      '#303030', // dark gray variation 3
      '#1f1f1f', // dark gray variation 4
      '#282828', // dark gray variation 5
    ],
    cardCompleted: '#1a1a1a',
    cardTextDark: '#ff4444',
    cardText: '#ff4444',
    cardTextInverseDark: '#000000',
    cardTextInverse: '#000000',
  },
  spacing,
  typography,
  elevation,
  borderRadius,
  isDark: true,
  reducedMotion: false,
};