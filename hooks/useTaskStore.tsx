import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
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
  scheduleNotification: (task: Task) => Promise<void>;
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
    
    // Schedule notification for the new task
    get().scheduleNotification(newTask);
  },

  updateTask: (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
    get().saveData();
    
    // If reminder time was updated, reschedule notification
    if (updates.reminderTime) {
      const updatedTask = get().tasks.find(task => task.id === id);
      if (updatedTask) {
        get().scheduleNotification(updatedTask);
      }
    }
  },

  toggleComplete: (id) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    }));
    get().saveData();
    
    // Cancel notification when task is completed
    const task = get().tasks.find(t => t.id === id);
    if (task?.isCompleted) {
      Notifications.cancelScheduledNotificationAsync(id);
    } else {
      // Reschedule if uncompleted
      get().scheduleNotification(task!);
    }
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
    
    // Reschedule notification with new delay time
    const delayedTask = get().tasks.find(task => task.id === id);
    if (delayedTask) {
      get().scheduleNotification(delayedTask);
    }
  },

  deleteTask: (id) => {
    // Cancel notification before deleting task
    Notifications.cancelScheduledNotificationAsync(id);
    
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
  },

  scheduleNotification: async (task: Task) => {
    if (task.isCompleted) {
      // Don't schedule notifications for completed tasks
      return;
    }

    try {
      // Cancel existing notification first
      await Notifications.cancelScheduledNotificationAsync(task.id);

      const { settings } = get();
      const { workingHoursEnabled, workingHoursStart, workingHoursEnd } = settings;
      
      let reminderTime = new Date(task.reminderTime);
      
      // Check working hours if enabled and task doesn't ignore them
      if (workingHoursEnabled && !task.ignoreWorkingHours) {
        reminderTime = adjustForWorkingHours(reminderTime, workingHoursStart, workingHoursEnd);
      }

      // Create notification title with task name
      const title = task.title.length > 30 ? `${task.title.substring(0, 27)}...` : task.title;
      
      // Create notification body with description and delay info
      let body = '';
      
      if (task.description) {
        // Add part of description with ellipsis if too long
        const desc = task.description.length > 60 ? `${task.description.substring(0, 57)}...` : task.description;
        body += desc;
      }
      
      // Add delay information if task has been delayed
      if (task.delayCount > 0) {
        const delayInfo = task.delayCount === 1 ? ' (Delayed once)' : ` (Delayed ${task.delayCount}x)`;
        body += delayInfo;
      }
      
      // Add original vs new time info if delayed
      if (task.originalReminderTime && task.delayCount > 0) {
        const originalTime = new Date(task.originalReminderTime).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
        const newTime = reminderTime.toLocaleTimeString('en-US', {
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false
        });
        body += ` | ${originalTime} → ${newTime}`;
      }
      
      // Fallback body if empty
      if (!body.trim()) {
        body = 'Task reminder - tap for details';
      }

      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content: {
          title,
          body,
          categoryIdentifier: 'task_reminder',
          data: { taskId: task.id },
          sound: 'default'
        },
        trigger: {
          type: 'date',
          date: reminderTime
        } as any
      });
      
      console.log(`Scheduled notification for task "${title}" at ${reminderTime}`);
    } catch (error) {
      console.error('Failed to schedule notification:', error);
    }
  }
}));

// Helper function for working hours adjustment
const adjustForWorkingHours = (date: Date, startTime: string, endTime: string): Date => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  const hour = date.getHours();
  const minute = date.getMinutes();
  
  const currentTime = hour * 60 + minute;
  const workStart = startHour * 60 + startMinute;
  const workEnd = endHour * 60 + endMinute;
  
  if (currentTime < workStart) {
    // Before work hours - move to start of work
    date.setHours(startHour, startMinute, 0, 0);
  } else if (currentTime > workEnd) {
    // After work hours - move to next day start
    date.setDate(date.getDate() + 1);
    date.setHours(startHour, startMinute, 0, 0);
  }
  
  return date;
};