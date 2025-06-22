import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';
import FilterDropdownComponent from './FilterDropdownComponent';

interface MinimalSectionedListProps {
  tasks: any[];
  pendingTasks: any[];
  completedTasks: any[];
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
  searchText: string;
  setSearchText: (text: string) => void;
  onThemeToggle: () => void;
  isDark: boolean;
}

export default function MinimalSectionedList({
  tasks,
  pendingTasks,
  completedTasks,
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
  searchText,
  setSearchText,
  onThemeToggle,
  isDark
}: MinimalSectionedListProps) {
  const { theme } = useTheme();

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
    },
    // Header Bar
    headerBar: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    title: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.text,
      letterSpacing: 0.8,
      fontWeight: '800',
    },
    statsText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    themeButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      padding: theme.spacing.xs,
      minWidth: 36,
      alignItems: 'center',
    },
    // Filter Section
    filterSection: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    filterHeader: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    // Tasks List
    tasksList: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
    },
    tasksHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
      paddingBottom: theme.spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    tasksTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    tasksCount: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      minWidth: 24,
      alignItems: 'center',
    },
    tasksCountText: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.background,
      letterSpacing: theme.typography.letterSpacing * 0.2,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.lg,
    },
    emptyStateText: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    bottomPadding: {
      height: 80,
    },
  }));

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Checkmate</Text>
          <Text style={styles.statsText}>
            {tasks.length} tasks • {pendingTasks.length} pending • {completedTasks.length} done
          </Text>
        </View>
        <TouchableOpacity style={styles.themeButton} onPress={onThemeToggle}>
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={18} 
            color={theme.colors.text} 
          />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      <View style={styles.filterSection}>
        <Text style={styles.filterHeader}>Filter & Search Tasks</Text>
        <FilterDropdownComponent
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          getFilterCount={getFilterCount}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </View>

      {/* Tasks List */}
      <View style={styles.tasksList}>
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>{selectedFilter} Tasks</Text>
          <View style={styles.tasksCount}>
            <Text style={styles.tasksCountText}>{tasks.length}</Text>
          </View>
        </View>
        
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No tasks found
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </View>
  );
}