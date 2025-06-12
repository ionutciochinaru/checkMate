import '../global.css';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import * as Font from 'expo-font';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

const createPaperTheme = (isDark: boolean) => ({
  colors: {
    primary: isDark ? '#f5f5f0' : '#1a1a1a',
    onPrimary: isDark ? '#1a1a1a' : '#f5f5f0',
    primaryContainer: isDark ? '#2a2a2a' : '#e8e8e0',
    onPrimaryContainer: isDark ? '#f5f5f0' : '#1a1a1a',
    secondary: isDark ? '#c0c0c0' : '#4a4a4a',
    onSecondary: isDark ? '#1a1a1a' : '#f5f5f0',
    secondaryContainer: isDark ? '#3a3a3a' : '#d0d0c8',
    onSecondaryContainer: isDark ? '#f5f5f0' : '#1a1a1a',
    tertiary: isDark ? '#f5f5f0' : '#2a2a2a',
    onTertiary: isDark ? '#1a1a1a' : '#f5f5f0',
    tertiaryContainer: isDark ? '#2a2a2a' : '#e8e8e0',
    onTertiaryContainer: isDark ? '#f5f5f0' : '#1a1a1a',
    error: isDark ? '#ff453a' : '#ff3b30',
    onError: '#f5f5f0',
    errorContainer: isDark ? '#3a1a1a' : '#ffeae8',
    onErrorContainer: isDark ? '#ff453a' : '#1a1a1a',
    background: isDark ? '#0a0a0a' : '#f5f5f0',
    onBackground: isDark ? '#f5f5f0' : '#1a1a1a',
    surface: isDark ? '#1a1a1a' : '#f5f5f0',
    onSurface: isDark ? '#f5f5f0' : '#1a1a1a',
    surfaceVariant: isDark ? '#2a2a2a' : '#e8e8e0',
    onSurfaceVariant: isDark ? '#c0c0c0' : '#4a4a4a',
    outline: isDark ? '#3a3a3a' : '#d0d0c8',
    outlineVariant: isDark ? '#2a2a2a' : '#e8e8e0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: isDark ? '#f5f5f0' : '#1a1a1a',
    inverseOnSurface: isDark ? '#1a1a1a' : '#f5f5f0',
    inversePrimary: isDark ? '#1a1a1a' : '#8a8a8a',
    elevation: {
      level0: 'transparent',
      level1: isDark ? '#1a1a1a' : '#f8f8f3',
      level2: isDark ? '#2a2a2a' : '#f2f2ed',
      level3: isDark ? '#3a3a3a' : '#eaeae5',
      level4: isDark ? '#4a4a4a' : '#e8e8e3',
      level5: isDark ? '#5a5a5a' : '#e5e5e0',
    },
    surfaceDisabled: isDark ? 'rgba(245, 245, 240, 0.12)' : 'rgba(26, 26, 26, 0.12)',
    onSurfaceDisabled: isDark ? 'rgba(245, 245, 240, 0.38)' : 'rgba(26, 26, 26, 0.38)',
    backdrop: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(74, 74, 74, 0.4)',
  },
});

const ThemedLayout = () => {
  const { colors, isDark } = useTheme();
  
  return (
    <PaperProvider theme={createPaperTheme(isDark)}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontFamily: 'JetBrainsMono_500Medium',
            fontSize: 16,
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen 
          name="add-task" 
          options={{ 
            headerShown: false
          }} 
        />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={colors.background} />
    </PaperProvider>
  );
};

export default function RootLayout() {
  const loadData = useTaskStore(state => state.loadData);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        JetBrainsMono_400Regular,
        JetBrainsMono_500Medium,
        JetBrainsMono_700Bold,
      });
      setFontsLoaded(true);
    }
    
    loadFonts();
    loadData();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <ThemedLayout />
    </ThemeProvider>
  );
}