import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTaskStore } from '../hooks/useTaskStore';

const WorkingHoursSettings: React.FC = () => {
  const { settings, updateSettings } = useTaskStore();
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  if (!settings.workingHoursEnabled) return null;

  const handleTimeChange = (type: 'start' | 'end', time: string) => {
    if (type === 'start') {
      updateSettings({ workingHoursStart: time });
    } else {
      updateSettings({ workingHoursEnd: time });
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
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) {
                handleTimeChange('start', formatTimeFromDate(selectedDate));
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
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) {
                handleTimeChange('end', formatTimeFromDate(selectedDate));
              }
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  timeContainer: {
    flex: 1,
  },
  timeLabel: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 9,
    color: '#8a8a8a',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  timeButton: {
    backgroundColor: '#f5f5f0',
    borderWidth: 1,
    borderColor: '#d0d0c8',
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
  timeText: {
    fontFamily: 'JetBrainsMono_500Medium',
    fontSize: 11,
    color: '#1a1a1a',
    letterSpacing: 0.5,
  },
});

export default WorkingHoursSettings;