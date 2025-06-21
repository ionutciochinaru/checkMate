import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import { Task } from '../types/task';
import { initializeDatabase , useMainStore } from './mainStore';

// Re-export useMainStore for convenience
export { useMainStore };


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

// Task database operations
export const loadTasks = async (): Promise<Task[]> => {
  try {
    const database = await initializeDatabase();
    const rows = await database.getAllAsync('SELECT * FROM tasks ORDER BY reminderTime ASC');
    
    return rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      isRecurring: Boolean(row.isRecurring),
      recurringInterval: row.recurringInterval || 24,
      reminderTime: new Date(row.reminderTime),
      createdAt: new Date(row.createdAt),
      delayCount: row.delayCount,
      isCompleted: Boolean(row.isCompleted),
      originalReminderTime: row.originalReminderTime ? new Date(row.originalReminderTime) : undefined,
      ignoreWorkingHours: Boolean(row.ignoreWorkingHours),
      completionCount: row.completionCount || 0,
      lastCompletedAt: row.lastCompletedAt ? new Date(row.lastCompletedAt) : undefined,
      enableSequentialNotification: Boolean(row.enableSequentialNotification),
      sequentialInterval: row.sequentialInterval || 300,
      followUpNotificationId: row.followUpNotificationId
    }));
  } catch (error) {
    return [];
  }
};

