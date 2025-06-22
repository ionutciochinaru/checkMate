import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';
import FilterDropdownComponent from './FilterDropdownComponent';

interface SectionedTaskListProps {
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

export default function SectionedTaskList({
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
}: SectionedTaskListProps) {
  const { theme } = useTheme();

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
    },
    // Header Section
    headerCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    title: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.xl,
      color: theme.colors.text,
      letterSpacing: 0.8,
      fontWeight: '800',
    },
    themeButton: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      minWidth: 44,
      alignItems: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.accent,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    statLabel: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.3,
      marginTop: theme.spacing.xs,
    },
    // Filter Section
    filterCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    filterTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    // Tasks Section
    tasksCard: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    tasksHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    tasksTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: 0.8,
      marginRight: 12,
      fontWeight: '800',
      flexShrink: 1,
    },
    tasksLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
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
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Checkmate</Text>
          <TouchableOpacity style={styles.themeButton} onPress={onThemeToggle}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color={theme.colors.text} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
        </View>
      </View>

      {/* Filter Card */}
      <View style={styles.filterCard}>
        <Text style={styles.filterTitle}>Filter & Search</Text>
        <FilterDropdownComponent
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
          getFilterCount={getFilterCount}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      </View>

      {/* Tasks Card */}
      <View style={styles.tasksCard}>
        <View style={styles.tasksHeader}>
          <Text style={styles.tasksTitle}>
            Tasks [{tasks.length}] - {selectedFilter}
          </Text>
          <View style={styles.tasksLine} />
        </View>
        
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No tasks found for the current filter
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </View>
  );
}