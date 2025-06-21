import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface HeaderComponentProps {
  // No props needed yet
}

export default function HeaderComponent(_props: HeaderComponentProps) {
  const { colors, theme, setTheme } = useTheme();



  const isTerminalTheme = true;
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: isTerminalTheme ? 2 : 0,
      borderBottomColor: colors.border,
      paddingTop: isTerminalTheme ? 50 : 60,
      paddingBottom: 0,
      paddingHorizontal: 16,
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: config.elevation.low,
      }),
    },
    filterContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 0,
      paddingVertical: 0,
      position: 'relative',
      marginBottom: 16,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      flexWrap: 'wrap',
      minHeight: 35,
    },
    terminalTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: isTerminalTheme ? 20 * fontScale : 28 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: isTerminalTheme ? '800' : '600',
      flexShrink: 1,
    },
    // Removed terminal time styles
    topRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexShrink: 0,
    },
    themeToggle: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? config.borderRadius : 20,
      minWidth: isTerminalTheme ? 28 : 40,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsButton: {
      paddingHorizontal: 10,
      paddingVertical: 8,
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? config.borderRadius : 15,
      minWidth: isTerminalTheme ? 28 : 40,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
  }));

  return (
    <View style={styles.header}>
      <View style={styles.terminalBar}>
        <Text style={styles.terminalTitle}>CheckMate </Text>
        {/*<Text style={styles.statusText}>{currentDate}</Text>*/}
        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
            }}
          >
            <Ionicons 
              name={theme === 'dark' ? 'moon' : 'sunny'} 
              size={16} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
          >
            <Ionicons 
              name="settings-outline" 
              size={16} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}