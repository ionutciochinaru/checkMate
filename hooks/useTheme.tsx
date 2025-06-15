import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';
import { useMainStore } from './useTaskStore';
import { getThemeFonts, getThemeTextStyles, getThemeBorderRadius, getThemeElevation } from '../utils/theme-fonts';

type Theme = 'light' | 'dark' | 'auto';
type ThemeStyle = 'terminal' | 'y2k' | 'material';

interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;
  border: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  danger: string;
  success: string;
  warning: string;
  // Y2K accent colors remain the same
  y2kPink: string;
  y2kCyan: string;
  y2kLime: string;
  y2kPurple: string;
}

const lightTheme: ThemeColors = {
  background: '#f8f8f6',
  surface: '#ffffff', 
  surfaceVariant: '#f0f0ee',
  border: '#c0c0c0',
  text: '#000000',
  textSecondary: '#333333',
  textMuted: '#666666',
  accent: '#000000',
  danger: '#800000',
  success: '#006400',
  warning: '#ff6600',
  // Minimal Y2K accents for e-ink aesthetic
  y2kPink: '#cc3366',
  y2kCyan: '#006666', 
  y2kLime: '#009900',
  y2kPurple: '#663399',
};

const darkTheme: ThemeColors = {
  background: '#000000',
  surface: '#111111',
  surfaceVariant: '#1a1a1a',
  border: '#333333',
  text: '#00ff00',
  textSecondary: '#00cc00',
  textMuted: '#008800',
  accent: '#00ff00',
  danger: '#ff0000',
  success: '#00ff00',
  warning: '#ffff00',
  // Terminal-style Y2K accents
  y2kPink: '#ff00ff',
  y2kCyan: '#00ffff',
  y2kLime: '#00ff00', 
  y2kPurple: '#8000ff',
};

const darkHighContrastTheme: ThemeColors = {
  background: '#000000',
  surface: '#000000',
  surfaceVariant: '#000000',
  border: '#ffffff',
  text: '#ffffff',
  textSecondary: '#ffffff',
  textMuted: '#cccccc',
  accent: '#ffffff',
  danger: '#ff0000',
  success: '#00ff00',
  warning: '#ffff00',
  y2kPink: '#ff00ff',
  y2kCyan: '#00ffff',
  y2kLime: '#00ff00',
  y2kPurple: '#8000ff',
};

const lightHighContrastTheme: ThemeColors = {
  background: '#ffffff',
  surface: '#ffffff',
  surfaceVariant: '#ffffff',
  border: '#000000',
  text: '#000000',
  textSecondary: '#000000',
  textMuted: '#333333',
  accent: '#000000',
  danger: '#cc0000',
  success: '#006600',
  warning: '#cc6600',
  y2kPink: '#cc0066',
  y2kCyan: '#006666',
  y2kLime: '#009900',
  y2kPurple: '#663399',
};

// Material Design 3 Light Theme
const materialLightTheme: ThemeColors = {
  background: '#FFFBFE',
  surface: '#FFFBFE',
  surfaceVariant: '#F4EFF4',
  border: '#79747E',
  text: '#1D1B20',
  textSecondary: '#49454F',
  textMuted: '#73777F',
  accent: '#6750A4',
  danger: '#BA1A1A',
  success: '#146C2E',
  warning: '#7D5260',
  // Y2K colors adapted for Material Design
  y2kPink: '#8E4EC6',
  y2kCyan: '#006A6B',
  y2kLime: '#4F6F52',
  y2kPurple: '#6750A4',
};

// Material Design 3 Dark Theme  
const materialDarkTheme: ThemeColors = {
  background: '#141218',
  surface: '#141218',
  surfaceVariant: '#49454F',
  border: '#938F99',
  text: '#E6E0E9',
  textSecondary: '#CAC4D0',
  textMuted: '#938F99',
  accent: '#D0BCFF',
  danger: '#FFB4AB',
  success: '#4F7942',
  warning: '#EFB8C8',
  // Y2K colors adapted for Material Design dark
  y2kPink: '#D0BCFF',
  y2kCyan: '#4FD3C4',
  y2kLime: '#B7D3BA',
  y2kPurple: '#D0BCFF',
};

// Material Design 3 High Contrast Light
const materialLightHighContrastTheme: ThemeColors = {
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F4EFF4',
  border: '#000000',
  text: '#000000',
  textSecondary: '#2E2E2E',
  textMuted: '#5F5F5F',
  accent: '#4A148C',
  danger: '#BF0000',
  success: '#0F5132',
  warning: '#5D4037',
  y2kPink: '#7B1FA2',
  y2kCyan: '#00695C',
  y2kLime: '#2E7D32',
  y2kPurple: '#4A148C',
};

// Material Design 3 High Contrast Dark
const materialDarkHighContrastTheme: ThemeColors = {
  background: '#000000',
  surface: '#000000',
  surfaceVariant: '#2E2E2E',
  border: '#FFFFFF',
  text: '#FFFFFF',
  textSecondary: '#FFFFFF',
  textMuted: '#CCCCCC',
  accent: '#EADDFF',
  danger: '#FFCCCB',
  success: '#A8E6A3',
  warning: '#FFCCCB',
  y2kPink: '#EADDFF',
  y2kCyan: '#A7FFEB',
  y2kLime: '#C8E6C9',
  y2kPurple: '#EADDFF',
};

