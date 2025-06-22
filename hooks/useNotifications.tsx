import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useTaskStore, useMainStore } from './useTaskStore';
import { useTheme } from './useTheme';
import { Task } from '../types/task';
import { Platform } from 'react-native';
import { showAlert } from '../components/CustomAlert';

const setupNotificationHandler = (colors: any, isDark: boolean) => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => ({
      shouldShowAlert: true,
      shouldShowBanner: true, 
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
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
  const { theme } = useTheme();
  
  const settings = getSettings();

  useEffect(() => {
    setupNotificationHandler(theme.colors, theme.isDark);
    setupNotifications();
  }, [theme.colors, theme.isDark, settings.defaultDelay]);

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      showAlert('Permissions Required', 'Notification permissions required for task reminders!');
      return;
    }

    const delayTime = settings.defaultDelay || '30m';

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

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(
      async (response: any) => {
        const taskId = response.notification.request.content.data?.taskId || response.notification.request.identifier;
        const { actionIdentifier } = response;
        const notificationData = response.notification.request.content.data;
        
        if (notificationData?.isSequential && notificationData?.isPrimary) {
          const followUpId = `${taskId}_followup`;
          try {
            await Notifications.cancelScheduledNotificationAsync(followUpId);
          } catch (error) {
          }
        }
        
        if (actionIdentifier === 'done_action') {
          toggleComplete(taskId);
          await Notifications.cancelScheduledNotificationAsync(taskId);
          try {
            await Notifications.cancelScheduledNotificationAsync(`${taskId}_followup`);
          } catch (error) {
          }
          await Notifications.dismissNotificationAsync(response.notification.request.identifier);
        } else if (actionIdentifier === 'delay_action') {
          delayTask(taskId);
          try {
            await Notifications.cancelScheduledNotificationAsync(`${taskId}_followup`);
          } catch (error) {
          }
          await Notifications.dismissNotificationAsync(response.notification.request.identifier);
        } else if (actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER) {
          if (notificationData?.isSequential && notificationData?.isPrimary) {
            try {
              await Notifications.cancelScheduledNotificationAsync(`${taskId}_followup`);
            } catch (error) {
            }
          }
        }
      }
    );
    
    const dismissSubscription = Notifications.addNotificationReceivedListener(
      (notification: any) => {
        const taskId = notification.request.content.data?.taskId || notification.request.identifier;
        
        setTimeout(async () => {
          try {
            const presented = await Notifications.getPresentedNotificationsAsync();
            const stillPresent = presented.some(n => 
              (n.request.content.data?.taskId || n.request.identifier) === taskId
            );
            
            if (!stillPresent) {
            }
          } catch (error) {
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
    
    const shouldRespectWorkingHours = workingHoursEnabled && !twentyFourHourMode && !task.ignoreWorkingHours;
    
    if (shouldRespectWorkingHours) {
      const isWithinWorkingHours = checkIfTimeWithinWorkingHours(reminderTime, workingHoursStart, workingHoursEnd);
      
      if (!isWithinWorkingHours) {
        return;
      }
      
      reminderTime = adjustForWorkingHours(reminderTime, workingHoursStart, workingHoursEnd);
    }

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
    
    if (!body.trim()) {
      body = 'Task reminder - tap for details';
    }

    try {
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
          ...(Platform.OS === 'android' && {
            color: theme.colors.accent,
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
            ...(Platform.OS === 'android' && {
              color: theme.colors.accent,
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
      date.setHours(startHour, startMinute, 0, 0);
    } else if (currentTime > workEnd) {
      date.setDate(date.getDate() + 1);
      date.setHours(startHour, startMinute, 0, 0);
    }
    return date;
  };

  return { scheduleTaskReminder };
};