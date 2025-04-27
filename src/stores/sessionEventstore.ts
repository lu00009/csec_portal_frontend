// stores/sessionEventStore.ts
import { create } from 'zustand';
import {
  getSessions,
  getEvents,
  createSession,
  createEvent,
  updateSession,
  updateEvent,
  deleteSessionById,
  deleteEventById,
} from '@/lib/api/sessionEventApi';
import { Session, Event } from '@/types/eventSession';

interface SessionEventStore {
  sessions: Session[];
  events: Event[];
  loading: boolean;
  fetchSessions: (page: number) => Promise<void>;
  fetchEvents: (page: number) => Promise<void>;
  addSession: (data: Partial<Session>) => Promise<void>;
  addEvent: (data: Partial<Event>) => Promise<void>;
  editSession: (id: string, data: Partial<Session>) => Promise<void>;
  editEvent: (id: string, data: Partial<Event>) => Promise<void>;
  deleteSession: (id: string) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
}

export const useSessionEventStore = create<SessionEventStore>((set) => ({
  sessions: [],
  events: [],
  loading: false,

  fetchSessions: async (page) => {
    set({ loading: true });
    try {
      const data = await getSessions(page);
      set({ sessions: data });
    } catch (err) {
      console.error('Failed to fetch sessions', err);
    } finally {
      set({ loading: false });
    }
  },

  fetchEvents: async (page) => {
    set({ loading: true });
    try {
      const data = await getEvents(page);
      set({ events: data });
    } catch (err) {
      console.error('Failed to fetch events', err);
    } finally {
      set({ loading: false });
    }
  },

  addSession: async (data) => {
    try {
      await createSession(data);
    } catch (err) {
      console.error('Failed to create session', err);
    }
  },

  addEvent: async (data) => {
    try {
      await createEvent(data);
    } catch (err) {
      console.error('Failed to create event', err);
    }
  },

  editSession: async (id, data) => {
    try {
      await updateSession(id, data);
    } catch (err) {
      console.error('Failed to update session', err);
    }
  },

  editEvent: async (id, data) => {
    try {
      await updateEvent(id, data);
    } catch (err) {
      console.error('Failed to update event', err);
    }
  },

  deleteSession: async (id) => {
    try {
      await deleteSessionById(id);
    } catch (err) {
      console.error('Failed to delete session', err);
    }
  },

  deleteEvent: async (id) => {
    try {
      await deleteEventById(id);
    } catch (err) {
      console.error('Failed to delete event', err);
    }
  },
}));
