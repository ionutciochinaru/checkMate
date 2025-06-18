import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { 
  FadeInUp, 
  FadeOutRight, 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  withTiming,
  withSequence,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { useTheme , useThemedStyles } from '../hooks/useTheme';
import { router } from 'expo-router';
import { useTaskStore, useMainStore } from '../hooks/useTaskStore';
import { Task } from '../types/task';
import { formatTime } from '../utils/dateFormatters';
import { Ionicons } from '@expo/vector-icons';

import { showAlert } from './CustomAlert';

interface TaskItemProps {
  task: Task;
}

// Color palette from design - exact color codes for light theme
const LIGHT_CARD_COLORS = {
  orange: '#EB8146',
  blue: '#A9CEF2', 
  yellow: '#D7D982',
  pink: '#F09BAF',
  lightYellow: '#EEC045',
  lightGray: '#F0EFEC',
};


const CARD_TEXT_COLORS = {
  light: '#313131',
  dark: '#FFFFFF',
};

// Get card color based on task properties and theme
const getCardColor = (task: Task, isDark: boolean, themeColors: any) => {
  if (task.isCompleted) {
    return isDark ? themeColors.surfaceVariant : LIGHT_CARD_COLORS.lightGray;
  }
  
  if (isDark) {
    // Use theme colors for dark mode - variations matching filter and header
    const darkColors = [themeColors.surfaceVariant];
    const index = Math.abs(task.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % darkColors.length;
    return darkColors[index];
  } else {
    // Use colorful palette for light theme
    const lightColors = [LIGHT_CARD_COLORS.orange, LIGHT_CARD_COLORS.blue, LIGHT_CARD_COLORS.yellow, LIGHT_CARD_COLORS.pink, LIGHT_CARD_COLORS.lightYellow];
    const index = Math.abs(task.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % lightColors.length;
    return lightColors[index];
  }
};

const TaskItem: React.FC<TaskItemProps> = React.memo(({ task }) => {
  const { toggleComplete, delayTask, deleteTask } = useTaskStore();
  const { getSettings } = useMainStore();
  const { colors, reducedMotion, isDark } = useTheme();
  
  const settings = getSettings();
  const delayTime = settings.defaultDelay || '30m';
  const cardColor = getCardColor(task, isDark, colors);
  const textColor = isDark ? colors.text : CARD_TEXT_COLORS.light;
  const textColorVariant = isDark ? colors.background : CARD_TEXT_COLORS.dark;
  const lightTextColor = isDark ? colors.textSecondary : LIGHT_CARD_COLORS.lightGray;
  
  const cardScale = useSharedValue(1);
  const strikethroughProgress = useSharedValue(0);
  const timeChangeProgress = useSharedValue(0);

  // State for menu dropdown and UI feedback
  const [showMenu, setShowMenu] = useState(false);
  const [isDelaying, setIsDelaying] = useState(false);
  const [isProcessingNext, setIsProcessingNext] = useState(false);

  // Get day info for completed tasks
  const getDayInfo = () => {
    const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
    const dayNumber = reminderDate.getDate();
    const dayName = reminderDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return { dayNumber, dayName };
  };

  // Truncate description text
  const getTruncatedDescription = (text: string, maxLength: number = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Get time info for display with before/after delay logic
  const getTimeInfo = () => {
    const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
    const now = new Date();
    const timeDiff = reminderDate.getTime() - now.getTime();
    const minutesLeft = Math.ceil(timeDiff / (1000 * 60));
    
    if (minutesLeft < 0) return 'Overdue';
    if (minutesLeft < 60) return `${minutesLeft} min`;
    
    const hoursLeft = Math.ceil(minutesLeft / 60);
    if (hoursLeft < 24) return `${hoursLeft}h ${minutesLeft % 60}m`;
    
    return formatTime(reminderDate, settings.timeFormat);
  };

  // Get formatted time for display
  const getCurrentTime = () => {
    const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
    return formatTime(reminderDate, settings.timeFormat);
  };

  // Get original time (before delays) for display
  const getOriginalTime = () => {
    if (!task.originalReminderTime) return null;
    const originalDate = task.originalReminderTime instanceof Date ? task.originalReminderTime : new Date(task.originalReminderTime);
    return formatTime(originalDate, settings.timeFormat);
  };

  // Get natural language time display (Option 1 format)
  const getFormattedTimeDisplay = (dateToUse?: Date, isOriginal = false) => {
    const reminderDate = dateToUse || (task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime));
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    const dayDifference = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const timeString = formatTime(reminderDate, settings.timeFormat);
    const fullDateText = reminderDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: reminderDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });

    let prefix = '';
    let timePhrase = '';

    if (isOriginal) {
      prefix = 'Originally scheduled for ';
    } else {
      prefix = task.isRecurring ? 'Next occurrence ' : 'Scheduled ';
    }

    if (dayDifference === 0) {
      timePhrase = `today at ${timeString}`;
    } else if (dayDifference === 1) {
      timePhrase = `tomorrow at ${timeString}`;
    } else if (dayDifference === -1) {
      timePhrase = `yesterday at ${timeString}`;
    } else if (dayDifference > 1) {
      timePhrase = `in ${dayDifference} days at ${timeString} (${fullDateText})`;
    } else if (dayDifference < -1) {
      timePhrase = `${Math.abs(dayDifference)} days ago at ${timeString} (${fullDateText})`;
    } else {
      timePhrase = `at ${timeString} (${fullDateText})`;
    }

    return prefix + timePhrase;
  };

  // Legacy function for backward compatibility if needed elsewhere
  const getDateInfo = (dateToUse?: Date) => {
    const reminderDate = dateToUse || (task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime));
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
    
    const dayDifference = Math.floor((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let relativeDateText = '';
    let fullDateText = reminderDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: reminderDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });

    if (dayDifference === 0) {
      relativeDateText = 'today';
    } else if (dayDifference === 1) {
      relativeDateText = 'tomorrow';
    } else if (dayDifference === -1) {
      relativeDateText = 'yesterday';
    } else if (dayDifference > 1) {
      relativeDateText = `in ${dayDifference} days`;
    } else if (dayDifference < -1) {
      relativeDateText = `${Math.abs(dayDifference)} days ago`;
    } else {
      relativeDateText = fullDateText;
    }

    return {
      relative: relativeDateText,
      full: fullDateText,
      dayDifference
    };
  };

  // Check if task was delayed
  const wasDelayed = () => {
    return task.delayCount > 0 && task.originalReminderTime;
  };

  // Get day info for completed tasks (for the existing design)
  const getCompletedDayInfo = () => {
    const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
    const dayNumber = reminderDate.getDate();
    const dayName = reminderDate.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    return { dayNumber, dayName };
  };


  // Effect to handle time change animations after delays
  useEffect(() => {
    if (wasDelayed() && !reducedMotion) {
      timeChangeProgress.value = withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [task.reminderTime, task.delayCount, reducedMotion]);

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    container: {
      marginBottom: 3,
    },
    // Normal task card (card_normal.png style)
    taskCard: {
      backgroundColor: cardColor,
      borderRadius: 32,
      padding: 20,
      minHeight: 120,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    // Completed task card (card_done.png style)
    completedCard: {
      backgroundColor: cardColor,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 60,
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    dayCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? colors.background : CARD_TEXT_COLORS.light,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    dayText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: lightTextColor,
      textAlign: 'center',
    },
    dayLabel: {
      fontSize: 8,
      color: lightTextColor,
      textAlign: 'center',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 5,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap',
      flex: 1,
      justifyContent: 'flex-end',
    },
    taskId: {
      fontSize: 10,
      color: textColor,
      fontWeight: '700',
      letterSpacing: 0.5,
    },
    taskStatus: {
      fontSize: 9,
      color: textColor,
      fontWeight: '600',
      opacity: 0.8,
      marginLeft: 8,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      backgroundColor: 'rgba(255,255,255,0.1)',
      textTransform: 'uppercase',
      letterSpacing: 0.3,
    },
    timeInfo: {
      fontSize: 12,
      color: textColor,
      fontWeight: '500',
    },
    delayBadge: {
      fontSize: 10,
      color: textColor,
      fontWeight: '600',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    recurringBadge: {
      fontSize: 10,
      color: textColor,
      fontWeight: '600',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    alwaysOnBadge: {
      fontSize: 10,
      color: textColor,
      fontWeight: '600',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    taskMeta: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
      paddingVertical: 6,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255,255,255,0.1)',
      borderRadius: 8,
    },
    metaText: {
      fontSize: 12,
      color: textColor,
      fontWeight: '500',
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: textColor,
      marginBottom: 4,
      lineHeight: 24,
    },
    taskDescription: {
      fontSize: 13,
      color: textColor,
      marginBottom: 12,
      lineHeight: 18,
      fontStyle: 'italic',
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 8,
      flexWrap: 'wrap',
    },
    actionBtnDone: {
      backgroundColor: textColor,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      borderStyle: 'solid',
      borderWidth: 0.5,
      minHeight: 28,
      flex: 1,
      justifyContent: 'center',
    },
    actionBtnTextDone: {
      color: textColorVariant,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    actionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 16,
      borderStyle: 'solid',
      borderWidth: 0.5,
      minHeight: 28,
      flex: 1,
      justifyContent: 'center',
    },
    actionBtnText: {
      color: textColor,
      fontSize: 12,
      fontWeight: '600',
      marginLeft: 4,
    },
    completedTaskInfo: {
      flex: 1,
    },
    completedTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: textColor,
      marginBottom: 4,
      textDecorationLine: "line-through"
    },
    completedSubtitle: {
      fontSize: 12,
      color: textColor,
    },
    undoButtonText: {
      fontSize: 12,
      color: textColor,
    },
    undoButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'transparent',
      borderColor: textColor,
      borderStyle: 'dashed',
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
      gap: 4,
      display: "flex",
      flexDirection: "row",
    },
    menuButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'transparent',
      borderWidth: 0.5,
      borderColor: '#666',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 8,
    },
    menuDropdown: {
      position: 'absolute',
      top: 45,
      right: 0,
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 8,
      minWidth: 220,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
      zIndex: 1000,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
    },
    menuItemText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: '500',
      color: textColor,
    },
    deleteMenuItem: {
      color: textColor,
    },
    doneStatus: {
      fontSize: 12,
      color: textColor,
      fontWeight: '500',
      marginTop: 2,
      opacity: 0.7,
    },
    // Strikethrough animation styles
    strikethroughOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
      borderRadius: 32,
      zIndex: 5,
    },
    strikethroughLine: {
      height: 3,
      backgroundColor: colors.accent,
      width: '80%',
      borderRadius: 2,
    },
    // Unified time container styles
    timeInfoContainer: {
      backgroundColor: cardColor,
      marginBottom: 8,
    },
    singleTimeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 2,
    },
    timeMainText: {
      fontSize: 14,
      color: textColor,
      fontWeight: '800',
    },
    timeDateText: {
      fontSize: 12,
      color: textColor,
      fontWeight: '400',
      opacity: 0.8,
    },
    // Time change styles (when delayed)
    timeChangeContainer: {
      borderTopWidth: 1,
      borderTopColor: textColor,
      paddingTop: 6,
      marginTop: 6,
      opacity: 0.8,
    },
    oldTimeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    oldTimeText: {
      fontSize: 12,
      color: textColor,
      fontWeight: '500',
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
    oldDateText: {
      fontSize: 10,
      color: textColor,
      fontWeight: '400',
      textDecorationLine: 'line-through',
      opacity: 0.6,
    },
    newTimeText: {
      fontSize: 12,
      color: textColor,
      fontWeight: '600',
    },
    newDateText: {
      fontSize: 10,
      color: textColor,
      fontWeight: '400',
    },
    // Enhanced button states
    actionBtnPressed: {
      backgroundColor: colors.accent,
      transform: [{ scale: 0.95 }],
    },
    delayingButton: {
      backgroundColor: colors.warning,
    },
  }));

  // Animation styles
  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }]
  }));


  const animatedStrikethroughStyle = useAnimatedStyle(() => ({
    opacity: strikethroughProgress.value,
    transform: [{ 
      scaleX: interpolate(strikethroughProgress.value, [0, 1], [0, 1], Extrapolate.CLAMP) 
    }],
  }));

  const animatedTimeChangeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(timeChangeProgress.value, [0, 0.5, 1], [1, 0.3, 1], Extrapolate.CLAMP),
    transform: [{ 
      scale: interpolate(timeChangeProgress.value, [0, 0.5, 1], [1, 1.1, 1], Extrapolate.CLAMP) 
    }],
  }));


  // Animate card when task updates
  const animateCardUpdate = () => {
    if (reducedMotion) return;
    
    cardScale.value = withSpring(1.02, { damping: 15, stiffness: 300 }, () => {
      cardScale.value = withSpring(1, { damping: 15, stiffness: 300 });
    });
  };

  const handleToggleComplete = async () => {
    console.log('Toggle complete called for task:', task.id, 'isRecurring:', task.isRecurring);
    
    if (task.isRecurring) {
      setIsProcessingNext(true);
    }
    
    try {
      await toggleComplete(task.id);
      animateCardUpdate();
      
      // Show feedback for recurring tasks
      if (task.isRecurring) {
        console.log('Recurring task completed, should reschedule');
        // Reset processing state after a brief delay
        setTimeout(() => {
          setIsProcessingNext(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Error toggling task completion:', error);
      setIsProcessingNext(false);
    }
  };

  const handleDelayTask = async () => {
    if (isDelaying) return;
    
    setIsDelaying(true);
    
    if (!reducedMotion) {
      // Animate strikethrough effect
      strikethroughProgress.value = withTiming(1, { duration: 600 }, () => {
        strikethroughProgress.value = withTiming(0, { duration: 300 });
      });
    }
    
    // Delay the actual task update to sync with animation
    setTimeout(() => {
      delayTask(task.id, delayTime);
      animateCardUpdate();
      setIsDelaying(false);
    }, reducedMotion ? 0 : 300);
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

  if (task.isCompleted) {
    // Completed task design (card_done.png style)
    return (
      <Animated.View 
        entering={reducedMotion ? undefined : FadeInUp} 
        exiting={reducedMotion ? undefined : FadeOutRight} 
        style={[styles.container, animatedCardStyle]}
      >
        <View style={[styles.taskCard, styles.completedCard, { position: 'relative' }]}>
          <View style={styles.dayCircle}>
            <Text style={styles.dayText}>{getCompletedDayInfo().dayNumber}</Text>
            <Text style={styles.dayLabel}>{getCompletedDayInfo().dayName}</Text>
          </View>
          
          <View style={styles.completedTaskInfo}>
            <Text style={styles.completedTitle}>{task.title}</Text>
            {task.description && (
              <Text style={styles.completedSubtitle}>
                {getTruncatedDescription(task.description)}
              </Text>
            )}
          </View>
          
          <TouchableOpacity style={styles.undoButton} onPress={handleToggleComplete}>
            <Ionicons name="arrow-undo" size={16} color={textColor} />
          </TouchableOpacity>
          
          <View style={{ position: 'relative' }}>
            <TouchableOpacity 
              style={styles.menuButton} 
              onPress={() => setShowMenu(!showMenu)}
            >
              <Ionicons name="ellipsis-horizontal" size={16} color={textColor} />
            </TouchableOpacity>
            
            {showMenu && (
              <View style={styles.menuDropdown}>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    setShowMenu(false);
                    router.push(`/add-task?edit=${task.id}`);
                  }}
                >
                  <Ionicons name="create-outline" size={16} color={textColor} />
                  <Text style={styles.menuItemText}>Edit</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => {
                    setShowMenu(false);
                    showDeleteConfirmation();
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color={textColor} />
                  <Text style={[styles.menuItemText, styles.deleteMenuItem]}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  }

  // Normal task design (card_normal.png style)
  return (
    <Animated.View 
      entering={reducedMotion ? undefined : FadeInUp} 
      exiting={reducedMotion ? undefined : FadeOutRight} 
      style={[styles.container, animatedCardStyle]}
    >
      <View style={[styles.taskCard, { position: 'relative' }]}>
        
        {/* Strikethrough Animation Overlay */}
        <Animated.View style={[styles.strikethroughOverlay, animatedStrikethroughStyle]} pointerEvents="none">
          <Animated.View style={[styles.strikethroughLine, animatedStrikethroughStyle]} />
        </Animated.View>
        
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.taskId}>#{task.id.slice(-4).toUpperCase()}</Text>
            <Text style={styles.taskStatus}>Todo</Text>
          </View>
          <View style={styles.headerRight}>
            {task.isRecurring && (
              <Text style={styles.recurringBadge}>Loop</Text>
            )}
            {task.ignoreWorkingHours && (
              <Text style={styles.alwaysOnBadge}>24H</Text>
            )}
            {task.delayCount > 0 && (
              <Text style={styles.delayBadge}>Delays: {task.delayCount}</Text>
            )}
          </View>
        </View>
        
        <Text style={styles.taskTitle}>{task.title}</Text>
        
        {task.description && (
          <Text style={styles.taskDescription}>// {task.description}</Text>
        )}
        
        {/* Unified Time Information Container */}
        <Animated.View style={[styles.timeInfoContainer, animatedTimeChangeStyle]}>
          {/* Show original time first when task was delayed */}
          {wasDelayed() && (
            <View style={styles.singleTimeRow}>
              <Text style={styles.oldTimeText}>
                {getFormattedTimeDisplay(task.originalReminderTime, true)}
              </Text>
            </View>
          )}

          {/* Current/updated time shown below */}
          <View style={[styles.singleTimeRow, wasDelayed() && styles.timeChangeContainer]}>
            <Text style={styles.timeMainText}>
              {getFormattedTimeDisplay()}
            </Text>
          </View>
        </Animated.View>
        
        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          {!task.isCompleted && (
            <TouchableOpacity 
              style={[
                styles.actionBtn,
                isDelaying && styles.delayingButton
              ]}
              onPress={handleDelayTask}
              disabled={isDelaying}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isDelaying ? "hourglass-outline" : "time-outline"} 
                size={14} 
                color={textColor} 
              />
              <Text style={styles.actionBtnText}>
                {isDelaying ? "..." : `+${delayTime}`}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[
              styles.actionBtnDone,
              task.isCompleted && { backgroundColor: colors.warning },
              isProcessingNext && { backgroundColor: colors.accent }
            ]}
            onPress={handleToggleComplete}
            activeOpacity={0.7}
            disabled={isProcessingNext}
          >
            <Ionicons 
              name={
                isProcessingNext ? 'hourglass-outline' :
                task.isCompleted ? 'refresh-outline' : 
                (task.isRecurring ? 'refresh' : 'checkmark')
              } 
              size={14} 
              color={
                isProcessingNext ? colors.background :
                task.isCompleted ? colors.background : textColorVariant
              }
            />
            <Text style={[
              styles.actionBtnTextDone,
              task.isCompleted && { color: colors.background },
              isProcessingNext && { color: colors.background }
            ]}>
              {
                isProcessingNext ? 'NEXT...' :
                task.isCompleted ? 'UNDO' : 
                (task.isRecurring ? 'NEXT' : 'DONE')
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn]}
            onPress={() => router.push(`/add-task?edit=${task.id}`)}
            activeOpacity={0.7}
          >
            <Ionicons name="create-outline" size={14} color={textColor} />
            <Text style={styles.actionBtnText}>EDIT</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionBtn]}
            onPress={showDeleteConfirmation}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={14} color={colors.danger} />
            <Text style={[styles.actionBtnText, { color: colors.danger }]}>DEL</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
});

TaskItem.displayName = 'TaskItem';

export default TaskItem;