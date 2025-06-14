import { create } from 'zustand';
import * as SQLite from 'expo-sqlite';
import { AppSettings } from '../types/task';

// Default settings with proper fallbacks
export const defaultSettings: AppSettings = {
  workingHoursEnabled: true,
  workingHoursStart: "09:00",
  workingHoursEnd: "17:00",
  defaultDelay: "30m",
  twentyFourHourMode: false,
  fontScale: 1.0,
  highContrast: false,
  reducedMotion: false
};

// Global database instance
let db: SQLite.SQLiteDatabase | null = null;

// Initialize database with proper error handling
export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  
  console.log('🗄️ Initializing SQLite database...');
  
  try {
    db = await SQLite.openDatabaseAsync('checkmate.db');
    
    // Enable WAL mode for better performance
    await db.execAsync('PRAGMA journal_mode = WAL;');
    
    // Create tables
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        isRecurring INTEGER DEFAULT 0,
        recurringInterval INTEGER DEFAULT 24,
        reminderTime TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        delayCount INTEGER DEFAULT 0,
        isCompleted INTEGER DEFAULT 0,
        originalReminderTime TEXT,
        ignoreWorkingHours INTEGER DEFAULT 0,
        completionCount INTEGER DEFAULT 0,
        lastCompletedAt TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);
    
    console.log('✅ Database initialized successfully');
    return db;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    throw error;
  }
};

// Settings operations with error handling
export const saveSetting = async (key: string, value: any): Promise<void> => {
  try {
    const database = await initializeDatabase();
    await database.runAsync(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      key, JSON.stringify(value)
    );
    console.log(`✅ Setting ${key} saved successfully`);
  } catch (error) {
    console.error(`❌ Failed to save setting ${key}:`, error);
    throw error;
  }
};

export const loadSettings = async (): Promise<AppSettings> => {
  try {
    const database = await initializeDatabase();
    const rows = await database.getAllAsync('SELECT key, value FROM settings');
    
    let settings = { ...defaultSettings };
    
    rows.forEach((row: any) => {
      try {
        const key = row.key as keyof AppSettings;
        if (key in defaultSettings) {
          (settings as any)[key] = JSON.parse(row.value);
        }
      } catch (error) {
        console.warn(`Failed to parse setting ${row.key}:`, error);
      }
    });
    
    console.log('✅ Settings loaded successfully');
    return settings;
  } catch (error) {
    console.error('❌ Failed to load settings:', error);
    return defaultSettings;
  }
};

interface MainStore {
  settings: AppSettings;
  isInitialized: boolean;
  isLoading: boolean;
  
  // Initialization
  initialize: () => Promise<void>;
  
  // Settings management
  updateSetting: (key: keyof AppSettings, value: any) => Promise<void>;
  updateSettings: (updates: Partial<AppSettings>) => Promise<void>;
  getSettings: () => AppSettings;
}

export const useMainStore = create<MainStore>((set, get) => ({
  settings: defaultSettings,
  isInitialized: false,
  isLoading: false,

  initialize: async () => {
    const { isInitialized, isLoading } = get();
    
    if (isInitialized || isLoading) return;
    
    console.log('🚀 Initializing main store...');
    set({ isLoading: true });
    
    try {
      await initializeDatabase();
      const loadedSettings = await loadSettings();
      
      set({ 
        settings: loadedSettings,
        isInitialized: true,
        isLoading: false 
      });
      
      console.log('✅ Main store initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize main store:', error);
      set({ 
        settings: defaultSettings,
        isInitialized: true,
        isLoading: false 
      });
    }
  },

  updateSetting: async (key, value) => {
    console.log(`🔧 Main Store: Updating ${key} to ${value}`);
    
    try {
      await saveSetting(key, value);
      
      set(state => ({
        settings: { ...state.settings, [key]: value }
      }));
      
      console.log(`✅ Main Store: ${key} updated successfully`);
    } catch (error) {
      console.error(`❌ Main Store: Failed to update ${key}:`, error);
      throw error;
    }
  },

  updateSettings: async (updates) => {
    console.log('🔧 Main Store: Updating multiple settings:', updates);
    
    try {
      // Save all settings to database
      await Promise.all(
        Object.entries(updates).map(([key, value]) => saveSetting(key, value))
      );
      
      // Update state
      set(state => ({
        settings: { ...state.settings, ...updates }
      }));
      
      console.log('✅ Main Store: Multiple settings updated successfully');
    } catch (error) {
      console.error('❌ Main Store: Failed to update settings:', error);
      throw error;
    }
  },

  getSettings: () => {
    return get().settings;
  }
}));