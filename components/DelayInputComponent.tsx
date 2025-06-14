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

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    container: {
      flex: 1,
    },
    presetsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    presetButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 12,
      paddingVertical: 8,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    presetButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    presetButtonText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: '700',
    },
    presetButtonTextActive: {
      color: colors.background,
    },
    helpText: {
      fontFamily: 'JetBrainsMono_400Regular',
      fontSize: 10 * fontScale,
      color: colors.textMuted,
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