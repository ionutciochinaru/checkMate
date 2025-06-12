import React from 'react';
import { View, Text as RNText, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeOutRight } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useTaskStore } from '../hooks/useTaskStore';
import { Task } from '../types/task';
import { y2kStyles, y2kColors } from '../utils/y2k-styles';
import { useThemedStyles } from '../hooks/useTheme';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task }) => {
  const { toggleComplete, delayTask, deleteTask } = useTaskStore();

  const styles = useThemedStyles((colors, isDark) => StyleSheet.create({
    container: {
      marginBottom: 12,
    },
    taskCard: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 0,
      padding: 16,
    },
    completedCard: {
      backgroundColor: colors.surfaceVariant,
      borderColor: isDark ? '#3a3a3a' : '#c0c0b8',
    },
    futureCard: {
      opacity: 0.7,
      borderStyle: 'dashed',
    },
    header: {
      marginBottom: 12,
    },
    statusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    taskId: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 10,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    statusIndicators: {
      flexDirection: 'row',
      gap: 6,
    },
    statusBadge: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 8,
      color: colors.textSecondary,
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: colors.border,
      letterSpacing: 0.5,
    },
    delayBadge: {
      color: colors.danger,
      borderColor: colors.danger,
      backgroundColor: 'transparent',
    },
    loopBadge: {
      color: y2kColors.electricCyan,
      borderColor: y2kColors.electricCyan,
      backgroundColor: isDark ? 'rgba(0, 255, 255, 0.2)' : 'rgba(0, 255, 255, 0.1)',
    },
    alwaysOnBadge: {
      color: y2kColors.limeGreen,
      borderColor: y2kColors.limeGreen,
      backgroundColor: isDark ? 'rgba(50, 205, 50, 0.2)' : 'rgba(50, 205, 50, 0.1)',
    },
    timestamp: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 9,
      color: colors.textMuted,
      letterSpacing: 0.5,
    },
    originalTimestamp: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 9,
      color: colors.textMuted,
      letterSpacing: 0.5,
      textDecorationLine: 'line-through',
      opacity: 0.7,
    },
    newTimestamp: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 9,
      color: y2kColors.bubblegumPink,
      letterSpacing: 0.5,
      marginTop: 2,
    },
    statusIndicator: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 9,
      letterSpacing: 0.5,
      marginTop: 4,
    },
    status_completed: {
      color: y2kColors.limeGreen,
    },
    status_today: {
      color: colors.accent,
    },
    status_tomorrow: {
      color: y2kColors.electricCyan,
    },
    status_future: {
      color: colors.textSecondary,
    },
    status_delayed: {
      color: y2kColors.bubblegumPink,
    },
    status_overdue: {
      color: colors.danger,
    },
    content: {
      marginBottom: 12,
    },
    taskContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    checkboxContainer: {
      marginRight: 12,
      marginTop: 2,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkedBox: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    checkboxText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12,
      color: colors.textSecondary,
    },
    checkedText: {
      color: colors.background,
    },
    textContainer: {
      flex: 1,
    },
    taskTitle: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 14,
      color: colors.text,
      letterSpacing: 0.5,
      lineHeight: 20,
    },
    completedTitle: {
      color: colors.textMuted,
      textDecorationLine: 'line-through',
    },
    taskDescription: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 11,
      color: colors.textSecondary,
      marginTop: 4,
      letterSpacing: 0.3,
      lineHeight: 16,
    },
    completedDescription: {
      color: colors.textMuted,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
      flexWrap: 'wrap',
    },
    actionButton: {
      borderWidth: 1,
      borderColor: colors.textSecondary,
      backgroundColor: 'transparent',
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    completedButton: {
      borderColor: colors.textMuted,
    },
    actionText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 9,
      color: colors.textSecondary,
      letterSpacing: 1,
    },
    completedActionText: {
      color: colors.textMuted,
    },
    delayButton: {
      backgroundColor: isDark ? 'rgba(255, 105, 180, 0.2)' : 'rgba(255, 105, 180, 0.1)',
      borderColor: y2kColors.bubblegumPink,
    },
    delayButtonText: {
      color: y2kColors.bubblegumPink,
    },
    doneButton: {
      ...y2kStyles.xpGreenGradient,
      borderWidth: 1,
    },
    doneButtonText: {
      color: '#FFFFFF',
      fontWeight: 'bold',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    deleteButton: {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
    },
    deleteButtonText: {
      color: '#ffffff',
      fontWeight: 'bold',
    },
    editButton: {
      backgroundColor: y2kColors.electricCyan,
      borderColor: y2kColors.electricCyan,
    },
    editButtonText: {
      color: '#000000',
      fontWeight: 'bold',
    },
  }));

  const showDeleteConfirmation = () => {
    Alert.alert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteTask(task.id)
        }
      ]
    );
  };

  const getDelayMessage = (count: number) => {
    if (count === 0) return '';
    if (count === 1) return 'DELAY_01';
    return `DELAY_${count.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Time';
    }
    return dateObj.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  const getTaskStatus = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    // Ensure reminderTime is a proper Date object
    const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
    if (isNaN(reminderDate.getTime())) {
      return { icon: '⚠️', text: 'Invalid date', style: 'overdue' };
    }
    
    const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    if (task.isCompleted) {
      return { icon: '✅', text: 'Completed', style: 'completed' };
    }
    
    if (task.delayCount > 0) {
      if (taskDate.getTime() === today.getTime()) {
        return { icon: '🔔', text: 'Delayed to today', style: 'delayed' };
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        return { icon: '⏭', text: 'Delayed to tomorrow', style: 'delayed' };
      } else if (taskDate.getTime() > tomorrow.getTime()) {
        return { icon: '📅', text: 'Delayed to future', style: 'delayed' };
      }
    }
    
    if (taskDate.getTime() === today.getTime()) {
      return { icon: '🔔', text: 'Scheduled for today', style: 'today' };
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return { icon: '⏭', text: 'Scheduled for tomorrow', style: 'tomorrow' };
    } else if (taskDate.getTime() > tomorrow.getTime()) {
      return { icon: '🗓', text: 'Scheduled for later', style: 'future' };
    } else {
      return { icon: '⚠️', text: 'Overdue', style: 'overdue' };
    }
  };

  const taskStatus = getTaskStatus();

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutRight} style={styles.container}>
      <View style={[
        styles.taskCard, 
        task.isCompleted && styles.completedCard,
        taskStatus.style === 'future' && styles.futureCard
      ]}>
        {/* Header with status indicators */}
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <RNText style={styles.taskId}>#{task.id.slice(-4).toUpperCase()}</RNText>
            <View style={styles.statusIndicators}>
              {task.isRecurring && (
                <RNText style={[styles.statusBadge, styles.loopBadge]}>LOOP</RNText>
              )}
              {task.delayCount > 0 && (
                <RNText style={[styles.statusBadge, styles.delayBadge]}>
                  {getDelayMessage(task.delayCount)}
                </RNText>
              )}
              {task.ignoreWorkingHours && (
                <RNText style={[styles.statusBadge, styles.alwaysOnBadge]}>24H</RNText>
              )}
            </View>
          </View>
          {/* Show original and new schedule if task has been delayed */}
          {task.delayCount > 0 && task.originalReminderTime ? (
            <>
              <RNText style={styles.originalTimestamp}>
                SCHED_ORIG: {formatDate(task.originalReminderTime)} {formatTime(task.originalReminderTime)}
              </RNText>
              <RNText style={styles.newTimestamp}>
                SCHED_NEW: {formatDate(task.reminderTime)} {formatTime(task.reminderTime)}
              </RNText>
            </>
          ) : (
            <RNText style={styles.timestamp}>
              SCHED: {formatDate(task.reminderTime)} {formatTime(task.reminderTime)}
            </RNText>
          )}
          
          {/* Status indicator */}
          <RNText style={[styles.statusIndicator, styles[`status_${taskStatus.style}`]]}>
            {taskStatus.icon} {taskStatus.text}
          </RNText>
        </View>

        {/* Task content */}
        <View style={styles.content}>
          <TouchableOpacity 
            style={styles.taskContent}
            onPress={() => toggleComplete(task.id)}
            activeOpacity={0.7}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, task.isCompleted && styles.checkedBox]}>
                <RNText style={[styles.checkboxText, task.isCompleted && styles.checkedText]}>
                  {task.isCompleted ? '✓' : '○'}
                </RNText>
              </View>
            </View>
            
            <View style={styles.textContainer}>
              <RNText style={[styles.taskTitle, task.isCompleted && styles.completedTitle]}>
                {task.title.toUpperCase()}
              </RNText>
              
              {task.description && (
                <RNText style={[styles.taskDescription, task.isCompleted && styles.completedDescription]}>
                  // {task.description}
                </RNText>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Action buttons */}
        <View style={styles.actions}>
          {!task.isCompleted && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.delayButton]}
              onPress={() => delayTask(task.id)}
              activeOpacity={0.7}
            >
              <RNText style={[styles.actionText, styles.delayButtonText]}>DELAY</RNText>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              task.isCompleted ? styles.completedButton : styles.doneButton
            ]}
            onPress={() => toggleComplete(task.id)}
            activeOpacity={0.7}
          >
            <RNText style={[
              styles.actionText, 
              task.isCompleted ? styles.completedActionText : styles.doneButtonText
            ]}>
              {task.isCompleted ? 'UNDO' : 'DONE'}
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/add-task?edit=${task.id}`)}
            activeOpacity={0.7}
          >
            <RNText style={[styles.actionText, styles.editButtonText]}>EDIT</RNText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={showDeleteConfirmation}
            activeOpacity={0.7}
          >
            <RNText style={[styles.actionText, styles.deleteButtonText]}>DELETE</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

export default TaskItem;