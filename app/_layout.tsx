import '../global.css';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { useTaskStore, useMainStore } from '../stores/taskStore';
import { ThemeProvider, useTheme } from '../hooks/useTheme';
import { useNotifications } from '../hooks/useNotifications';
import { AlertProvider } from '../components/CustomAlert';
import * as Font from 'expo-font';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { SafeAreaProvider } from "react-native-safe-area-context";

const createPaperTheme = (theme: any) => ({
  colors: {
    primary: theme.colors.text,
    onPrimary: theme.colors.textInverse,
    primaryContainer: theme.colors.surfaceVariant,
    onPrimaryContainer: theme.colors.text,
    secondary: theme.colors.textSecondary,
    onSecondary: theme.colors.textInverse,
    secondaryContainer: theme.colors.surfaceVariant,
    onSecondaryContainer: theme.colors.text,
    tertiary: theme.colors.text,
    onTertiary: theme.colors.textInverse,
    tertiaryContainer: theme.colors.surfaceVariant,
    onTertiaryContainer: theme.colors.text,
    error: theme.colors.danger,
    onError: theme.colors.textInverse,
    errorContainer: theme.colors.danger,
    onErrorContainer: theme.colors.text,
    background: theme.colors.background,
    onBackground: theme.colors.text,
    surface: theme.colors.surface,
    onSurface: theme.colors.text,
    surfaceVariant: theme.colors.surfaceVariant,
    onSurfaceVariant: theme.colors.textSecondary,
    outline: theme.colors.border,
    outlineVariant: theme.colors.border,
    shadow: theme.isDark ? '#000000' : '#000000',
    scrim: theme.isDark ? '#000000' : '#000000',
    inverseSurface: theme.colors.textInverse,
    inverseOnSurface: theme.colors.text,
    inversePrimary: theme.colors.textMuted,
    elevation: {
      level0: 'transparent',
      level1: theme.colors.surface,
      level2: theme.colors.surfaceVariant,
      level3: theme.colors.surfaceVariant,
      level4: theme.colors.surfaceVariant,
      level5: theme.colors.surfaceVariant,
    },
    surfaceDisabled: theme.colors.textMuted,
    onSurfaceDisabled: theme.colors.textMuted,
    backdrop: theme.isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(74, 74, 74, 0.4)',
  },
});

function ThemedLayout() {
  const { theme } = useTheme();
  useNotifications();
  
  return (
    <PaperProvider theme={createPaperTheme(theme)}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontFamily: theme.typography.fontFamily.medium,
            fontSize: theme.typography.fontSize.lg,
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
        <Stack.Screen 
          name="settings" 
          options={{ 
            headerShown: false
          }} 
        />
      </Stack>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} backgroundColor={theme.colors.background} />
    </PaperProvider>
  );
}

export default function RootLayout() {
  const initializeMain = useMainStore(state => state.initialize);
  const loadTasks = useTaskStore(state => state.loadTasks);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function setup() {
      await Font.loadAsync({
        JetBrainsMono_400Regular,
        JetBrainsMono_500Medium,
        JetBrainsMono_700Bold,
      });
      setFontsLoaded(true);
      
      await initializeMain();
      
      await loadTasks();
    }
    
    setup();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AlertProvider>
          <ThemedLayout />
        </AlertProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}