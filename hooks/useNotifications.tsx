import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useTaskStore, useMainStore } from './useTaskStore';
import { useTheme } from './useTheme';
import { Task } from '../types/task';
import { Platform } from 'react-native';
import { showAlert } from '../components/CustomAlert';

// Set up notification handler with theme-aware styling
const setupNotificationHandler = (colors: any, isDark: boolean) => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => ({
      shouldShowAlert: true,
      shouldShowBanner: true, 
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      // Apply theme colors to notification (iOS only)
      ...(Platform.OS === 'ios' && {
        priority: Notifications.AndroidNotificationPriority.HIGH,
        sound: 'default',
        color: colors.accent,
        badge: false
      })
    }),
  });
};

export const useNotifications = () => {
  const { tasks, toggleComplete, delayTask } = useTaskStore();
  const { getSettings } = useMainStore();
  const { colors, isDark } = useTheme();
  
  const settings = getSettings();

  useEffect(() => {
    setupNotificationHandler(colors, isDark);
    setupNotifications();
  }, [colors, isDark, settings.defaultDelay]);

  const setupNotifications = async () => {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permissions Required', 'Notification permissions required for task reminders!');
      return;
    }

    // Get delay time for button title
    const delayTime = settings.defaultDelay || '30m';

    // Setup notification categories with Done and Delay actions
    await Notifications.setNotificationCategoryAsync('task_reminder', [
      {
        identifier: 'done_action',
        buttonTitle: 'DONE',
        options: {
          opensAppToForeground: false,
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
      {
        identifier: 'delay_action', 
        buttonTitle: `DELAY ${delayTime}`,
        options: {
          opensAppToForeground: false,
          isDestructive: false,
          isAuthenticationRequired: false,
        },
      },
    ]);

    // Handle notification responses (button taps and dismissals)
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response: any) => {
        const taskId = response.notification.request.content.data?.taskId || response.notification.request.identifier;
        const { actionIdentifier } = response;
        const notificationData = response.notification.request.content.data;
        
        // Cancel follow-up notification if user interacts with primary notification
        if (notificationData?.isSequential && notificationData?.isPrimary) {
          const followUpId = `${taskId}_followup`;
          try {
            await Notifications.cancelScheduledNotificationAsync(followUpId);
          } catch (error) {
            // Silently handle cancellation errors
          }
        }
        
        if (actionIdentifier === 'done_action') {
          // Mark task as done and cancel all notifications for this task
          toggleComplete(taskId);
          await Notifications.cancelScheduledNotificationAsync(taskId);
          // Also cancel follow-up notification if it exists
          try {
            await Notifications.cancelScheduledNotificationAsync(`${taskId}_followup`);
          } catch (error) {
            // Silently handle cancellation errors
          }
          await Notifications.dismissNotificationAsync(response.notification.request.identifier);
        } else if (actionIdentifier === 'delay_action') {
          // Delay task and dismiss current notification
          delayTask(taskId);
          // Also cancel follow-up notification if it exists
          try {
            await Notifications.cancelScheduledNotificationAsync(`${taskId}_followup`);
          } catch (error) {
            // Silently handle cancellation errors
          }
          await Notifications.dismissNotificationAsync(response.notification.request.identifier);
        } else if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          // User tapped the notification body - open app
          // Cancel follow-up if this was a tap on primary notification
          if (notificationData?.isSequential && notificationData?.isPrimary) {
            try {
              await Notifications.cancelScheduledNotificationAsync(`${taskId}_followup`);
            } catch (error) {
              // Silently handle cancellation errors
            }
          }
        }
      }
    );
    
    // Handle notification dismissal as delay action
    const dismissSubscription = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        // Set up a timer to detect if notification was dismissed
        const taskId = notification.request.content.data?.taskId || notification.request.identifier;
        
        setTimeout(async () => {
          try {
            // Check if notification is still present
            const presented = await Notifications.getPresentedNotificationsAsync();
            const stillPresent = presented.some(n => 
              (n.request.content.data?.taskId || n.request.identifier) === taskId
            );
            
            // If notification was dismissed without action, treat as delay
            if (!stillPresent) {
              // Note: We can't definitively detect dismissal vs action, 
              // so this is a best-effort approach
            }
          } catch (error) {
            // Silently handle error
          }
        }, 1000); // Check after 1 second
      }
    );

    return () => {
      responseSubscription.remove();
      dismissSubscription.remove();
    };
  };

  const scheduleTaskReminder = async (task: Task) => {
    const { workingHoursEnabled, workingHoursStart, workingHoursEnd, twentyFourHourMode } = settings;
    
    let reminderTime = new Date(task.reminderTime);
    
    // Check if notification should be shown based on working hours and 24h mode
    const shouldRespectWorkingHours = workingHoursEnabled && !twentyFourHourMode && !task.ignoreWorkingHours;
    
    if (shouldRespectWorkingHours) {
      // Check if reminder time is within working hours
      const isWithinWorkingHours = checkIfTimeWithinWorkingHours(reminderTime, workingHoursStart, workingHoursEnd);
      
      if (!isWithinWorkingHours) {
        // Don't schedule notification if outside working hours and not in 24h mode
        return;
      }
      
      // Adjust reminder time if needed (e.g., if it's exactly on the boundary)
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

    try {
      // Schedule the primary notification (A)
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
          // Theme-aware styling (Android)
          ...(Platform.OS === 'android' && {
            color: colors.accent,
            priority: Notifications.AndroidNotificationPriority.HIGH,
            vibrate: [0, 250, 250, 250],
            sound: 'default'
          })
        },
        trigger: {
          type: 'date',
          date: reminderTime
        } as any
      });

      // Schedule follow-up notification (B) if sequential notifications are enabled
      if (task.enableSequentialNotification && task.sequentialInterval) {
        const followUpTime = new Date(reminderTime.getTime() + (task.sequentialInterval * 1000));
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
            // Theme-aware styling (Android)
            ...(Platform.OS === 'android' && {
              color: colors.accent,
              priority: Notifications.AndroidNotificationPriority.HIGH,
              vibrate: [0, 250, 250, 250],
              sound: 'default'
            })
          },
          trigger: {
            type: 'date',
            date: followUpTime
          } as any
        });
      }
    } catch (error) {
      // Silently handle notification scheduling errors
    }
  };

  const checkIfTimeWithinWorkingHours = (date: Date, startTime: string, endTime: string): boolean => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const hour = date.getHours();
    const minute = date.getMinutes();

    const currentTime = hour * 60 + minute;
    const workStart = startHour * 60 + startMinute;
    const workEnd = endHour * 60 + endMinute;

    return currentTime >= workStart && currentTime <= workEnd;
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
      // After work hours - move to start of next day's work
      date.setDate(date.getDate() + 1);
      date.setHours(startHour, startMinute, 0, 0);
    }
    return date;
  };

  return { scheduleTaskReminder };
};