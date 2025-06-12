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

  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

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
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Empty State */}
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

        {/* Pending Tasks Section */}
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ACTIVE_PROCESSES [{pendingTasks.length}]</Text>
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
              <Text style={styles.sectionTitle}>COMPLETED_PROCESSES [{completedTasks.length}]</Text>
              <View style={styles.sectionLine} />
            </View>
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Floating Add Button - only show when tasks exist */}
      {tasks.length > 0 && (
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/add-task')}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>$ ./add_task --init</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}