import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { useTaskStore } from '../hooks/useTaskStore';
import { useNotifications } from '../hooks/useNotifications';
import TaskItem from '../components/TaskItem';
import WorkingHoursSettings from '../components/WorkingHoursSettings';

export default function HomeScreen() {
  const { tasks, settings, updateSettings } = useTaskStore();
  const { scheduleTaskReminder } = useNotifications();

  const pendingTasks = tasks.filter(task => !task.isCompleted);
  const completedTasks = tasks.filter(task => task.isCompleted);

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  return (
    <View style={styles.container}>
      {/* Terminal-style Header */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <Text style={styles.terminalTitle}>CHECKMATE.EXE</Text>
          <Text style={styles.terminalTime}>{currentTime}</Text>
        </View>
        
        <View style={styles.statusLine}>
          <Text style={styles.statusText}>
            SYS: {currentDate} | TASKS: {tasks.length} | PENDING: {pendingTasks.length} | DONE: {completedTasks.length}
          </Text>
        </View>

        {/* Settings Panel */}
        <View style={styles.settingsPanel}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>WORK_HOURS_MODE</Text>
            <Switch
              value={settings.workingHoursEnabled}
              onValueChange={(value) => updateSettings({ workingHoursEnabled: value })}
              trackColor={{ false: '#d0d0c8', true: '#4a4a4a' }}
              thumbColor={settings.workingHoursEnabled ? '#1a1a1a' : '#8a8a8a'}
            />
          </View>
          
          <WorkingHoursSettings />
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Empty State */}
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>NO_TASKS_LOADED</Text>
            <Text style={styles.emptySubtitle}>// Initialize new task to begin</Text>
            <Text style={styles.emptyCommand}>$ ./add_task --init</Text>
          </View>
        )}

        {/* Pending Tasks Section */}
        {pendingTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ACTIVE_PROCESSES [{pendingTasks.length}]</Text>
              <View style={styles.sectionLine} />
            </View>
            {pendingTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </View>
        )}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>COMPLETED_PROCESSES [{completedTasks.length}]</Text>
              <View style={styles.sectionLine} />
            </View>
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </View>
        )}

        <View style={styles.bottomPadding} />
      </ScrollView>

      {/* Terminal-style Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/add-task')}
        activeOpacity={0.8}
      >
        <Text style={styles.addButtonText}>+ NEW_TASK</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  header: {
    backgroundColor: '#f5f5f0',
    borderBottomWidth: 2,
    borderBottomColor: '#d0d0c8',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  terminalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  terminalTitle: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 16,
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  terminalTime: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: '#4a4a4a',
    letterSpacing: 0.5,
  },
  statusLine: {
    backgroundColor: '#e8e8e0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    padding: 8,
    marginBottom: 16,
  },
  statusText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    color: '#4a4a4a',
    letterSpacing: 0.5,
  },
  settingsPanel: {
    backgroundColor: '#e8e8e0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    padding: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 18,
    color: '#1a1a1a',
    letterSpacing: 1,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 12,
    color: '#4a4a4a',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  emptyCommand: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: '#8a8a8a',
    backgroundColor: '#e8e8e0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#d0d0c8',
    letterSpacing: 0.5,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 12,
    color: '#1a1a1a',
    letterSpacing: 1,
    marginRight: 16,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d0d0c8',
  },
  bottomPadding: {
    height: 80,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    borderColor: '#4a4a4a',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  addButtonText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 10,
    color: '#f5f5f0',
    letterSpacing: 1,
  },
});