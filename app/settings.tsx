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
import MockDataGenerator from '../components/MockDataGenerator';
import { showAlert } from '../components/CustomAlert';
import { availableDateFormats, availableSeparators, availableTimeFormats, getDateFormatDisplayName, getTimeFormatDisplayName } from '../utils/dateFormatters';
import { DateFormat, DateSeparator, TimeFormat } from '../types/task';
import { Ionicons } from '@expo/vector-icons';

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
  const { colors, config } = useTheme();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Load settings when page comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadSettingsForPage();
      
      return () => {
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
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      borderRadius: config.borderRadius,
      fontWeight: '600',
    },
    section: {
      marginBottom: 20,
    },
    sectionCard: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: config.borderRadius,
      padding: 16,
      marginBottom: 20,
    },
    sectionTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: 16 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
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
      paddingTop: 16,
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
      borderRadius: config.borderRadius,
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
    dateFormatContainer: {
      marginTop: 8,
      marginBottom: 8,
      gap: 8,
    },
    dateFormatButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: 'flex-start',
      borderRadius: config.borderRadius,
    },
    dateFormatButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    dateFormatText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    dateFormatTextActive: {
      color: colors.background,
      fontWeight: '600',
    },
    separatorContainer: {
      flexDirection: 'row',
      gap: 8,
    },
    separatorButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: config.borderRadius,
    },
    separatorButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    separatorText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: '700',
    },
    separatorTextActive: {
      color: colors.background,
    },
    timeFormatContainer: {
      marginTop: 8,
      gap: 8,
    },
    timeFormatButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      alignItems: 'flex-start',
      borderRadius: config.borderRadius,
    },
    timeFormatButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    timeFormatText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    timeFormatTextActive: {
      color: colors.background,
      fontWeight: '600',
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
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: config.borderRadius,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: colors.accent,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: config.elevation.medium,
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <Text style={styles.terminalTitle}>Settings</Text>
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
Customize your experience - changes take effect immediately
{'\n'}Working hours and 24H mode are mutually exclusive
          </Text>
        )}
        
        {/* Settings Content - Only show when loaded */}
        {isLoaded && (
          <>
            {/* General Settings */}
            <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>General</Text>
          
          {/* Work Hours Toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Work Hours</Text>
              <Text style={styles.settingSubtext}>
Restrict notifications to working hours only
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
                <Text style={styles.timeLabel}>Start Time</Text>
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
                <Text style={styles.timeLabel}>End Time</Text>
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
              <Text style={styles.settingLabel}>Default Delay</Text>
              <Text style={styles.settingSubtext}>
                Default delay time for postponing tasks
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
              <Text style={styles.settingLabel}>24H Mode</Text>
              <Text style={styles.settingSubtext}>
                Allow notifications at any time (disables work hours)
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
          <Text style={styles.sectionTitle}>Display & Access</Text>
          
          {/* Font Scale */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Font Size</Text>
              <Text style={styles.settingSubtext}>
                Adjust text size for better readability
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
{scale === 1.0 ? 'S' : scale === 1.2 ? 'M' : 'L'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* High Contrast */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>High Contrast</Text>
              <Text style={styles.settingSubtext}>
                Enhanced contrast for better visibility
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
              <Text style={styles.settingLabel}>Reduce Motion</Text>
              <Text style={styles.settingSubtext}>
                Minimize animations and transitions
              </Text>
            </View>
            <Switch
              value={settings.reducedMotion}
              onValueChange={(value) => handleUpdateSetting('reducedMotion', value)}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={settings.reducedMotion ? colors.accent : colors.textMuted}
            />
          </View>

          {/* Date Format Order */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Date Order</Text>
              <Text style={styles.settingSubtext}>
                Choose the order of day, month, and year
              </Text>
            </View>
          </View>
          <View style={styles.dateFormatContainer}>
            {availableDateFormats.map(format => (
              <TouchableOpacity
                key={format}
                style={[
                  styles.dateFormatButton,
                  settings.dateFormat === format && styles.dateFormatButtonActive
                ]}
                onPress={() => handleUpdateSetting('dateFormat', format)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dateFormatText,
                  settings.dateFormat === format && styles.dateFormatTextActive
                ]}>
                  {getDateFormatDisplayName(format, settings.dateUseMonthNames, settings.dateSeparator)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Month Names Toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Month Names</Text>
              <Text style={styles.settingSubtext}>
                Use month names (Jan, Feb) instead of numbers (01, 02)
              </Text>
            </View>
            <Switch
              value={settings.dateUseMonthNames}
              onValueChange={(value) => handleUpdateSetting('dateUseMonthNames', value)}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={settings.dateUseMonthNames ? colors.accent : colors.textMuted}
            />
          </View>

          {/* Date Separator Toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Date Separator</Text>
              <Text style={styles.settingSubtext}>
                Choose separator between date parts
              </Text>
            </View>
            <View style={styles.separatorContainer}>
              {availableSeparators.map(separator => (
                <TouchableOpacity
                  key={separator}
                  style={[
                    styles.separatorButton,
                    settings.dateSeparator === separator && styles.separatorButtonActive
                  ]}
                  onPress={() => handleUpdateSetting('dateSeparator', separator)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.separatorText,
                    settings.dateSeparator === separator && styles.separatorTextActive
                  ]}>
                    [{separator}]
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Format Toggle */}
          <View style={styles.settingRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>Time Format</Text>
              <Text style={styles.settingSubtext}>
                Choose between 24-hour and 12-hour (AM/PM) format
              </Text>
            </View>
            <View style={styles.timeFormatContainer}>
              {availableTimeFormats.map(format => (
                <TouchableOpacity
                  key={format}
                  style={[
                    styles.timeFormatButton,
                    settings.timeFormat === format && styles.timeFormatButtonActive
                  ]}
                  onPress={() => handleUpdateSetting('timeFormat', format)}
                  activeOpacity={0.7}
                >
                  <Text style={[
                    styles.timeFormatText,
                    settings.timeFormat === format && styles.timeFormatTextActive
                  ]}>
                    {getTimeFormatDisplayName(format)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>


        {/* Developer Tools */}
        <MockDataGenerator />
        
        {/* Buy Me a Coffee Section */}
        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Support the Developer</Text>
          <Text style={styles.supportSubtext}>
            If you enjoy using CheckMate and find it helpful,
            consider buying me a coffee! Your support helps
            keep this app free and motivates continued development.
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
            <Text style={styles.coffeeButtonText}>Buy Me a Coffee</Text>
            <Text style={styles.coffeeSubtext}>via Revolut</Text>
          </TouchableOpacity>
          
          <Text style={styles.gratitudeText}>
Thank you for using CheckMate! Every bit of support
            means the world to an independent developer.
          </Text>
        </View>
        </>
        )}
      </ScrollView>
    </View>
  );
}