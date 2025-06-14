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
    console.log('🔄 Settings Store: Loading settings for page...');
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
      
      console.log('✅ Settings Store: Settings loaded from main store');
    } catch (error) {
      console.error('❌ Settings Store: Failed to load settings:', error);
      set({ 
        isLoaded: true,
        isLoading: false 
      });
    }
  },

  updateSetting: async (key, value) => {
    console.log(`🔧 Settings Store: Updating ${key} to ${value}`);
    
    try {
      const currentSettings = get().settings;
      let newSettings = { ...currentSettings, [key]: value };
      
      // Apply mutual exclusivity logic
      if (key === 'workingHoursEnabled' && !value) {
        newSettings.twentyFourHourMode = true;
        console.log('🔄 Settings Store: Auto-enabled 24H mode (work hours disabled)');
      }
      
      if (key === 'twentyFourHourMode' && value) {
        newSettings.workingHoursEnabled = false;
        console.log('🔄 Settings Store: Auto-disabled work hours (24H mode enabled)');
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
      
      console.log(`✅ Settings Store: ${key} saved successfully`);
    } catch (error) {
      console.error(`❌ Settings Store: Failed to save ${key}:`, error);
      
      // Revert local changes on error
      const mainStore = useMainStore.getState();
      const revertedSettings = mainStore.getSettings();
      set({ settings: revertedSettings });
      
      throw error;
    }
  },

  updateMultipleSettings: async (updates) => {
    console.log('🔧 Settings Store: Updating multiple settings:', updates);
    
    try {
      const currentSettings = get().settings;
      const newSettings = { ...currentSettings, ...updates };
      
      // Update local store immediately
      set({ settings: newSettings });
      
      // Update main store
      const mainStore = useMainStore.getState();
      await mainStore.updateSettings(updates);
      
      console.log('✅ Settings Store: Multiple settings saved successfully');
    } catch (error) {
      console.error('❌ Settings Store: Failed to save multiple settings:', error);
      
      // Revert local changes on error
      const mainStore = useMainStore.getState();
      const revertedSettings = mainStore.getSettings();
      set({ settings: revertedSettings });
      
      throw error;
    }
  },

  saveAndExit: async () => {
    console.log('💾 Settings Store: Saving settings on exit...');
    
    try {
      const { settings } = get();
      
      // Sync all settings to main store
      const mainStore = useMainStore.getState();
      await mainStore.updateSettings(settings);
      
      console.log('✅ Settings Store: All settings synced on exit');
    } catch (error) {
      console.error('❌ Settings Store: Failed to save on exit:', error);
    }
  }
}));