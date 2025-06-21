import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Platform
} from 'react-native';
import { Switch } from 'react-native-paper';
import { router, useLocalSearchParams } from 'expo-router';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useTaskStore, useMainStore } from '../hooks/useTaskStore';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { showAlert } from '../components/CustomAlert';
import { formatDateWithPreference, formatTime } from '../utils/dateFormatters';
import { Ionicons } from '@expo/vector-icons';

export default function AddTaskScreen() {
  const { addTask, tasks, updateTask } = useTaskStore();
  const { getSettings } = useMainStore();
  const { colors } = useTheme();
  const { edit } = useLocalSearchParams();
  
  const settings = getSettings();
  
  const isEditing = !!edit;
  const editingTask = isEditing ? tasks.find(t => t.id === edit) : null;

  // Form state - set default time 10 minutes ahead
  const getDefaultTime = () => {
    const now = new Date();
    return new Date(now.getTime() + 10 * 60 * 1000); // Add 10 minutes
  };
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderTime, setReminderTime] = useState(getDefaultTime());
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] = useState(24);
  const [ignoreWorkingHours, setIgnoreWorkingHours] = useState(false);
  const [enableSequentialNotification, setEnableSequentialNotification] = useState(false);
  const [sequentialInterval, setSequentialInterval] = useState(300); // Default to 5 minutes
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
      setEnableSequentialNotification(editingTask.enableSequentialNotification || false);
      setSequentialInterval(editingTask.sequentialInterval || 300);
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

  const sequentialIntervalOptions = [
    { label: '30s', value: 30 },
    { label: '5min', value: 300 },
    { label: '10min', value: 600 }
  ];

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }
    return formatDateWithPreference(
      dateObj, 
      settings.dateFormat, 
      settings.dateUseMonthNames, 
      settings.dateSeparator
    );
  };

  const formatTimeWithPreference = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Time';
    }
    return formatTime(dateObj, settings.timeFormat);
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showAlert('Error', 'Task name is required');
      return;
    }

    // Only check past time for new tasks, not when editing
    if (!isEditing) {
      const now = new Date();
      if (reminderTime <= now) {
        showAlert(
          'Invalid Time', 
          'Cannot schedule tasks in the past. Please select a future date and time.'
        );
        return;
      }
    }

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      isRecurring,
      recurringInterval,
      ignoreWorkingHours,
      reminderTime,
      enableSequentialNotification,
      sequentialInterval
    };

    try {
      if (isEditing && editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await addTask(taskData);
      }
      
      // Small delay to ensure task is saved before navigation
      setTimeout(() => {
        router.back();
      }, 100);
    } catch {
      showAlert('Error', 'Failed to save task');
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
            
            // Only check past date for new tasks, not when editing
            if (!isEditing) {
              const now = new Date();
              if (newDateTime <= now) {
                showAlert(
                  'Invalid Date', 
                  'Cannot schedule tasks in the past. Please select a future date.'
                );
                return;
              }
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
            
            // Only check past time for new tasks, not when editing
            if (!isEditing) {
              const now = new Date();
              if (newDateTime <= now) {
                showAlert(
                  'Invalid Time', 
                  'Cannot schedule tasks in the past. Please select a future time.'
                );
                return;
              }
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
      
      // Only check past date for new tasks, not when editing
      if (!isEditing) {
        const now = new Date();
        if (newDateTime <= now) {
          showAlert(
            'Invalid Date', 
            'Cannot schedule tasks in the past. Please select a future date.'
          );
          setShowDatePicker(false);
          return;
        }
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
      
      // Only check past time for new tasks, not when editing
      if (!isEditing) {
        const now = new Date();
        if (newDateTime <= now) {
          showAlert(
            'Invalid Time', 
            'Cannot schedule tasks in the past. Please select a future time.'
          );
          setShowTimePicker(false);
          return;
        }
      }
      
      setReminderTime(newDateTime);
    }
    setShowTimePicker(false);
  };

  const isTerminalTheme = true;
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: isTerminalTheme ? 2 : 0,
      borderBottomColor: colors.border,
      paddingTop: isTerminalTheme ? 50 : 60,
      paddingBottom: isTerminalTheme ? 16 : 24,
      paddingHorizontal: isTerminalTheme ? 16 : 24,
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: config.elevation.low,
      }),
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    terminalTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: 20 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: '800',
    },
    backButton: {
      padding: 0,
    },
    backButtonText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.8,
      fontWeight: '700',
    },
    helpText: {
      fontFamily: config.fontFamily.regular,
      fontSize: 10 * fontScale,
      color: colors.textMuted,
      letterSpacing: config.letterSpacing * 0.4,
      marginBottom: 8,
      lineHeight: 12 * fontScale,
    },
    instructionText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      marginBottom: 16,
      paddingHorizontal: 12,
      paddingVertical: 10,
      backgroundColor: colors.surfaceVariant,
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      fontWeight: '600',
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
      fontFamily: config.fontFamily.bold,
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      marginBottom: 8,
      fontWeight: '800',
    },
    textInput: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12 * fontScale,
      color: colors.text,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      borderRadius: config.borderRadius,
      padding: 14,
      letterSpacing: config.letterSpacing * 0.5,
      fontWeight: '500',
    },
    multilineInput: {
      height: 80,
      textAlignVertical: 'top',
    },
    dateTimeButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: config.borderRadius,
      padding: 12,
    },
    dateTimeText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing * 0.8,
      fontWeight: '700',
    },
    toggleCard: {
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : colors.surface,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.border,
      borderRadius: isTerminalTheme ? config.borderRadius : 20,
      padding: isTerminalTheme ? 12 : 20,
      marginBottom: 20,
      marginHorizontal: isTerminalTheme ? 0 : 4,
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }),
    },
    toggleRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    toggleLabel: {
      fontFamily: config.fontFamily.bold,
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: '800',
    },
    toggleSubtext: {
      fontFamily: config.fontFamily.regular,
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 4,
      letterSpacing: config.letterSpacing * 0.4,
      lineHeight: 16,
    },
    intervalSection: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    intervalLabel: {
      fontFamily: config.fontFamily.medium,
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.4,
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
      borderRadius: config.borderRadius,
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
      fontFamily: config.fontFamily.medium,
      fontSize: 10,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.4,
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
      backgroundColor: isTerminalTheme ? 'transparent' : colors.surfaceVariant,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.textMuted,
      borderRadius: isTerminalTheme ? config.borderRadius : 28,
      paddingVertical: isTerminalTheme ? 16 : 20,
      alignItems: 'center',
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }),
    },
    cancelButtonText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 11,
      color: colors.textMuted,
      letterSpacing: config.letterSpacing * 0.8,
    },
    submitButton: {
      flex: 1,
      backgroundColor: colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? config.borderRadius : 28,
      paddingVertical: isTerminalTheme ? 16 : 20,
      alignItems: 'center',
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
      }),
    },
    submitButtonText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 14 * fontScale,
      color: colors.background,
      letterSpacing: config.letterSpacing,
      fontWeight: '800',
    },
    bottomPadding: {
      height: 40,
    },
  }));

  return (
    <View style={styles.container}>
      {/* Header - Same pattern as index.tsx */}
      <View style={styles.header}>
        <View style={styles.terminalBar}>
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                router.back();
              }}
          >
            <Ionicons 
              name="arrow-back" 
              size={20} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>
          <Text style={styles.terminalTitle}>
{isEditing ? 'Edit Task' : 'New Task'}
          </Text>
        </View>

      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Instructions */}
        <Text style={styles.instructionText}>
          {isEditing 
            ? 'Edit task details and schedule - past times allowed when rescheduling'
            : 'Create a new task with scheduled reminder time (default: 10min from now)'
          }
          {'\n'}Required fields marked with (*), optional settings below
        </Text>
        
        {/* Title Field */}
        <View style={styles.section}>
          <Text style={styles.label}>Task Name *</Text>
          <Text style={styles.helpText}>
            Short name for the task
          </Text>
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
          <Text style={styles.label}>Description</Text>
          <Text style={styles.helpText}>
            Detailed description or notes for the task
          </Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={description}
            onChangeText={setDescription}
            placeholder="Optional task description..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Schedule Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Schedule Date</Text>
          <Text style={styles.helpText}>
            {isEditing 
              ? 'Date when the task reminder should be triggered (past dates allowed when editing)'
              : 'Date when the task reminder should be triggered (cannot be in the past)'
            }
          </Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => {
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
          <Text style={styles.label}>Schedule Time</Text>
          <Text style={styles.helpText}>
            {isEditing 
              ? 'Time when the task reminder should be triggered (24-hour format, past times allowed)'
              : 'Time when the task reminder should be triggered (24-hour format, must be future)'
            }
          </Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => {
              openTimePicker();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.dateTimeText}>
              {formatTimeWithPreference(reminderTime)}
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
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Recurring Task</Text>
              <Text style={styles.toggleSubtext}>Reschedule task at intervals</Text>
              <Text style={styles.toggleSubtext}>Examples: Eat, Drink water, Take medicine</Text>
            </View>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={isRecurring ? colors.accent : colors.textMuted}
            />
          </View>
          
          {isRecurring && (
            <View style={styles.intervalSection}>
              <Text style={styles.intervalLabel}>Repeat Interval</Text>
              <Text style={styles.helpText}>
                Time between automatic task rescheduling (H=hours, D=days, W=weeks)
              </Text>
              <View style={styles.chipContainer}>
                {intervalOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      recurringInterval === option.value && styles.selectedChip
                    ]}
                    onPress={() => {
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
              <Text style={styles.toggleLabel}>24 Hour Mode</Text>
              <Text style={styles.toggleSubtext}>Allow notifications outside configured work hours</Text>
            </View>
            <Switch
              value={ignoreWorkingHours}
              onValueChange={setIgnoreWorkingHours}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={ignoreWorkingHours ? colors.accent : colors.textMuted}
            />
          </View>
        </View>

        {/* Sequential Notifications */}
        <View style={styles.toggleCard}>
          <View style={styles.toggleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.toggleLabel}>Follow-up Reminders</Text>
              <Text style={styles.toggleSubtext}>Send follow-up reminder if first notification is ignored</Text>
              <Text style={styles.toggleSubtext}>Notification A at time T, then B at T + interval</Text>
            </View>
            <Switch
              value={enableSequentialNotification}
              onValueChange={setEnableSequentialNotification}
              trackColor={{ false: colors.border, true: colors.textSecondary }}
              thumbColor={enableSequentialNotification ? colors.accent : colors.textMuted}
            />
          </View>
          
          {enableSequentialNotification && (
            <View style={styles.intervalSection}>
              <Text style={styles.intervalLabel}>Follow-up Interval</Text>
              <Text style={styles.helpText}>
                Time delay before sending follow-up notification (if first is ignored)
              </Text>
              <View style={styles.chipContainer}>
                {sequentialIntervalOptions.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.chip,
                      sequentialInterval === option.value && styles.selectedChip
                    ]}
                    onPress={() => {
                      setSequentialInterval(option.value);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.chipText,
                      sequentialInterval === option.value && styles.selectedChipText
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              router.back();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              handleSubmit();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Task' : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}