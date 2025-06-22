import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import { Ionicons } from '@expo/vector-icons';
import DropdownMenu from './DropdownMenu';
import { MenuOption } from './MenuOption';

interface FilterDropdownProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
}

export default function FilterDropdown({
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
}: FilterDropdownProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
    },
    triggerButton: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      shadowColor: theme.isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: theme.isDark ? 0.15 : 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    triggerText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      fontWeight: '500',
      flex: 1,
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    optionText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      flex: 1,
    },
    optionTextSelected: {
      color: theme.colors.accent,
      fontWeight: '600',
    },
    optionCount: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.xs,
      paddingVertical: 2,
      minWidth: 24,
      alignItems: 'center',
      marginLeft: theme.spacing.sm,
    },
    optionCountSelected: {
      backgroundColor: theme.colors.accent + '20',
    },
    optionCountText: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textSecondary,
      letterSpacing: theme.typography.letterSpacing * 0.2,
    },
    optionCountTextSelected: {
      color: theme.colors.accent,
    },
    checkIcon: {
      marginLeft: theme.spacing.sm,
    },
  }));

  const allFilters: FilterType[] = [
    'All', 'Today', 'Tomorrow', 'This Week', 'Focus', 'Sprint', 
    'Attention', 'Work Hours', 'After Hours', 'Weekend', 'Quick Wins'
  ];

  const handleFilterSelect = (filter: FilterType) => {
    console.log('Filter selected:', filter);
    setSelectedFilter(filter);
    setVisible(false);
  };

  const getDisplayCount = (filter: FilterType) => {
    const count = getFilterCount(filter);
    return count > 99 ? '99+' : count.toString();
  };

  return (
    <View style={styles.container}>
      <DropdownMenu
        visible={visible}
        handleOpen={() => setVisible(true)}
        handleClose={() => setVisible(false)}
        dropdownWidth={250}
        position="left"
        trigger={
          <View style={styles.triggerButton}>
            <Text style={styles.triggerText}>{selectedFilter}</Text>
            <Ionicons
              name="chevron-down"
              size={20}
              color={theme.colors.textSecondary}
            />
          </View>
        }
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          bounces={false}
          nestedScrollEnabled={true}
        >
          {allFilters.map((filter, index) => {
            const isSelected = filter === selectedFilter;
            const isLast = index === allFilters.length - 1;
            
            return (
              <MenuOption
                key={filter}
                onSelect={() => handleFilterSelect(filter)}
              >
                <View style={styles.optionContent}>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {filter}
                  </Text>
                  
                  <View style={[
                    styles.optionCount,
                    isSelected && styles.optionCountSelected,
                  ]}>
                    <Text
                      style={[
                        styles.optionCountText,
                        isSelected && styles.optionCountTextSelected,
                      ]}
                    >
                      {getDisplayCount(filter)}
                    </Text>
                  </View>
                  
                  {isSelected && (
                    <View style={styles.checkIcon}>
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={theme.colors.accent}
                      />
                    </View>
                  )}
                </View>
              </MenuOption>
            );
          })}
        </ScrollView>
      </DropdownMenu>
    </View>
  );
}