interface ThemeContextValue {
  theme: Theme;
  themeStyle: ThemeStyle;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setThemeStyle: (themeStyle: ThemeStyle) => void;
  animatedBackgroundStyle: any;
  animatedSurfaceStyle: any;
  animatedTextStyle: any;
  fontScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
  // Theme utilities
  fonts: ReturnType<typeof getThemeFonts>;
  textStyles: ReturnType<typeof getThemeTextStyles>;
  borderRadius: number;
  getElevation: (level?: 'low' | 'medium' | 'high') => ReturnType<typeof getThemeElevation>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [themeStyle, setThemeStyleState] = useState<ThemeStyle>('terminal');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  
  // Get settings directly from main store and subscribe to changes
  const mainStore = useMainStore();
  const settings = mainStore.isInitialized ? mainStore.settings : {
    fontScale: 1.0,
    highContrast: false,
    reducedMotion: false
  };

  // Animated values for smooth transitions
  const backgroundProgress = useSharedValue(0);
  const surfaceProgress = useSharedValue(0);
  const textProgress = useSharedValue(0);

  const isDark = theme === 'dark' || (theme === 'auto' && systemColorScheme === 'dark');
  
  // Apply theme style and high contrast
  let colors: ThemeColors;
  
  switch (themeStyle) {
    case 'material':
      if (settings.highContrast) {
        colors = isDark ? materialDarkHighContrastTheme : materialLightHighContrastTheme;
      } else {
        colors = isDark ? materialDarkTheme : materialLightTheme;
      }
      break;
    case 'y2k':
      // Y2K theme uses the original light/dark themes with Y2K styling
      if (settings.highContrast) {
        colors = isDark ? darkHighContrastTheme : lightHighContrastTheme;
      } else {
        colors = isDark ? darkTheme : lightTheme;
      }
      break;
    case 'terminal':
    default:
      if (settings.highContrast) {
        colors = isDark ? darkHighContrastTheme : lightHighContrastTheme;
      } else {
        colors = isDark ? darkTheme : lightTheme;
      }
      break;
  }

  // Load saved theme and themeStyle on mount
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedThemeStyle = await AsyncStorage.getItem('themeStyle');
        
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
        
        if (savedThemeStyle && ['terminal', 'y2k', 'material'].includes(savedThemeStyle)) {
          setThemeStyleState(savedThemeStyle as ThemeStyle);
        }
      } catch (error) {
        // Use default theme
      }
    };
    loadThemeSettings();
  }, []);

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription?.remove();
  }, []);

  // Animate theme transitions (respect reduced motion setting)
  useEffect(() => {
    const targetValue = isDark ? 1 : 0;
    const duration = settings.reducedMotion ? 0 : 300;
    backgroundProgress.value = withTiming(targetValue, { duration });
    surfaceProgress.value = withTiming(targetValue, { duration });
    textProgress.value = withTiming(targetValue, { duration });
  }, [isDark, settings.reducedMotion, backgroundProgress, surfaceProgress, textProgress]);

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem('theme', newTheme);
    } catch (error) {
      // Silently fail theme save
    }
  };

  const setThemeStyle = async (newThemeStyle: ThemeStyle) => {
    setThemeStyleState(newThemeStyle);
    try {
      await AsyncStorage.setItem('themeStyle', newThemeStyle);
    } catch (error) {
      // Silently fail theme style save
    }
  };

  // Animated styles for smooth transitions
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      backgroundProgress.value,
      [0, 1],
      [lightTheme.background, darkTheme.background]
    ),
  }));

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      surfaceProgress.value,
      [0, 1],
      [lightTheme.surface, darkTheme.surface]
    ),
    borderColor: interpolateColor(
      surfaceProgress.value,
      [0, 1],
      [lightTheme.border, darkTheme.border]
    ),
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      textProgress.value,
      [0, 1],
      [lightTheme.text, darkTheme.text]
    ),
  }));

  // React to settings changes from main store
  useEffect(() => {
    // Colors will automatically update when settings change because
    // we're getting settings directly from the store
  }, [settings.fontScale, settings.highContrast, settings.reducedMotion]);

  // Theme utilities
  const fonts = getThemeFonts(themeStyle);
  const textStyles = getThemeTextStyles(themeStyle);
  const borderRadius = getThemeBorderRadius(themeStyle);
  const getElevation = (level: 'low' | 'medium' | 'high' = 'medium') => 
    getThemeElevation(themeStyle, level);

  const value: ThemeContextValue = {
    theme,
    themeStyle,
    colors,
    isDark,
    setTheme,
    setThemeStyle,
    animatedBackgroundStyle,
    animatedSurfaceStyle,
    animatedTextStyle,
    fontScale: settings.fontScale,
    highContrast: settings.highContrast,
    reducedMotion: settings.reducedMotion,
    fonts,
    textStyles,
    borderRadius,
    getElevation,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme-aware hook for creating dynamic styles with accessibility support
export const useThemedStyles = <T extends Record<string, any>>(
  styleFactory: (colors: ThemeColors, isDark: boolean, fontScale: number, reducedMotion: boolean) => T
): T => {
  const { colors, isDark, fontScale, reducedMotion } = useTheme();
  return styleFactory(colors, isDark, fontScale, reducedMotion);
};