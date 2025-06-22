import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useThemedStyles, useTheme } from '../hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { FilterPreset, FilterType } from '../hooks/useTaskFilter';
import { useFilterPresets } from '../hooks/useFilterPresets';

interface FilterPresetManagerProps {
  visible: boolean;
  onClose: () => void;
  onLoadPreset: (preset: FilterPreset) => void;
  currentFilter: {
    primaryFilter: FilterType;
    additionalFilters: FilterType[];
    filterLogic: 'AND' | 'OR';
    searchText: string;
  };
}

export default function FilterPresetManager({ 
  visible, 
  onClose, 
  onLoadPreset, 
  currentFilter 
}: FilterPresetManagerProps) {
  const { theme } = useTheme();
  const { 
    presets, 
    recentFilters, 
    isLoading, 
    savePreset, 
    deletePreset, 
    updatePreset, 
    clearRecent 
  } = useFilterPresets();
  
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [editingPreset, setEditingPreset] = useState<string | null>(null);

  if (!visible) return null;

  const handleSavePreset = async () => {
    if (!presetName.trim()) {
      Alert.alert('Error', 'Please enter a name for the preset');
      return;
    }

    try {
      await savePreset(
        presetName.trim(),
        currentFilter.primaryFilter,
        currentFilter.additionalFilters,
        currentFilter.filterLogic,
        currentFilter.searchText
      );
      
      setPresetName('');
      setShowSaveForm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save preset');
    }
  };

  const handleDeletePreset = (preset: FilterPreset) => {
    Alert.alert(
      'Delete Preset',
      `Are you sure you want to delete "${preset.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deletePreset(preset.id)
        }
      ]
    );
  };

  const handleRenamePreset = (preset: FilterPreset) => {
    Alert.prompt(
      'Rename Preset',
      'Enter new name:',
      (newName) => {
        if (newName && newName.trim()) {
          updatePreset(preset.id, { name: newName.trim() });
        }
      },
      'plain-text',
      preset.name
    );
  };

  const formatPresetDescription = (preset: FilterPreset): string => {
    const parts: string[] = [];
    
    if (preset.primaryFilter !== 'All') {
      parts.push(preset.primaryFilter);
    }
    
    if (preset.additionalFilters.length > 0) {
      parts.push(`${preset.filterLogic} ${preset.additionalFilters.join(', ')}`);
    }
    
    if (preset.searchText.trim()) {
      parts.push(`"${preset.searchText}"`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'All tasks';
  };

  const styles = useThemedStyles((theme) => StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      margin: theme.spacing.md,
      maxHeight: '80%',
      minWidth: '90%',
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 8,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    title: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.lg,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing,
    },
    closeButton: {
      padding: theme.spacing.xs,
    },
    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.5,
    },
    sectionAction: {
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      backgroundColor: theme.colors.accent,
      borderRadius: theme.borderRadius.sm,
    },
    sectionActionText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.background,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    presetItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    lastPresetItem: {
      borderBottomWidth: 0,
    },
    presetContent: {
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    presetName: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      letterSpacing: theme.typography.letterSpacing * 0.3,
    },
    presetDescription: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.textMuted,
      letterSpacing: theme.typography.letterSpacing * 0.3,
      marginTop: 2,
    },
    presetMeta: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.textMuted,
      letterSpacing: theme.typography.letterSpacing * 0.2,
      marginTop: 1,
    },
    presetActions: {
      flexDirection: 'row',
      gap: theme.spacing.xs,
    },
    actionButton: {
      padding: theme.spacing.xs,
      borderRadius: theme.borderRadius.sm,
      backgroundColor: theme.colors.surfaceVariant,
    },
    deleteButton: {
      backgroundColor: theme.colors.danger,
    },
    saveForm: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    saveFormTitle: {
      fontFamily: theme.typography.fontFamily.bold,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    saveInput: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    saveFormActions: {
      flexDirection: 'row',
      gap: theme.spacing.sm,
    },
    saveButton: {
      flex: 1,
      backgroundColor: theme.colors.accent,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
    },
    cancelButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      alignItems: 'center',
    },
    saveButtonText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.background,
    },
    cancelButtonText: {
      fontFamily: theme.typography.fontFamily.medium,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.text,
    },
    emptyState: {
      paddingVertical: theme.spacing.xl,
      alignItems: 'center',
    },
    emptyStateText: {
      fontFamily: theme.typography.fontFamily.regular,
      fontSize: theme.typography.fontSize.md,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  }));

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter Presets</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Save Current Filter */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Save Current Filter</Text>
              <TouchableOpacity 
                style={styles.sectionAction}
                onPress={() => setShowSaveForm(!showSaveForm)}
              >
                <Text style={styles.sectionActionText}>
                  {showSaveForm ? 'Cancel' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>

            {showSaveForm && (
              <View style={styles.saveForm}>
                <Text style={styles.saveFormTitle}>Save as Preset</Text>
                <TextInput
                  style={styles.saveInput}
                  placeholder="Enter preset name..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={presetName}
                  onChangeText={setPresetName}
                  autoFocus
                  returnKeyType="done"
                  onSubmitEditing={handleSavePreset}
                />
                <View style={styles.saveFormActions}>
                  <TouchableOpacity style={styles.saveButton} onPress={handleSavePreset}>
                    <Text style={styles.saveButtonText}>Save Preset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => {
                      setShowSaveForm(false);
                      setPresetName('');
                    }}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          {/* Recent Filters */}
          {recentFilters.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Filters</Text>
                <TouchableOpacity style={styles.sectionAction} onPress={clearRecent}>
                  <Text style={styles.sectionActionText}>Clear</Text>
                </TouchableOpacity>
              </View>

              {recentFilters.map((filter, index) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.presetItem,
                    index === recentFilters.length - 1 && styles.lastPresetItem
                  ]}
                  onPress={() => {
                    onLoadPreset(filter);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>{filter.name}</Text>
                    <Text style={styles.presetDescription}>
                      {formatPresetDescription(filter)}
                    </Text>
                    {filter.lastUsed && (
                      <Text style={styles.presetMeta}>
                        Used {filter.lastUsed.toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                  
                  <Ionicons name="time-outline" size={16} color={theme.colors.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Saved Presets */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Saved Presets</Text>
            </View>

            {presets.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No saved presets yet.{'\n'}Save your current filter to create one!
                </Text>
              </View>
            ) : (
              presets.map((preset, index) => (
                <TouchableOpacity
                  key={preset.id}
                  style={[
                    styles.presetItem,
                    index === presets.length - 1 && styles.lastPresetItem
                  ]}
                  onPress={() => {
                    onLoadPreset(preset);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.presetContent}>
                    <Text style={styles.presetName}>{preset.name}</Text>
                    <Text style={styles.presetDescription}>
                      {formatPresetDescription(preset)}
                    </Text>
                    <Text style={styles.presetMeta}>
                      Created {preset.createdAt.toLocaleDateString()}
                      {preset.lastUsed && ` • Last used ${preset.lastUsed.toLocaleDateString()}`}
                    </Text>
                  </View>
                  
                  <View style={styles.presetActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleRenamePreset(preset)}
                    >
                      <Ionicons name="create-outline" size={16} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDeletePreset(preset)}
                    >
                      <Ionicons name="trash-outline" size={16} color={theme.colors.background} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}