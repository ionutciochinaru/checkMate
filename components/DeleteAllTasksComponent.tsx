import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useTaskStore } from '../hooks/useTaskStore';
import { Ionicons } from '@expo/vector-icons';

const DeleteAllTasksComponent: React.FC = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { colors, config } = useTheme();
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
      backgroundColor: colors.surface,
      borderRadius: config.borderRadius,
      padding: 16,
      margin: 16,
      borderWidth: 2,
      borderColor: colors.danger,
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
      color: colors.danger,
      fontFamily: config.fontFamily.bold,
    },
    description: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 16,
      lineHeight: 18,
      fontFamily: config.fontFamily.regular,
    },
    warningBox: {
      backgroundColor: colors.danger + '15', // 15% opacity
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.danger + '30',
    },
    warningText: {
      fontSize: 12,
      color: colors.danger,
      fontWeight: '600',
      textAlign: 'center',
      fontFamily: config.fontFamily.medium,
    },
    taskCount: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
      fontWeight: '600',
      fontFamily: config.fontFamily.medium,
    },
    button: {
      backgroundColor: colors.danger,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderRadius: config.borderRadius,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    buttonDisabled: {
      backgroundColor: colors.border,
      opacity: 0.6,
    },
    buttonText: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
      marginLeft: 8,
      fontFamily: config.fontFamily.bold,
    },
    buttonTextDisabled: {
      color: colors.textMuted,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons 
          name="warning" 
          size={24} 
          color={colors.danger} 
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
          color={(isDeleting || tasks.length === 0) ? colors.textMuted : '#fff'} 
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