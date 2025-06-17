import React from 'react';
import { View, Text, Text as RNText, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeOutRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
} from 'react-native-reanimated';
import { useTheme , useThemedStyles } from '../hooks/useTheme';
import { router } from 'expo-router';
import { useTaskStore, useMainStore } from '../hooks/useTaskStore';
import { Task } from '../types/task';
import { formatDateWithPreference, formatTime } from '../utils/dateFormatters';
import { Ionicons } from '@expo/vector-icons';

import { showAlert } from './CustomAlert';

interface TaskItemProps {
  task: Task;
}

// Theme-appropriate colors that work with both light and dark themes
const getStatusColors = (colors: any, isDark: boolean) => ({
  success: colors.success, // Use theme success color
  info: isDark ? colors.textSecondary : colors.accent, // Use theme colors for info/edit
  delayed: colors.warning, // Use theme warning color for delayed
  completion: isDark ? colors.textSecondary : colors.textMuted, // Use theme colors for completion count
});

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task }) => {
  const { toggleComplete, delayTask, deleteTask } = useTaskStore();
  const { getSettings } = useMainStore();
  const { colors, reducedMotion, isDark } = useTheme();
  
  const settings = getSettings();
  const statusColors = getStatusColors(colors, isDark);
  const delayTime = settings.defaultDelay || '30m';
  
  const cardScale = useSharedValue(1);
  const buttonPulse = useSharedValue(1);

  const getTaskStatus = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    
    const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
    if (isNaN(reminderDate.getTime())) {
      return { icon: '[ERR]', text: 'Invalid date', style: 'overdue' };
    }
    
    const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    if (task.isCompleted && !task.isRecurring) {
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
      return { icon: '[NOW]', text: task.isRecurring ? 'Next due today' : 'Scheduled for today', style: 'today' };
    } else if (taskDate.getTime() === tomorrow.getTime()) {
      return { icon: '[TMR]', text: task.isRecurring ? 'Next due tomorrow' : 'Scheduled for tomorrow', style: 'tomorrow' };
    } else if (taskDate.getTime() > tomorrow.getTime()) {
      return { icon: '[FUT]', text: task.isRecurring ? 'Next due later' : 'Scheduled for later', style: 'future' };
    } else {
      return { icon: '[OVR]', text: 'Overdue', style: 'overdue' };
    }
  };

  const taskStatus = getTaskStatus();

  const getCardBorderColor = () => {
    if (task.isCompleted) return statusColors.success;
    
    switch (taskStatus.style) {
      case 'today': return colors.accent;
      case 'tomorrow': return statusColors.info;
      case 'delayed': return statusColors.delayed;
      case 'overdue': return colors.danger;
      default: return colors.border;
    }
  };

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    taskCard: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: getCardBorderColor(),
      borderRadius: config.borderRadius,
      padding: 16,
      shadowColor: isDark ? getCardBorderColor() : 'transparent',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: isDark ? 0.3 : 0,
      shadowRadius: isDark ? 4 : 0,
      elevation: isDark ? 4 : 0,
    },
    completedCard: {
      backgroundColor: colors.surfaceVariant,
      borderColor: statusColors.success,
    },
    futureCard: {
      opacity: 0.8,
      borderStyle: 'dashed',
    },
    mainTaskLine: {
      marginBottom: 12,
      minHeight: 44,
    },
    
    firstRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    
    titleRow: {
      marginBottom: 8,
    },
    leftSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    rightSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    scheduleSection: {
      marginBottom: 8,
    },
    descriptionSection: {
      marginBottom: 8,
    },
    taskId: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 1.0,
      fontWeight: '700',
      minWidth: 50,
    },
    statusIndicators: {
      flexDirection: 'row',
      gap: 6,
    },
    statusBadge: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 9 * fontScale,
      color: colors.textMuted,
      backgroundColor: colors.surfaceVariant,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderWidth: 0,
      letterSpacing: 0.3,
      fontWeight: '700',
      borderRadius: config.borderRadius,
      overflow: 'hidden',
    },
    delayBadge: {
      color: statusColors.delayed,
      backgroundColor: `${statusColors.delayed}15`,
    },
    loopBadge: {
      color: statusColors.info,
      backgroundColor: `${statusColors.info}15`,
    },
    alwaysOnBadge: {
      color: statusColors.success,
      backgroundColor: `${statusColors.success}15`,
    },
    completionBadge: {
      color: statusColors.completion,
      backgroundColor: `${statusColors.completion}15`,
    },
    timestamp: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.8,
      fontWeight: '500',
      marginBottom: 2,
    },
    originalTimestamp: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.8,
      textDecorationLine: 'line-through',
      fontWeight: '500',
      marginBottom: 2,
      opacity: 0.7,
    },
    newTimestamp: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      color: statusColors.delayed,
      letterSpacing: 0.8,
      fontWeight: '600',
      marginBottom: 2,
      textShadowColor: isDark ? statusColors.delayed : 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isDark ? 3 : 0,
    },
    statusIndicator: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 11 * fontScale,
      letterSpacing: 0.8,
      fontWeight: '600',
      marginBottom: 2,
    },
    status_completed: {
      color: statusColors.success,
      textShadowColor: isDark ? statusColors.success : 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isDark ? 3 : 0,
    },
    status_today: {
      color: colors.accent,
      textShadowColor: isDark ? colors.accent : 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isDark ? 3 : 0,
    },
    status_tomorrow: {
      color: statusColors.info,
      textShadowColor: isDark ? statusColors.info : 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isDark ? 3 : 0,
    },
    status_future: {
      color: colors.textSecondary,
    },
    status_delayed: {
      color: statusColors.delayed,
      textShadowColor: isDark ? statusColors.delayed : 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isDark ? 3 : 0,
    },
    status_overdue: {
      color: colors.danger,
      textShadowColor: isDark ? colors.danger : 'transparent',
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: isDark ? 3 : 0,
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
      width: 24,
      height: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkedBox: {
      backgroundColor: statusColors.success,
      borderColor: statusColors.success,
    },
    checkboxText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: '700',
    },
    checkedText: {
      color: isDark ? colors.background : '#ffffff',
    },
    textContainer: {
      flex: 1,
    },
    taskTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 15 * fontScale,
      color: colors.text,
      letterSpacing: 0.8,
      fontWeight: '700',
      // paddingLeft: spacing.xl + 12, // Align with ID after checkbox
    },
    completedTitle: {
      color: colors.textMuted,
      textDecorationLine: 'line-through',
      opacity: 0.7,
    },
    taskDescription: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 13 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      lineHeight: 18 * fontScale,
      fontStyle: 'italic',
    },
    completedDescription: {
      color: colors.textMuted,
      opacity: 0.7,
    },
    actions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 6,
      flexWrap: 'wrap',
      marginTop: 4,
    },
    actionButton: {
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      minWidth: 56,
      minHeight: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    completedButton: {
      borderColor: colors.textMuted,
      backgroundColor: colors.surface,
    },
    actionText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 13 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 1.5,
      fontWeight: '800',
    },
    completedActionText: {
      color: colors.textMuted,
    },
    delayButton: {
      backgroundColor: colors.surfaceVariant,
      borderColor: statusColors.delayed,
    },
    delayButtonText: {
      color: statusColors.delayed,
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
      borderColor: statusColors.info,
    },
    editButtonText: {
      color: statusColors.info,
      fontFamily: 'JetBrainsMono_700Bold',
    },
  }));

  // Animation styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }]
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonPulse.value }]
  }));

  // Animate card when task updates
  const animateCardUpdate = () => {
    if (reducedMotion) return;
    
    cardScale.value = withSpring(1.02, { damping: 15, stiffness: 300 }, () => {
      cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
  };

  // Animate button when pressed
  const animateButtonPress = () => {
    if (reducedMotion) return;
    
    buttonPulse.value = withSpring(0.95, { damping: 20, stiffness: 400 }, () => {
      buttonPulse.value = withSpring(1, { damping: 20, stiffness: 400 });
    });
  };

  const handleDelayTask = async () => {
    animateButtonPress();
    setTimeout(() => {
      delayTask(task.id, delayTime);
      animateCardUpdate();
    }, 100);
  };

  const handleToggleComplete = async () => {
    animateButtonPress();
    setTimeout(() => {
      toggleComplete(task.id);
      animateCardUpdate();
    }, 100);
  };

  const showDeleteConfirmation = () => {
    showAlert(
      'Delete Task',
      `Are you sure you want to delete "${task.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            animateCardUpdate();
          }
        }
      ]
    );
  };

  const getDelayMessage = (count: number) => {
    if (count === 0) return '';
    if (count === 1) return 'Delayed';
    return `Delayed ${count}x`;
  };

  const getLoopIntervalLabel = (hours: number) => {
    if (hours === 1) return '1H';
    if (hours === 4) return '4H';
    if (hours === 8) return '8H';
    if (hours === 12) return '12H';
    if (hours === 24) return '24H';
    if (hours === 72) return '3D';
    if (hours === 168) return '1W';
    // Fallback for custom intervals
    if (hours < 24) return `${hours}H`;
    if (hours % 24 === 0) return `${hours / 24}D`;
    return `${hours}H`;
  };

  const formatTimeWithPreference = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Time';
    }
    return formatTime(dateObj, settings.timeFormat);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return formatDateWithPreference(
      dateObj, 
      settings.dateFormat, 
      settings.dateUseMonthNames, 
      settings.dateSeparator
    );
  };

  return (
    <Animated.View 
      entering={reducedMotion ? undefined : FadeInUp} 
      exiting={reducedMotion ? undefined : FadeOutRight} 
      style={[styles.container, animatedCardStyle]}
    >
      <Animated.View style={[
        styles.taskCard, 
        task.isCompleted && styles.completedCard,
        taskStatus.style === 'future' && styles.futureCard
      ]}>
        {/* Main task section with separate rows */}
        <View style={styles.mainTaskLine}>
          {/* First row: checkbox + ID + badges */}
          {task.isRecurring ? (
            <View style={styles.firstRow}>
              <View style={styles.leftSection}>
                <RNText style={styles.taskId}>#{task.id.slice(-4).toUpperCase()}</RNText>
              </View>
              
              <View style={styles.rightSection}>
                {task.delayCount > 0 && (
                  <RNText style={[styles.statusBadge, styles.delayBadge]}>
                    {getDelayMessage(task.delayCount)}
                  </RNText>
                )}
                {task.isRecurring && (
                  <RNText style={[styles.statusBadge, styles.loopBadge]}>
Loop {getLoopIntervalLabel(task.recurringInterval || 24)}
                  </RNText>
                )}
                {task.isRecurring && (task.completionCount || 0) > 0 && (
                  <RNText style={[styles.statusBadge, styles.completionBadge]}>
Done {task.completionCount}x
                  </RNText>
                )}
                {task.ignoreWorkingHours && (
                  <RNText style={[styles.statusBadge, styles.alwaysOnBadge]}>24H</RNText>
                )}
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.firstRow}
              onPress={handleToggleComplete}
              activeOpacity={0.7}
            >
              <View style={styles.leftSection}>
                <View style={[styles.checkbox, task.isCompleted && styles.checkedBox]}>
                  <RNText style={[styles.checkboxText, task.isCompleted && styles.checkedText]}>
                    {task.isCompleted ? '[X]' : '[ ]'}
                  </RNText>
                </View>
                
                <RNText style={styles.taskId}>#{task.id.slice(-4).toUpperCase()}</RNText>
              </View>
              
              <View style={styles.rightSection}>
                {task.delayCount > 0 && (
                  <RNText style={[styles.statusBadge, styles.delayBadge]}>
                    {getDelayMessage(task.delayCount)}
                  </RNText>
                )}
                {task.ignoreWorkingHours && (
                  <RNText style={[styles.statusBadge, styles.alwaysOnBadge]}>24H</RNText>
                )}
              </View>
            </TouchableOpacity>
          )}
          
          {/* Second row: title */}
          {task.isRecurring ? (
            <View style={styles.titleRow}>
              <RNText style={[styles.taskTitle, task.isCompleted && styles.completedTitle]}>
                {task.title.toUpperCase()}
              </RNText>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.titleRow}
              onPress={handleToggleComplete}
              activeOpacity={0.7}
            >
              <RNText style={[styles.taskTitle, task.isCompleted && styles.completedTitle]}>
                {task.title.toUpperCase()}
              </RNText>
            </TouchableOpacity>
          )}
        </View>

        {/* Schedule information */}
        <View style={styles.scheduleSection}>
          {task.delayCount > 0 && task.originalReminderTime ? (
            <>
              <RNText style={styles.originalTimestamp}>
                Originally: {formatDate(task.originalReminderTime)} {formatTimeWithPreference(task.originalReminderTime)}
              </RNText>
              <RNText style={styles.newTimestamp}>
                Delayed to: {formatDate(task.reminderTime)} {formatTimeWithPreference(task.reminderTime)}
              </RNText>
            </>
          ) : (
            <RNText style={styles.timestamp}>
{task.isRecurring ? 'Next:' : 'Due:'} {formatDate(task.reminderTime)} {formatTimeWithPreference(task.reminderTime)}
            </RNText>
          )}
          
          <RNText style={[styles.statusIndicator, (styles as any)[`status_${taskStatus.style}`]]}>
Status: {taskStatus.text}
          </RNText>
        </View>

        {/* Description if exists */}
        {task.description && (
          <View style={styles.descriptionSection}>
            <RNText style={[styles.taskDescription, task.isCompleted && styles.completedDescription]}>
              // {task.description}
            </RNText>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actions}>
          {!task.isCompleted && (
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.delayButton]}
                onPress={handleDelayTask}
                activeOpacity={0.7}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons 
                    name="time-outline" 
                    size={12} 
                    color={statusColors.delayed} 
                  />
                  <Text style={[styles.actionText, styles.delayButtonText]}>
                    {delayTime}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}
          
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                task.isCompleted ? styles.completedButton : styles.doneButton
              ]}
              onPress={handleToggleComplete}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons 
                  name={task.isCompleted ? 'refresh-outline' : (task.isRecurring ? 'add' : 'checkmark')} 
                  size={12} 
                  color={task.isCompleted ? colors.textMuted : (isDark ? colors.background : '#ffffff')} 
                />
                <Text style={[styles.actionText, task.isCompleted ? styles.completedActionText : styles.doneButtonText]}>
                  {task.isCompleted ? 'UNDO' : (task.isRecurring ? 'NEXT' : 'DONE')}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.editButton]}
              onPress={() => {
                animateButtonPress();
                router.push(`/add-task?edit=${task.id}`);
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons 
                  name="create-outline" 
                  size={12} 
                  color={statusColors.info} 
                />
                <Text style={[styles.actionText, styles.editButtonText]}>
                  EDIT
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deleteButton]}
              onPress={() => {
                animateButtonPress();
                showDeleteConfirmation();
              }}
              activeOpacity={0.7}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons 
                  name="trash-outline" 
                  size={12} 
                  color={colors.danger} 
                />
                <Text style={[styles.actionText, styles.deleteButtonText]}>
                  DEL
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </Animated.View>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;