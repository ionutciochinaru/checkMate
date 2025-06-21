import { Theme } from './types';
import { spacing, typography, elevation, borderRadius } from './base';

export const lightHighContrastTheme: Theme = {
  colors: {
    // Base colors - maximum contrast
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#ffffff',
    border: '#000000',
    
    // Text colors
    text: '#000000',
    textSecondary: '#000000',
    textMuted: '#333333',
    textInverse: '#ffffff',
    
    // Accent colors
    accent: '#000000',
    accentSecondary: '#333333',
    
    // Status colors
    danger: '#cc0000',
    success: '#008800',
    warning: '#ff8800',
    info: '#0088cc',
    
    // Card colors - high contrast
    cardPrimary: [
      '#ffffff',
      '#f8f8f8',
      '#f0f0f0',
      '#e8e8e8',
      '#e0e0e0',
    ],
    cardCompleted: '#ffffff',
    cardText: '#000000',
    cardTextInverse: '#ffffff',
  },
  spacing,
  typography,
  elevation,
  borderRadius,
  isDark: false,
  reducedMotion: false,
};

export const darkHighContrastTheme: Theme = {
  colors: {
    // Base colors - maximum contrast
    background: '#000000',
    surface: '#000000',
    surfaceVariant: '#000000',
    border: '#ff4444',
    
    // Text colors
    text: '#ff4444',
    textSecondary: '#ff4444',
    textMuted: '#cc3333',
    textInverse: '#000000',
    
    // Accent colors
    accent: '#ff4444',
    accentSecondary: '#cc3333',
    
    // Status colors
    danger: '#ff6666',
    success: '#44ff44',
    warning: '#ffaa44',
    info: '#4488ff',
    
    // Card colors - high contrast
    cardPrimary: [
      '#000000',
      '#080808',
      '#101010',
      '#181818',
      '#202020',
    ],
    cardCompleted: '#000000',
    cardText: '#ff4444',
    cardTextInverse: '#000000',
  },
  spacing,
  typography,
  elevation,
  borderRadius,
  isDark: true,
  reducedMotion: false,
};