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
import Animated from 'react-native-reanimated';

export default function AddTaskScreen() {
  const { addTask, tasks, updateTask } = useTaskStore();
  const { getSettings } = useMainStore();
  const { colors, animatedBackgroundStyle } = useTheme();
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
      reminderTime
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
    } catch (error) {
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

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
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
      fontSize: 20 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      fontWeight: '800',
    },
    backButton: {
      padding: 0,
    },
    backButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 1,
      fontWeight: '700',
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 8,
      lineHeight: 12 * fontScale,
    },
    instructionText: {
      fontFamily: 'JetBrainsMono_500Medium',
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
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      marginBottom: 8,
      fontWeight: '800',
    },
    textInput: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.text,
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.border,
      padding: 14,
      letterSpacing: 0.5,
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
      padding: 12,
    },
    dateTimeText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 0.8,
      fontWeight: '700',
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
      fontSize: 14 * fontScale,
      color: colors.text,
      letterSpacing: 1.2,
      fontWeight: '800',
    },
    toggleSubtext: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 11,
      color: colors.textMuted,
      marginTop: 4,
      letterSpacing: 0.5,
      lineHeight: 16,
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
      fontSize: 14 * fontScale,
      color: colors.background,
      letterSpacing: 1.2,
      fontWeight: '800',
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
          <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                router.back();
              }}
          >
            <Text style={styles.backButtonText}>[ESC] BACK</Text>
          </TouchableOpacity>
          <Text style={styles.terminalTitle}>
            {isEditing ? 'EDIT_TASK.EXE' : 'NEW_TASK.EXE'}
          </Text>
        </View>

      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Instructions */}
        <Text style={styles.instructionText}>
          {isEditing 
            ? '// Edit task details and schedule - past times allowed when rescheduling'
            : '// Create a new task with scheduled reminder time (default: 10min from now)'
          }
          {'\n'}// Required fields marked with (*), optional settings below
        </Text>
        
        {/* Title Field */}
        <View style={styles.section}>
          <Text style={styles.label}>TASK_NAME *</Text>
          <Text style={styles.helpText}>
            // Short name for the task
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
          <Text style={styles.label}>DESCRIPTION</Text>
          <Text style={styles.helpText}>
            // Detailed description or notes for the task
          </Text>
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
          <Text style={styles.helpText}>
            {isEditing 
              ? '// Date when the task reminder should be triggered (past dates allowed when editing)'
              : '// Date when the task reminder should be triggered (cannot be in the past)'
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
          <Text style={styles.label}>SCHEDULE_TIME</Text>
          <Text style={styles.helpText}>
            {isEditing 
              ? '// Time when the task reminder should be triggered (24-hour format, past times allowed)'
              : '// Time when the task reminder should be triggered (24-hour format, must be future)'
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
              <Text style={styles.toggleLabel}>LOOP_MODE</Text>
              <Text style={styles.toggleSubtext}>// Reschedule task at intervals</Text>
              <Text style={styles.toggleSubtext}>// [Ex: Eat, Drink water]</Text>
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
              <Text style={styles.intervalLabel}>LOOP_INTERVAL</Text>
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
              <Text style={styles.toggleLabel}>24H_MODE</Text>
              <Text style={styles.toggleSubtext}>// Allow notifications outside configured work hours</Text>
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
              router.back();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelButtonText}>[ESC]</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => {
              handleSubmit();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? '[UPD]' : '[EXE]'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Animated.View>
  );
}