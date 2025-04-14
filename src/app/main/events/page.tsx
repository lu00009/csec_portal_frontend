'use client';

import { useState } from 'react';
import { FiPlus, FiChevronDown } from 'react-icons/fi';
import SessionItem from '@/components/sessions&events/SessionItem';
import EventItem from '@/components/sessions&events/EventItem';
import SessionsTable from '@/components/sessions&events/SessionsTable';
import EventTable from '@/components/sessions&events/EventTable';
import Pagination from '@/components/sessions&events/Pagination';
import ViewToggle from '@/components/sessions&events/ViewToggle';
import CreateSessionModal from '@/components/sessions&events/CreateSessionModal';
import CreateEventModal from '@/components/sessions&events/CreateEventModal';

type Session = {
  id: string;
  type: 'session' | 'event';
  status: 'planned' | 'ongoing' | 'ended';
  division: string;
  timeRemaining: string;
  title: string;
  date: string;
  visibility: 'public' | 'members';
  groups?: string[];
  venue: string;
  attendance?: 'mandatory' | 'optional';
};

type Event = {
  id: string;
  type: 'session' | 'event';
  status: 'planned' | 'ongoing' | 'ended';
  category: string;
  timeRemaining: string;
  title: string;
  date: string;
  visibility: 'public' | 'members';
  venue: string;
};

const SessionsPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [contentType, setContentType] = useState<'sessions' | 'events'>('sessions');
  const [editingItem, setEditingItem] = useState<Session | Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [items, setItems] = useState<(Session | Event)[]>([
    // Sessions
    {
      id: '1',
      type: 'session',
      status: 'planned',
      division: 'Dev Division',
      timeRemaining: '1d 12h 31m left',
      title: 'Development weekly session',
      date: 'Wednesday, 06 July 2025',
      visibility: 'members',
      groups: ['Group 1', 'Group 2'],
      venue: 'Lab 1',
      attendance: 'mandatory'
    },
    {
      id: '2',
      type: 'session',
      status: 'planned',
      division: 'Design Division',
      timeRemaining: '2d 5h 20m left',
      title: 'UI/UX Workshop',
      date: 'Thursday, 07 July 2025',
      visibility: 'members',
      groups: ['Group 3'],
      venue: 'Lab 2',
      attendance: 'optional'
    },
    {
      id: '3',
      type: 'session',
      status: 'ended',
      division: 'Marketing',
      timeRemaining: '3d 2h ago',
      title: 'Social Media Strategy',
      date: 'Monday, 04 July 2025',
      visibility: 'public',
      groups: ['Group 1', 'Group 4'],
      venue: 'Conference Room'
    },
    {
      id: '4',
      type: 'session',
      status: 'ongoing',
      division: 'Dev Division',
      timeRemaining: '4h 30m left',
      title: 'Code Review',
      date: 'Tuesday, 05 July 2025',
      visibility: 'members',
      groups: ['Group 2'],
      venue: 'Lab 1'
    },
    // Events
    {
      id: '5',
      type: 'event',
      status: 'planned',
      category: 'Tutorial',
      timeRemaining: '1d 12h 31m left',
      title: 'Cyber Security Tutorial',
      date: 'Wednesday, 06 July 2025',
      visibility: 'members',
      venue: 'Lab 1'
    },
    {
      id: '6',
      type: 'event',
      status: 'planned',
      category: 'Game Night',
      timeRemaining: '1d 12h 31m left',
      title: 'Funny Games Beyond Coding',
      date: 'Wednesday, 06 July 2025',
      visibility: 'members',
      venue: 'Lab 1'
    },
    {
      id: '7',
      type: 'event',
      status: 'ended',
      category: 'Seminar',
      timeRemaining: '1d 12h 3m ago',
      title: 'Working Remotely',
      date: 'Wednesday, 06 July 2025',
      visibility: 'public',
      venue: 'Lab 1'
    },
    {
      id: '8',
      type: 'event',
      status: 'planned',
      category: 'Dev Division',
      timeRemaining: '1d 12h 31m left',
      title: 'Development weekly session',
      date: 'Wednesday, 06 July 2025',
      visibility: 'members',
      venue: 'Lab 1'
    }
  ]);

  const filteredItems = items.filter(item => 
    contentType === 'sessions' ? item.type === 'session' : item.type === 'event'
  );

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item: Session | Event) => {
    setEditingItem(item);
    if (item.type === 'session') {
      setShowCreateModal(true);
    } else {
      setShowEventModal(true);
    }
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newSession: Session = {
      id: editingItem?.id || Date.now().toString(),
      type: 'session',
      status: 'planned',
      division: formData.get('division') as string,
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
      timeRemaining: '1d 12h 31m left',
      visibility: formData.get('visibility') as 'public' | 'members',
      groups: (formData.get('groups') as string).split(',').map(g => g.trim()),
      venue: formData.get('venue') as string,
      attendance: formData.get('attendance') as 'mandatory' | 'optional'
    };

    if (editingItem) {
      setItems(items.map(s => s.id === editingItem.id ? newSession : s));
    } else {
      setItems([...items, newSession]);
    }

    setShowCreateModal(false);
    setEditingItem(null);
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newEvent: Event = {
      id: editingItem?.id || Date.now().toString(),
      type: 'event',
      status: 'planned',
      category: formData.get('category') as string,
      title: formData.get('title') as string,
      date: new Date(formData.get('date') as string).toLocaleDateString('en-US', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }),
      timeRemaining: '1d 12h 31m left',
      visibility: formData.get('visibility') as 'public' | 'members',
      venue: formData.get('venue') as string
    };

    if (editingItem) {
      setItems(items.map(s => s.id === editingItem.id ? newEvent : s));
    } else {
      setItems([...items, newEvent]);
    }

    setShowEventModal(false);
    setEditingItem(null);
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
                setCurrentPage(1); // Reset to first page when changing content type
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

      {/* Content Display */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              item.type === 'session' ? (
                <SessionItem 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              ) : (
                <EventItem 
                  key={item.id} 
                  item={item} 
                  onEdit={handleEdit} 
                  onDelete={handleDelete} 
                />
              )
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              No {contentType} found
            </div>
          )}
        </div>
      ) : (
        contentType === 'sessions' ? (
          <SessionsTable 
            items={currentItems} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ) : (
          <EventTable 
            items={currentItems} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )
      )}

      {/* Pagination */}
      {filteredItems.length > itemsPerPage && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={setCurrentPage} 
        />
      )}

      {/* Modals */}
      <CreateSessionModal 
        isOpen={showCreateModal} 
        onClose={() => {
          setShowCreateModal(false);
          setEditingItem(null);
        }} 
        onSubmit={handleSessionSubmit}
        editingItem={editingItem}
      />

      <CreateEventModal 
        isOpen={showEventModal} 
        onClose={() => {
          setShowEventModal(false);
          setEditingItem(null);
        }} 
        onSubmit={handleEventSubmit}
        editingItem={editingItem}
      />
    </div>
  );
};

export default SessionsPage;