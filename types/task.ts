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
}

export interface AppSettings {
  workingHoursEnabled: boolean;
  workingHoursStart: string; // "09:00"
  workingHoursEnd: string;   // "17:00"
  defaultDelay: string; // "30m"
}