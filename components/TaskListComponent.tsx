import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';
import FilterBarLayout from './FilterBarLayout';

interface TaskListComponentProps {
  tasks: any[];
  pendingTasks: any[];
  completedTasks: any[];
  allTasks?: any[];
  allPendingTasks?: any[];
  allCompletedTasks?: any[];
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
  searchText: string;
  setSearchText: (text: string) => void;
  onThemeToggle: () => void;
  isDark: boolean;
  onSettingsPress: () => void;
}

export default function TaskListComponent({
  tasks,
  pendingTasks,
  completedTasks,
  allTasks = tasks,
  allPendingTasks = pendingTasks,
  allCompletedTasks = completedTasks,
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
  searchText,
  setSearchText,
  onThemeToggle,
  isDark,
  onSettingsPress
}: TaskListComponentProps) {
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
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      marginTop: theme.spacing.xs,
      marginBottom: theme.spacing.md,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    headerLeft: {
      flex: 1,
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
    },
    title: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.xl,
      color: theme.colors.text,
      letterSpacing: 0.8,
      fontWeight: '800',
      marginBottom: theme.spacing.xs,
    },
    statsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    statNumber: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.accent,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    statLabel: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    actionButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.sm,
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Filter and Search Section
    filterSearchContainer: {
      backgroundColor: 'transparent',
      padding: 0,
      marginBottom: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    filterRow: {
      width: '100%',
    },
    searchRow: {
      width: '100%',
    },
    searchContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      minHeight: 48,
      gap: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    searchInput: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      paddingVertical: theme.spacing.md,
    },
    // Tasks List - Modern 2025 Design
    tasksList: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 0,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.isDark ? 0.2 : 0.08,
      shadowRadius: 6,
      elevation: 2,
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
    // Results and Status Indicators
    resultsIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      marginTop: theme.spacing.sm,
    },
    resultsText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.2,
    },
    filterChip: {
      backgroundColor: theme.colors.accent + '15',
      borderRadius: theme.borderRadius.lg,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
    },
    filterChipText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.accent,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    // Modern Empty State
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
      paddingHorizontal: theme.spacing.lg,
    },
    emptyStateText: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.textMuted,
      textAlign: 'center',
      lineHeight: theme.typography.fontSize.lg * 1.4,
    },
    bottomPadding: {
      height: 80,
    },
  }));

  return (
    <>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>Checkmate</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.actionButton} onPress={onThemeToggle}>
              <Ionicons 
                name={isDark ? 'sunny' : 'moon'} 
                size={20} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={onSettingsPress}>
              <Ionicons 
                name="settings-outline" 
                size={20} 
                color={theme.colors.text} 
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{allTasks.length}</Text>
            <Text style={styles.statLabel}>total</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{allPendingTasks.length}</Text>
            <Text style={styles.statLabel}>pending</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{allCompletedTasks.length}</Text>
            <Text style={styles.statLabel}>completed</Text>
          </View>
        </View>
      </View>

      {/* Tasks List */}
      <View style={styles.tasksList}>
        {tasks.length > 0 ? (
          <>
            {/* Filter and Search Section */}
            <View style={styles.filterSearchContainer}>
              {/* Filter Section */}
              <View style={styles.filterRow}>
                <FilterBarLayout
                  selectedFilter={selectedFilter}
                  setSelectedFilter={setSelectedFilter}
                  getFilterCount={getFilterCount}
                />
              </View>

              {/* Search Bar Row */}
              <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                  <Ionicons
                    name="search"
                    size={18}
                    color={theme.colors.textSecondary}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search tasks..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={searchText}
                    onChangeText={setSearchText}
                    returnKeyType="search"
                    clearButtonMode="while-editing"
                  />
                </View>
              </View>

              {/* Results Indicator */}
              <View style={styles.resultsIndicator}>
                <Text style={styles.resultsText}>
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} found
                </Text>
                {selectedFilter !== 'All' && (
                  <View style={styles.filterChip}>
                    <Text style={styles.filterChipText}>{selectedFilter}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Task Items */}
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons 
              name="checkmark-circle-outline" 
              size={48} 
              color={theme.colors.textMuted} 
              style={{ marginBottom: theme.spacing.md }}
            />
            <Text style={styles.emptyStateText}>
              No tasks yet{'\n'}
              <Text style={{ fontSize: theme.typography.fontSize.md, opacity: 0.7 }}>
                Add your first task to get started
              </Text>
            </Text>
          </View>
        )}
      </View>

      <View style={styles.bottomPadding} />
    </>
  );
}