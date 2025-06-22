import { Theme } from './types';
import { spacing, typography, elevation, borderRadius } from './base';

export const lightTheme: Theme = {
  colors: {
    // Base colors
    background: '#f8f8f6',
    surface: '#ffffff',
    surfaceVariant: '#f0f0ee',
    border: '#c0c0c0',
    
    // Text colors
    text: '#000000',
    textSecondary: '#333333',
    textMuted: '#666666',
    textInverse: '#ffffff',
    
    // Accent colors
    accent: '#000000',
    accentSecondary: '#333333',
    
    // Status colors
    danger: '#800000',
    success: '#006400',
    warning: '#ff6600',
    info: '#0066cc',
    
    // Card colors - darker vibrant palette for white text contrast
    cardPrimary: [
      '#D2691E', // darker orange
      '#4682B4', // steel blue
      '#8B8B00', // dark yellow
      '#B22A6B', // dark pink
      '#DAA520', // goldenrod
    ],
    cardCompleted: '#6B7280', // dark gray for white text contrast
    cardText: '#313131',
    cardTextInverse: '#ffffff',
  },
  spacing,
  typography,
  elevation,
  borderRadius,
  isDark: false,
  reducedMotion: false,
};