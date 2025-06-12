import React from 'react';
import { View, Text as RNText, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeOutRight } from 'react-native-reanimated';
import { useTheme } from '../hooks/useTheme';
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
  const { reducedMotion } = useTheme();

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
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
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      letterSpacing: 1.2,
      fontWeight: '700',
    },
    statusIndicators: {
      flexDirection: 'row',
      gap: 6,
    },
    statusBadge: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 10 * fontScale,
      color: colors.textSecondary,
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderWidth: 1,
      borderColor: colors.border,
      letterSpacing: 0.8,
      fontWeight: '700',
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
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.8,
      fontWeight: '600',
    },
    originalTimestamp: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.8,
      textDecorationLine: 'line-through',
      opacity: 0.7,
      fontWeight: '500',
    },
    newTimestamp: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11 * fontScale,
      color: colors.y2kPink,
      letterSpacing: 0.8,
      marginTop: 2,
      fontWeight: '700',
    },
    statusIndicator: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11 * fontScale,
      letterSpacing: 0.8,
      marginTop: 4,
      fontWeight: '700',
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
      width: 28,
      height: 16,
      borderWidth: 0,
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
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.8,
      fontWeight: '800',
    },
    checkedText: {
      color: colors.success,
    },
    textContainer: {
      flex: 1,
    },
    taskTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16 * fontScale,
      color: colors.text,
      letterSpacing: 0.8,
      lineHeight: 24 * fontScale,
      fontWeight: '700',
    },
    completedTitle: {
      color: colors.textMuted,
      textDecorationLine: 'line-through',
    },
    taskDescription: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 13 * fontScale,
      color: colors.textSecondary,
      marginTop: 6,
      letterSpacing: 0.5,
      lineHeight: 18 * fontScale,
      fontWeight: '400',
    },
    completedDescription: {
      color: colors.textMuted,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 4,
    },
    actionButton: {
      borderWidth: 2,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 56,
      minHeight: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    completedButton: {
      borderColor: colors.textMuted,
      backgroundColor: colors.surface,
    },
    actionText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 1.5,
      fontWeight: '800',
    },
    completedActionText: {
      color: colors.textMuted,
    },
    delayButton: {
      backgroundColor: colors.surfaceVariant,
      borderColor: colors.y2kPink,
    },
    delayButtonText: {
      color: colors.y2kPink,
    },
    doneButton: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    doneButtonText: {
      color: isDark ? colors.background : '#ffffff',
      fontFamily: 'JetBrainsMono_700Bold',
    },
    deleteButton: {
      backgroundColor: colors.surfaceVariant,
      borderColor: colors.danger,
    },
    deleteButtonText: {
      color: colors.danger,
      fontFamily: 'JetBrainsMono_700Bold',
    },
    editButton: {
      backgroundColor: colors.surfaceVariant,
      borderColor: colors.y2kCyan,
    },
    editButtonText: {
      color: colors.y2kCyan,
      fontFamily: 'JetBrainsMono_700Bold',
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
      return { icon: '[ERR]', text: 'Invalid date', style: 'overdue' };
    }
    
    const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    if (task.isCompleted) {
      return { icon: '[OK]', text: 'Completed', style: 'completed' };
    }
    
    if (task.delayCount > 0) {
      if (taskDate.getTime() === today.getTime()) {
        return { icon: '[DLY]', text: 'Delayed to today', style: 'delayed' };
      } else if (taskDate.getTime() === tomorrow.getTime()) {
        return { icon: '[DLY]', text: 'Delayed to tomorrow', style: 'delayed' };
      } else if (taskDate.getTime() > tomorrow.getTime()) {
        return { icon: '[DLY]', text: 'Delayed to future', style: 'delayed' };
      }
    }
    
    if (taskDate.getTime() === today.getTime()) {
      return { icon: '[NOW]', text: 'Scheduled for today', style: 'today' };
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return { icon: '[TMR]', text: 'Scheduled for tomorrow', style: 'tomorrow' };
    } else if (taskDate.getTime() > tomorrow.getTime()) {
      return { icon: '[FUT]', text: 'Scheduled for later', style: 'future' };
    } else {
      return { icon: '[OVR]', text: 'Overdue', style: 'overdue' };
    }
  };

  const taskStatus = getTaskStatus();

  return (
    <Animated.View 
      entering={reducedMotion ? undefined : FadeInUp} 
      exiting={reducedMotion ? undefined : FadeOutRight} 
      style={styles.container}
    >
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
          <RNText style={[styles.statusIndicator, (styles as any)[`status_${taskStatus.style}`]]}>
            STATUS: {taskStatus.icon} {taskStatus.text}
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
                  {task.isCompleted ? '[X]' : '[ ]'}
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
              <RNText style={[styles.actionText, styles.delayButtonText]}>[DLY]</RNText>
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
              {task.isCompleted ? '[UDO]' : '[OK]'}
            </RNText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => router.push(`/add-task?edit=${task.id}`)}
            activeOpacity={0.7}
          >
            <RNText style={[styles.actionText, styles.editButtonText]}>[EDT]</RNText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={showDeleteConfirmation}
            activeOpacity={0.7}
          >
            <RNText style={[styles.actionText, styles.deleteButtonText]}>[DEL]</RNText>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

export default TaskItem;