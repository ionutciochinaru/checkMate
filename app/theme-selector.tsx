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
import { typography, spacing } from '../utils/y2k-styles';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');

type ThemeStyle = 'terminal' | 'y2k' | 'material';

export default function ThemeSelectorScreen() {
  const { colors, themeStyle, setThemeStyle, animatedBackgroundStyle } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<ThemeStyle>(themeStyle);

  const themeOptions = [
    {
      id: 'terminal' as ThemeStyle,
      name: 'Terminal',
      description: 'Classic green-on-black terminal aesthetic with monospace fonts',
      features: ['Retro computing feel', 'High contrast', 'Minimal design', 'Hacker aesthetic'],
      colors: {
        background: '#000000',
        surface: '#111111',
        text: '#00ff00',
        accent: '#00ff00'
      }
    },
    {
      id: 'y2k' as ThemeStyle,
      name: 'Y2K Retro',
      description: 'Nostalgic Y2K era with chrome effects and neon colors',
      features: ['Chrome gradients', 'Neon glows', 'Metallic effects', '2000s nostalgia'],
      colors: {
        background: '#f8f8f6',
        surface: '#ffffff',
        text: '#000000',
        accent: '#ff00ff'
      }
    },
    {
      id: 'material' as ThemeStyle,
      name: 'Material Design 3',
      description: 'Modern Material You design with dynamic colors and rounded corners',
      features: ['Clean & modern', 'Accessibility focused', 'Dynamic colors', 'Rounded design'],
      colors: {
        background: '#FFFBFE',
        surface: '#FFFBFE',
        text: '#1D1B20',
        accent: '#6750A4'
      }
    }
  ];

  const appFlows = [
    {
      title: 'Task Management',
      description: 'Create, edit, and organize your tasks with reminders'
    },
    {
      title: 'Loop Mode',
      description: 'Recurring tasks that reschedule automatically when completed'
    },
    {
      title: 'Sequential Notifications',
      description: 'Follow-up reminders if you miss the first notification'
    },
    {
      title: 'Working Hours',
      description: 'Configure when you want to receive notifications'
    },
    {
      title: 'Themes & Accessibility',
      description: 'Customize appearance and accessibility settings'
    }
  ];

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
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
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 20 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      fontWeight: '800',
    },
    backButton: {
      padding: 0,
    },
    backButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 1,
      fontWeight: '700',
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      marginBottom: 12,
      fontWeight: '800',
    },
    introText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      fontWeight: '600',
      lineHeight: 18 * fontScale,
    },
    themeCard: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 12,
    },
    selectedThemeCard: {
      borderColor: colors.accent,
      backgroundColor: colors.surface,
    },
    themeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    themeName: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      fontWeight: '800',
    },
    themeCheckbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },
    selectedCheckbox: {
      borderColor: colors.accent,
      backgroundColor: colors.accent,
    },
    checkboxText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.background,
      letterSpacing: 0.5,
    },
    themeDescription: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 8,
      lineHeight: 16 * fontScale,
    },
    featuresList: {
      marginBottom: 12,
    },
    featureItem: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 2,
      lineHeight: 14 * fontScale,
    },
    colorPreview: {
      flexDirection: 'row',
      gap: 8,
    },
    colorDot: {
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    flowItem: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 8,
    },
    flowTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 4,
      fontWeight: '700',
    },
    flowDescription: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      lineHeight: 14 * fontScale,
    },
    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.textMuted,
      paddingVertical: 16,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    submitButton: {
      flex: 1,
      backgroundColor: colors.accent,
      borderWidth: 1,
      borderColor: colors.accent,
      paddingVertical: 16,
      alignItems: 'center',
    },
    submitButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.background,
      letterSpacing: 1.2,
      fontWeight: '800',
    },
    bottomPadding: {
      height: 40,
    },
  }));

  const handleApplyTheme = async () => {
    await setThemeStyle(selectedTheme);
    router.back();
  };

  return (
    <Animated.View style={[styles.container, animatedBackgroundStyle]}>
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
        {/* Introduction */}
        <Text style={styles.introText}>
          // Welcome to checkMate - A powerful task management app{'\n'}
          // Choose your preferred visual theme and learn about app features{'\n'}
          // You can change themes anytime using the [TRM]/[Y2K]/[MAT] button
        </Text>
        
        {/* Theme Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SELECT_THEME</Text>
          
          {themeOptions.map((theme) => (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
                selectedTheme === theme.id && styles.selectedThemeCard
              ]}
              onPress={() => setSelectedTheme(theme.id)}
              activeOpacity={0.7}
            >
              <View style={styles.themeHeader}>
                <Text style={styles.themeName}>{theme.name}</Text>
                <View style={[
                  styles.themeCheckbox,
                  selectedTheme === theme.id && styles.selectedCheckbox
                ]}>
                  {selectedTheme === theme.id && (
                    <Text style={styles.checkboxText}>X</Text>
                  )}
                </View>
              </View>
              
              <Text style={styles.themeDescription}>
                {theme.description}
              </Text>
              
              <View style={styles.featuresList}>
                {theme.features.map((feature, index) => (
                  <Text key={index} style={styles.featureItem}>
                    • {feature}
                  </Text>
                ))}
              </View>
              
              <View style={styles.colorPreview}>
                <View style={[styles.colorDot, { backgroundColor: theme.colors.background }]} />
                <View style={[styles.colorDot, { backgroundColor: theme.colors.surface }]} />
                <View style={[styles.colorDot, { backgroundColor: theme.colors.text }]} />
                <View style={[styles.colorDot, { backgroundColor: theme.colors.accent }]} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>APP_FEATURES</Text>
          
          {appFlows.map((flow, index) => (
            <View key={index} style={styles.flowItem}>
              <Text style={styles.flowTitle}>{flow.title}</Text>
              <Text style={styles.flowDescription}>{flow.description}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>[CANCEL]</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleApplyTheme}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>[APPLY THEME]</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Animated.View>
  );
}