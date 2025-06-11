import React, { useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import { Switch } from 'react-native-paper';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../hooks/useTaskStore';

interface FormData {
  title: string;
  description: string;
  isRecurring: boolean;
  recurringInterval: number;
  ignoreWorkingHours: boolean;
}

export default function AddTaskScreen() {
  const [reminderTime, setReminderTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const addTask = useTaskStore(state => state.addTask);

  const { control, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      title: '',
      description: '',
      isRecurring: false,
      recurringInterval: 24,
      ignoreWorkingHours: false
    }
  });

  const isRecurring = watch('isRecurring');

  const onSubmit = (data: FormData) => {
    addTask({
      ...data,
      reminderTime
    });
    router.back();
  };

  const intervalOptions = [
    { label: '1H', value: 1 },
    { label: '4H', value: 4 },
    { label: '8H', value: 8 },
    { label: '12H', value: 12 },
    { label: '24H', value: 24 },
    { label: '3D', value: 72 },
    { label: '1W', value: 168 }
  ];

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/\//g, '.').replace(', ', ' ');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Terminal Header */}
        <View style={styles.terminalHeader}>
          <Text style={styles.promptText}>$ ./create_task --config</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          {/* Title Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>TASK_NAME *</Text>
            <Controller
              control={control}
              name="title"
              rules={{ required: 'Task name required' }}
              render={({ field: { onChange, onBlur, value } }) => (
                <RNTextInput
                  style={[styles.textInput, errors.title && styles.errorInput]}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="Enter task name..."
                  placeholderTextColor="#8a8a8a"
                />
              )}
            />
            {errors.title && (
              <Text style={styles.errorText}>// ERROR: {errors.title.message}</Text>
            )}
          </View>

          {/* Description Field */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>DESCRIPTION</Text>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, onBlur, value } }) => (
                <RNTextInput
                  style={[styles.textInput, styles.multilineInput]}
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  placeholder="// Optional task description..."
                  placeholderTextColor="#8a8a8a"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              )}
            />
          </View>

          {/* Schedule Time */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>SCHEDULE_TIME</Text>
            <TouchableOpacity
              style={styles.dateTimeButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateTimeText}>
                {formatDateTime(reminderTime)}
              </Text>
            </TouchableOpacity>
            
            {showTimePicker && (
              <DateTimePicker
                value={reminderTime}
                mode="datetime"
                onChange={(event, selectedDate) => {
                  setShowTimePicker(false);
                  if (selectedDate) setReminderTime(selectedDate);
                }}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* Recurring Toggle */}
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>LOOP_MODE</Text>
            <Controller
              control={control}
              name="isRecurring"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#d0d0c8', true: '#4a4a4a' }}
                  thumbColor={value ? '#1a1a1a' : '#8a8a8a'}
                />
              )}
            />
          </View>

          {/* Recurring Interval */}
          {isRecurring && (
            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>LOOP_INTERVAL</Text>
              <Controller
                control={control}
                name="recurringInterval"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.chipContainer}>
                    {intervalOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[
                          styles.chip,
                          value === option.value && styles.selectedChip
                        ]}
                        onPress={() => onChange(option.value)}
                      >
                        <Text style={[
                          styles.chipText,
                          value === option.value && styles.selectedChipText
                        ]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
          )}

          {/* Working Hours Override */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleTextContainer}>
              <Text style={styles.toggleLabel}>24H_MODE</Text>
              <Text style={styles.toggleSubtext}>// Bypass work hours restriction</Text>
            </View>
            <Controller
              control={control}
              name="ignoreWorkingHours"
              render={({ field: { onChange, value } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#d0d0c8', true: '#4a4a4a' }}
                  thumbColor={value ? '#1a1a1a' : '#8a8a8a'}
                />
              )}
            />
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>EXECUTE</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f0',
  },
  content: {
    padding: 20,
  },
  terminalHeader: {
    backgroundColor: '#e8e8e0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    padding: 12,
    marginBottom: 24,
  },
  promptText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  formSection: {
    marginBottom: 24,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 11,
    color: '#1a1a1a',
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 14,
    color: '#1a1a1a',
    backgroundColor: '#f5f5f0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    padding: 12,
    letterSpacing: 0.3,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 10,
    color: '#ff3b30',
    marginTop: 4,
    letterSpacing: 0.3,
  },
  dateTimeButton: {
    backgroundColor: '#e8e8e0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    padding: 12,
  },
  dateTimeText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 12,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#e8e8e0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    padding: 12,
  },
  toggleLabel: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 11,
    color: '#1a1a1a',
    letterSpacing: 1,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleSubtext: {
    fontFamily: 'JetBrainsMono_400Regular',
    fontSize: 9,
    color: '#8a8a8a',
    marginTop: 2,
    letterSpacing: 0.3,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#e8e8e0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  selectedChip: {
    backgroundColor: '#1a1a1a',
    borderColor: '#1a1a1a',
  },
  chipText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 10,
    color: '#4a4a4a',
    letterSpacing: 0.5,
  },
  selectedChipText: {
    color: '#f5f5f0',
  },
  actionContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8a8a8a',
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 11,
    color: '#8a8a8a',
    letterSpacing: 1,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#1a1a1a',
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontFamily: 'JetBrainsMono_700Bold',
    fontSize: 11,
    color: '#f5f5f0',
    letterSpacing: 1,
  },
});