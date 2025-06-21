import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles } from '../hooks/useTheme';
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
  
  const styles = useThemedStyles((theme) => StyleSheet.create({
    addButton: {
      position: 'absolute',
      bottom: 32,
      right: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.isDark ? '#000000' : '#ffffff',
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: theme.isDark ? '#ff4444' : '#000000',
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: theme.isDark ? '#ff4444' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
    addButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: theme.typography.fontSize.xl,
      color: theme.isDark ? '#ff4444' : '#000000',
      textAlign: 'center',
      fontWeight: 'bold',
      lineHeight: theme.typography.fontSize.xl,
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