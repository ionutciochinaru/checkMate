import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';

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
  const { theme } = useTheme();
  
  const styles = useThemedStyles((theme) => StyleSheet.create({
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
    },
    emptyTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18 * 1.0,
      color: theme.colors.text,
      letterSpacing: 1,
      marginBottom: 8,
      fontWeight: 'normal',
      textAlign: 'center',
    },
    emptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12 * 1.0,
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
      textAlign: 'center',
      fontWeight: 'normal',
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12 * 1.0,
      color: theme.colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 6,
      lineHeight: 16 * 1.0,
      textAlign: 'center',
    },
    emptyStateButton: {
      marginTop: 16,
    },
    emptyCommand: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * 1.0,
      color: theme.colors.surface,
      backgroundColor: theme.colors.accent,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      letterSpacing: 0.5,
      textAlign: 'center',
      fontWeight: 'normal',
      alignItems: 'center',
      justifyContent: 'center',
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
      color: theme.colors.text,
      letterSpacing: 1,
      marginBottom: 8,
      fontWeight: 'normal',
      textAlign: 'center',
    },
    filterEmptySubtitle: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 12,
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 24,
      textAlign: 'center',
      fontWeight: 'normal',
    },
    filterSuggestions: {
      gap: 12,
      alignItems: 'center',
    },
    filterSuggestion: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: theme.borderRadius.md,
    },
    filterSuggestionText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: 'normal',
    },
  }));

  if (tasks.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons 
          name="list-outline" 
          size={48} 
          color={theme.colors.textMuted} 
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.emptyTitle}>
          No Tasks Yet
        </Text>
        <Text style={styles.emptySubtitle}>
          Create your first task to get started
        </Text>
        <Text style={styles.helpText}>
          Tasks are scheduled reminders with optional recurring intervals.\nConfigure work hours to restrict notifications during off-hours.\nUse delay feature to postpone tasks when they become overdue.
        </Text>
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => router.push('/add-task')}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons 
              name="add" 
              size={16} 
              color={theme.colors.surface} 
            />
            <Text style={styles.emptyCommand}>
              Add Task
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  if (tasks.length > 0 && filteredTasks.length === 0) {
    return (
      <View style={styles.filterEmptyState}>
        <Ionicons 
          name="search-outline" 
          size={48} 
          color={theme.colors.textMuted} 
          style={{ marginBottom: 16 }}
        />
        <Text style={styles.filterEmptyTitle}>
          No Tasks Found
        </Text>
        <Text style={styles.filterEmptySubtitle}>
          No tasks match filter: {selectedFilter}
        </Text>
        <View style={styles.filterSuggestions}>
          <TouchableOpacity
            style={styles.filterSuggestion}
            onPress={() => setSelectedFilter('All')}
          >
            <Text style={styles.filterSuggestionText}>
              Show All Tasks
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return null;
}