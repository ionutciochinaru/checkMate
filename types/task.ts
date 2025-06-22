export interface Task {
  id: string;
  title: string;
  description?: string;
  isRecurring: boolean;
  recurringInterval?: number; // hours
  reminderTime: Date;
  originalReminderTime?: Date; // Track original scheduled time before delays
  isCompleted: boolean;
  delayCount: number;
  createdAt: Date;
  ignoreWorkingHours: boolean;
  completionCount?: number; // How many times this loop task has been completed
  lastCompletedAt?: Date; // When it was last marked as done
  enableSequentialNotification?: boolean; // Whether to use A → B notification pattern
  sequentialInterval?: number; // Interval in seconds (30, 300, 600 for 30s, 5min, 10min)
  followUpNotificationId?: string; // ID of the scheduled follow-up notification
}

export type DateFormat = 'DD-MM-YYYY' | 'MM-DD-YYYY' | 'YYYY-MM-DD';
export type DateSeparator = '-' | '/';
export type TimeFormat = '24H' | '12H';

export interface AppSettings {
  workingHoursEnabled: boolean;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string;   // "17:00"
  defaultDelay: string; // "30m"
  twentyFourHourMode: boolean; // If true, ignore working hours for all notifications
  fontScale: number; // 1.0 = normal, 1.2 = large, 1.5 = extra large
  highContrast: boolean;
  reducedMotion: boolean;
  dateFormat: DateFormat; // Date order preference
  dateUseMonthNames: boolean; // Use month names instead of numbers
  dateSeparator: DateSeparator; // Separator between date parts
  timeFormat: TimeFormat; // 24H or 12H format
}