import { create } from 'zustand';
import { AppSettings } from '../types/task';
import { useMainStore } from './mainStore';

interface SettingsStore {
  settings: AppSettings;
  isLoaded: boolean;
  isLoading: boolean;
  
  // Page lifecycle methods
  loadSettingsForPage: () => Promise<void>;
  saveAndExit: () => Promise<void>;
  
  // Immediate update methods
  updateSetting: (key: keyof AppSettings, value: any) => Promise<void>;
  updateMultipleSettings: (updates: Partial<AppSettings>) => Promise<void>;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  settings: {} as AppSettings,
  isLoaded: false,
  isLoading: false,

  loadSettingsForPage: async () => {
    set({ isLoading: true });
    
    try {
      // Ensure main store is initialized
      const mainStore = useMainStore.getState();
      if (!mainStore.isInitialized) {
        await mainStore.initialize();
      }
      
      // Get current settings from main store
      const currentSettings = mainStore.getSettings();
      
      set({ 
        settings: currentSettings, 
        isLoaded: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoaded: true,
        isLoading: false 
      });
    }
  },

  updateSetting: async (key, value) => {
    try {
      const currentSettings = get().settings;
      let newSettings = { ...currentSettings, [key]: value };
      
      // Apply mutual exclusivity logic
      if (key === 'workingHoursEnabled' && !value) {
        newSettings.twentyFourHourMode = true;
      }
      
      if (key === 'twentyFourHourMode' && value) {
        newSettings.workingHoursEnabled = false;
      }
      
      // Update local store immediately for responsive UI
      set({ settings: newSettings });
      
      // Update main store
      const mainStore = useMainStore.getState();
      
      if (key === 'workingHoursEnabled' && !value) {
        await mainStore.updateSettings({
          workingHoursEnabled: false,
          twentyFourHourMode: true
        });
      } else if (key === 'twentyFourHourMode' && value) {
        await mainStore.updateSettings({
          twentyFourHourMode: true,
          workingHoursEnabled: false
        });
      } else {
        await mainStore.updateSetting(key, value);
      }
    } catch (error) {
      
      // Revert local changes on error
      const mainStore = useMainStore.getState();
      const revertedSettings = mainStore.getSettings();
      set({ settings: revertedSettings });
      
      throw error;
    }
  },

  updateMultipleSettings: async (updates) => {
    try {
      const currentSettings = get().settings;
      const newSettings = { ...currentSettings, ...updates };
      
      // Update local store immediately
      set({ settings: newSettings });
      
      // Update main store
      const mainStore = useMainStore.getState();
      await mainStore.updateSettings(updates);
    } catch (error) {
      
      // Revert local changes on error
      const mainStore = useMainStore.getState();
      const revertedSettings = mainStore.getSettings();
      set({ settings: revertedSettings });
      
      throw error;
    }
  },

  saveAndExit: async () => {
    try {
      const { settings } = get();
      
      // Sync all settings to main store
      const mainStore = useMainStore.getState();
      await mainStore.updateSettings(settings);
    } catch (error) {
      // Silently fail on exit
    }
  }
}));