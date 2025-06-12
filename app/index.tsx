import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
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

  const styles = useThemedStyles((colors, isDark) => StyleSheet.create({
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
      marginBottom: 8,
    },
    terminalTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16,
      color: colors.text,
      letterSpacing: 1,
    },
    terminalTime: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    topRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themeToggle: {
      padding: 4,
    },
    themeToggleText: {
      fontSize: 16,
    },
    statusLine: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 8,
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    settingsButton: {
      padding: 4,
    },
    settingsIcon: {
      fontSize: 14,
    },
    statusText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    settingsPanel: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    inlineSettingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      gap: 12,
    },
    delayInput: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 4,
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11,
      color: colors.text,
      letterSpacing: 0.5,
      minWidth: 60,
    },
    settingLabel: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11,
      color: colors.text,
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    emptyTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
    },
    emptyStateButton: {
      marginTop: 16,
    },
    emptyCommand: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11,
      color: colors.textMuted,
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
      fontSize: 12,
      color: colors.text,
      letterSpacing: 1,
      marginRight: 16,
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
      bottom: 20,
      right: 20,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    addButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 10,
      color: colors.background,
      letterSpacing: 1,
    },
    filterContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 0,
      paddingTop: 16,
      position: 'relative',
    },
    filterButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 6,
      alignSelf: 'flex-start',
      flexDirection: 'row',
      alignItems: 'center',
    },
    filterText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 10,
      color: isDark ? colors.text : colors.text,
      letterSpacing: 0.5,
    },
    filterDropdown: {
      position: 'absolute',
      top: 42,
      left: 16,
      right: 16,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
      elevation: 5,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 4,
    },
    filterOption: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectedFilterOption: {
      backgroundColor: colors.accent,
    },
    filterOptionText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 11,
      color: colors.text,
      letterSpacing: 0.5,
    },
    selectedFilterOptionText: {
      color: colors.background,
      fontFamily: 'JetBrainsMono_700Bold',
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    filterButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterArrow: {
      marginLeft: 8,
      fontSize: 10,
      color: colors.textSecondary,
      transform: [{ rotate: '0deg' }],
    },
    filterArrowRotated: {
      transform: [{ rotate: '180deg' }],
      color: isDark ? colors.background : colors.textSecondary,
    },
    quickFilters: {
      flexDirection: 'row',
      gap: 8,
    },
    quickFilterChip: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: 12,
    },
    quickFilterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    quickFilterText: {
      fontSize: 12,
    },
    quickFilterTextActive: {
      fontSize: 12,
    },
    filterCheckmark: {
      fontSize: 12,
      color: isDark ? colors.background : '#ffffff',
      fontFamily: 'JetBrainsMono_700Bold',
    },
    lastFilterOption: {
      borderBottomWidth: 0,
    },
    filterIndicator: {
      fontSize: 10,
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
      fontSize: 11,
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
      fontSize: 11,
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
                {theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🌓'}
              </Text>
            </TouchableOpacity>
            <Text style={styles.terminalTime}>{currentTime}</Text>
          </View>
        </View>
        
        <View style={styles.statusLine}>
          <Text style={styles.statusText}>
            SYS: {currentDate} | TASKS: {tasks.length} | PENDING: {pendingTasks.length} | DONE: {completedTasks.length}
          </Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Settings Panel */}
        {showSettings && (
          <View style={styles.settingsPanel}>
            <View style={styles.inlineSettingRow}>
              <Text style={styles.settingLabel}>WORK_HOURS:</Text>
              <WorkingHoursSettings />
            </View>
            
            <View style={styles.inlineSettingRow}>
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
        )}

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
                🔍 FILTER: {selectedFilter}
              </Text>
              <Text style={[styles.filterArrow, showFilterDropdown && styles.filterArrowRotated]}>
                ▾
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
                      {filter === 'Today' ? '📅' : '🌐'}
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
                        {selectedFilter === filter ? '✓' : ' '}
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
            <Text style={styles.emptySubtitle}>// Initialize new task to begin</Text>
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
            <Text style={styles.filterEmptyIcon}>🔍</Text>
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
              <TouchableOpacity
                style={styles.filterSuggestion}
                onPress={() => router.push('/add-task')}
              >
                <Text style={styles.filterSuggestionText}>$ ./add_task --for={selectedFilter.toLowerCase()}</Text>
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