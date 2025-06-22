import React, { ReactNode } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useThemedStyles } from '../hooks/useTheme';

interface MenuOptionProps {
  onSelect: () => void;
  children: ReactNode;
}

export const MenuOption = ({
  onSelect,
  children,
}: MenuOptionProps) => {
  const styles = useThemedStyles((theme) => StyleSheet.create({
    menuOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
      minHeight: 48,
    },
  }));

  return (
    <TouchableOpacity onPress={onSelect} style={styles.menuOption}>
      {children}
    </TouchableOpacity>
  );
};