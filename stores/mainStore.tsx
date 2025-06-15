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
  reducedMotion: false,
  dateFormat: 'DD-MM-YYYY',
  dateUseMonthNames: false,
  dateSeparator: '-',
  timeFormat: '24H'
};

// Global database instance
let db: SQLite.SQLiteDatabase | null = null;

// Initialize database with proper error handling
export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;
  
  try {
    db = await SQLite.openDatabaseAsync('taskloopd.db');
    
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
        lastCompletedAt TEXT,
        enableSequentialNotification INTEGER DEFAULT 0,
        sequentialInterval INTEGER DEFAULT 300,
        followUpNotificationId TEXT
      );

      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );
    `);

    // Migration for existing databases - add new columns if they don't exist
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN enableSequentialNotification INTEGER DEFAULT 0;
      `);
    } catch (error) {
      // Column already exists, ignore
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN sequentialInterval INTEGER DEFAULT 300;
      `);
    } catch (error) {
      // Column already exists, ignore
    }
    
    try {
      await db.execAsync(`
        ALTER TABLE tasks ADD COLUMN followUpNotificationId TEXT;
      `);
    } catch (error) {
      // Column already exists, ignore
    }
    
    return db;
  } catch (error) {
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
  } catch (error) {
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
        // Skip invalid settings
      }
    });
    
    return settings;
  } catch (error) {
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
    
    set({ isLoading: true });
    
    try {
      await initializeDatabase();
      const loadedSettings = await loadSettings();
      
      set({ 
        settings: loadedSettings,
        isInitialized: true,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        settings: defaultSettings,
        isInitialized: true,
        isLoading: false 
      });
    }
  },

  updateSetting: async (key, value) => {
    try {
      await saveSetting(key, value);
      
      set(state => ({
        settings: { ...state.settings, [key]: value }
      }));
    } catch (error) {
      throw error;
    }
  },

  updateSettings: async (updates) => {
    try {
      // Save all settings to database
      await Promise.all(
        Object.entries(updates).map(([key, value]) => saveSetting(key, value))
      );
      
      // Update state
      set(state => ({
        settings: { ...state.settings, ...updates }
      }));
    } catch (error) {
      throw error;
    }
  },

  getSettings: () => {
    return get().settings;
  }
}));