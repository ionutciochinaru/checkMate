import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemedStyles } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';
import FilterDropdown from './FilterDropdown';

interface FilterBarLayoutProps {
  selectedFilter: FilterType;
  setSelectedFilter: (filter: FilterType) => void;
  getFilterCount: (filter: FilterType) => number;
}

export default function FilterBarLayout({
  selectedFilter,
  setSelectedFilter,
  getFilterCount,
}: FilterBarLayoutProps) {

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
    },
  }));

  return (
    <View style={styles.container}>
      <FilterDropdown
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
        getFilterCount={getFilterCount}
      />
    </View>
  );
}