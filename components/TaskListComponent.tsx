import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import TaskItem from './TaskItem';

interface TaskListComponentProps {
  pendingTasks: any[];
  completedTasks: any[];
  selectedFilter: FilterType;
}

export default function TaskListComponent({
  pendingTasks,
  completedTasks,
  selectedFilter
}: TaskListComponentProps) {
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    section: {
      marginBottom: 24,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      marginHorizontal: 0,
    },
    sectionTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 0.8,
      marginRight: 12,
      marginBottom: 0,
      fontWeight: '800',
      flexShrink: 1,
    },
    sectionLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
      display: 'flex',
    },
    filterIndicator: {
      fontSize: 12,
      color: colors.textMuted,
      fontFamily: 'JetBrainsMono_400Regular',
      fontWeight: 'normal',
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: 0,
      alignSelf: 'auto',
      overflow: 'hidden',
    },
    bottomPadding: {
      height: 80,
    },
  }));


  return (
    <>
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
    </>
  );
}