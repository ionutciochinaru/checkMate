import React, { useRef } from 'react';
import { View, Text, StyleSheet, Platform, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';

interface FilterStackedLayoutProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function FilterStackedLayout({
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
  searchText,
  setSearchText
}: FilterStackedLayoutProps) {
  const { theme } = useTheme();
  const primaryPickerRef = useRef<any>(null);

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      gap: theme.spacing.md,
    },
    section: {
      gap: theme.spacing.xs,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.xs,
    },
    sectionTitle: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    pickerContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden',
      minHeight: Platform.OS === 'ios' ? 60 : 55,
      justifyContent: 'center',
    },
    picker: {
      backgroundColor: theme.colors.surfaceVariant,
      color: theme.colors.text,
      height: Platform.OS === 'ios' ? 60 : 55,
      marginHorizontal: Platform.OS === 'ios' ? -16 : 0,
      marginVertical: Platform.OS === 'android' ? -5 : 0,
    },
    searchContainer: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      minHeight: Platform.OS === 'ios' ? 60 : 55,
      gap: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      paddingVertical: Platform.OS === 'ios' ? 18 : 16,
    },
  }));

  const allFilters: FilterType[] = [
    'All', 'Today', 'Tomorrow', 'This Week', 'Focus', 'Sprint', 
    'Attention', 'Work Hours', 'After Hours', 'Weekend', 'Quick Wins'
  ];

  const getPickerItemStyle = () => ({
    backgroundColor: theme.colors.surfaceVariant,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: Platform.OS === 'ios' ? 18 : 16,
    height: Platform.OS === 'ios' ? 50 : 45,
    textAlign: 'center' as const,
    lineHeight: Platform.OS === 'ios' ? 50 : 45,
  });

  const getFilterLabel = (filter: FilterType) => {
    const count = getFilterCount(filter);
    return `${filter} (${count})`;
  };

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="funnel" size={16} color={theme.colors.accent} />
          <Text style={styles.sectionTitle}>Filter</Text>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            ref={primaryPickerRef}
            selectedValue={selectedFilter}
            onValueChange={(itemValue) => setSelectedFilter(itemValue as FilterType)}
            style={styles.picker}
            itemStyle={getPickerItemStyle()}
            mode={Platform.OS === 'android' ? 'dropdown' : undefined}
            prompt="Filter Tasks"
            dropdownIconColor={theme.colors.text}
            dropdownIconRippleColor={theme.colors.accent + '30'}
            selectionColor={theme.colors.accent}
            numberOfLines={1}
          >
            {allFilters.map(filter => (
              <Picker.Item
                key={filter}
                label={getFilterLabel(filter)}
                value={filter}
                color={theme.colors.text}
                fontFamily={theme.typography.fontFamily.medium}
                enabled={true}
                style={Platform.OS === 'android' ? {
                  fontSize: 16,
                  height: 45,
                  backgroundColor: theme.colors.surfaceVariant,
                  textAlignVertical: 'center',
                  paddingVertical: 10,
                } : undefined}
              />
            ))}
          </Picker>
        </View>
      </View>

      {/* Search Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="search" size={16} color={theme.colors.accent} />
          <Text style={styles.sectionTitle}>Search</Text>
        </View>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search tasks..."
            placeholderTextColor={theme.colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          <Ionicons
            name="search"
            size={18}
            color={theme.colors.textSecondary}
          />
        </View>
      </View>
    </View>
  );
}