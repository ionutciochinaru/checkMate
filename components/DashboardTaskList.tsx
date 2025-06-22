import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';
import FilterDropdownComponent from './FilterDropdownComponent';

interface DashboardTaskListProps {
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

export default function DashboardTaskList({
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
}: DashboardTaskListProps) {
  const { theme } = useTheme();

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
    },
    // Dashboard Header
    dashboardHeader: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: theme.isDark ? 0.4 : 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    titleSection: {
      flex: 1,
    },
    title: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.xxl,
      color: theme.colors.text,
      letterSpacing: 1.2,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    subtitle: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textMuted,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    themeToggle: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 50,
      minHeight: 50,
    },
    // Stats Grid
    statsGrid: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      alignItems: 'center',
    },
    statNumber: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.xl,
      color: theme.colors.accent,
      letterSpacing: 0.8,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    statLabel: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.5,
      textTransform: 'uppercase',
    },
    statIcon: {
      marginBottom: theme.spacing.xs,
    },
    // Controls Section
    controlsPanel: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
    },
    controlsHeader: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    controlsTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    controlsContent: {
      padding: theme.spacing.lg,
    },
    // Tasks Panel
    tasksPanel: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      marginBottom: theme.spacing.md,
      overflow: 'hidden',
    },
    tasksPanelHeader: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    tasksPanelTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    tasksBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    tasksBadgeText: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.background,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    tasksContent: {
      padding: theme.spacing.lg,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateIcon: {
      marginBottom: theme.spacing.md,
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

  const getCompletionPercentage = () => {
    if (tasks.length === 0) return 0;
    return Math.round((completedTasks.length / (tasks.length + completedTasks.length)) * 100);
  };

  return (
    <View style={styles.container}>
      {/* Dashboard Header */}
      <View style={styles.dashboardHeader}>
        <View style={styles.headerTop}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Checkmate</Text>
            <Text style={styles.subtitle}>Task Management Dashboard</Text>
          </View>
          <TouchableOpacity style={styles.themeToggle} onPress={onThemeToggle}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={24} 
              color={theme.colors.background} 
            />
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons 
              name="list" 
              size={20} 
              color={theme.colors.accent} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>{tasks.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons 
              name="time" 
              size={20} 
              color={theme.colors.accent} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>{pendingTasks.length}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons 
              name="checkmark-circle" 
              size={20} 
              color={theme.colors.accent} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>{completedTasks.length}</Text>
            <Text style={styles.statLabel}>Done</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons 
              name="stats-chart" 
              size={20} 
              color={theme.colors.accent} 
              style={styles.statIcon}
            />
            <Text style={styles.statNumber}>{getCompletionPercentage()}%</Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>
      </View>

      {/* Controls Panel */}
      <View style={styles.controlsPanel}>
        <View style={styles.controlsHeader}>
          <Text style={styles.controlsTitle}>Filter & Search Controls</Text>
        </View>
        <View style={styles.controlsContent}>
          <FilterDropdownComponent
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            getFilterCount={getFilterCount}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        </View>
      </View>

      {/* Tasks Panel */}
      <View style={styles.tasksPanel}>
        <View style={styles.tasksPanelHeader}>
          <Text style={styles.tasksPanelTitle}>{selectedFilter} Tasks</Text>
          <View style={styles.tasksBadge}>
            <Text style={styles.tasksBadgeText}>{tasks.length}</Text>
          </View>
        </View>
        <View style={styles.tasksContent}>
          {tasks.length > 0 ? (
            tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name="document-text-outline" 
                size={48} 
                color={theme.colors.textMuted} 
                style={styles.emptyStateIcon}
              />
              <Text style={styles.emptyStateText}>
                No tasks found for the current filter
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </View>
  );
}