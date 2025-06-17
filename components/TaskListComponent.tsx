import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { formatDateWithPreference } from '../utils/dateFormatters';
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
  
  const { colors, isDark } = useTheme();
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    statusLine: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: config.borderRadius,
      padding: 12,
      marginBottom: 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: 36,
    },
    statusText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.3,
      flexShrink: 1,
    },
    filterContainer: {
      backgroundColor: colors.surface,
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
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      borderRadius: config.borderRadius,
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      minWidth: 100,
    },
    filterButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing * 0.5,
      fontWeight: '700',
      flexShrink: 1,
    },
    filterDropdown: {
      position: 'absolute',
      top: 38,
      left: 0,
      right: 0,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: config.borderRadius,
      zIndex: 1000,
      elevation: 5,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 4,
      maxHeight: 200,
    },
    filterOption: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 36,
    },
    selectedFilterOption: {
      backgroundColor: colors.accent,
    },
    filterOptionText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing * 0.5,
      fontWeight: '600',
      flexShrink: 1,
    },
    selectedFilterOptionText: {
      color: colors.background,
      fontFamily: config.fontFamily.bold,
    },
    lastFilterOption: {
      borderBottomWidth: 0,
    },
    quickFilters: {
      flexDirection: 'row',
      gap: 6,
      flexShrink: 0,
    },
    quickFilterChip: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: config.borderRadius,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickFilterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    quickFilterText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.3,
    },
    quickFilterTextActive: {
      color: colors.background,
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
      borderRadius: config.borderRadius,
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
      borderRadius: config.borderRadius,
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
          {tasks.length} tasks | {pendingTasks.length} pending | {completedTasks.length} done
        </Text>
      </View>

      {/* Filter Container */}
      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity
              style={[styles.filterButton, showFilterDropdown && styles.filterButtonActive]}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              activeOpacity={0.7}
          >
            <Text style={[
              styles.filterText,
              showFilterDropdown && { color: isDark ? colors.background : '#ffffff' }
            ]}>
              Filter: {selectedFilter}
            </Text>
            <Ionicons
              name={showFilterDropdown ? 'chevron-up' : 'chevron-down'} 
              size={16} 
              color={showFilterDropdown ? (isDark ? colors.background : '#ffffff') : colors.textSecondary} 
            />
          </TouchableOpacity>

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

        {showFilterDropdown && (
            <View style={styles.filterDropdown}>
              {(['Today', 'Tomorrow', 'This Week', 'All'] as FilterType[]).map((filter, index) => (
                  <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterOption,
                        selectedFilter === filter && styles.selectedFilterOption,
                        index === 3 && styles.lastFilterOption
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
                        color={colors.background} 
                      />
                    )}
                  </TouchableOpacity>
              ))}
            </View>
        )}
      </View>

      {pendingTasks.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Active Tasks [{pendingTasks.length}]
              {selectedFilter !== 'All' && (
                <Text style={styles.filterIndicator}> Filter: {selectedFilter}</Text>
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
              Completed Tasks [{completedTasks.length}]
              {selectedFilter !== 'All' && (
                <Text style={styles.filterIndicator}> Filter: {selectedFilter}</Text>
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