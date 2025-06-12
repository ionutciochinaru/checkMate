import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform,
  Alert
} from 'react-native';
import { Switch } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTaskStore } from '../hooks/useTaskStore';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import Animated from 'react-native-reanimated';

export default function AddTaskScreen() {
  const { addTask, tasks, updateTask } = useTaskStore();
  const { colors, animatedBackgroundStyle } = useTheme();
  const { edit } = useLocalSearchParams();
  
  const isEditing = !!edit;
  const editingTask = isEditing ? tasks.find(t => t.id === edit) : null;

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState(new Date());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState(24);
  const [ignoreWorkingHours, setIgnoreWorkingHours] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Load existing task data when editing
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setReminderTime(editingTask.reminderTime);
      setIsRecurring(editingTask.isRecurring);
      setRecurringInterval(editingTask.recurringInterval || 24);
      setIgnoreWorkingHours(editingTask.ignoreWorkingHours);
    }
  }, [editingTask]);

  const intervalOptions = [
    { label: '1H', value: 1 },
    { label: '4H', value: 4 },
    { label: '8H', value: 8 },
    { label: '12H', value: 12 },
    { label: '24H', value: 24 },
    { label: '3D', value: 72 },
    { label: '1W', value: 168 }
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '.');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task name is required');
      return;
    }

    // Check if the scheduled time is in the past
    const now = new Date();
    if (reminderTime <= now) {
      Alert.alert(
        'Invalid Time', 
        'Cannot schedule tasks in the past. Please select a future date and time.'
      );
      return;
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      isRecurring,
      recurringInterval,
      ignoreWorkingHours,
      reminderTime
    };

    try {
      if (isEditing && editingTask) {
        updateTask(editingTask.id, taskData);
      } else {
        addTask(taskData);
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to save task');
    }
  };

  const openDatePicker = () => {

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: reminderTime,
        mode: 'date',
        minimumDate: new Date(),
        onChange: (event, selectedDate) => {

          if (event?.type === 'set' && selectedDate) {
            const newDateTime = new Date(reminderTime);
            newDateTime.setFullYear(selectedDate.getFullYear());
            newDateTime.setMonth(selectedDate.getMonth());
            newDateTime.setDate(selectedDate.getDate());
            
            // Check if the new date/time is in the past
            const now = new Date();
            if (newDateTime <= now) {
              Alert.alert(
                'Invalid Date', 
                'Cannot schedule tasks in the past. Please select a future date.'
              );
              return;
            }
            
            setReminderTime(newDateTime);
          }
        }
      });
    } else {
      setShowDatePicker(true);
    }
  };

  const openTimePicker = () => {

    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: reminderTime,
        mode: 'time',
        is24Hour: true,
        onChange: (event, selectedTime) => {

          if (event?.type === 'set' && selectedTime) {
            const newDateTime = new Date(reminderTime);
            newDateTime.setHours(selectedTime.getHours());
            newDateTime.setMinutes(selectedTime.getMinutes());
            newDateTime.setSeconds(0);
            newDateTime.setMilliseconds(0);
            
            // Check if the new date/time is in the past
            const now = new Date();
            if (newDateTime <= now) {
              Alert.alert(
                'Invalid Time', 
                'Cannot schedule tasks in the past. Please select a future time.'
              );
              return;
            }
            
            setReminderTime(newDateTime);
          }
        }
      });
    } else {
      setShowTimePicker(true);
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event?.type !== 'dismissed' && selectedDate) {
      const newDateTime = new Date(reminderTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      
      // Check if the new date/time is in the past
      const now = new Date();
      if (newDateTime <= now) {
        Alert.alert(
          'Invalid Date', 
          'Cannot schedule tasks in the past. Please select a future date.'
        );
        setShowDatePicker(false);
        return;
      }
      
      setReminderTime(newDateTime);
    }
    setShowDatePicker(false);
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (event?.type !== 'dismissed' && selectedTime) {
      // Preserve the date, only update the time
      const newDateTime = new Date(reminderTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      newDateTime.setSeconds(0);
      newDateTime.setMilliseconds(0);
      
      // Check if the new date/time is in the past
      const now = new Date();
      if (newDateTime <= now) {
        Alert.alert(
          'Invalid Time', 
          'Cannot schedule tasks in the past. Please select a future time.'
        );
        setShowTimePicker(false);
        return;
      }
      
      setReminderTime(newDateTime);
    }
    setShowTimePicker(false);
  };

  const styles = useThemedStyles((colors, isDark) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      paddingTop: 50,
      paddingBottom: 16,
      paddingHorizontal: 16,
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    terminalTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 16,
      color: colors.text,
      letterSpacing: 1,
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    section: {
      marginBottom: 20,
    },
    label: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11,
      color: colors.text,
      letterSpacing: 1,
      marginBottom: 8,
    },
    textInput: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 14,
      color: colors.text,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      letterSpacing: 0.3,
    },
    multilineInput: {
      height: 80,
      textAlignVertical: 'top',
    },
    dateTimeButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
    },
    dateTimeText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12,
      color: colors.text,
      letterSpacing: 0.5,
    },
    toggleCard: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 12,
      marginBottom: 20,
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toggleLabel: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11,
      color: colors.text,
      letterSpacing: 1,
    },
    toggleSubtext: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 9,
      color: colors.textMuted,
      marginTop: 2,
      letterSpacing: 0.3,
    },
    intervalSection: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    intervalLabel: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 8,
    },
    chipContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minHeight: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedChip: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    chipText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: 0.5,
    },
    selectedChipText: {
      color: colors.background,
    },
    actionContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 24,
    },
    cancelButton: {
      flex: 1,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: colors.textMuted,
      paddingVertical: 16,
      alignItems: 'center',
    },
    cancelButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11,
      color: colors.textMuted,
      letterSpacing: 1,
    },
    submitButton: {
      flex: 1,
      backgroundColor: colors.accent,
      borderWidth: 1,
      borderColor: colors.accent,
      paddingVertical: 16,
      alignItems: 'center',
    },
    submitButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 11,
      color: colors.background,
      letterSpacing: 1,
    },
    bottomPadding: {
      height: 40,
    },
  }));

  return (
    <Animated.View style={[styles.container, animatedBackgroundStyle]}>
      {/* Header - Same pattern as index.tsx */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <Text style={styles.terminalTitle}>
            {isEditing ? 'EDIT_TASK.EXE' : 'NEW_TASK.EXE'}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              console.log('Back button pressed');
              router.back();
            }}
          >
            <Text style={styles.backButtonText}>← BACK</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Title Field */}
        <View style={styles.section}>
          <Text style={styles.label}>TASK_NAME *</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task name..."
            placeholderTextColor={colors.textMuted}
          />
        </View>

        {/* Description Field */}
        <View style={styles.section}>
          <Text style={styles.label}>DESCRIPTION</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="// Optional task description..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Schedule Date */}
        <View style={styles.section}>
          <Text style={styles.label}>SCHEDULE_DATE</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => {
              console.log('Date picker button pressed!');
              openDatePicker();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeText}>
              {formatDate(reminderTime)}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && Platform.OS === 'ios' && (
            <DateTimePicker
              value={reminderTime}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {/* Schedule Time */}
        <View style={styles.section}>
          <Text style={styles.label}>SCHEDULE_TIME</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => {
              console.log('Time picker button pressed!');
              openTimePicker();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeText}>
              {formatTime(reminderTime)}
            </Text>
          </TouchableOpacity>
          
          {showTimePicker && Platform.OS === 'ios' && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Loop Mode */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>LOOP_MODE</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={isRecurring ? colors.accent : colors.textMuted}
            />
          </View>
          
          {isRecurring && (
            <View style={styles.intervalSection}>
              <Text style={styles.intervalLabel}>LOOP_INTERVAL</Text>
              <View style={styles.chipContainer}>
                {intervalOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      recurringInterval === option.value && styles.selectedChip
                    ]}
                    onPress={() => {
                      console.log('Setting interval to:', option.value);
                      setRecurringInterval(option.value);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.chipText,
                      recurringInterval === option.value && styles.selectedChipText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* 24H Mode */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>24H_MODE</Text>
              <Text style={styles.toggleSubtext}>// Bypass work hours restriction</Text>
            </View>
            <Switch
              value={ignoreWorkingHours}
              onValueChange={setIgnoreWorkingHours}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={ignoreWorkingHours ? colors.accent : colors.textMuted}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              console.log('Cancel button pressed');
              router.back();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              console.log('Submit button pressed!');
              handleSubmit();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? 'UPDATE' : 'EXECUTE'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Animated.View>
  );
}