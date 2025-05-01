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
import { formatDisplayDate } from '@/utils/date';
import { Session, Event } from '@/types/eventSession';
import { useSessionEventStore } from '@/stores/sessionEventstore';

const SessionsPage = () => {
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [contentType, setContentType] = useState<'sessions' | 'events'>('sessions');
  const [editingItem, setEditingItem] = useState<Session | Event | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    sessions,
    events,
    loading,
    fetchSessions,
    fetchEvents,
    addSession,
    addEvent,
    editSession,
    editEvent,
    deleteSession,
    deleteEvent,
  } = useSessionEventStore();

  const items = contentType === 'sessions' ? sessions : events;
  const itemsPerPage = 4;

  useEffect(() => {
    if (contentType === 'sessions') {
      fetchSessions(currentPage);
    } else {
      fetchEvents(currentPage);
    }
  }, [contentType, currentPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const currentItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      if (contentType === 'sessions') {
        await deleteSession(id);
        fetchSessions(currentPage);
      } else {
        await deleteEvent(id);
        fetchEvents(currentPage);
      }
    }
  };

  const handleEdit = (item: Session | Event) => {
    setEditingItem(item);
    void ('sessionTitle' in item ? setShowCreateModal(true) : setShowEventModal(true));
  };

  const handleSessionSubmit = async (data: Partial<Session>) => {
    try {
      if (editingItem && 'sessionTitle' in editingItem) {
        await editSession(editingItem._id, data);
      } else {
        await addSession(data);
      }
      fetchSessions(currentPage);
    } catch (err) {
      console.error(err);
    }
    setShowCreateModal(false);
    setEditingItem(null);
  };

  const handleEventSubmit = async (data: Partial<Event>) => {
    try {
      if (editingItem && 'eventTitle' in editingItem) {
        await editEvent(editingItem._id, data);
      } else {
        await addEvent(data);
      }
      fetchEvents(currentPage);
    } catch (err) {
      console.error(err);
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
            if (contentType === 'sessions') {
              setShowCreateModal(true);
            } else {
              setShowEventModal(true);
            }
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
              <SessionItem
                key={item._id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
                date={formatDisplayDate(item.startDate)}
              />
            ) : (
              <EventItem
                key={item._id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
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
