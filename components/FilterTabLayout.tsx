import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Platform, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';

interface FilterTabLayoutProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
  searchText: string;
  setSearchText: (text: string) => void;
}

export default function FilterTabLayout({
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
  searchText,
  setSearchText
}: FilterTabLayoutProps) {
  const { theme } = useTheme();
  const primaryPickerRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState<'filter' | 'search'>('filter');

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.md,
      marginBottom: theme.spacing.sm,
      overflow: 'hidden',
    },
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.sm,
      gap: theme.spacing.xs,
    },
    activeTab: {
      backgroundColor: theme.colors.accent,
    },
    tabText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    activeTabText: {
      color: theme.colors.background,
      fontWeight: '600',
    },
    content: {
      padding: theme.spacing.sm,
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
    filterInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: theme.spacing.sm,
      paddingTop: theme.spacing.sm,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    filterInfoText: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textSecondary,
    },
    filterBadge: {
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
    },
    filterBadgeText: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.background,
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
      {/* Tab Headers */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'filter' && styles.activeTab]}
          onPress={() => setActiveTab('filter')}
        >
          <Ionicons 
            name="funnel" 
            size={16} 
            color={activeTab === 'filter' ? theme.colors.background : theme.colors.text} 
          />
          <Text style={[styles.tabText, activeTab === 'filter' && styles.activeTabText]}>
            Filter
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'search' && styles.activeTab]}
          onPress={() => setActiveTab('search')}
        >
          <Ionicons 
            name="search" 
            size={16} 
            color={activeTab === 'search' ? theme.colors.background : theme.colors.text} 
          />
          <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>
            Search
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'filter' ? (
          <>
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
            
            <View style={styles.filterInfo}>
              <Text style={styles.filterInfoText}>Current filter: {selectedFilter}</Text>
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{getFilterCount(selectedFilter)}</Text>
              </View>
            </View>
          </>
        ) : (
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
              autoFocus={activeTab === 'search'}
            />
          </View>
        )}
      </View>
    </View>
  );
}