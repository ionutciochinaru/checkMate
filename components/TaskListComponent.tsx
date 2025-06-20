import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';
import TaskItem from './TaskItem';

interface TaskListComponentProps {
  tasks: any[];
  pendingTasks: any[];
  completedTasks: any[];
  selectedFilter: FilterType;
  showFilterDropdown: boolean;
  setSelectedFilter: (filter: FilterType) => void;
  setShowFilterDropdown: (show: boolean) => void;
}

export default function TaskListComponent({
  tasks,
  pendingTasks,
  completedTasks,
  selectedFilter,
  showFilterDropdown,
  setSelectedFilter,
  setShowFilterDropdown
}: TaskListComponentProps) {
  
  const { theme } = useTheme();
  
  const styles = useThemedStyles((theme) => StyleSheet.create({
    statusLine: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: 12,
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: 36,
    },
    statusText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.3,
      flexShrink: 1,
    },
    filterContainer: {
      backgroundColor: theme.colors.surface,
      paddingHorizontal: 0,
      paddingVertical: 0,
      position: 'relative',
      marginBottom: 16,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterButton: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      minWidth: 120,
    },
    filterButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    filterText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      fontWeight: '600',
      flexShrink: 1,
      marginRight: 8,
    },
    filterDropdown: {
      position: 'absolute',
      top: 45,
      left: 0,
      right: 0,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 12,
      zIndex: 1000,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      padding: 4,
    },
    filterOption: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    selectedFilterOption: {
      backgroundColor: theme.colors.accent,
    },
    filterOptionText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      fontWeight: '500',
    },
    selectedFilterOptionText: {
      color: theme.isDark ? theme.colors.background : '#ffffff',
      fontWeight: '600',
    },
    quickFilters: {
      flexDirection: 'row',
      gap: 6,
      flexShrink: 0,
    },
    quickFilterChip: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: theme.borderRadius.md,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickFilterChipActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    quickFilterText: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    quickFilterTextActive: {
      color: theme.colors.background,
    },
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
      borderRadius: theme.borderRadius.md,
      marginHorizontal: 0,
    },
    sectionTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: 0.8,
      marginRight: 12,
      marginBottom: 0,
      fontWeight: '800',
      flexShrink: 1,
    },
    sectionLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
      display: 'flex',
    },
    filterIndicator: {
      fontSize: 12,
      color: theme.colors.textMuted,
      fontFamily: 'JetBrainsMono_400Regular',
      fontWeight: 'normal',
      backgroundColor: 'transparent',
      paddingHorizontal: 0,
      paddingVertical: 0,
      borderRadius: theme.borderRadius.md,
      alignSelf: 'auto',
      overflow: 'hidden',
    },
    bottomPadding: {
      height: 80,
    },
  }));


  return (
    <>
      {/* Status Line */}
      <View style={styles.statusLine}>
        <Text style={styles.statusText}>
          {tasks.length} tasks
        </Text>
        <Text style={styles.statusText}>
          |
        </Text>
        <Text style={styles.statusText}>
         {pendingTasks.length} pending
        </Text>
        <Text style={styles.statusText}>
          |
        </Text>
        <Text style={styles.statusText}>
         {completedTasks.length} done
        </Text>
      </View>

      {/* Filter Container */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <View style={{ position: 'relative', flexShrink: 1 }}>
            <TouchableOpacity
              style={[styles.filterButton, showFilterDropdown && styles.filterButtonActive]}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterText,
                showFilterDropdown && { color: theme.isDark ? theme.colors.background : '#ffffff' }
              ]}>
                {selectedFilter}
              </Text>
              <Ionicons
                name={showFilterDropdown ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={showFilterDropdown ? (theme.isDark ? theme.colors.background : '#ffffff') : theme.colors.textSecondary} 
              />
            </TouchableOpacity>
            
            {showFilterDropdown && (
              <View style={styles.filterDropdown}>
                {(['Today', 'Tomorrow', 'This Week', 'All'] as FilterType[]).map((filter) => (
                  <TouchableOpacity
                    key={filter}
                    style={[
                      styles.filterOption,
                      selectedFilter === filter && styles.selectedFilterOption
                    ]}
                    onPress={() => {
                      setSelectedFilter(filter);
                      setShowFilterDropdown(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedFilter === filter && styles.selectedFilterOptionText
                    ]}>
                      {filter}
                    </Text>
                    {selectedFilter === filter && (
                      <Ionicons 
                        name="checkmark" 
                        size={16} 
                        color={theme.isDark ? theme.colors.background : '#ffffff'} 
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.quickFilters}>
            {(['Today', 'All'] as FilterType[]).map(filter => (
                <TouchableOpacity
                    key={filter}
                    style={[
                      styles.quickFilterChip,
                      selectedFilter === filter && styles.quickFilterChipActive
                    ]}
                    onPress={() => {
                      setSelectedFilter(filter);
                      setShowFilterDropdown(false);
                    }}
                    activeOpacity={0.7}
                >
                  <Text style={[
                    styles.quickFilterText,
                    selectedFilter === filter && styles.quickFilterTextActive
                  ]}>
                    {filter === 'Today' ? 'T' : '∗'}
                  </Text>
                </TouchableOpacity>
            ))}
          </View>
        </View>

      </View>

      {/* Single unified task list */}
      {tasks.length > 0 && (
        <View style={styles.section}>
          {selectedFilter !== 'All' && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Tasks [{tasks.length}] - Filter: {selectedFilter}
              </Text>
              <View style={styles.sectionLine} />
            </View>
          )}
          {tasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>
      )}

      <View style={styles.bottomPadding} />
    </>
  );
}