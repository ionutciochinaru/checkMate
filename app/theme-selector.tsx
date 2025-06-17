import React, { useState } from 'react';
import {
  View,
  ScrollView,  
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

export default function ThemeSelectorScreen() {
  const { themeStyle, setThemeStyle, colors, config } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(themeStyle);

  const handleThemeSelect = async (theme: 'terminal') => {
    setSelectedTheme(theme);
    await setThemeStyle(theme);
  };

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      paddingTop: 50,
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    terminalTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: 20 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: '800',
    },
    backButton: {
      padding: 0,
    },
    backButtonText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.8,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    instructionText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.4,
      marginBottom: 24,
      paddingHorizontal: 12,
      paddingVertical: 12,
      backgroundColor: colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      borderRadius: config.borderRadius,
      fontWeight: '600',
    },
    themeGrid: {
      gap: 16,
      marginBottom: 32,
    },
    themeCard: {
      borderWidth: 2,
      borderRadius: config.borderRadius,
      padding: 16,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    selectedCard: {
      borderColor: colors.accent,
      backgroundColor: colors.surfaceVariant,
    },
    themeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    themeName: {
      fontFamily: config.fontFamily.bold,
      fontSize: 18 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: '800',
    },
    themeIcon: {
      fontFamily: config.fontFamily.bold,
      fontSize: 16 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing,
    },
    themeDescription: {
      fontFamily: config.fontFamily.regular,
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.6,
      lineHeight: 20 * fontScale,
      marginBottom: 12,
    },
    colorPreview: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 12,
    },
    colorDot: {
      width: 20,
      height: 20,
      borderRadius: config.borderRadius === 0 ? 0 : 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    features: {
      marginBottom: 12,
    },
    featureText: {
      fontFamily: config.fontFamily.regular,
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      letterSpacing: config.letterSpacing * 0.4,
      lineHeight: 16 * fontScale,
    },
    appGuideSection: {
      marginTop: 24,
      paddingTop: 24,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    guideTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: 18 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: '800',
      marginBottom: 16,
    },
    guideCard: {
      backgroundColor: colors.surfaceVariant,
      borderRadius: config.borderRadius,
      padding: 16,
      marginBottom: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
    },
    guideCardTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: 16 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing * 0.8,
      fontWeight: '700',
      marginBottom: 8,
    },
    guideCardDescription: {
      fontFamily: config.fontFamily.regular,
      fontSize: 13 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.4,
      lineHeight: 18 * fontScale,
    },
    bottomPadding: {
      height: 40,
    },
  }));

  const themeData = [
    {
      id: 'terminal',
      name: 'Terminal Theme',
      icon: '[TRM]',
      description: 'Classic terminal aesthetic with monospace font and sharp, angular design. Supports both light and dark modes.',
      colors: ['#00ff00', '#000000', '#333333', '#00cc00'],
      features: '• JetBrains Mono monospace font • Sharp square edges • No shadows or elevation • Minimal terminal interface • Command-line aesthetic • Light/Dark mode support'
    }
  ];

  const appFeatures = [
    {
      title: 'Task Management',
      description: 'Create, edit, and organize tasks with scheduled reminders. Set custom notification times and add detailed descriptions.'
    },
    {
      title: 'Loop Mode',
      description: 'Automatically reschedule recurring tasks at set intervals (1H-1W). Perfect for habits like drinking water or taking breaks.'
    },
    {
      title: 'Sequential Notifications',
      description: 'Send follow-up reminders if the first notification is ignored. Choose from 30s, 5min, or 10min follow-up intervals.'
    },
    {
      title: 'Working Hours',
      description: 'Configure work hours to control when notifications are sent. Enable 24H mode to override for urgent tasks.'
    },
    {
      title: 'Themes & Accessibility',
      description: 'Terminal theme with light/dark modes, font scaling, high contrast, and reduced motion options for better accessibility.'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>[ESC] BACK</Text>
          </TouchableOpacity>
          <Text style={styles.terminalTitle}>THEME_SELECTOR.EXE</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Instructions */}
        <Text style={styles.instructionText}>
          // Terminal theme with light/dark modes and high contrast variants{'\n'}
          // Use system settings or manual toggle for light/dark mode
        </Text>

        {/* Theme Selection */}
        <View style={styles.themeGrid}>
          {themeData.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
                selectedTheme === theme.id && styles.selectedCard
              ]}
              onPress={() => handleThemeSelect(theme.id as any)}
              activeOpacity={0.7}
            >
              <View style={styles.themeHeader}>
                <Text style={styles.themeName}>{theme.name}</Text>
                <Text style={styles.themeIcon}>{theme.icon}</Text>
              </View>
              
              <Text style={styles.themeDescription}>{theme.description}</Text>
              
              <View style={styles.colorPreview}>
                {theme.colors.map((color, index) => (
                  <View
                    key={index}
                    style={[styles.colorDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
              
              <View style={styles.features}>
                <Text style={styles.featureText}>{theme.features}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Flow Guide */}
        <View style={styles.appGuideSection}>
          <Text style={styles.guideTitle}>App Features Guide</Text>
          
          {appFeatures.map((feature, index) => (
            <View key={index} style={styles.guideCard}>
              <Text style={styles.guideCardTitle}>{feature.title}</Text>
              <Text style={styles.guideCardDescription}>{feature.description}</Text>
            </View>
          ))}
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}