import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Linking,
  ActivityIndicator
} from 'react-native';
import { Switch } from 'react-native-paper';
import { router } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import { useSettingsStore } from '../hooks/useSettingsStore';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import DelayInputComponent from '../components/DelayInputComponent';
import { showAlert } from '../components/CustomAlert';
import Animated from 'react-native-reanimated';

export default function SettingsScreen() {
  const { 
    settings, 
    isLoaded, 
    isLoading,
    loadSettingsForPage, 
    saveAndExit, 
    updateSetting,
    updateMultipleSettings 
  } = useSettingsStore();
  const { colors, animatedBackgroundStyle } = useTheme();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Load settings when page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 Settings Page: Focus gained, loading settings...');
      loadSettingsForPage();
      
      return () => {
        console.log('📱 Settings Page: Focus lost, saving settings...');
        saveAndExit();
      };
    }, [loadSettingsForPage, saveAndExit])
  );

  // Helper to create Date from time string
  const createDateFromTimeString = (timeString: string): Date => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  // Helper to convert Date to HH:MM string
  const dateToTimeString = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Update setting using the dedicated settings store
  const handleUpdateSetting = async (key: string, value: any) => {
    await updateSetting(key as keyof typeof settings, value);
  };

  // Time picker handlers
  const onStartTimeChange = async (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowStartPicker(false);
      return;
    }
    
    if (event.type === 'set' && selectedDate) {
      setShowStartPicker(false);
      const newStartTime = dateToTimeString(selectedDate);
      await handleUpdateSetting('workingHoursStart', newStartTime);
      
      // Auto-adjust end time if needed
      const endMinutes = timeToMinutes(settings.workingHoursEnd);
      const startMinutes = timeToMinutes(newStartTime);
      if (startMinutes >= endMinutes) {
        const adjustedEndTime = minutesToTime(startMinutes + 60);
        await handleUpdateSetting('workingHoursEnd', adjustedEndTime);
      }
    }
  };

  const onEndTimeChange = async (event: any, selectedDate?: Date) => {
    if (event.type === 'dismissed') {
      setShowEndPicker(false);
      return;
    }
    
    if (event.type === 'set' && selectedDate) {
      setShowEndPicker(false);
      const newEndTime = dateToTimeString(selectedDate);
      await handleUpdateSetting('workingHoursEnd', newEndTime);
      
      // Auto-adjust start time if needed
      const endMinutes = timeToMinutes(newEndTime);
      const startMinutes = timeToMinutes(settings.workingHoursStart);
      if (endMinutes <= startMinutes) {
        const adjustedStartTime = minutesToTime(Math.max(0, endMinutes - 60));
        await handleUpdateSetting('workingHoursStart', adjustedStartTime);
      }
    }
  };

  // Helper functions for time validation
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60) % 24;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Go back to previous screen
  const goBack = () => {
    router.back();
  };

  const styles = useThemedStyles((colors, isDark, fontScale) => StyleSheet.create({
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
    instructionText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: colors.textMuted,
      fontWeight: '600',
    },
    section: {
      marginBottom: 20,
    },
    sectionCard: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 20,
    },
    sectionTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      marginBottom: 16,
      fontWeight: '800',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      minHeight: 40,
    },
    settingLabel: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      fontWeight: '700',
      flex: 1,
    },
    settingSubtext: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 2,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    timePickersRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 12,
    },
    timeContainer: {
      flex: 1,
    },
    timeLabel: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 10 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 4,
      textAlign: 'center',
    },
    timeButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingVertical: 12,
      paddingHorizontal: 8,
      alignItems: 'center',
    },
    timeText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 0.5,
      fontWeight: '500',
    },
    delayInputContainer: {
      marginTop: -8,
      marginBottom: 8,
      paddingLeft: 0,
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginTop: 4,
      lineHeight: 12 * fontScale,
    },
    fontScaleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    fontScaleButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 40,
      alignItems: 'center',
    },
    fontScaleButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    fontScaleText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 10 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    fontScaleTextActive: {
      color: colors.background,
    },
    disabledText: {
      color: colors.textMuted,
      opacity: 0.5,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    loadingText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginTop: 16,
    },
    supportSection: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      marginBottom: 40,
      alignItems: 'center',
    },
    supportTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      marginBottom: 8,
      fontWeight: '800',
    },
    supportSubtext: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 11,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 16,
      textAlign: 'center',
      lineHeight: 16,
    },
    coffeeButton: {
      backgroundColor: colors.y2kCyan || '#00FFFF',
      borderWidth: 2,
      borderColor: colors.y2kCyan || '#00FFFF',
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: colors.y2kCyan || '#00FFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    coffeeButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: Math.max(12, 11 * fontScale),
      color: colors.background,
      letterSpacing: 1,
      fontWeight: '800',
      marginBottom: 2,
    },
    coffeeSubtext: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: Math.max(12, 9 * fontScale),
      color: colors.background,
      letterSpacing: 0.5,
      opacity: 0.8,
    },
    gratitudeText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: Math.max(12, 9 * fontScale),
      color: colors.textMuted,
      letterSpacing: 0.3,
      lineHeight: Math.max(14, 12 * fontScale),
      textAlign: 'center',
      fontStyle: 'italic',
    },
  }));

  return (
    <Animated.View style={[styles.container, animatedBackgroundStyle]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
          >
            <Text style={styles.backButtonText}>[ESC] BACK</Text>
          </TouchableOpacity>
          <Text style={styles.terminalTitle}>SETTINGS.EXE</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Loading State */}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.accent} />
            <Text style={styles.loadingText}>Loading settings...</Text>
          </View>
        )}

        {/* Instructions */}
        {isLoaded && (
          <Text style={styles.instructionText}>
            // Configure app settings - changes take effect immediately
            {'\n'}// Working hours and 24H mode are mutually exclusive
          </Text>
        )}
        
        {/* Settings Content - Only show when loaded */}
        {isLoaded && (
          <>
            {/* General Settings */}
            <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>GENERAL SETTINGS</Text>
          
          {/* Work Hours Toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>WORK_HOURS</Text>
              <Text style={styles.settingSubtext}>
                // Restrict notifications to working hours only
              </Text>
            </View>
            <Switch
              value={settings.workingHoursEnabled}
              onValueChange={(value) => handleUpdateSetting('workingHoursEnabled', value)}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={settings.workingHoursEnabled ? colors.accent : colors.textMuted}
            />
          </View>

          {/* Time Pickers - Only show when work hours enabled */}
          {settings.workingHoursEnabled && (
            <View style={styles.timePickersRow}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeLabel}>START_TIME</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowStartPicker(true)}
                >
                  <Text style={styles.timeText}>
                    {settings.workingHoursStart}
                  </Text>
                </TouchableOpacity>
                {showStartPicker && (
                  <DateTimePicker
                    value={createDateFromTimeString(settings.workingHoursStart)}
                    mode="time"
                    is24Hour={true}
                    minuteInterval={15}
                    onChange={onStartTimeChange}
                  />
                )}
              </View>
              
              <View style={styles.timeContainer}>
                <Text style={styles.timeLabel}>END_TIME</Text>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowEndPicker(true)}
                >
                  <Text style={styles.timeText}>
                    {settings.workingHoursEnd}
                  </Text>
                </TouchableOpacity>
                {showEndPicker && (
                  <DateTimePicker
                    value={createDateFromTimeString(settings.workingHoursEnd)}
                    mode="time"
                    is24Hour={true}
                    minuteInterval={15}
                    onChange={onEndTimeChange}
                  />
                )}
              </View>
            </View>
          )}

          {/* Delay Setting */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>DELAY</Text>
              <Text style={styles.settingSubtext}>
                // Default delay time for postponing tasks
              </Text>
            </View>
          </View>
          <View style={styles.delayInputContainer}>
            <DelayInputComponent
              value={settings.defaultDelay || '30m'}
              onValueChange={(value) => handleUpdateSetting('defaultDelay', value)}
            />
          </View>

          {/* 24 Hour Mode */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>24H_MODE</Text>
              <Text style={styles.settingSubtext}>
                // Allow notifications at any time (disables work hours)
              </Text>
            </View>
            <Switch
              value={settings.twentyFourHourMode}
              onValueChange={(value) => handleUpdateSetting('twentyFourHourMode', value)}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={settings.twentyFourHourMode ? colors.accent : colors.textMuted}
            />
          </View>
        </View>

        {/* Accessibility Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ACCESSIBILITY</Text>
          
          {/* Font Scale */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>FONT_SIZE</Text>
              <Text style={styles.settingSubtext}>
                // Adjust text size for better readability
              </Text>
            </View>
            <View style={styles.fontScaleContainer}>
              {[1.0, 1.2, 1.5].map(scale => (
                <TouchableOpacity
                  key={scale}
                  style={[
                    styles.fontScaleButton,
                    settings.fontScale === scale && styles.fontScaleButtonActive
                  ]}
                  onPress={() => handleUpdateSetting('fontScale', scale)}
                >
                  <Text style={[
                    styles.fontScaleText,
                    settings.fontScale === scale && styles.fontScaleTextActive
                  ]}>
                    {scale === 1.0 ? '[S]' : scale === 1.2 ? '[M]' : '[L]'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* High Contrast */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>HIGH_CONTRAST</Text>
              <Text style={styles.settingSubtext}>
                // Enhanced contrast for better visibility
              </Text>
            </View>
            <Switch
              value={settings.highContrast}
              onValueChange={(value) => handleUpdateSetting('highContrast', value)}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={settings.highContrast ? colors.accent : colors.textMuted}
            />
          </View>

          {/* Reduced Motion */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>REDUCE_MOTION</Text>
              <Text style={styles.settingSubtext}>
                // Minimize animations and transitions
              </Text>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={(value) => handleUpdateSetting('reducedMotion', value)}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={settings.reducedMotion ? colors.accent : colors.textMuted}
            />
          </View>
        </View>


        {/* Buy Me a Coffee Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>SUPPORT THE DEVELOPER</Text>
          <Text style={styles.supportSubtext}>
            // If you enjoy using checkMate and find it helpful,
            // consider buying me a coffee! Your support helps
            // keep this app free and motivates continued development.
          </Text>
          
          <TouchableOpacity 
            style={styles.coffeeButton}
            onPress={async () => {
              const urls = [
                'https://revolut.me/ionutn9j',
                'http://revolut.me/ionutn9j'
              ];
              
              let opened = false;
              
              // Try different URL formats
              for (const url of urls) {
                try {
                  await Linking.openURL(url);
                  opened = true;
                  break;
                } catch (error) {
                  console.log(`Failed to open ${url}:`, error);
                  continue;
                }
              }
              
              // If all attempts failed, show manual instructions
              if (!opened) {
                showAlert(
                  'Buy me a coffee ☕',
                  'Please visit:\nrevolut.me/ionutn9j\n\nOr search "ionutn9j" in the Revolut app to send a tip!\n\nThank you for wanting to support! 💚',
                  [
                    { text: 'Got it!' }
                  ]
                );
              }
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.coffeeButtonText}>[BUY ME A COFFEE]</Text>
            <Text style={styles.coffeeSubtext}>via Revolut</Text>
          </TouchableOpacity>
          
          <Text style={styles.gratitudeText}>
            // Thank you for using checkMate! Every bit of support
            // means the world to an independent developer.
          </Text>
        </View>
        </>
        )}
      </ScrollView>
    </Animated.View>
  );
}