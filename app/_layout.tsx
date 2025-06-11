import '../global.css';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { useTaskStore } from '../hooks/useTaskStore';
import * as Font from 'expo-font';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

const einkTheme = {
  colors: {
    primary: '#1a1a1a',
    onPrimary: '#f5f5f0',
    primaryContainer: '#e8e8e0',
    onPrimaryContainer: '#1a1a1a',
    secondary: '#4a4a4a',
    onSecondary: '#f5f5f0',
    secondaryContainer: '#d0d0c8',
    onSecondaryContainer: '#1a1a1a',
    tertiary: '#2a2a2a',
    onTertiary: '#f5f5f0',
    tertiaryContainer: '#e8e8e0',
    onTertiaryContainer: '#1a1a1a',
    error: '#ff3b30',
    onError: '#f5f5f0',
    errorContainer: '#ffeae8',
    onErrorContainer: '#1a1a1a',
    background: '#f5f5f0',
    onBackground: '#1a1a1a',
    surface: '#f5f5f0',
    onSurface: '#1a1a1a',
    surfaceVariant: '#e8e8e0',
    onSurfaceVariant: '#4a4a4a',
    outline: '#d0d0c8',
    outlineVariant: '#e8e8e0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#1a1a1a',
    inverseOnSurface: '#f5f5f0',
    inversePrimary: '#8a8a8a',
    elevation: {
      level0: 'transparent',
      level1: '#f8f8f3',
      level2: '#f2f2ed',
      level3: '#eaeae5',
      level4: '#e8e8e3',
      level5: '#e5e5e0',
    },
    surfaceDisabled: 'rgba(26, 26, 26, 0.12)',
    onSurfaceDisabled: 'rgba(26, 26, 26, 0.38)',
    backdrop: 'rgba(74, 74, 74, 0.4)',
  },
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
    <PaperProvider theme={einkTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f5f5f0',
          },
          headerTintColor: '#1a1a1a',
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
            presentation: 'modal',
            title: 'NEW_TASK.EXE',
            headerStyle: {
              backgroundColor: '#f5f5f0',
            },
            headerTitleStyle: {
              fontFamily: 'JetBrainsMono_500Medium',
              fontSize: 14,
              color: '#1a1a1a',
            },
          }} 
        />
      </Stack>
      <StatusBar style="dark" backgroundColor="#f5f5f0" />
    </PaperProvider>
  );
}