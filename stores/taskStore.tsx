import { create } from 'zustand';
import * as Notifications from 'expo-notifications';
import { Task } from '../types/task';
import { initializeDatabase } from './mainStore';
import { useMainStore } from './mainStore';

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
      lastCompletedAt: row.lastCompletedAt ? new Date(row.lastCompletedAt) : undefined
    }));
  } catch (error) {
    console.error('❌ Failed to load tasks:', error);
    return [];
  }
};

export const saveTask = async (task: Task): Promise<void> => {
  try {
    console.log(`💾 Attempting to save task: ${task.title}`);
    const database = await initializeDatabase();
    
    if (!database) {
      throw new Error('Database not initialized');
    }
    
    console.log(`💾 Database ready, executing INSERT for task: ${task.title}`);
    const result = await database.runAsync(`
      INSERT OR REPLACE INTO tasks (
        id, title, description, isRecurring, recurringInterval, reminderTime, 
        createdAt, delayCount, isCompleted, originalReminderTime, ignoreWorkingHours,
        completionCount, lastCompletedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      task.lastCompletedAt?.toISOString() || null
    );
    
    console.log(`✅ Task ${task.title} saved successfully, result:`, result);
  } catch (error) {
    console.error(`❌ Failed to save task ${task.title}:`, error);
    throw error;
  }
};

export const deleteTaskFromDb = async (id: string): Promise<void> => {
  try {
    const database = await initializeDatabase();
    await database.runAsync('DELETE FROM tasks WHERE id = ?', id);
    console.log(`✅ Task ${id} deleted successfully`);
  } catch (error) {
    console.error(`❌ Failed to delete task ${id}:`, error);
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
    
    console.log('📂 Loading tasks...');
    set({ isLoading: true });
    
    try {
      const loadedTasks = await loadTasks();
      set({ 
        tasks: loadedTasks,
        isLoaded: true,
        isLoading: false 
      });
      console.log(`✅ Loaded ${loadedTasks.length} tasks`);
    } catch (error) {
      console.error('❌ Failed to load tasks:', error);
      set({ 
        isLoaded: true,
        isLoading: false 
      });
    }
  },

  addTask: async (taskData) => {
    const { isLoaded } = get();
    if (!isLoaded) {
      console.warn('Task store not fully loaded, waiting...');
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
      console.log(`📝 Adding task "${newTask.title}"...`);
      await saveTask(newTask);
      set(state => ({ tasks: [...state.tasks, newTask] }));
      
      // Schedule notification for the new task
      await get().scheduleNotification(newTask);
      console.log(`✅ Task "${newTask.title}" added successfully`);
      return newTask;
    } catch (error) {
      console.error(`❌ Failed to add task "${newTask.title}":`, error);
      throw error;
    }
  },

  updateTask: async (id, updates) => {
    const currentTasks = get().tasks;
    const taskIndex = currentTasks.findIndex(task => task.id === id);
    
    if (taskIndex === -1) {
      console.warn(`Task ${id} not found for update`);
      return;
    }
    
    try {
      console.log(`📝 Updating task ${id}...`);
      const updatedTask = { ...currentTasks[taskIndex], ...updates };
      await saveTask(updatedTask);
      
      set(state => ({
        tasks: state.tasks.map(task => task.id === id ? updatedTask : task)
      }));

      // If reminder time was updated, reschedule notification
      if (updates.reminderTime) {
        await get().scheduleNotification(updatedTask);
      }
      
      console.log(`✅ Task ${id} updated successfully`);
    } catch (error) {
      console.error(`❌ Failed to update task ${id}:`, error);
      throw error;
    }
  },

  toggleComplete: async (id) => {
    const currentTasks = get().tasks;
    const task = currentTasks.find(t => t.id === id);
    
    if (!task) {
      console.warn(`Task ${id} not found for toggle`);
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
        
        console.log(`🔄 Loop task ${id} completed. Count: ${updatedTask.completionCount}, Next: ${nextReminderTime}`);
      } else {
        // Regular task: toggle completion status
        updatedTask = { ...task, isCompleted: !task.isCompleted };
        console.log(`✅ Regular task ${id} toggled to ${updatedTask.isCompleted ? 'completed' : 'active'}`);
      }
      
      await saveTask(updatedTask);
      
      set(state => ({
        tasks: state.tasks.map(t => t.id === id ? updatedTask : t)
      }));

      // Handle notifications
      if (updatedTask.isCompleted) {
        // Only cancel notifications for regular completed tasks
        await Notifications.cancelScheduledNotificationAsync(id);
        await Notifications.dismissAllNotificationsAsync();
      } else {
        // Schedule notification for active tasks (including rescheduled loop tasks)
        await get().scheduleNotification(updatedTask);
      }
      
    } catch (error) {
      console.error(`❌ Failed to toggle task ${id}:`, error);
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
      console.warn(`Task ${id} not found for delay`);
      return;
    }

    try {
      // Cancel current notification first
      await Notifications.cancelScheduledNotificationAsync(id);

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
      
      console.log(`✅ Task ${id} delayed by ${defaultDelay}`);
    } catch (error) {
      console.error(`❌ Failed to delay task ${id}:`, error);
      throw error;
    }
  },

  deleteTask: async (id) => {
    try {
      // Cancel notification before deleting task
      await Notifications.cancelScheduledNotificationAsync(id);
      await deleteTaskFromDb(id);
      
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id)
      }));
      
      console.log(`✅ Task ${id} deleted successfully`);
    } catch (error) {
      console.error(`❌ Failed to delete task ${id}:`, error);
      throw error;
    }
  },

  scheduleNotification: async (task: Task, settings?: any) => {
    if (task.isCompleted) {
      return;
    }

    try {
      // Cancel existing notification first
      await Notifications.cancelScheduledNotificationAsync(task.id);

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
          date: task.reminderTime
        } as any
      });
      
      console.log(`✅ Notification scheduled for task "${title}" at ${task.reminderTime}`);
    } catch (error) {
      console.error('❌ Failed to schedule notification:', error);
    }
  }
}));