export const saveTask = async (task: Task): Promise<void> => {
  try {
    const database = await initializeDatabase();
    
    if (!database) {
      throw new Error('Database not initialized');
    }
    
    await database.runAsync(`
      INSERT OR REPLACE INTO tasks (
        id, title, description, isRecurring, recurringInterval, reminderTime, 
        createdAt, delayCount, isCompleted, originalReminderTime, ignoreWorkingHours,
        completionCount, lastCompletedAt, enableSequentialNotification, sequentialInterval, followUpNotificationId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      task.id,
      task.title,
      task.description || null,
      task.isRecurring ? 1 : 0,
      task.recurringInterval || 24,
      task.reminderTime.toISOString(),
      task.createdAt.toISOString(),
      task.delayCount,
      task.isCompleted ? 1 : 0,
      task.originalReminderTime?.toISOString() || null,
      task.ignoreWorkingHours ? 1 : 0,
      task.completionCount || 0,
      task.lastCompletedAt?.toISOString() || null,
      task.enableSequentialNotification ? 1 : 0,
      task.sequentialInterval || 300,
      task.followUpNotificationId || null
    );
  } catch (error) {
    throw error;
  }
};

export const deleteTaskFromDb = async (id: string): Promise<void> => {
  try {
    const database = await initializeDatabase();
    await database.runAsync('DELETE FROM tasks WHERE id = ?', id);
  } catch (error) {
    throw error;
  }
};

export const deleteAllTasksFromDb = async (): Promise<void> => {
  try {
    const database = await initializeDatabase();
    await database.runAsync('DELETE FROM tasks');
  } catch (error) {
    throw error;
  }
};

interface TaskStore {
  tasks: Task[];
  isLoaded: boolean;
  isLoading: boolean;
  
  // Lifecycle
  loadTasks: () => Promise<void>;
  
  // Task operations
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'delayCount' | 'isCompleted'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  delayTask: (id: string, delayAmount?: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  deleteAllTasks: () => Promise<void>;
  
  // Notification scheduling
  scheduleNotification: (task: Task, settings?: any) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  isLoaded: false,
  isLoading: false,

  loadTasks: async () => {
    const { isLoading } = get();
    if (isLoading) return;
    
    set({ isLoading: true });
    
    try {
      const loadedTasks = await loadTasks();
      set({ 
        tasks: loadedTasks,
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

  addTask: async (taskData) => {
    const { isLoaded } = get();
    if (!isLoaded) {
      await get().loadTasks();
    }

    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      delayCount: 0,
      isCompleted: false,
      completionCount: 0,
      lastCompletedAt: undefined
    };
    
    try {
      await saveTask(newTask);
      set(state => ({ tasks: [...state.tasks, newTask] }));
      
      // Schedule notification for the new task
      await get().scheduleNotification(newTask);
    } catch (error) {
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    const currentTasks = get().tasks;
    const taskIndex = currentTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      return;
    }
    
    try {
      const updatedTask = { ...currentTasks[taskIndex], ...updates };
      await saveTask(updatedTask);
      
      set(state => ({
        tasks: state.tasks.map(task => task.id === id ? updatedTask : task)
      }));

      // If reminder time was updated, reschedule notification
      if (updates.reminderTime) {
        await get().scheduleNotification(updatedTask);
      }
    } catch (error) {
      throw error;
    }
  },

  toggleComplete: async (id) => {
    const currentTasks = get().tasks;
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) {
      return;
    }
    
    try {
      let updatedTask: Task;
      
      if (task.isRecurring) {
        // Loop mode: increment counter and reschedule, never mark as completed
        const now = new Date();
        const nextReminderTime = new Date(now.getTime() + (task.recurringInterval || 24) * 60 * 60 * 1000);
        
        updatedTask = { 
          ...task, 
          completionCount: (task.completionCount || 0) + 1,
          lastCompletedAt: now,
          reminderTime: nextReminderTime,
          delayCount: 0, // Reset delay count on completion
          originalReminderTime: undefined // Clear original time since this is a fresh schedule
        };
        
      } else {
        // Regular task: toggle completion status
        updatedTask = { ...task, isCompleted: !task.isCompleted };
      }
      
      await saveTask(updatedTask);
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t)
      }));

      // Handle notifications
      if (updatedTask.isCompleted) {
        // Only cancel notifications for regular completed tasks
        await Notifications.cancelScheduledNotificationAsync(id);
        // Also cancel follow-up notification if it exists
        try {
          await Notifications.cancelScheduledNotificationAsync(`${id}_followup`);
        } catch (error) {
          // Silently handle cancellation errors
        }
        await Notifications.dismissAllNotificationsAsync();
      } else {
        // Schedule notification for active tasks (including rescheduled loop tasks)
        await get().scheduleNotification(updatedTask);
      }
      
    } catch (error) {
      throw error;
    }
  },

  delayTask: async (id, delayAmount?: string) => {
    // Get default delay from settings if not provided
    const defaultDelay = delayAmount || useMainStore.getState().getSettings().defaultDelay || '30m';
    const delayMs = parseDelayString(defaultDelay);
    const currentTasks = get().tasks;
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) {
      return;
    }

    try {
      // Cancel current notification first
      await Notifications.cancelScheduledNotificationAsync(id);
      // Also cancel follow-up notification if it exists
      try {
        await Notifications.cancelScheduledNotificationAsync(`${id}_followup`);
      } catch (error) {
        // Silently handle cancellation errors
      }

      const updatedTask = {
        ...task,
        delayCount: task.delayCount + 1,
        // Save original time on first delay
        originalReminderTime: task.delayCount === 0 ? task.reminderTime : task.originalReminderTime,
        reminderTime: new Date(task.reminderTime.getTime() + delayMs)
      };
      
      await saveTask(updatedTask);
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t)
      }));

      // Reschedule notification with new delay time
      await get().scheduleNotification(updatedTask);
    } catch (error) {
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      // Cancel notification before deleting task
      await Notifications.cancelScheduledNotificationAsync(id);
      // Also cancel follow-up notification if it exists
      try {
        await Notifications.cancelScheduledNotificationAsync(`${id}_followup`);
      } catch (error) {
        // Silently handle cancellation errors
      }
      await deleteTaskFromDb(id);
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }));
    } catch (error) {
      throw error;
    }
  },

  deleteAllTasks: async () => {
    try {
      const currentTasks = get().tasks;
      
      // Cancel all notifications for all tasks
      for (const task of currentTasks) {
        try {
          await Notifications.cancelScheduledNotificationAsync(task.id);
          await Notifications.cancelScheduledNotificationAsync(`${task.id}_followup`);
        } catch (error) {
          // Silently handle cancellation errors
        }
      }
      
      // Delete all tasks from database
      await deleteAllTasksFromDb();
      
      // Clear tasks from state
      set({ tasks: [] });
    } catch (error) {
      throw error;
    }
  },

  scheduleNotification: async (task: Task, settings?: any) => {
    if (task.isCompleted) {
      return;
    }

    try {
      // Cancel existing notifications first
      await Notifications.cancelScheduledNotificationAsync(task.id);
      try {
        await Notifications.cancelScheduledNotificationAsync(`${task.id}_followup`);
      } catch (error) {
        // Silently handle cancellation errors
      }

      // Create notification content
      const title = task.title.length > 30 ? `${task.title.substring(0, 27)}...` : task.title;
      let body = '';
      
      if (task.description) {
        const desc = task.description.length > 60 ? `${task.description.substring(0, 57)}...` : task.description;
        body += desc;
      }
      
      if (task.delayCount > 0) {
        const delayInfo = task.delayCount === 1 ? ' (Delayed once)' : ` (Delayed ${task.delayCount}x)`;
        body += delayInfo;
      }
      
      if (!body.trim()) {
        body = 'Task reminder - tap for details';
      }

      // Schedule primary notification
      await Notifications.scheduleNotificationAsync({
        identifier: task.id,
        content: {
          title,
          body,
          categoryIdentifier: 'task_reminder',
          data: { 
            taskId: task.id,
            isSequential: task.enableSequentialNotification,
            isPrimary: true
          },
          sound: 'default'
        },
        trigger: {
          type: 'date',
          date: task.reminderTime
        } as any
      });

      // Schedule follow-up notification if enabled
      if (task.enableSequentialNotification && task.sequentialInterval) {
        const followUpTime = new Date(task.reminderTime.getTime() + (task.sequentialInterval * 1000));
        const followUpId = `${task.id}_followup`;
        
        await Notifications.scheduleNotificationAsync({
          identifier: followUpId,
          content: {
            title: `⚠️ ${title}`,
            body: `Follow-up reminder: ${body}`,
            categoryIdentifier: 'task_reminder',
            data: { 
              taskId: task.id,
              isSequential: true,
              isPrimary: false,
              primaryNotificationId: task.id
            },
            sound: 'default'
          },
          trigger: {
            type: 'date',
            date: followUpTime
          } as any
        });
      }
    } catch (error) {
      // Silently fail notification scheduling
    }
  }
}));