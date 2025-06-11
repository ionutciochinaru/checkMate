import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  soundEnabled: boolean;
}

const STORAGE_KEYS = {
  TASKS: 'adhd_assistant_tasks',
  PREFERENCES: 'adhd_assistant_preferences',
  USER_DATA: 'adhd_assistant_user_data',
} as const;

export class StorageService {
  // Task Management
  static async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
      return tasksJson ? JSON.parse(tasksJson) : [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  }

  static async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
      throw error;
    }
  }

  static async addTask(task: Omit<Task, 'id'>): Promise<Task> {
    try {
      const existingTasks = await this.getTasks();
      const newTask: Task = {
        ...task,
        id: Date.now().toString(),
      };
      const updatedTasks = [...existingTasks, newTask];
      await this.saveTasks(updatedTasks);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  }

  static async updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const updatedTasks = tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      );
      await this.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  static async deleteTask(taskId: string): Promise<void> {
    try {
      const tasks = await this.getTasks();
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      await this.saveTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // User Preferences Management
  static async getPreferences(): Promise<UserPreferences> {
    try {
      const preferencesJson = await AsyncStorage.getItem(STORAGE_KEYS.PREFERENCES);
      const defaultPreferences: UserPreferences = {
        theme: 'light',
        notifications: true,
        soundEnabled: true,
      };
      return preferencesJson ? { ...defaultPreferences, ...JSON.parse(preferencesJson) } : defaultPreferences;
    } catch (error) {
      console.error('Error loading preferences:', error);
      return {
        theme: 'light',
        notifications: true,
        soundEnabled: true,
      };
    }
  }

  static async savePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    try {
      const currentPreferences = await this.getPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPreferences));
    } catch (error) {
      console.error('Error saving preferences:', error);
      throw error;
    }
  }

  // Secure Storage for sensitive data (if needed in future)
  static async setSecureItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error('Error saving secure item:', error);
      throw error;
    }
  }

  static async getSecureItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error('Error loading secure item:', error);
      return null;
    }
  }

  static async deleteSecureItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error('Error deleting secure item:', error);
      throw error;
    }
  }

  // Utility methods
  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
    } catch (error) {
      console.error('Error clearing all data:', error);
      throw error;
    }
  }

  static async exportData(): Promise<string> {
    try {
      const tasks = await this.getTasks();
      const preferences = await this.getPreferences();
      
      const exportData = {
        tasks,
        preferences,
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  static async importData(dataJson: string): Promise<void> {
    try {
      const data = JSON.parse(dataJson);
      
      if (data.tasks) {
        await this.saveTasks(data.tasks);
      }
      
      if (data.preferences) {
        await this.savePreferences(data.preferences);
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}