export interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  
  accent: string;
  accentSecondary: string;
  
  danger: string;
  success: string;
  warning: string;
  info: string;
  
  cardPrimary: string[];
  cardCompleted: string;
  cardText: string;
  cardTextDark: string;
  cardTextInverse: string;
  cardTextInverseDark: string;
}

export interface ThemeSpacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeTypography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: number;
}

export interface ThemeElevation {
  none: number;
  low: number;
  medium: number;
  high: number;
}

export interface ThemeBorderRadius {
  none: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: ThemeTypography;
  elevation: ThemeElevation;
  borderRadius: ThemeBorderRadius;
  isDark: boolean;
  reducedMotion: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'auto';