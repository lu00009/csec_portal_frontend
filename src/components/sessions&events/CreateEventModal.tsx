'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import { useFormik } from 'formik';

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: { 
    eventTitle: string; 
    visibility: string; 
    division: string; 
    groups: string[]; 
    eventDate: string; 
    startTime: string; 
    endTime: string; 
    attendance: string; 
  }) => void;
  editingItem: {
    eventTitle?: string;
    visibility?: string;
    division?: string;
    groups?: string;
    eventDate?: string;
    startTime?: string;
    endTime?: string;
    attendance?: string;

  } | null;
};

const CreateEventModal = ({ isOpen, onClose, onSubmit, editingItem }: CreateEventModalProps) => {
  const formik = useFormik({
    initialValues: {
      eventTitle: editingItem?.eventTitle || '',
      visibility: editingItem?.visibility || 'public',
      division: editingItem?.division || '',
      groups: editingItem?.groups
      ? Array.isArray(editingItem.groups)
        ? editingItem.groups
        : editingItem.groups.split(/,\s*/)
      : ['Group 1'],
      eventDate: editingItem?.eventDate || '',
      startTime: editingItem?.startTime || '',
      endTime: editingItem?.endTime || '',
      attendance: editingItem?.attendance || 'optional',
   
    },
    onSubmit: (values) => {
      const eventData = {
        ...values,
      };
      onSubmit(eventData);
      onClose();
    }
  });

  // const handleRemoveTag = (index: number) => {
  //   const newTags: string[] = formik.values.tags.filter((_: string, i: number) => i !== index);
  //   formik.setFieldValue('tags', newTags);
  // };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{editingItem ? 'Edit Event' : 'Add New Event'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              className="border rounded px-4 py-2 w-full"
              placeholder="Event Title"
              name="title"
              value={formik.values.eventTitle}
              onChange={formik.handleChange}
              required
            />
            <div>
              <label className="font-semibold mb-1">Visibility</label>
              <div className="flex gap-4">
                {['public', 'members'].map((v) => (
                  <label key={v} className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="visibility"
                      value={v}
                      checked={formik.values.visibility === v}
                      onChange={formik.handleChange}
                    />
                    {v === 'public' ? 'Public' : 'Members'}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {formik.values.visibility === 'members' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  className="border rounded px-4 py-2"
                  name="division"
                  value={formik.values.division}
                  onChange={formik.handleChange}
                  required
                >
                  <option value="">Select Division</option>
                  <option value="Div 1">Div 1</option>
                  <option value="Div 2">Div 2</option>
                </select>
                <select
              name="groups"
              value={formik.values.groups}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                formik.setFieldValue('groups', selected);
              }}
              className="border rounded px-4 py-2"
              multiple
            >
              <option value="Group 1">Group 1</option>
              <option value="Group 2">Group 2</option>
              <option value="Group 3">Group 3</option>
              <option value="Group 4">Group 4</option>
            </select>
              </div>
              <div className="mb-4">
                <label className="font-semibold mb-1">Attendance</label>
                <div className="flex gap-4">
                  <label>
                    <input
                      type="radio"
                      name="attendance"
                      value="mandatory"
                      checked={formik.values.attendance === 'mandatory'}
                      onChange={formik.handleChange}
                    /> Mandatory
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="attendance"
                      value="optional"
                      checked={formik.values.attendance === 'optional'}
                      onChange={formik.handleChange}
                    /> Optional
                  </label>
                </div>
              </div>
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input type="date" name="date" value={formik.values.eventDate} onChange={formik.handleChange} className="border rounded px-4 py-2" required />
            <input type="time" name="startTime" value={formik.values.startTime} onChange={formik.handleChange} className="border rounded px-4 py-2" required />
            <input type="time" name="endTime" value={formik.values.endTime} onChange={formik.handleChange} className="border rounded px-4 py-2" required />
          </div>

          


          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
