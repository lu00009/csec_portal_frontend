import React from 'react';
import { FiX } from 'react-icons/fi';
import { useFormik } from 'formik';

type CreateEventModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (eventData: any) => void;
  editingItem: any | null;
};

const CreateEventModal = ({ isOpen, onClose, onSubmit, editingItem }: CreateEventModalProps) => {
  const formik = useFormik({
    initialValues: {
      title: editingItem?.title || '',
      visibility: editingItem?.visibility || 'public',
      division: editingItem?.division || '',
      group: editingItem?.group || '',
      date: editingItem?.date || '',
      startTime: editingItem?.startTime || '',
      endTime: editingItem?.endTime || '',
      attendance: editingItem?.attendance || 'optional',
      tags: editingItem?.tags || ['Group 1', 'Group 3', 'Div 1'],
      venue: editingItem?.venue || 'Lab 1' // Added venue field
    },
    onSubmit: (values) => {
      const eventData = {
        ...values,
        id: editingItem?.id || Date.now().toString(),
        type: 'event',
        status: 'planned',
        timeRemaining: '1d 12h 31m left',
        category: values.title // Or add a separate category field
      };
      onSubmit(eventData);
      onClose(); // Close modal after submission
    }
  });

  const handleRemoveTag = (index: number) => {
    const newTags = formik.values.tags.filter((_, i) => i !== index);
    formik.setFieldValue('tags', newTags);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingItem ? 'Edit Event' : 'Add New Event'}
          </h2>
          <button 
            type="button"
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Event Title & Visibility */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <input
              className="border rounded px-4 py-2 w-full"
              placeholder="Event Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />

            <div className="flex flex-col">
              <label className="font-semibold mb-1">Select Visibility</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formik.values.visibility === "public"}
                    onChange={formik.handleChange}
                  />
                  Public
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="visibility"
                    value="members"
                    checked={formik.values.visibility === "members"}
                    onChange={formik.handleChange}
                  />
                  Only for Members
                </label>
              </div>
            </div>
          </div>

          {/* Dropdowns */}
          {formik.values.visibility === "members" && (
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
                className="border rounded px-4 py-2"
                name="group"
                value={formik.values.group}
                onChange={formik.handleChange}
                required
              >
                <option value="">Select Group</option>
                <option value="Group 1">Group 1</option>
                <option value="Group 3">Group 3</option>
              </select>
            </div>
          )}

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="date"
              className="border rounded px-4 py-2"
              name="date"
              value={formik.values.date}
              onChange={formik.handleChange}
              required
            />
            <input
              type="time"
              className="border rounded px-4 py-2"
              name="startTime"
              value={formik.values.startTime}
              onChange={formik.handleChange}
              required
            />
            <input
              type="time"
              className="border rounded px-4 py-2"
              name="endTime"
              value={formik.values.endTime}
              onChange={formik.handleChange}
              required
            />
          </div>

          {/* Venue */}
          <div className="mb-4">
            <input
              className="border rounded px-4 py-2 w-full"
              placeholder="Venue"
              name="venue"
              value={formik.values.venue}
              onChange={formik.handleChange}
              required
            />
          </div>

          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {formik.values.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 text-sm px-3 py-1 rounded-full">
                {tag} <button 
                  type="button" 
                  onClick={() => handleRemoveTag(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Attendance */}
          {formik.values.visibility === "members" && (
            <div className="mb-4">
              <p className="font-semibold mb-1">Attendance</p>
              <label className="mr-4">
                <input
                  type="radio"
                  name="attendance"
                  value="mandatory"
                  checked={formik.values.attendance === "mandatory"}
                  onChange={formik.handleChange}
                />
                <span className="ml-1">Mandatory</span>
              </label>
              <label>
                <input
                  type="radio"
                  name="attendance"
                  value="optional"
                  checked={formik.values.attendance === "optional"}
                  onChange={formik.handleChange}
                />
                <span className="ml-1">Optional</span>
              </label>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-400"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              disabled={formik.isSubmitting}
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;