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
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    addButton: {
      position: 'absolute',
      bottom: 26,
      right: 26,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      paddingHorizontal: 12,
      paddingVertical: 10,
      color: colors.surface,
      maxWidth: '60%',
    },
    addButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.surface,
      letterSpacing: 0.5,
      textAlign: 'center',
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
        <Text style={styles.addButtonText}>
          {filteredTasks.length === 0 && tasks.length > 0 
            ? `$ ./add_task --${selectedFilter.toLowerCase()}` 
            : '$ ./add_task --init'
          }
        </Text>
      </TouchableOpacity>
    );
  }

  return null;
}