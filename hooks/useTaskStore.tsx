import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task, AppSettings } from '../types/task';

interface TaskStore {
  tasks: Task[];
  settings: AppSettings;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'delayCount' | 'isCompleted'>) => void;
  toggleComplete: (id: string) => void;
  delayTask: (id: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  loadData: () => Promise<void>;
  saveData: () => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  settings: {
    workingHoursEnabled: true,
    workingHoursStart: "09:00",
    workingHoursEnd: "17:00"
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

  toggleComplete: (id) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    }));
    get().saveData();
  },

  delayTask: (id) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id 
          ? { 
              ...task, 
              delayCount: task.delayCount + 1,
              reminderTime: new Date(Date.now() + 60 * 60 * 1000) // +1 hour
            } 
          : task
      )
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