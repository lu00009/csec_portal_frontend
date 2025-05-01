import axios from 'axios';
import { Session, Event } from '@/types/eventSession';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE



// Sessions API
export const getSessions = async (page = 1): Promise<Session[]> => {
  const res = await axios.get(`${BASE_URL}/sessions?page=${page}`);
  return res.data.sessions;
};

export const createSession = async (sessionData: Partial<Session>): Promise<Session> => {
  const res = await axios.post(`${BASE_URL}/sessions/createSession`, sessionData,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data.session;
};

export const updateSession = async (id: string, sessionData: Partial<Session>): Promise<Session> => {
  const res = await axios.put(`${BASE_URL}/sessions/${id}`, sessionData,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data.session;
};

export const deleteSessionById = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/sessions/${id}`, {
     headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  }});
};

// Events API
export const getEvents = async (page = 1): Promise<Event[]> => {
  const res = await axios.get(`${BASE_URL}/events?page=${page}`);
  return res.data.events;
};

export const createEvent = async (eventData: Partial<Event>): Promise<Event> => {
const res = await axios.post(`${BASE_URL}/events/addEvent`, eventData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data.event;
};

export const updateEvent = async (id: string, eventData: Partial<Event>): Promise<Event> => {
  const res = await axios.put(`${BASE_URL}/events/${id}`, eventData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return res.data.event;
};

export const deleteEventById = async (id: string): Promise<void> => {
  await axios.delete(`${BASE_URL}/events/${id}`,{
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
};
