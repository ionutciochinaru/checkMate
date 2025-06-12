import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

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
  background: '#f5f5f0',
  surface: '#f5f5f0', 
  surfaceVariant: '#e8e8e0',
  border: '#d0d0c8',
  text: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#8a8a8a',
  accent: '#2a2a2a',
  danger: '#ff3b30',
  success: '#34c759',
  warning: '#ff9500',
  // Y2K colors remain vibrant in both themes
  y2kPink: '#FF69B4',
  y2kCyan: '#00FFFF', 
  y2kLime: '#32CD32',
  y2kPurple: '#9932CC',
};

const darkTheme: ThemeColors = {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  surfaceVariant: '#2a2a2a',
  border: '#3a3a3a',
  text: '#f5f5f0',
  textSecondary: '#c0c0c0',
  textMuted: '#8a8a8a',
  accent: '#f5f5f0',
  danger: '#ff453a',
  success: '#30d158',
  warning: '#ff9f0a',
  // Y2K colors with slight adjustment for dark mode
  y2kPink: '#FF69B4',
  y2kCyan: '#00FFFF',
  y2kLime: '#32CD32', 
  y2kPurple: '#9932CC',
};

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  animatedBackgroundStyle: any;
  animatedSurfaceStyle: any;
  animatedTextStyle: any;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Animated values for smooth transitions
  const backgroundProgress = useSharedValue(0);
  const surfaceProgress = useSharedValue(0);
  const textProgress = useSharedValue(0);

  const isDark = theme === 'dark' || (theme === 'auto' && systemColorScheme === 'dark');
  const colors = isDark ? darkTheme : lightTheme;

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

  // Animate theme transitions
  useEffect(() => {
    const targetValue = isDark ? 1 : 0;
    backgroundProgress.value = withTiming(targetValue, { duration: 300 });
    surfaceProgress.value = withTiming(targetValue, { duration: 300 });
    textProgress.value = withTiming(targetValue, { duration: 300 });
  }, [isDark, backgroundProgress, surfaceProgress, textProgress]);

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

  const value: ThemeContextValue = {
    theme,
    colors,
    isDark,
    setTheme,
    animatedBackgroundStyle,
    animatedSurfaceStyle,
    animatedTextStyle,
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

// Theme-aware hook for creating dynamic styles
export const useThemedStyles = <T extends Record<string, any>>(
  styleFactory: (colors: ThemeColors, isDark: boolean) => T
): T => {
  const { colors, isDark } = useTheme();
  return styleFactory(colors, isDark);
};