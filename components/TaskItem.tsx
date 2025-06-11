import React from 'react';
import { View, Text as RNText, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Animated, { FadeInUp, FadeOutRight } from 'react-native-reanimated';
import { useTaskStore } from '../hooks/useTaskStore';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleComplete, delayTask } = useTaskStore();

  const getDelayMessage = (count: number) => {
    if (count === 0) return '';
    if (count === 1) return 'DELAY_01';
    return `DELAY_${count.toString().padStart(2, '0')}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutRight} style={styles.container}>
      <View style={[styles.taskCard, task.isCompleted && styles.completedCard]}>
        {/* Header with status indicators */}
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <RNText style={styles.taskId}>#{task.id.slice(-4).toUpperCase()}</RNText>
            <View style={styles.statusIndicators}>
              {task.isRecurring && (
                <RNText style={styles.statusBadge}>LOOP</RNText>
              )}
              {task.delayCount > 0 && (
                <RNText style={[styles.statusBadge, styles.delayBadge]}>
                  {getDelayMessage(task.delayCount)}
                </RNText>
              )}
              {task.ignoreWorkingHours && (
                <RNText style={styles.statusBadge}>24H</RNText>
              )}
            </View>
          </View>
          <RNText style={styles.timestamp}>
            SCHED: {formatTime(task.reminderTime)}
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
              style={styles.actionButton}
              onPress={() => delayTask(task.id)}
              activeOpacity={0.7}
            >
              <RNText style={styles.actionText}>DELAY</RNText>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, task.isCompleted && styles.completedButton]}
            onPress={() => toggleComplete(task.id)}
            activeOpacity={0.7}
          >
            <RNText style={[styles.actionText, task.isCompleted && styles.completedActionText]}>
              {task.isCompleted ? 'UNDO' : 'DONE'}
            </RNText>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#f5f5f0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    borderRadius: 0,
    padding: 16,
  },
  completedCard: {
    backgroundColor: '#e8e8e0',
    borderColor: '#c0c0b8',
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
    color: '#8a8a8a',
    letterSpacing: 1,
  },
  statusIndicators: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 8,
    color: '#4a4a4a',
    backgroundColor: '#e8e8e0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: '#d0d0c8',
    letterSpacing: 0.5,
  },
  delayBadge: {
    color: '#ff3b30',
    borderColor: '#ff3b30',
    backgroundColor: 'transparent',
  },
  timestamp: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 9,
    color: '#8a8a8a',
    letterSpacing: 0.5,
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
    borderColor: '#4a4a4a',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedBox: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  checkboxText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 12,
    color: '#4a4a4a',
  },
  checkedText: {
    color: '#f5f5f0',
  },
  textContainer: {
    flex: 1,
  },
  taskTitle: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 14,
    color: '#1a1a1a',
    letterSpacing: 0.5,
    lineHeight: 20,
  },
  completedTitle: {
    color: '#8a8a8a',
    textDecorationLine: 'line-through',
  },
  taskDescription: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 11,
    color: '#4a4a4a',
    marginTop: 4,
    letterSpacing: 0.3,
    lineHeight: 16,
  },
  completedDescription: {
    color: '#8a8a8a',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#4a4a4a',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  completedButton: {
    borderColor: '#8a8a8a',
  },
  actionText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 9,
    color: '#4a4a4a',
    letterSpacing: 1,
  },
  completedActionText: {
    color: '#8a8a8a',
  },
});

export default TaskItem;