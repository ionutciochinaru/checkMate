import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import DropdownMenu from './DropdownMenu';
import { MenuOption } from './MenuOption';

interface TaskMenuOption {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
  destructive?: boolean;
}

interface TaskMenuDropdownProps {
  options: TaskMenuOption[];
  textColor: string;
}

export default function TaskMenuDropdown({
  options,
  textColor,
}: TaskMenuDropdownProps) {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);

  const styles = useThemedStyles((theme) => StyleSheet.create({
    triggerButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'transparent',
      borderWidth: 0.5,
      borderColor: theme.isDark ? 'rgba(255,255,255,0.3)' : textColor + '50',
      justifyContent: 'center',
      alignItems: 'center',
    },
    optionContent: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    optionIcon: {
      marginRight: theme.spacing.sm,
      width: 20,
      alignItems: 'center',
    },
    optionText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      flex: 1,
    },
    optionTextDestructive: {
      color: theme.colors.danger,
    },
  }));

  const handleOptionSelect = (option: TaskMenuOption) => {
    setVisible(false);
    // Add delay to prevent modal race condition between dropdown and alert
    setTimeout(() => {
      option.onPress();
    }, 200);
  };

  return (
    <DropdownMenu
      visible={visible}
      handleOpen={() => setVisible(true)}
      handleClose={() => setVisible(false)}
      dropdownWidth={180}
      position="right"
      isIcon={true}
      trigger={
        <View style={styles.triggerButton}>
          <Ionicons
            name="ellipsis-horizontal"
            size={16}
            color={textColor}
          />
        </View>
      }
    >
      {options.map((option, index) => {
        const isLast = index === options.length - 1;
        
        return (
          <MenuOption
            key={option.id}
            onSelect={() => handleOptionSelect(option)}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionIcon}>
                <Ionicons
                  name={option.icon as any}
                  size={16}
                  color={option.destructive ? theme.colors.danger : theme.colors.text}
                />
              </View>
              
              <Text
                style={[
                  styles.optionText,
                  option.destructive && styles.optionTextDestructive,
                ]}
              >
                {option.label}
              </Text>
            </View>
          </MenuOption>
        );
      })}
    </DropdownMenu>
  );
}