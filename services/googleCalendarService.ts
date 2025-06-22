import { GoogleCalendarEvent } from '../types/googleCalendar';
import { Task } from '../types/task';

export class GoogleCalendarService {
  private static readonly BASE_URL = 'https://www.googleapis.com/calendar/v3';

  static async fetchEvents(accessToken: string, timeMin?: string, timeMax?: string): Promise<GoogleCalendarEvent[]> {
    const params = new URLSearchParams({
      orderBy: 'startTime',
      singleEvents: 'true',
      maxResults: '50',
    });

    if (timeMin) params.append('timeMin', timeMin);
    if (timeMax) params.append('timeMax', timeMax);

    const response = await fetch(
      `${this.BASE_URL}/calendars/primary/events?${params.toString()}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch calendar events: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.items || [];
  }

  static async getUserProfile(accessToken: string) {
    const response = await fetch(
      'https://www.googleapis.com/oauth2/v2/userinfo',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user profile: ${response.status}`);
    }

    return response.json();
  }

  static mapEventToTask(event: GoogleCalendarEvent): Omit<Task, 'id' | 'createdAt' | 'delayCount' | 'isCompleted'> {
    const startDateTime = event.start?.dateTime || event.start?.date;
    const reminderTime = startDateTime ? new Date(startDateTime) : new Date();
    
    // If it's an all-day event, set time to 9 AM
    if (event.start?.date && !event.start?.dateTime) {
      reminderTime.setHours(9, 0, 0, 0);
    }

    return {
      title: event.summary || 'Untitled Event',
      description: event.description ? `${event.description}\n\nFrom Google Calendar` : 'From Google Calendar',
      isRecurring: false, // We'll handle Google's recurring events as individual tasks
      reminderTime,
      ignoreWorkingHours: false,
      enableSequentialNotification: false,
      sequentialInterval: 300, // 5 minutes default
    };
  }

  static getUpcomingEventsTimeRange(): { timeMin: string; timeMax: string } {
    const now = new Date();
    const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return {
      timeMin: now.toISOString(),
      timeMax: oneWeekFromNow.toISOString(),
    };
  }
}