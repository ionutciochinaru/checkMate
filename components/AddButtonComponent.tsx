import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';

interface AddButtonComponentProps {
  tasks: any[];
  filteredTasks: any[];
  selectedFilter: FilterType;
  showFilterDropdown: boolean;
  setShowFilterDropdown: (show: boolean) => void;
}

export default function AddButtonComponent({
  tasks,
  filteredTasks,
  selectedFilter,
  showFilterDropdown,
  setShowFilterDropdown
}: AddButtonComponentProps) {
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    addButton: {
      position: 'absolute',
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? '#000000' : '#ffffff',
      borderWidth: 2,
      borderStyle: 'dashed',
      borderColor: isDark ? '#ff4444' : '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: isDark ? '#ff4444' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    addButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 24 * fontScale,
      color: isDark ? '#ff4444' : '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
      lineHeight: 24 * fontScale,
    },
  }));

  if (tasks.length > 0 || (tasks.length > 0 && filteredTasks.length === 0)) {
    return (
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          if (showFilterDropdown) setShowFilterDropdown(false);
          router.push('/add-task');
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    );
  }

  return null;
}