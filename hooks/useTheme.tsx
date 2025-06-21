import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming 
} from 'react-native-reanimated';
import { useMainStore } from './useTaskStore';
import { 
  Theme, 
  ThemeMode, 
  lightTheme, 
  darkTheme, 
  lightHighContrastTheme, 
  darkHighContrastTheme 
} from '../theme';

interface ThemeContextValue {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  animatedBackgroundStyle: any;
  animatedSurfaceStyle: any;
  animatedTextStyle: any;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('auto');
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

  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  
  // Get theme based on mode and settings
  const getTheme = (): Theme => {
    const baseTheme = settings.highContrast 
      ? (isDark ? darkHighContrastTheme : lightHighContrastTheme)
      : (isDark ? darkTheme : lightTheme);
    
    return {
      ...baseTheme,
      isDark,
      reducedMotion: settings.reducedMotion
    };
  };

  const theme = getTheme();

  // Load saved theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch {
        // Use default theme
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
  }, [isDark, settings.reducedMotion, backgroundProgress]);

  const setThemeMode = async (newMode: ThemeMode) => {
    setThemeModeState(newMode);
    try {
      await AsyncStorage.setItem('theme', newMode);
    } catch {
      // Silently fail theme save
    }
  };

  // Animated styles for smooth transitions
  const animatedBackgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: theme.colors.background,
  }));

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: theme.colors.text,
  }));

  const value: ThemeContextValue = {
    theme,
    themeMode,
    setThemeMode,
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

// Legacy support - will be deprecated
export const useThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
): T => {
  const { theme } = useTheme();
  return styleFactory(theme);
};