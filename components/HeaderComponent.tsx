import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { useMainStore } from '../hooks/useTaskStore';
import { formatDateWithPreference } from '../utils/dateFormatters';
import { Ionicons } from '@expo/vector-icons';

interface HeaderComponentProps {}

export default function HeaderComponent({}: HeaderComponentProps) {
  const { colors, isDark, theme, setTheme, config } = useTheme();
  const { getSettings } = useMainStore();
  
  const settings = getSettings();


  // Format current date using user preferences
  const currentDate = formatDateWithPreference(
    new Date(), 
    settings.dateFormat, 
    settings.dateUseMonthNames, 
    settings.dateSeparator
  );

  const isTerminalTheme = true;
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: isTerminalTheme ? 2 : 0,
      borderBottomColor: colors.border,
      paddingTop: isTerminalTheme ? 50 : 60,
      paddingBottom: 16,
      paddingHorizontal: 16,
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: config.elevation.low,
      }),
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
      flexWrap: 'wrap',
      minHeight: 40,
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
      gap: 8,
      flexShrink: 0,
    },
    themeToggle: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? config.borderRadius : 20,
      minWidth: isTerminalTheme ? 44 : 56,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }),
    },
    themeToggleText: {
      fontFamily: config.fontFamily.bold,
      fontSize: isTerminalTheme ? 11 * fontScale : 14 * fontScale,
      color: isTerminalTheme ? colors.accent : colors.surface,
      letterSpacing: config.letterSpacing * 0.6,
      fontWeight: isTerminalTheme ? '800' : '600',
    },
    settingsButton: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : 'transparent',
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? config.borderRadius : 20,
      minWidth: isTerminalTheme ? 36 : 48,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIcon: {
      fontFamily: config.fontFamily.bold,
      fontSize: 12 * fontScale,
      color: colors.accent,
      letterSpacing: config.letterSpacing * 0.3,
      fontWeight: '800',
    },
    statusText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.3,
      flexShrink: 1,
    },
  }));

  return (
    <View style={styles.header}>
      <View style={styles.terminalBar}>
        <Text style={styles.terminalTitle}>CheckMate <Text style={styles.statusText}>{currentDate}</Text> </Text>
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