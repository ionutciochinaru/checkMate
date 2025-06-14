import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';

interface EmptyStateComponentProps {
  tasks: any[];
  filteredTasks: any[];
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
}

export default function EmptyStateComponent({
  tasks,
  filteredTasks,
  selectedFilter,
  setSelectedFilter
}: EmptyStateComponentProps) {
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    },
    emptyTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    emptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 6,
      lineHeight: 16 * fontScale,
    },
    emptyStateButton: {
      marginTop: 16,
    },
    emptyCommand: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.surface,
      backgroundColor: colors.accent,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: colors.border,
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    filterEmptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 60,
    },
    filterEmptyTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    filterEmptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 24,
      textAlign: 'center',
    },
    filterSuggestions: {
      gap: 12,
      alignItems: 'center',
    },
    filterSuggestion: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    filterSuggestionText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
  }));

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>NO_TASKS_LOADED</Text>
        <Text style={styles.emptySubtitle}>{`// Create your first task to get started`}</Text>
        <Text style={styles.helpText}>
          Tasks are scheduled reminders with optional recurring intervals.
          Configure work hours to restrict notifications during off-hours.
          Use delay feature to postpone tasks when they become overdue.
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => router.push('/add-task')}
        >
          <Text style={styles.emptyCommand}>$ ./add_task --init</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (tasks.length > 0 && filteredTasks.length === 0) {
    return (
      <View style={styles.filterEmptyState}>
        <Text style={styles.filterEmptyTitle}>NO_TASKS_FOUND</Text>
        <Text style={styles.filterEmptySubtitle}>
          {`// No tasks match filter: ${selectedFilter}`}
        </Text>
        <View style={styles.filterSuggestions}>
          <TouchableOpacity
            style={styles.filterSuggestion}
            onPress={() => setSelectedFilter('All')}
          >
            <Text style={styles.filterSuggestionText}>$ show --all</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}