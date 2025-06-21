import { ThemeSpacing, ThemeTypography, ThemeElevation, ThemeBorderRadius } from './types';

// Base spacing system (8pt grid)
export const spacing: ThemeSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography system
export const typography: ThemeTypography = {
  fontFamily: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    bold: 'JetBrainsMono_700Bold',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: 1.2,
};

// Elevation/Shadow system
export const elevation: ThemeElevation = {
  none: 0,
  low: 2,
  medium: 4,
  high: 8,
};

// Border radius system
export const borderRadius: ThemeBorderRadius = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};