export interface GoogleCalendarEvent {
  id: string;
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end?: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status?: string;
  htmlLink?: string;
}

export interface GoogleCalendarSyncSettings {
  isEnabled: boolean;
  autoSyncEnabled: boolean;
  autoSyncInterval: number; // in hours: 1, 6, 12, 24
  lastSyncTime?: Date;
  connectedAccount?: string;
}

export interface GoogleAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userEmail?: string;
}