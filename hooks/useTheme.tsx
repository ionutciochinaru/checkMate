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

type Theme = 'light' | 'dark' | 'auto';

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

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  animatedBackgroundStyle: any;
  animatedSurfaceStyle: any;
  animatedTextStyle: any;
  fontScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
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
  
  // Apply high contrast theme if enabled
  let colors: ThemeColors;
  if (settings.highContrast) {
    colors = isDark ? darkHighContrastTheme : lightHighContrastTheme;
  } else {
    colors = isDark ? darkTheme : lightTheme;
  }

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
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
      console.error('Failed to save theme:', error);
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
    console.log('🎨 Theme: Settings updated', {
      fontScale: settings.fontScale,
      highContrast: settings.highContrast,
      reducedMotion: settings.reducedMotion
    });
  }, [settings.fontScale, settings.highContrast, settings.reducedMotion]);

  const value: ThemeContextValue = {
    theme,
    colors,
    isDark,
    setTheme,
    animatedBackgroundStyle,
    animatedSurfaceStyle,
    animatedTextStyle,
    fontScale: settings.fontScale,
    highContrast: settings.highContrast,
    reducedMotion: settings.reducedMotion,
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