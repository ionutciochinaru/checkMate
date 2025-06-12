import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, Linking, Alert, Platform } from 'react-native';
import { Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { useTaskStore } from '../hooks/useTaskStore';
import { useNotifications } from '../hooks/useNotifications';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import TaskItem from '../components/TaskItem';
import WorkingHoursSettings from '../components/WorkingHoursSettings';
import Animated from 'react-native-reanimated';

export default function HomeScreen() {
  const { tasks, settings, updateSettings } = useTaskStore();
  const { scheduleTaskReminder } = useNotifications();
  const { colors, animatedBackgroundStyle, isDark, theme, setTheme } = useTheme();
  const [showSettings, setShowSettings] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('Today');

  // Filter tasks based on selected filter
  const filterTasks = (tasks: any[], filter: string) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'Today':
        return tasks.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() === today.getTime();
        });
      case 'Tomorrow':
        return tasks.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() === tomorrow.getTime();
        });
      case 'This Week':
        return tasks.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() >= today.getTime() && taskDate.getTime() < nextWeek.getTime();
        });
      case 'All':
      default:
        return tasks;
    }
  };

  const filteredTasks = filterTasks(tasks, selectedFilter);
  const pendingTasks = filteredTasks.filter(task => !task.isCompleted);
  const completedTasks = filteredTasks.filter(task => task.isCompleted);

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

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
      paddingBottom: 12,
      paddingHorizontal: 12,
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      flexWrap: 'wrap',
      minHeight: 32,
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 6,
      lineHeight: 16 * fontScale,
    },
    terminalTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      fontWeight: '800',
      flexShrink: 1,
    },
    terminalTime: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: '600',
      flexShrink: 0,
    },
    topRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 1,
    },
    themeToggle: {
      padding: 6,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 2,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeToggleText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.accent,
      letterSpacing: 0.5,
      fontWeight: '800',
    },
    statusLine: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 6,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: 36,
    },
    settingsButton: {
      padding: 6,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 2,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIcon: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.accent,
      letterSpacing: 0.5,
      fontWeight: '800',
    },
    statusText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.3,
      fontWeight: '600',
      flexShrink: 1,
    },
    settingsCard: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      padding: 8,
      borderColor: colors.border,
      marginBottom: 8,
    },
    settingsCardHeader: {
      paddingVertical: 4,
    },
    settingsCardTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: Math.max(12, 11 * fontScale),
      color: colors.text,
      letterSpacing: 1,
      fontWeight: '800',
    },
    settingsCardDivider: {
      height: 1,
      backgroundColor: colors.border,
    },
    settingsCardContent: {
      paddingVertical: 12,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      minHeight: 32,
    },
    delayInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: Math.max(12, 10 * fontScale),
      color: colors.text,
      letterSpacing: 0.5,
      minWidth: 60,
      textAlign: 'center',
    },
    fontScaleContainer: {
      flexDirection: 'row',
      gap: 6,
    },
    fontScaleButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      minWidth: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fontScaleButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    fontScaleText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: Math.max(12, 9 * fontScale),
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    fontScaleTextActive: {
      color: colors.background,
    },
    supportText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: Math.max(12, 10 * fontScale),
      color: colors.textSecondary,
      letterSpacing: 0.3,
      lineHeight: Math.max(16, 14 * fontScale),
      marginBottom: 16,
    },
    coffeeButton: {
      backgroundColor: colors.y2kCyan,
      borderWidth: 2,
      borderColor: colors.y2kCyan,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: colors.y2kCyan,
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
    settingLabel: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: Math.max(12, 10 * fontScale),
      color: colors.text,
      letterSpacing: 0.8,
      fontWeight: '700',
      flexShrink: 0,
      minWidth: 100,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 12,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    },
    emptyTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
    },
    emptyStateButton: {
      marginTop: 16,
    },
    emptyCommand: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.surface,
      backgroundColor: colors.accent,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 0.8,
      marginRight: 12,
      fontWeight: '800',
      flexShrink: 1,
    },
    sectionLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    bottomPadding: {
      height: 80,
    },
    addButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.surface,
      maxWidth: '60%',
    },
    addButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.surface,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    filterContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 0,
      paddingVertical: 0,
      position: 'relative',
    },
    filterButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      minWidth: 100,
    },
    filterText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: 0.5,
      fontWeight: '700',
      flexShrink: 1,
    },
    filterDropdown: {
      position: 'absolute',
      top: 38,
      left: 12,
      right: 12,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
      elevation: 5,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 4,
      maxHeight: 200,
    },
    filterOption: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 36,
    },
    selectedFilterOption: {
      backgroundColor: colors.accent,
    },
    filterOptionText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: 0.5,
      fontWeight: '600',
      flexShrink: 1,
    },
    selectedFilterOptionText: {
      color: colors.background,
      fontFamily: 'JetBrainsMono_700Bold',
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterArrow: {
      marginLeft: 8,
      fontSize: 12,
      color: colors.textSecondary,
      transform: [{ rotate: '0deg' }],
    },
    filterArrowRotated: {
      transform: [{ rotate: '180deg' }],
      color: isDark ? colors.background : colors.textSecondary,
    },
    quickFilters: {
      flexDirection: 'row',
      gap: 6,
      flexShrink: 0,
    },
    quickFilterChip: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickFilterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    quickFilterText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.3,
    },
    quickFilterTextActive: {
      color: colors.background,
    },
    filterCheckmark: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      fontFamily: 'JetBrainsMono_700Bold',
      letterSpacing: 0.3,
      flexShrink: 0,
    },
    lastFilterOption: {
      borderBottomWidth: 0,
    },
    filterIndicator: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: 'JetBrainsMono_400Regular',
    },
    filterEmptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    filterEmptyIcon: {
      fontSize: 48,
      marginBottom: 16,
      opacity: 0.5,
    },
    filterEmptyTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    filterEmptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 24,
      textAlign: 'center',
    },
    filterSuggestions: {
      gap: 12,
      alignItems: 'center',
    },
    filterSuggestion: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    filterSuggestionText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
  }));

  return (
    <Animated.View style={[styles.container, animatedBackgroundStyle]}>
      {/* Terminal-style Header */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <Text style={styles.terminalTitle}>CHECKMATE.EXE</Text>
          <View style={styles.topRightControls}>
            <TouchableOpacity
              style={styles.themeToggle}
              onPress={() => {
                const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
                setTheme(nextTheme);
              }}
            >
              <Text style={styles.themeToggleText}>
                {theme === 'light' ? '[LGT]' : theme === 'dark' ? '[TRM]' : '[AUTO]'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => setShowSettings(!showSettings)}
            >
              <Text style={styles.settingsIcon}>[CFG]</Text>
            </TouchableOpacity>
            <Text style={styles.terminalTime}>{currentTime}</Text>
          </View>
        </View>

        {/* Settings Panel */}
        {showSettings && (
          <View style={styles.settingsCard}>
            <View style={styles.settingsCardHeader}>
              <Text style={styles.settingsCardTitle}>GENERAL SETTINGS</Text>
            </View>
            <View style={styles.settingsCardDivider} />
            
            <View style={styles.settingsCardContent}>
              {/* Work Hours */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>WORK_HOURS:</Text>
                <WorkingHoursSettings />
              </View>
              
              {/* Delay */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>DELAY:</Text>
                <TextInput
                  style={styles.delayInput}
                  value={settings.defaultDelay || '30m'}
                  onChangeText={(value) => updateSettings({ defaultDelay: value })}
                  placeholder="30m"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>
            
            <View style={styles.settingsCardDivider} />
            <View style={styles.settingsCardHeader}>
              <Text style={styles.settingsCardTitle}>ACCESSIBILITY</Text>
            </View>
            <View style={styles.settingsCardDivider} />
            
            <View style={styles.settingsCardContent}>
              {/* Font Scale */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>FONT SIZE:</Text>
                <View style={styles.fontScaleContainer}>
                  {[1.0, 1.2, 1.5].map(scale => (
                    <TouchableOpacity
                      key={scale}
                      style={[
                        styles.fontScaleButton,
                        settings.fontScale === scale && styles.fontScaleButtonActive
                      ]}
                      onPress={() => updateSettings({ fontScale: scale })}
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
                <Text style={styles.settingLabel}>HIGH CONTRAST:</Text>
                <Switch
                  value={settings.highContrast}
                  onValueChange={(value) => updateSettings({ highContrast: value })}
                  trackColor={{ false: colors.border, true: colors.textSecondary }}
                  thumbColor={settings.highContrast ? colors.accent : colors.textMuted}
                />
              </View>
              
              {/* Reduced Motion */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>REDUCE MOTION:</Text>
                <Switch
                  value={settings.reducedMotion}
                  onValueChange={(value) => updateSettings({ reducedMotion: value })}
                  trackColor={{ false: colors.border, true: colors.textSecondary }}
                  thumbColor={settings.reducedMotion ? colors.accent : colors.textMuted}
                />
              </View>
            </View>
            
            <View style={styles.settingsCardDivider} />
            <View style={styles.settingsCardHeader}>
              <Text style={styles.settingsCardTitle}>SUPPORT THE DEVELOPER</Text>
            </View>
            <View style={styles.settingsCardDivider} />
            
            <View style={styles.settingsCardContent}>
              <Text style={styles.supportText}>
                // If you enjoy using checkMate and find it helpful,{"\n"}
                // consider buying me a coffee! Your support helps{"\n"}
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
                    Alert.alert(
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
                // Thank you for using checkMate! Every bit of support{"\n"}
                // means the world to an independent developer.
              </Text>
            </View>
          </View>
        )}
        
        <View style={styles.statusLine}>
          <Text style={styles.statusText}>
            SYS: {currentDate} | TASKS: {tasks.length} | PENDING: {pendingTasks.length} | DONE: {completedTasks.length}
          </Text>
        </View>

        {/* Filter Dropdown */}
        <View style={styles.filterContainer}>
          <View style={styles.filterRow}>
            <TouchableOpacity
                style={[styles.filterButton, showFilterDropdown && styles.filterButtonActive]}
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                activeOpacity={0.7}
            >
              <Text style={[
                styles.filterText,
                showFilterDropdown && { color: isDark ? colors.background : '#ffffff' }
              ]}>
                [FILTER]: {selectedFilter}
              </Text>
              <Text style={[styles.filterArrow, showFilterDropdown && styles.filterArrowRotated]}>
                {showFilterDropdown ? '^' : 'v'}
              </Text>
            </TouchableOpacity>

            {/* Quick filter chips */}
            <View style={styles.quickFilters}>
              {['Today', 'All'].map(filter => (
                  <TouchableOpacity
                      key={filter}
                      style={[
                        styles.quickFilterChip,
                        selectedFilter === filter && styles.quickFilterChipActive
                      ]}
                      onPress={() => {
                        setSelectedFilter(filter);
                        setShowFilterDropdown(false);
                      }}
                      activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.quickFilterText,
                      selectedFilter === filter && styles.quickFilterTextActive
                    ]}>
                      {filter === 'Today' ? '[T]' : '[*]'}
                    </Text>
                  </TouchableOpacity>
              ))}
            </View>
          </View>

          {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                {['Today', 'Tomorrow', 'This Week', 'All'].map((filter, index) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                          styles.filterOption,
                          selectedFilter === filter && styles.selectedFilterOption,
                          index === 3 && styles.lastFilterOption
                        ]}
                        onPress={() => {
                          setSelectedFilter(filter);
                          setShowFilterDropdown(false);
                        }}
                        activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        selectedFilter === filter && styles.selectedFilterOptionText
                      ]}>
                        {filter}
                      </Text>
                      <Text style={styles.filterCheckmark}>
                        {selectedFilter === filter ? '[X]' : '[ ]'}
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
          )}
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        contentContainerStyle={styles.contentContainer}
        onTouchStart={() => {
          // Close filter dropdown when scrolling starts
          if (showFilterDropdown) setShowFilterDropdown(false);
        }}
      >
        {/* Empty State - No tasks at all */}
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>NO_TASKS_LOADED</Text>
            <Text style={styles.emptySubtitle}>// Create your first task to get started</Text>
            <Text style={styles.helpText}>
              Tasks are scheduled reminders with optional recurring intervals.
              Configure work hours to restrict notifications during off-hours.
              Use delay feature to postpone tasks when they become overdue.
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={() => router.push('/add-task')}
            >
              <Text style={styles.emptyCommand}>$ ./add_task --init</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Filter Empty State - Tasks exist but filter shows nothing */}
        {tasks.length > 0 && filteredTasks.length === 0 && (
          <View style={styles.filterEmptyState}>
            <Text style={styles.filterEmptyTitle}>NO_TASKS_FOUND</Text>
            <Text style={styles.filterEmptySubtitle}>
              // No tasks match filter: {selectedFilter}
            </Text>
            <View style={styles.filterSuggestions}>
              <TouchableOpacity
                style={styles.filterSuggestion}
                onPress={() => setSelectedFilter('All')}
              >
                <Text style={styles.filterSuggestionText}>$ show --all</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Pending Tasks Section */}
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                ACTIVE_PROCESSES [{pendingTasks.length}]
                {selectedFilter !== 'All' && (
                  <Text style={styles.filterIndicator}> // FILTER: {selectedFilter}</Text>
                )}
              </Text>
              <View style={styles.sectionLine} />
            </View>
            {pendingTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </View>
        )}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                COMPLETED_PROCESSES [{completedTasks.length}]
                {selectedFilter !== 'All' && (
                  <Text style={styles.filterIndicator}> // FILTER: {selectedFilter}</Text>
                )}
              </Text>
              <View style={styles.sectionLine} />
            </View>
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Add Button - show when there are tasks OR when filter shows no results */}
      {(tasks.length > 0 || (tasks.length > 0 && filteredTasks.length === 0)) && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            // Close filter dropdown when adding task
            if (showFilterDropdown) setShowFilterDropdown(false);
            router.push('/add-task');
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>
            {filteredTasks.length === 0 && tasks.length > 0 
              ? `$ ./add_task --${selectedFilter.toLowerCase()}` 
              : '$ ./add_task --init'
            }
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}