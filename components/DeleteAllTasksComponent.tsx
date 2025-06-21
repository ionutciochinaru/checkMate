import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTaskStore } from '../hooks/useTaskStore';
import { Ionicons } from '@expo/vector-icons';

const DeleteAllTasksComponent: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { theme } = useTheme();
  const { deleteAllTasks, tasks } = useTaskStore();

  const handleDeleteAllTasks = async () => {
    Alert.alert(
      'Delete All Tasks',
      `Are you sure you want to delete all ${tasks.length} tasks? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteAllTasks();
              Alert.alert('Success!', 'All tasks have been deleted successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete all tasks. Please try again.');
              console.error('Delete all tasks error:', error);
            } finally {
              setIsDeleting(false);
            }
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: 16,
      margin: 16,
      borderWidth: 2,
      borderColor: theme.colors.danger,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      marginRight: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      color: theme.colors.danger,
      fontFamily: theme.typography.fontFamily.bold,
    },
    description: {
      fontSize: 13,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 18,
      fontFamily: theme.typography.fontFamily.regular,
    },
    warningBox: {
      backgroundColor: theme.colors.danger + '15', // 15% opacity
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: theme.colors.danger + '30',
    },
    warningText: {
      fontSize: 12,
      color: theme.colors.danger,
      fontWeight: '600',
      textAlign: 'center',
      fontFamily: theme.typography.fontFamily.medium,
    },
    taskCount: {
      fontSize: 14,
      color: theme.colors.text,
      marginBottom: 16,
      textAlign: 'center',
      fontWeight: '600',
      fontFamily: theme.typography.fontFamily.medium,
    },
    button: {
      backgroundColor: theme.colors.danger,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonDisabled: {
      backgroundColor: theme.colors.border,
      opacity: 0.6,
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 8,
      fontFamily: theme.typography.fontFamily.bold,
    },
    buttonTextDisabled: {
      color: theme.colors.textMuted,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="warning" 
          size={24} 
          color={theme.colors.danger} 
          style={styles.icon} 
        />
        <Text style={styles.title}>Danger Zone</Text>
      </View>
      
      <Text style={styles.description}>
        Permanently delete all tasks from your device. This will remove all task data, 
        cancel scheduled notifications, and cannot be undone.
      </Text>

      <View style={styles.warningBox}>
        <Text style={styles.warningText}>
          ⚠️ THIS ACTION IS IRREVERSIBLE ⚠️
        </Text>
      </View>

      <Text style={styles.taskCount}>
        Current tasks: {tasks.length}
      </Text>
      
      <TouchableOpacity
        style={[
          styles.button, 
          (isDeleting || tasks.length === 0) && styles.buttonDisabled
        ]}
        onPress={handleDeleteAllTasks}
        disabled={isDeleting || tasks.length === 0}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={isDeleting ? "hourglass-outline" : "trash"} 
          size={16} 
          color={(isDeleting || tasks.length === 0) ? theme.colors.textMuted : '#fff'} 
        />
        <Text style={[
          styles.buttonText, 
          (isDeleting || tasks.length === 0) && styles.buttonTextDisabled
        ]}>
          {isDeleting ? 'Deleting All Tasks...' : 'Delete All Tasks'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DeleteAllTasksComponent;