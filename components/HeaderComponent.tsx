import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { useMainStore } from '../hooks/useTaskStore';
import { FilterType } from '../hooks/useTaskFilter';
import { formatDateWithPreference } from '../utils/dateFormatters';

interface HeaderComponentProps {
  tasks: any[];
  pendingTasks: any[];
  completedTasks: any[];
  selectedFilter: FilterType;
  showFilterDropdown: boolean;
  setSelectedFilter: (filter: FilterType) => void;
  setShowFilterDropdown: (show: boolean) => void;
}

export default function HeaderComponent({
  tasks,
  pendingTasks,
  completedTasks,
  selectedFilter,
  showFilterDropdown,
  setSelectedFilter,
  setShowFilterDropdown
}: HeaderComponentProps) {
  const { colors, isDark, theme, setTheme, config } = useTheme();
  const { getSettings } = useMainStore();
  
  const settings = getSettings();


  // Format current date using user preferences
  const currentDate = formatDateWithPreference(
    new Date(), 
    settings.dateFormat, 
    settings.dateUseMonthNames, 
    settings.dateSeparator
  );

  const isTerminalTheme = true;
  
  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion, config) => StyleSheet.create({
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: isTerminalTheme ? 2 : 0,
      borderBottomColor: colors.border,
      paddingTop: isTerminalTheme ? 50 : 60,
      paddingBottom: 16,
      paddingHorizontal: 16,
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
      marginBottom: 8,
      flexWrap: 'wrap',
      minHeight: 40,
    },
    terminalTitle: {
      fontFamily: config.fontFamily.bold,
      fontSize: isTerminalTheme ? 20 * fontScale : 28 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing,
      fontWeight: isTerminalTheme ? '800' : '600',
      flexShrink: 1,
    },
    // Removed terminal time styles
    topRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 0,
    },
    themeToggle: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : colors.accent,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? 2 : 20,
      minWidth: isTerminalTheme ? 44 : 56,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      }),
    },
    themeToggleText: {
      fontFamily: config.fontFamily.bold,
      fontSize: isTerminalTheme ? 11 * fontScale : 14 * fontScale,
      color: isTerminalTheme ? colors.accent : colors.surface,
      letterSpacing: config.letterSpacing * 0.6,
      fontWeight: isTerminalTheme ? '800' : '600',
    },
    statusLine: {
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : colors.surface,
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.border,
      borderRadius: isTerminalTheme ? 0 : 12,
      padding: 12,
      marginBottom: 16,
      marginHorizontal: isTerminalTheme ? 0 : 16,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: 36,
      ...(isTerminalTheme ? {} : {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      }),
    },
    settingsButton: {
      paddingHorizontal: 8,
      paddingVertical: 8,
      backgroundColor: isTerminalTheme ? colors.surfaceVariant : 'transparent',
      borderWidth: isTerminalTheme ? 1 : 0,
      borderColor: colors.accent,
      borderRadius: isTerminalTheme ? 2 : 20,
      minWidth: isTerminalTheme ? 36 : 48,
      minHeight: isTerminalTheme ? 28 : 40,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIcon: {
      fontFamily: config.fontFamily.bold,
      fontSize: 12 * fontScale,
      color: colors.accent,
      letterSpacing: config.letterSpacing * 0.3,
      fontWeight: '800',
    },
    statusText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.3,
      flexShrink: 1,
    },
    filterContainer: {
      backgroundColor: colors.surface,
      paddingHorizontal: 0,
      paddingVertical: 0,
      position: 'relative',
    },
    filterButton: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 8,
      paddingVertical: 6,
      flexDirection: 'row',
      alignItems: 'center',
      flexShrink: 1,
      minWidth: 100,
    },
    filterText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing * 0.5,
      fontWeight: '700',
      flexShrink: 1,
    },
    filterDropdown: {
      position: 'absolute',
      top: 38,
      left: 12,
      right: 12,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      zIndex: 1000,
      elevation: 5,
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.5 : 0.25,
      shadowRadius: 4,
      maxHeight: 200,
    },
    filterOption: {
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      minHeight: 36,
    },
    selectedFilterOption: {
      backgroundColor: colors.accent,
    },
    filterOptionText: {
      fontFamily: config.fontFamily.medium,
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: config.letterSpacing * 0.5,
      fontWeight: '600',
      flexShrink: 1,
    },
    selectedFilterOptionText: {
      color: colors.background,
      fontFamily: config.fontFamily.bold,
    },
    filterRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 8,
    },
    filterButtonActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    filterArrow: {
      marginLeft: 8,
      fontSize: 12,
      color: colors.textSecondary,
      transform: [{ rotate: '0deg' }],
    },
    filterArrowRotated: {
      transform: [{ rotate: '180deg' }],
      color: isDark ? colors.background : colors.textSecondary,
    },
    quickFilters: {
      flexDirection: 'row',
      gap: 6,
      flexShrink: 0,
    },
    quickFilterChip: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 6,
      paddingVertical: 4,
      borderRadius: 8,
      minWidth: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    quickFilterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    quickFilterText: {
      fontFamily: config.fontFamily.bold,
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: config.letterSpacing * 0.3,
    },
    quickFilterTextActive: {
      color: colors.background,
    },
    filterCheckmark: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      fontFamily: config.fontFamily.bold,
      letterSpacing: config.letterSpacing * 0.3,
      flexShrink: 0,
    },
    lastFilterOption: {
      borderBottomWidth: 0,
    },
  }));

  return (
    <View style={styles.header}>
      <View style={styles.terminalBar}>
        <Text style={styles.terminalTitle}>CHECKMATE.EXE</Text>
        <View style={styles.topRightControls}>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={() => {
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
            }}
          >
            <Text style={styles.themeToggleText}>
              {theme === 'dark' ? '[DRK]' : '[LGT]'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
          >
            <Text style={styles.settingsIcon}>[CFG]</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusLine}>
        <Text style={styles.statusText}>
          SYS:{currentDate} | TSK:{tasks.length} | PEN:{pendingTasks.length} | DONE:{completedTasks.length}
        </Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.filterRow}>
          <TouchableOpacity
              style={[styles.filterButton, showFilterDropdown && styles.filterButtonActive]}
              onPress={() => setShowFilterDropdown(!showFilterDropdown)}
              activeOpacity={0.7}
          >
            <Text style={[
              styles.filterText,
              showFilterDropdown && { color: isDark ? colors.background : '#ffffff' }
            ]}>
              [FILTER]: {selectedFilter}
            </Text>
            <Text style={[styles.filterArrow, showFilterDropdown && styles.filterArrowRotated]}>
              {showFilterDropdown ? '^' : 'v'}
            </Text>
          </TouchableOpacity>

          <View style={styles.quickFilters}>
            {(['Today', 'All'] as FilterType[]).map(filter => (
                <TouchableOpacity
                    key={filter}
                    style={[
                      styles.quickFilterChip,
                      selectedFilter === filter && styles.quickFilterChipActive
                    ]}
                    onPress={() => {
                      setSelectedFilter(filter);
                      setShowFilterDropdown(false);
                    }}
                    activeOpacity={0.7}
                >
                  <Text style={[
                    styles.quickFilterText,
                    selectedFilter === filter && styles.quickFilterTextActive
                  ]}>
                    {filter === 'Today' ? '[T]' : '[*]'}
                  </Text>
                </TouchableOpacity>
            ))}
          </View>
        </View>

        {showFilterDropdown && (
            <View style={styles.filterDropdown}>
              {(['Today', 'Tomorrow', 'This Week', 'All'] as FilterType[]).map((filter, index) => (
                  <TouchableOpacity
                      key={filter}
                      style={[
                        styles.filterOption,
                        selectedFilter === filter && styles.selectedFilterOption,
                        index === 3 && styles.lastFilterOption
                      ]}
                      onPress={() => {
                        setSelectedFilter(filter);
                        setShowFilterDropdown(false);
                      }}
                      activeOpacity={0.7}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      selectedFilter === filter && styles.selectedFilterOptionText
                    ]}>
                      {filter}
                    </Text>
                    <Text style={styles.filterCheckmark}>
                      {selectedFilter === filter ? '[X]' : '[ ]'}
                    </Text>
                  </TouchableOpacity>
              ))}
            </View>
        )}
      </View>
    </View>
  );
}