import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface SearchSuggestion {
  type: 'syntax' | 'example' | 'preset';
  text: string;
  description: string;
  insertText: string;
}

interface SearchSuggestionsProps {
  searchText: string;
  onSuggestionPress: (suggestion: SearchSuggestion) => void;
  onDismiss: () => void;
}

export default function SearchSuggestions({ searchText, onSuggestionPress, onDismiss }: SearchSuggestionsProps) {
  const { theme } = useTheme();

  const getSuggestions = (): SearchSuggestion[] => {
    const suggestions: SearchSuggestion[] = [];
    const lower = searchText.toLowerCase();

    // Advanced search syntax suggestions
    const syntaxSuggestions: SearchSuggestion[] = [
      {
        type: 'syntax',
        text: 'is:overdue',
        description: 'Find overdue tasks',
        insertText: 'is:overdue '
      },
      {
        type: 'syntax',
        text: 'is:recurring',
        description: 'Find recurring tasks',
        insertText: 'is:recurring '
      },
      {
        type: 'syntax',
        text: 'is:delayed',
        description: 'Find delayed tasks',
        insertText: 'is:delayed '
      },
      {
        type: 'syntax',
        text: 'due:today',
        description: 'Tasks due today',
        insertText: 'due:today '
      },
      {
        type: 'syntax',
        text: 'due:tomorrow',
        description: 'Tasks due tomorrow',
        insertText: 'due:tomorrow '
      },
      {
        type: 'syntax',
        text: 'due:this-week',
        description: 'Tasks due this week',
        insertText: 'due:this-week '
      },
      {
        type: 'syntax',
        text: 'delays:3+',
        description: 'Tasks with 3+ delays',
        insertText: 'delays:3+ '
      },
      {
        type: 'syntax',
        text: 'time:morning',
        description: 'Morning tasks (6AM-12PM)',
        insertText: 'time:morning '
      },
      {
        type: 'syntax',
        text: 'time:afternoon',
        description: 'Afternoon tasks (12PM-5PM)',
        insertText: 'time:afternoon '
      },
      {
        type: 'syntax',
        text: 'time:evening',
        description: 'Evening tasks (5PM-10PM)',
        insertText: 'time:evening '
      },
      {
        type: 'syntax',
        text: 'title:"meeting"',
        description: 'Search in title only',
        insertText: 'title:"" '
      },
      {
        type: 'syntax',
        text: 'description:"urgent"',
        description: 'Search in description only',
        insertText: 'description:"" '
      }
    ];

    // Example searches
    const exampleSuggestions: SearchSuggestion[] = [
      {
        type: 'example',
        text: 'meeting is:overdue',
        description: 'Overdue meeting tasks',
        insertText: 'meeting is:overdue'
      },
      {
        type: 'example',
        text: 'is:recurring due:today',
        description: 'Recurring tasks due today',
        insertText: 'is:recurring due:today'
      },
      {
        type: 'example',
        text: 'delays:2+ time:morning',
        description: 'Delayed morning tasks',
        insertText: 'delays:2+ time:morning'
      },
      {
        type: 'example',
        text: 'title:"urgent" is:overdue',
        description: 'Urgent overdue tasks',
        insertText: 'title:"urgent" is:overdue'
      }
    ];

    // Filter suggestions based on current input
    if (searchText.trim() === '') {
      // Show examples when empty
      return exampleSuggestions.slice(0, 4);
    }

    // Show syntax suggestions that match the current input
    const matchingSyntax = syntaxSuggestions.filter(s => 
      s.text.toLowerCase().includes(lower) || 
      s.description.toLowerCase().includes(lower)
    );

    // Show example suggestions that match
    const matchingExamples = exampleSuggestions.filter(s => 
      s.text.toLowerCase().includes(lower) || 
      s.description.toLowerCase().includes(lower)
    );

    return [...matchingSyntax.slice(0, 6), ...matchingExamples.slice(0, 3)];
  };

  const suggestions = getSuggestions();

  if (suggestions.length === 0) {
    return null;
  }

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      marginTop: theme.spacing.xs,
      maxHeight: 200,
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.isDark ? 0.4 : 0.1,
      shadowRadius: 8,
      elevation: 5,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    dismissButton: {
      padding: theme.spacing.xs,
    },
    scrollContainer: {
      maxHeight: 160,
    },
    suggestion: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastSuggestion: {
      borderBottomWidth: 0,
    },
    suggestionIcon: {
      marginRight: theme.spacing.sm,
    },
    suggestionContent: {
      flex: 1,
    },
    suggestionText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    suggestionDescription: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textMuted,
      letterSpacing: theme.typography.letterSpacing * 0.3,
      marginTop: 2,
    },
    syntaxType: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      alignSelf: 'flex-start',
      marginLeft: theme.spacing.sm,
    },
    syntaxTypeText: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.background,
      letterSpacing: theme.typography.letterSpacing * 0.2,
    },
  }));

  const getIconName = (type: string) => {
    switch (type) {
      case 'syntax': return 'code-outline' as const;
      case 'example': return 'bulb-outline' as const;
      case 'preset': return 'bookmark-outline' as const;
      default: return 'search-outline' as const;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Search Suggestions</Text>
        <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
          <Ionicons name="close" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {suggestions.map((suggestion, index) => (
          <TouchableOpacity
            key={`${suggestion.type}-${index}`}
            style={[
              styles.suggestion,
              index === suggestions.length - 1 && styles.lastSuggestion
            ]}
            onPress={() => onSuggestionPress(suggestion)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={getIconName(suggestion.type)}
              size={16}
              color={theme.colors.textSecondary}
              style={styles.suggestionIcon}
            />
            
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionText}>{suggestion.text}</Text>
              <Text style={styles.suggestionDescription}>{suggestion.description}</Text>
            </View>
            
            <View style={styles.syntaxType}>
              <Text style={styles.syntaxTypeText}>
                {suggestion.type.toUpperCase()}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}