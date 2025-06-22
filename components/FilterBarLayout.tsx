import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';

interface FilterBarLayoutProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function FilterBarLayout({
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
  searchText,
  setSearchText
}: FilterBarLayoutProps) {
  const { theme } = useTheme();
  const primaryPickerRef = useRef<any>(null);

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.sm,
      minHeight: 50,
    },
    filterSection: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      flex: 1,
      minHeight: 40,
    },
    pickerContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      overflow: 'hidden',
      minHeight: Platform.OS === 'ios' ? 40 : 40,
      justifyContent: 'center',
    },
    picker: {
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      height: Platform.OS === 'ios' ? 40 : 40,
      marginHorizontal: Platform.OS === 'ios' ? -16 : 0,
    },
    divider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.xs,
    },
    searchContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.sm,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.sm,
      flex: 1,
      minHeight: 40,
      gap: theme.spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    },
  }));

  const allFilters: FilterType[] = [
    'All', 'Today', 'Tomorrow', 'This Week', 'Focus', 'Sprint', 
    'Attention', 'Work Hours', 'After Hours', 'Weekend', 'Quick Wins'
  ];

  const getPickerItemStyle = () => ({
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    fontFamily: theme.typography.fontFamily.medium,
    fontSize: Platform.OS === 'ios' ? 16 : 14,
    height: Platform.OS === 'ios' ? 40 : 35,
    textAlign: 'center' as const,
    lineHeight: Platform.OS === 'ios' ? 40 : 35,
  });

  const getFilterLabel = (filter: FilterType) => {
    const count = getFilterCount(filter);
    return count > 99 ? `${filter} (99+)` : `${filter} (${count})`;
  };

  return (
    <View style={styles.container}>
      {/* Filter Section */}
      <View style={styles.filterSection}>
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
                  backgroundColor: theme.colors.surface,
                  textAlignVertical: 'center',
                  paddingVertical: 10,
                } : undefined}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Search Container */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={16}
          color={theme.colors.textSecondary}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor={theme.colors.textMuted}
          value={searchText}
          onChangeText={setSearchText}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>
    </View>
  );
}