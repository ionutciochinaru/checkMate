import { create } from 'zustand';
import { AppSettings } from '../types/task';
import { useMainStore } from './mainStore';

interface SettingsStore {
  settings: AppSettings;
  isLoaded: boolean;
  isLoading: boolean;
  
  loadSettingsForPage: () => Promise<void>;
  saveAndExit: () => Promise<void>;
  
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
      const mainStore = useMainStore.getState();
      if (!mainStore.isInitialized) {
        await mainStore.initialize();
      }
      
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
      
      if (key === 'workingHoursEnabled' && !value) {
        newSettings.twentyFourHourMode = true;
      }
      
      if (key === 'twentyFourHourMode' && value) {
        newSettings.workingHoursEnabled = false;
      }
      
      set({ settings: newSettings });
      
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
      
      set({ settings: newSettings });
      
      const mainStore = useMainStore.getState();
      await mainStore.updateSettings(updates);
    } catch (error) {
      
      const mainStore = useMainStore.getState();
      const revertedSettings = mainStore.getSettings();
      set({ settings: revertedSettings });
      
      throw error;
    }
  },

  saveAndExit: async () => {
    try {
      const { settings } = get();
      
      const mainStore = useMainStore.getState();
      await mainStore.updateSettings(settings);
    } catch (error) {
    }
  }
}));