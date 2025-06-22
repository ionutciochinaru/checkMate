import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FilterPreset, FilterType } from './useTaskFilter';

const PRESETS_STORAGE_KEY = 'filter_presets';
const RECENT_FILTERS_STORAGE_KEY = 'recent_filters';

interface FilterPresetsState {
  presets: FilterPreset[];
  recentFilters: FilterPreset[];
  isLoading: boolean;
}

export function useFilterPresets() {
  const [state, setState] = useState<FilterPresetsState>({
    presets: [],
    recentFilters: [],
    isLoading: true,
  });

  // Load presets and recent filters from storage
  const loadPresets = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      const [presetsData, recentData] = await Promise.all([
        AsyncStorage.getItem(PRESETS_STORAGE_KEY),
        AsyncStorage.getItem(RECENT_FILTERS_STORAGE_KEY),
      ]);

      const presets: FilterPreset[] = presetsData ? JSON.parse(presetsData).map((preset: any) => ({
        ...preset,
        createdAt: new Date(preset.createdAt),
        lastUsed: preset.lastUsed ? new Date(preset.lastUsed) : undefined,
      })) : [];

      const recentFilters: FilterPreset[] = recentData ? JSON.parse(recentData).map((filter: any) => ({
        ...filter,
        createdAt: new Date(filter.createdAt),
        lastUsed: filter.lastUsed ? new Date(filter.lastUsed) : undefined,
      })) : [];

      setState({
        presets: presets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        recentFilters: recentFilters.sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0)),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load filter presets:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Save presets to storage
  const savePresetsToStorage = useCallback(async (presets: FilterPreset[]) => {
    try {
      await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets));
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  }, []);

  // Save recent filters to storage
  const saveRecentToStorage = useCallback(async (recent: FilterPreset[]) => {
    try {
      await AsyncStorage.setItem(RECENT_FILTERS_STORAGE_KEY, JSON.stringify(recent));
    } catch (error) {
      console.error('Failed to save recent filters:', error);
    }
  }, []);

  // Save a new preset
  const savePreset = useCallback(async (
    name: string,
    primaryFilter: FilterType,
    additionalFilters: FilterType[],
    filterLogic: 'AND' | 'OR',
    searchText: string
  ): Promise<FilterPreset> => {
    const newPreset: FilterPreset = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      primaryFilter,
      additionalFilters,
      filterLogic,
      searchText,
      createdAt: new Date(),
    };

    const updatedPresets = [newPreset, ...state.presets];
    setState(prev => ({ ...prev, presets: updatedPresets }));
    await savePresetsToStorage(updatedPresets);
    
    return newPreset;
  }, [state.presets, savePresetsToStorage]);

  // Update an existing preset
  const updatePreset = useCallback(async (id: string, updates: Partial<FilterPreset>) => {
    const updatedPresets = state.presets.map(preset => 
      preset.id === id ? { ...preset, ...updates } : preset
    );
    
    setState(prev => ({ ...prev, presets: updatedPresets }));
    await savePresetsToStorage(updatedPresets);
  }, [state.presets, savePresetsToStorage]);

  // Delete a preset
  const deletePreset = useCallback(async (id: string) => {
    const updatedPresets = state.presets.filter(preset => preset.id !== id);
    setState(prev => ({ ...prev, presets: updatedPresets }));
    await savePresetsToStorage(updatedPresets);
  }, [state.presets, savePresetsToStorage]);

  // Add to recent filters (automatically when filters are applied)
  const addToRecent = useCallback(async (
    primaryFilter: FilterType,
    additionalFilters: FilterType[],
    filterLogic: 'AND' | 'OR',
    searchText: string
  ) => {
    // Skip if it's the default "All" filter with no additional criteria
    if (primaryFilter === 'All' && additionalFilters.length === 0 && !searchText.trim()) {
      return;
    }

    const recentFilter: FilterPreset = {
      id: 'recent_' + Date.now().toString(),
      name: `${primaryFilter}${additionalFilters.length ? ` ${filterLogic} ${additionalFilters.join(', ')}` : ''}${searchText ? ` "${searchText}"` : ''}`,
      primaryFilter,
      additionalFilters,
      filterLogic,
      searchText,
      createdAt: new Date(),
      lastUsed: new Date(),
    };

    // Remove duplicates and limit to 10 recent filters
    const filteredRecent = state.recentFilters.filter(recent => 
      !(recent.primaryFilter === primaryFilter && 
        JSON.stringify(recent.additionalFilters) === JSON.stringify(additionalFilters) &&
        recent.filterLogic === filterLogic &&
        recent.searchText === searchText)
    );

    const updatedRecent = [recentFilter, ...filteredRecent].slice(0, 10);
    setState(prev => ({ ...prev, recentFilters: updatedRecent }));
    await saveRecentToStorage(updatedRecent);
  }, [state.recentFilters, saveRecentToStorage]);

  // Load preset (mark as recently used)
  const loadPreset = useCallback((preset: FilterPreset) => {
    // Update last used time for saved presets
    if (!preset.id.startsWith('recent_')) {
      updatePreset(preset.id, { lastUsed: new Date() });
    }
    
    return {
      primaryFilter: preset.primaryFilter,
      additionalFilters: preset.additionalFilters,
      filterLogic: preset.filterLogic,
      searchText: preset.searchText,
    };
  }, [updatePreset]);

  // Clear recent filters
  const clearRecent = useCallback(async () => {
    setState(prev => ({ ...prev, recentFilters: [] }));
    await AsyncStorage.removeItem(RECENT_FILTERS_STORAGE_KEY);
  }, []);

  // Load presets on mount
  useEffect(() => {
    loadPresets();
  }, [loadPresets]);

  return {
    presets: state.presets,
    recentFilters: state.recentFilters,
    isLoading: state.isLoading,
    savePreset,
    updatePreset,
    deletePreset,
    loadPreset,
    addToRecent,
    clearRecent,
    refreshPresets: loadPresets,
  };
}