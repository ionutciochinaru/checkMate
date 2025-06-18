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
type ThemeStyle = 'terminal';

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
}

interface ThemeConfig {
  colors: ThemeColors;
  borderRadius: number;
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
  };
  letterSpacing: number;
  elevation: {
    low: number;
    medium: number;
    high: number;
  };
}

// Terminal Theme Configurations
const terminalLight: ThemeConfig = {
  colors: {
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
  },
  borderRadius: 16,
  fontFamily: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    bold: 'JetBrainsMono_700Bold',
  },
  letterSpacing: 1.2,
  elevation: { low: 0, medium: 0, high: 0 },
};

const terminalDark: ThemeConfig = {
  colors: {
    background: '#000000',
    surface: '#111111',
    surfaceVariant: '#1a1a1a',
    border: '#333333',
    text: '#ff4444',
    textSecondary: '#cc3333',
    textMuted: '#882222',
    accent: '#ff4444',
    danger: '#ff6666',
    success: '#ff4444',
    warning: '#ffaa44',
  },
  borderRadius: 16,
  fontFamily: {
    regular: 'JetBrainsMono_400Regular',
    medium: 'JetBrainsMono_500Medium',
    bold: 'JetBrainsMono_700Bold',
  },
  letterSpacing: 1.2,
  elevation: { low: 0, medium: 0, high: 0 },
};


// High Contrast Variants
const terminalLightHighContrast: ThemeConfig = {
  ...terminalLight,
  colors: {
    ...terminalLight.colors,
    background: '#ffffff',
    surface: '#ffffff',
    surfaceVariant: '#ffffff',
    border: '#000000',
    text: '#000000',
    textSecondary: '#000000',
    textMuted: '#333333',
    accent: '#000000',
  },
};

const terminalDarkHighContrast: ThemeConfig = {
  ...terminalDark,
  colors: {
    ...terminalDark.colors,
    background: '#000000',
    surface: '#000000',
    surfaceVariant: '#000000',
    border: '#ff4444',
    text: '#ff4444',
    textSecondary: '#ff4444',
    textMuted: '#cc3333',
    accent: '#ff4444',
  },
};


interface ThemeContextValue {
  theme: Theme;
  themeStyle: ThemeStyle;
  colors: ThemeColors;
  config: ThemeConfig;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  setThemeStyle: (themeStyle: ThemeStyle) => void;
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
  
  // Get theme configuration based on style and mode
  const getThemeConfig = (): ThemeConfig => {
    if (settings.highContrast) {
      return isDark ? terminalDarkHighContrast : terminalLightHighContrast;
    }

    return isDark ? terminalDark : terminalLight;
  };

  const config = getThemeConfig();
  const colors = config.colors;

  // Load saved theme and style on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        const savedThemeStyle = await AsyncStorage.getItem('themeStyle');
        
        if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
          setThemeState(savedTheme as Theme);
        }
        
        if (savedThemeStyle && savedThemeStyle === 'terminal') {
          setThemeStyleState(savedThemeStyle as ThemeStyle);
        }
      } catch (error) {
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
    backgroundColor: colors.background,
  }));

  const animatedSurfaceStyle = useAnimatedStyle(() => ({
    backgroundColor: colors.surface,
    borderColor: colors.border,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    color: colors.text,
  }));

  // React to settings changes from main store
  useEffect(() => {
    // Colors will automatically update when settings change because
    // we're getting settings directly from the store
  }, [settings.fontScale, settings.highContrast, settings.reducedMotion]);

  const value: ThemeContextValue = {
    theme,
    themeStyle,
    colors,
    config,
    isDark,
    setTheme,
    setThemeStyle,
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
  styleFactory: (colors: ThemeColors, isDark: boolean, fontScale: number, reducedMotion: boolean, config: ThemeConfig) => T
): T => {
  const { colors, isDark, fontScale, reducedMotion, config } = useTheme();
  return styleFactory(colors, isDark, fontScale, reducedMotion, config);
};