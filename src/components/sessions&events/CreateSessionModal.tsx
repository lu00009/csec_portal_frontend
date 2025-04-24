'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import { useFormik } from 'formik';

function parseDateString(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function getTimeLeft(endDateStr: string): string {
  const endDate = parseDateString(endDateStr);
  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();

  if (isNaN(endDate.getTime()) || diffMs <= 0) return 'Ended';

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m left`;
}

type CreateSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: {
    id: string;
    title: string;
    type: string;
    division: string;
    startMonth: string;
    endMonth: string;
    sessions: { day: string; startTime: string; endTime: string }[];
    visibility: string;
    venue: string;
    attendance: string;
    status: string;
    timeRemaining: string;
    groups: string[];
  }) => void;
  editingItem: {
    id?: string;
    title?: string;
    type?: string;
    division?: string;
    startMonth?: string;
    endMonth?: string;
    sessions?: { day: string; startTime: string; endTime: string }[];
    visibility?: string;
    venue?: string;
    attendance?: string;
  } | null;
};

const CreateSessionModal = ({ isOpen, onClose, onSubmit, editingItem }: CreateSessionModalProps) => {
  type Session = {
    day: string;
    startTime: string;
    endTime: string;
  };

  const formik = useFormik({
    initialValues: {
      title: editingItem?.title || 'Contest',
      type: editingItem?.type || 'CPD',
      division: editingItem?.division || 'Div 1',
      startMonth: editingItem?.startMonth || '2024-02-10',
      endMonth: editingItem?.endMonth || '2024-04-20',
      sessions: editingItem?.sessions || [] as Session[],
      newSession: { day: '', startTime: '', endTime: '' },
      visibility: editingItem?.visibility || 'members',
      venue: editingItem?.venue || 'Default Venue',
      attendance: editingItem?.attendance || 'mandatory'
    },
    onSubmit: (values) => {
      const sessionData = {
        id: editingItem?.id || Date.now().toString(),
        ...values,
        status: 'planned',
        timeRemaining: getTimeLeft(values.endMonth),
        groups: values.sessions.map((s: Session) => s.day)
      };
      onSubmit(sessionData);
      onClose();
    }
  });

  const handleAddSession = () => {
    const { day, startTime, endTime } = formik.values.newSession;
    if (day && startTime && endTime) {
      formik.setFieldValue('sessions', [...formik.values.sessions, { day, startTime, endTime }]);
      formik.setFieldValue('newSession', { day: '', startTime: '', endTime: '' });
    }
  };

  const handleRemoveSession = (index: number) => {
    formik.setFieldValue('sessions', formik.values.sessions.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingItem ? 'Edit Session' : 'Add New Session'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input className="border rounded px-4 py-2" placeholder="Title" name="title" value={formik.values.title} onChange={formik.handleChange} required />
            <input className="border rounded px-4 py-2" placeholder="Type" name="type" value={formik.values.type} onChange={formik.handleChange} required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select name="division" value={formik.values.division} onChange={formik.handleChange} className="border rounded px-4 py-2">
              <option value="Div 1">Div 1</option>
              <option value="Div 2">Div 2</option>
            </select>
            <input type="date" className="border rounded px-4 py-2" placeholder="Start Month" name="startMonth" value={formik.values.startMonth} onChange={formik.handleChange} />
            <input type="date" className="border rounded px-4 py-2" placeholder="End Month" name="endMonth" value={formik.values.endMonth} onChange={formik.handleChange} />
          </div>

          {formik.values.sessions.map((s: { day: string; startTime: string; endTime: string }, i: number) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-2">
              <input className="border rounded px-4 py-2" value={s.day} disabled />
              <input className="border rounded px-4 py-2" value={s.startTime} disabled />
              <input className="border rounded px-4 py-2" value={s.endTime} disabled />
              <button type="button" className="border border-red-500 text-red-500 px-4 py-2 rounded" onClick={() => handleRemoveSession(i)}>Remove</button>
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              value={formik.values.newSession.day}
              onChange={(e) => formik.setFieldValue('newSession', { ...formik.values.newSession, day: e.target.value })}
              className="border rounded px-4 py-2"
            >
              <option value="">Select Day</option>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input type="time" className="border rounded px-4 py-2" value={formik.values.newSession.startTime} onChange={(e) => formik.setFieldValue('newSession', { ...formik.values.newSession, startTime: e.target.value })} />
            <input type="time" className="border rounded px-4 py-2" value={formik.values.newSession.endTime} onChange={(e) => formik.setFieldValue('newSession', { ...formik.values.newSession, endTime: e.target.value })} />
            <button type="button" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAddSession}>Add</button>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" className="px-6 py-2 border rounded" onClick={onClose}>Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;
