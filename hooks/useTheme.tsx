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
  toggleTheme: () => void;
  isDark: boolean;
  animatedBackgroundStyle: any;
  animatedSurfaceStyle: any;
  animatedTextStyle: any;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );
  
  const mainStore = useMainStore();
  const settings = mainStore.isInitialized ? mainStore.settings : {
    fontScale: 1.0,
    highContrast: false,
    reducedMotion: false
  };

  const backgroundProgress = useSharedValue(0);

  const isDark = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark');
  
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

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch {
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });
    return () => subscription?.remove();
  }, []);

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
    }
  };

  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: theme.colors.background,
    };
  });

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: theme.colors.text,
  }));

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setThemeMode(newMode);
  };

  const value: ThemeContextValue = {
    theme,
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark,
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

export const useThemedStyles = <T extends Record<string, any>>(
  styleFactory: (theme: Theme) => T
): T => {
  const { theme } = useTheme();
  return styleFactory(theme);
};