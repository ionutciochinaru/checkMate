import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { generateMockTasks } from '../scripts/generateMockTasks';

const MockDataGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { theme } = useTheme();

  const handleGenerateTasks = async () => {
    Alert.alert(
      'Generate Mock Tasks',
      'This will create 20+ realistic tasks with various properties. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            setIsGenerating(true);
            try {
              await generateMockTasks();
              Alert.alert('Success!', '20+ mock tasks have been created successfully.');
            } catch (error) {
              Alert.alert('Error', 'Failed to generate mock tasks. Please try again.');
              console.error('Mock task generation error:', error);
            } finally {
              setIsGenerating(false);
            }
          }
        }
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      margin: 16,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 16,
      lineHeight: 20,
    },
    button: {
      backgroundColor: theme.colors.accent,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: theme.colors.border,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    buttonTextDisabled: {
      color: theme.colors.textMuted,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mock Data Generator</Text>
      <Text style={styles.description}>
        Generate 20+ realistic tasks with various properties including:
        {'\n'}• Work, personal, and home tasks
        {'\n'}• Recurring and one-time tasks
        {'\n'}• Tasks with different delay counts
        {'\n'}• Completed and pending tasks
        {'\n'}• Tasks with descriptions and metadata
        {'\n'}• Various notification settings
      </Text>
      
      <TouchableOpacity
        style={[styles.button, isGenerating && styles.buttonDisabled]}
        onPress={handleGenerateTasks}
        disabled={isGenerating}
      >
        <Text style={[styles.buttonText, isGenerating && styles.buttonTextDisabled]}>
          {isGenerating ? 'Generating Tasks...' : 'Generate Mock Tasks'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default MockDataGenerator;