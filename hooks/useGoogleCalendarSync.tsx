import { useState, useCallback } from 'react';
import { GoogleCalendarService } from '../services/googleCalendarService';
import { useTaskStore } from './useTaskStore';
import { GoogleAuthState } from '../types/googleCalendar';
import { showAlert } from '../components/CustomAlert';

// TODO: Install expo-auth-session and expo-web-browser packages for full Google Calendar integration
// npm install expo-auth-session expo-web-browser

export function useGoogleCalendarSync() {
  const { addTask } = useTaskStore();
  const [authState, setAuthState] = useState<GoogleAuthState>({
    accessToken: null,
    isAuthenticated: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Placeholder for OAuth setup - requires expo-auth-session package
  const promptAsync = null;
  const request = null;

  // Handle auth response - placeholder implementation
  const handleAuthResponse = useCallback(async (response: any) => {
    // TODO: Implement OAuth response handling when packages are installed
    console.log('Auth response:', response);
  }, []);

  // Sign in with Google - placeholder implementation
  const signInWithGoogle = useCallback(async () => {
    setIsLoading(true);
    // TODO: Implement Google OAuth when expo-auth-session is installed
    showAlert('Setup Required', 'Google Calendar integration requires additional packages. Please install expo-auth-session and expo-web-browser.');
    setIsLoading(false);
  }, []);

  // Sync calendar events to tasks
  const syncCalendarEvents = useCallback(async () => {
    if (!authState.accessToken) {
      showAlert('Error', 'Please sign in with Google first');
      return { success: false, count: 0 };
    }

    try {
      setIsLoading(true);
      
      const { timeMin, timeMax } = GoogleCalendarService.getUpcomingEventsTimeRange();
      const events = await GoogleCalendarService.fetchEvents(
        authState.accessToken,
        timeMin,
        timeMax
      );

      // Filter out events that are in the past or all-day events without specific times
      const relevantEvents = events.filter(event => {
        if (!event.start?.dateTime && !event.start?.date) return false;
        if (event.status === 'cancelled') return false;
        
        const eventTime = new Date(event.start.dateTime || event.start.date!);
        return eventTime > new Date();
      });

      // Convert events to tasks and add them
      let addedCount = 0;
      for (const event of relevantEvents) {
        try {
          const taskData = GoogleCalendarService.mapEventToTask(event);
          await addTask(taskData);
          addedCount++;
        } catch (error) {
          console.error('Failed to add task from event:', event.summary, error);
        }
      }

      showAlert(
        'Sync Complete',
        `Successfully imported ${addedCount} event${addedCount !== 1 ? 's' : ''} from Google Calendar`
      );

      return { success: true, count: addedCount };
    } catch (error) {
      console.error('Calendar sync error:', error);
      showAlert('Sync Error', 'Failed to sync calendar events. Please try again.');
      return { success: false, count: 0 };
    } finally {
      setIsLoading(false);
    }
  }, [authState.accessToken, addTask]);

  // Sign out
  const signOut = useCallback(() => {
    setAuthState({
      accessToken: null,
      isAuthenticated: false,
    });
  }, []);

  return {
    authState,
    isLoading,
    signInWithGoogle,
    syncCalendarEvents,
    signOut,
    isReady: false, // Will be true when OAuth packages are installed
  };
}