import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface HeaderComponentProps {
  // No props needed yet
}

export default function HeaderComponent(_props: HeaderComponentProps) {
  const { theme, themeMode, setThemeMode } = useTheme();



  const isTerminalTheme = true;
  
  const styles = useThemedStyles((theme) => StyleSheet.create({
    header: {
      backgroundColor: theme.colors.surface,
      borderBottomWidth: isTerminalTheme ? 2 : 0,
      borderBottomColor: theme.colors.border,
      paddingTop: isTerminalTheme ? 50 : 60,
      paddingBottom: 0,
      paddingHorizontal: theme.spacing.md,
      ...(isTerminalTheme ? {} : {
        shadowColor: theme.isDark ? '#000000' : '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: theme.elevation.low,
      }),
    },
    filterContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 0,
      paddingVertical: 0,
      position: 'relative',
      marginBottom: theme.spacing.md,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: theme.spacing.sm,
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      flexWrap: 'wrap',
      minHeight: 35,
    },
    terminalTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: isTerminalTheme ? theme.typography.fontSize.xxl : 28,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing,
      fontWeight: isTerminalTheme ? '800' : '600',
      flexShrink: 1,
    },
    // Removed terminal time styles
    topRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      flexShrink: 0,
    },
    themeToggle: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      backgroundColor: isTerminalTheme ? theme.colors.surfaceVariant : theme.colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: theme.colors.accent,
      borderRadius: isTerminalTheme ? theme.borderRadius.md : theme.borderRadius.lg,
      minWidth: isTerminalTheme ? 28 : 40,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsButton: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      backgroundColor: isTerminalTheme ? theme.colors.surfaceVariant : theme.colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: theme.colors.accent,
      borderRadius: isTerminalTheme ? theme.borderRadius.md : theme.borderRadius.md,
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
              const nextTheme = themeMode === 'dark' ? 'light' : 'dark';
              setThemeMode(nextTheme);
            }}
          >
            <Ionicons 
              name={themeMode === 'dark' ? 'moon' : 'sunny'} 
              size={16} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
          >
            <Ionicons 
              name="settings-outline" 
              size={16} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}