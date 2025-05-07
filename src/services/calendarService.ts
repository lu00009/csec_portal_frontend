import { useSettingsStore } from '@/stores/settingsStore';

interface CalendarEvent {
  title: string;
  startTime: Date;
  endTime: Date;
  description?: string;
  location?: string;
}

class CalendarService {
  private static instance: CalendarService;
  private settings = useSettingsStore.getState();

  private constructor() {}

  static getInstance(): CalendarService {
    if (!CalendarService.instance) {
      CalendarService.instance = new CalendarService();
    }
    return CalendarService.instance;
  }

  async addEventToCalendar(event: CalendarEvent): Promise<boolean> {
    if (!this.settings.autoAddEvents) {
      return false;
    }

    try {
      // Here you would implement the actual calendar integration
      // This could be with Google Calendar, Outlook, or other calendar services
      // For now, we'll just log the event
      console.log('Adding event to calendar:', event);
      
      // Example implementation for Google Calendar:
      // const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${accessToken}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     summary: event.title,
      //     start: { dateTime: event.startTime.toISOString() },
      //     end: { dateTime: event.endTime.toISOString() },
      //     description: event.description,
      //     location: event.location,
      //   }),
      // });

      return true;
    } catch (error) {
      console.error('Failed to add event to calendar:', error);
      return false;
    }
  }

  isAutoAddEnabled(): boolean {
    return this.settings.autoAddEvents;
  }
}

export const calendarService = CalendarService.getInstance(); 