import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useTaskStore } from './useTaskStore';
import { Task } from '../types/task';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const useNotifications = () => {
  const { tasks, toggleComplete, delayTask, settings } = useTaskStore();

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      alert('Notification permissions required for task reminders!');
      return;
    }

    // Setup notification categories
    await Notifications.setNotificationCategoryAsync('task_reminder', [
      {
        identifier: 'yes_action',
        buttonTitle: 'Yes ✅',
        options: {
          opensAppToForeground: false,
          isDestructive: false,
        },
      },
      {
        identifier: 'no_action',
        buttonTitle: 'No ⏰',
        options: {
          opensAppToForeground: false,
          isDestructive: true,
        },
      },
    ]);

    // Handle notification responses
    const subscription = Notifications.addNotificationResponseReceivedListener(
      response => {
        const { identifier } = response.notification.request;
        const { actionIdentifier } = response;
        
        if (actionIdentifier === 'yes_action') {
          toggleComplete(identifier);
        } else if (actionIdentifier === 'no_action') {
          delayTask(identifier);
        }
      }
    );

    return subscription.remove;
  };

  const scheduleTaskReminder = async (task: Task) => {
    const { workingHoursEnabled, workingHoursStart, workingHoursEnd } = settings;
    
    let reminderTime = new Date(task.reminderTime);
    
    // Check working hours if enabled and task doesn't ignore them
    if (workingHoursEnabled && !task.ignoreWorkingHours) {
      reminderTime = adjustForWorkingHours(reminderTime, workingHoursStart, workingHoursEnd);
    }

    // Custom message based on delay count
    const delayMessages = [
      "Did you accomplish this?",
      "Still working on this task?",
      "Let's try to finish this one!",
      "This task needs attention 🎯",
      "Don't give up on this task! 💪"
    ];
    
    const message = delayMessages[Math.min(task.delayCount, delayMessages.length - 1)];

    await Notifications.scheduleNotificationAsync({
      identifier: task.id,
      content: {
        title: task.title,
        body: message,
        categoryIdentifier: 'task_reminder',
        data: { taskId: task.id }
      },
      trigger: reminderTime as any
    });
  };

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

  return { scheduleTaskReminder };
};