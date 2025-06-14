import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { FilterType } from '../hooks/useTaskFilter';

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
  const { colors, isDark, theme, setTheme } = useTheme();

  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour12: false, 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '.');

  const styles = useThemedStyles((colors, isDark, fontScale, reducedMotion) => StyleSheet.create({
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: 2,
      borderBottomColor: colors.border,
      paddingTop: 50,
      paddingBottom: 12,
      paddingHorizontal: 12,
    },
    terminalBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 6,
      flexWrap: 'wrap',
      minHeight: 32,
    },
    terminalTitle: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 18 * fontScale,
      color: colors.text,
      letterSpacing: 1,
      fontWeight: '800',
      flexShrink: 1,
    },
    terminalTime: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.5,
      fontWeight: '600',
      flexShrink: 0,
    },
    topRightControls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexShrink: 1,
    },
    themeToggle: {
      padding: 6,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 2,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    themeToggleText: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.accent,
      letterSpacing: 0.5,
      fontWeight: '800',
    },
    statusLine: {
      backgroundColor: colors.surfaceVariant,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 6,
      marginBottom: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      minHeight: 36,
    },
    settingsButton: {
      padding: 6,
      backgroundColor: colors.surfaceVariant,
      borderWidth: 2,
      borderColor: colors.accent,
      borderRadius: 2,
      minWidth: 48,
      alignItems: 'center',
      justifyContent: 'center',
    },
    settingsIcon: {
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.accent,
      letterSpacing: 0.5,
      fontWeight: '800',
    },
    statusText: {
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.3,
      fontWeight: '600',
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
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: 0.5,
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
      fontFamily: 'JetBrainsMono_500Medium',
      fontSize: 12 * fontScale,
      color: colors.text,
      letterSpacing: 0.5,
      fontWeight: '600',
      flexShrink: 1,
    },
    selectedFilterOptionText: {
      color: colors.background,
      fontFamily: 'JetBrainsMono_700Bold',
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
      fontFamily: 'JetBrainsMono_700Bold',
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      letterSpacing: 0.3,
    },
    quickFilterTextActive: {
      color: colors.background,
    },
    filterCheckmark: {
      fontSize: 12 * fontScale,
      color: colors.textSecondary,
      fontFamily: 'JetBrainsMono_700Bold',
      letterSpacing: 0.3,
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
              const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light';
              setTheme(nextTheme);
            }}
          >
            <Text style={styles.themeToggleText}>
              {theme === 'light' ? '[+LGT]' : theme === 'dark' ? '[+TRM]' : '[+AUTO]'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => router.push('/settings')}
          >
            <Text style={styles.settingsIcon}>[+CFG]</Text>
          </TouchableOpacity>
          <Text style={styles.terminalTime}>{currentTime}</Text>
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