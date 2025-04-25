'use client';

import { useEffect, useState } from 'react';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import SessionItem from '@/components/sessions&events/SessionItem';
import EventItem from '@/components/sessions&events/EventItem';
import SessionsTable from '@/components/sessions&events/SessionsTable';
import EventTable from '@/components/sessions&events/EventTable';
import Pagination from '@/components/sessions&events/Pagination';
import ViewToggle from '@/components/sessions&events/ViewToggle';
import CreateSessionModal from '@/components/sessions&events/CreateSessionModal';
import CreateEventModal from '@/components/sessions&events/CreateEventModal';
import {formatDisplayDate } from '@/utils/date';

type Session = {
  _id?: string;
  sessionTitle: string;
  division: string;
  startDate: string;
  endDate: string;
  groups: string[];
  sessions: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
};

type Event = {
  _id?: string;
  eventTitle: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  visibility: string;
};

const SessionsPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [contentType, setContentType] = useState<'sessions' | 'events'>('sessions');
  const [editingItem, setEditingItem] = useState<Session | Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<(Session | Event)[]>([]);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const endpoint = contentType === 'sessions'
        ? `https://csec-portal-backend-1.onrender.com/api/sessions?page=${currentPage}&limit=10`
        : `https://csec-portal-backend-1.onrender.com/api/events?page=${currentPage}&limit=10`;

      try {
        const res = await fetch(endpoint);
        const data = await res.json();
        console.log('Fetched data:', data); // Debugging line
        setItems(data[contentType] || []);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [contentType, currentPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item._id !== id));
    }
  };

  const handleEdit = (item: Session | Event) => {
    setEditingItem(item);
    item.hasOwnProperty('sessionTitle') ? setShowCreateModal(true) : setShowEventModal(true);
  };

  interface SessionData {
    sessionTitle: string;
    division: string;
    startDate: string;
    endDate: string;
    groups: string[];
    sessions: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
  }

  const handleSessionSubmit = async (sessionData: SessionData): Promise<void> => {
    console.log('sessionData:', sessionData); // Debugging line

    try {
      const response: Response = await fetch('https://csec-portal-backend-1.onrender.com/api/sessions/createSession', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
        },
        body: JSON.stringify(sessionData)
      });

      const contentType: string | null = response.headers.get('Content-Type');
      if (!response.ok) {
        const errorText: string = await response.text();
        throw new Error(`Server Error: ${response.status}\n${errorText}`);
      }

      if (contentType && contentType.includes('application/json')) {
        const data: unknown = await response.json();
        console.log('Success:', data);
      } else {
        const text: string = await response.text();
        console.warn('Unexpected response format:', text);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error submitting session:', error.message);
      }
    }
  };
  
  

  const handleEventSubmit = async (eventData: Event) => {
    try {
      const response = await fetch('https://csec-portal-backend-1.onrender.com/api/events/addEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,

         },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to submit event');

      setShowEventModal(false);
      setEditingItem(null);
      setCurrentPage(1);
    } catch (error) {
      console.error(error);
    }
  };
 
  

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">
            {contentType === 'sessions' ? 'Sessions' : 'Events'}
          </h1>
          <div className="relative">
            <select
              value={contentType}
              onChange={(e) => {
                setContentType(e.target.value as 'sessions' | 'events');
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sessions">Sessions</option>
              <option value="events">Events</option>
            </select>
            <FiChevronDown className="absolute right-3 top-3 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          <button
            onClick={() => {
              setEditingItem(null);
              contentType === 'sessions' ? setShowCreateModal(true) : setShowEventModal(true);
            }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
          >
            <FiPlus className="mr-2" />
            {contentType === 'sessions' ? 'Create Session' : 'Create Event'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : viewMode === 'list' ? (
        <div className="space-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((item) =>
              'sessionTitle' in item ? (
                <SessionItem key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} date={formatDisplayDate(item.startDate)} 
                 />
              ) : (
                <EventItem key={item._id} item={item} onEdit={handleEdit} onDelete={handleDelete} />
              )
            )
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No {contentType} found
            </div>
          )}
        </div>
      ) : contentType === 'sessions' ? (
        <SessionsTable 
        items={currentItems} 
        contentType={contentType} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
        date={currentItems.length > 0 ? formatDisplayDate((currentItems[0] as Session).startDate) : ''}
      />
      
      ) : (
        <EventTable items={currentItems} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {items.length > itemsPerPage && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleSessionSubmit}
        editingItem={editingItem as Session | null}
      />

      <CreateEventModal
        isOpen={showEventModal}
        onClose={() => {
          setShowEventModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleEventSubmit}
        editingItem={editingItem as Event | null}
      />
    </div>
  );
};

export default SessionsPage;
