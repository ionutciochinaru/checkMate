import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemedStyles } from '../hooks/useTheme';

interface DelayInputComponentProps {
  value: string;
  onValueChange: (value: string) => void;
}

const PRESET_DELAYS = [
  { label: '5m', value: '5m' },
  { label: '10m', value: '10m' },
  { label: '30m', value: '30m' },
  { label: '1h', value: '1h' },
  { label: '2h', value: '2h' },
  { label: '1d', value: '1d' },
];

export default function DelayInputComponent({ value, onValueChange }: DelayInputComponentProps) {
  const handlePresetPress = (presetValue: string) => {
    onValueChange(presetValue);
  };

  const styles = useThemedStyles((theme) => StyleSheet.create({
    container: {
      flex: 1,
    },
    presetsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    presetButton: {
      backgroundColor: theme.colors.surfaceVariant,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.md,
    },
    presetButtonActive: {
      backgroundColor: theme.colors.accent,
      borderColor: theme.colors.accent,
    },
    presetButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * 1.0,
      color: theme.colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: '700',
    },
    presetButtonTextActive: {
      color: theme.colors.background,
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10 * 1.0,
      color: theme.colors.textMuted,
      letterSpacing: 0.3,
      marginTop: 8,
    },
  }));

  return (
    <View style={styles.container}>
      <View style={styles.presetsContainer}>
        {PRESET_DELAYS.map((preset) => (
          <TouchableOpacity
            key={preset.value}
            style={[
              styles.presetButton,
              value === preset.value && styles.presetButtonActive
            ]}
            onPress={() => handlePresetPress(preset.value)}
          >
            <Text style={[
              styles.presetButtonText,
              value === preset.value && styles.presetButtonTextActive
            ]}>
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.helpText}>
        Selected: {value}
      </Text>
    </View>
  );
}