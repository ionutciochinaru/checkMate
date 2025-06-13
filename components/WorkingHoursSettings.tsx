import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../hooks/useTaskStore';
import { useThemedStyles } from '../hooks/useTheme';

const WorkingHoursSettings: React.FC = () => {
  const { settings, updateSettings } = useTaskStore();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  if (!settings.workingHoursEnabled) {
    return null;
  }


  const handleTimeChange = (type: 'start' | 'end', time: string) => {
    if (type === 'start') {
      // Validate start time is before end time
      const [startHour, startMinute] = time.split(':').map(Number);
      const [endHour, endMinute] = settings.workingHoursEnd.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      if (startMinutes >= endMinutes) {
        // If start time would be after/equal to end time, adjust end time
        const newEndMinutes = startMinutes + 60; // Add 1 hour minimum
        const newEndHour = Math.floor(newEndMinutes / 60) % 24;
        const newEndMinute = newEndMinutes % 60;
        const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${newEndMinute.toString().padStart(2, '0')}`;
        updateSettings({ 
          workingHoursStart: time,
          workingHoursEnd: newEndTime
        });
      } else {
        updateSettings({ workingHoursStart: time });
      }
    } else {
      // Validate end time is after start time
      const [startHour, startMinute] = settings.workingHoursStart.split(':').map(Number);
      const [endHour, endMinute] = time.split(':').map(Number);
      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;
      
      if (endMinutes <= startMinutes) {
        // If end time would be before/equal to start time, adjust start time
        const newStartMinutes = endMinutes - 60; // Subtract 1 hour minimum
        const newStartHour = Math.max(0, Math.floor(newStartMinutes / 60));
        const newStartMinute = Math.max(0, newStartMinutes % 60);
        const newStartTime = `${newStartHour.toString().padStart(2, '0')}:${newStartMinute.toString().padStart(2, '0')}`;
        updateSettings({ 
          workingHoursStart: newStartTime,
          workingHoursEnd: time
        });
      } else {
        updateSettings({ workingHoursEnd: time });
      }
    }
  };

  const createDateFromTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  const formatTimeFromDate = (date: Date) => {
    return date.toTimeString().slice(0, 5);
  };

  const styles = useThemedStyles((colors, isDark, fontScale) => StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flex: 1,
    },
    timeContainer: {
      flex: 1,
      alignItems: 'stretch',
    },
    timeLabel: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 10 * fontScale,
      color: colors.textMuted,
      letterSpacing: 0.5,
      marginBottom: 4,
      alignSelf: 'center',
    },
    timeButton: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 4,
      paddingVertical: 8,
      minHeight: 20 * fontScale, // responsive button
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    timeText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: 0.5,
      textAlign: 'center',
      width: '100%',
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>START_TIME</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowStartPicker(true)}
        >
          <Text style={styles.timeText}>{settings.workingHoursStart}</Text>
        </TouchableOpacity>
        
        {showStartPicker && (
          <DateTimePicker
            value={createDateFromTime(settings.workingHoursStart)}
            mode="time"
            is24Hour={true}
            minuteInterval={15}
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowStartPicker(false);
              }
              if (event.type === 'set' && selectedDate) {
                handleTimeChange('start', formatTimeFromDate(selectedDate));
                if (Platform.OS === 'ios') {
                  setShowStartPicker(false);
                }
              } else if (event.type === 'dismissed') {
                setShowStartPicker(false);
              }
            }}
          />
        )}
      </View>

      <View style={styles.timeContainer}>
        <Text style={styles.timeLabel}>END_TIME</Text>
        <TouchableOpacity
          style={styles.timeButton}
          onPress={() => setShowEndPicker(true)}
        >
          <Text style={styles.timeText}>{settings.workingHoursEnd}</Text>
        </TouchableOpacity>
        
        {showEndPicker && (
          <DateTimePicker
            value={createDateFromTime(settings.workingHoursEnd)}
            mode="time"
            is24Hour={true}
            minuteInterval={15}
            onChange={(event, selectedDate) => {
              if (Platform.OS === 'android') {
                setShowEndPicker(false);
              }
              if (event.type === 'set' && selectedDate) {
                handleTimeChange('end', formatTimeFromDate(selectedDate));
                if (Platform.OS === 'ios') {
                  setShowEndPicker(false);
                }
              } else if (event.type === 'dismissed') {
                setShowEndPicker(false);
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

export default WorkingHoursSettings;