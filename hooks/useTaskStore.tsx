import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, AppSettings } from '../types/task';

// Parse delay string formats like "30m", "1h", "1h30m", "90s", etc.
const parseDelayString = (delayStr: string): number => {
  const str = delayStr.toLowerCase().trim();
  let totalMs = 0;
  
  // Match patterns like 1h, 30m, 45s
  const patterns = [
    { regex: /(\d+)d/g, multiplier: 24 * 60 * 60 * 1000 }, // days
    { regex: /(\d+)h/g, multiplier: 60 * 60 * 1000 },      // hours
    { regex: /(\d+)m/g, multiplier: 60 * 1000 },           // minutes
    { regex: /(\d+)s/g, multiplier: 1000 }                 // seconds
  ];
  
  patterns.forEach(({ regex, multiplier }) => {
    let match;
    while ((match = regex.exec(str)) !== null) {
      totalMs += parseInt(match[1]) * multiplier;
    }
  });
  
  // Default to 30 minutes if nothing parsed
  return totalMs || (30 * 60 * 1000);
};

interface TaskStore {
  tasks: Task[];
  settings: AppSettings;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'delayCount' | 'isCompleted'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  toggleComplete: (id: string) => void;
  delayTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  settings: {
    workingHoursEnabled: true,
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00",
    defaultDelay: "30m",
    fontScale: 1.0,
    highContrast: false,
    reducedMotion: false
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      delayCount: 0,
      isCompleted: false
    };
    
    set(state => ({ tasks: [...state.tasks, newTask] }));
    get().saveData();
  },

  updateTask: (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
    get().saveData();
  },

  toggleComplete: (id) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    }));
    get().saveData();
  },

  delayTask: (id) => {
    const { settings } = get();
    const delayMs = parseDelayString(settings.defaultDelay || '30m');
    
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              delayCount: task.delayCount + 1,
              // Save original time on first delay
              originalReminderTime: task.delayCount === 0 ? task.reminderTime : task.originalReminderTime,
              reminderTime: new Date(task.reminderTime.getTime() + delayMs)
            } 
          : task
      )
    }));
    get().saveData();
  },

  deleteTask: (id) => {
    set(state => ({
      tasks: state.tasks.filter(task => task.id !== id)
    }));
    get().saveData();
  },

  updateSettings: (newSettings) => {
    set(state => ({ 
      settings: { ...state.settings, ...newSettings } 
    }));
    get().saveData();
  },

  loadData: async () => {
    try {
      const [tasksData, settingsData] = await Promise.all([
        AsyncStorage.getItem('tasks'),
        AsyncStorage.getItem('settings')
      ]);
      
      if (tasksData) {
        const tasks = JSON.parse(tasksData).map((task: any) => ({
          ...task,
          reminderTime: new Date(task.reminderTime),
          createdAt: new Date(task.createdAt)
        }));
        set({ tasks });
      }
      
      if (settingsData) {
        set({ settings: JSON.parse(settingsData) });
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    }
  },

  saveData: async () => {
    try {
      const { tasks, settings } = get();
      await Promise.all([
        AsyncStorage.setItem('tasks', JSON.stringify(tasks)),
        AsyncStorage.setItem('settings', JSON.stringify(settings))
      ]);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }
}));