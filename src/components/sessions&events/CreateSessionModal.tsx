import React from 'react';
import { FiX } from 'react-icons/fi';
import { useFormik } from 'formik';

type CreateSessionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (sessionData: any) => void;
  editingItem: any | null;
};

const CreateSessionModal = ({ isOpen, onClose, onSubmit, editingItem }: CreateSessionModalProps) => {
  const formik = useFormik({
    initialValues: {
      title: editingItem?.title || "Contest",
      type: editingItem?.type || "CPD",
      division: editingItem?.division || "Div 1",
      startMonth: editingItem?.startMonth || "January",
      endMonth: editingItem?.endMonth || "March",
      sessions: editingItem?.sessions || [
        { day: "Monday", startTime: "03:00 AM", endTime: "07:00 AM" }
      ],
      newSession: {
        day: "",
        startTime: "",
        endTime: "",
      },
      // Default values for parent's expected fields
      visibility: editingItem?.visibility || 'members',
      venue: editingItem?.venue || 'Default Venue',
      attendance: editingItem?.attendance || 'mandatory'
    },
    onSubmit: (values) => {
      const sessionData = {
        id: editingItem?.id || Date.now().toString(),
        title: values.title,
        type: values.type,
        division: values.division,
        startMonth: values.startMonth,
        endMonth: values.endMonth,
        sessions: values.sessions,
        visibility: values.visibility,
        venue: values.venue,
        attendance: values.attendance,
        // Additional fields expected by parent
        status: 'planned',
        timeRemaining: '1d 12h 31m left',
        groups: values.sessions.map((s: any) => s.day)
      };
      onSubmit(sessionData);
      onClose();
    }
  });

  const handleAddSession = () => {
    if (
      formik.values.newSession.day &&
      formik.values.newSession.startTime &&
      formik.values.newSession.endTime
    ) {
      formik.setFieldValue('sessions', [
        ...formik.values.sessions,
        formik.values.newSession
      ]);
      formik.setFieldValue('newSession', { day: "", startTime: "", endTime: "" });
    }
  };

  const handleRemoveSession = (index: number) => {
    formik.setFieldValue(
      'sessions',
      formik.values.sessions.filter((_: any, i: number) => i !== index)
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl z-10 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {editingItem ? 'Edit Session' : 'Add New Session'}
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
          {/* Title and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              className="border rounded px-4 py-2"
              placeholder="Title"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              required
            />
            <input
              className="border rounded px-4 py-2"
              placeholder="Type"
              name="type"
              value={formik.values.type}
              onChange={formik.handleChange}
              required
            />
          </div>

          {/* Division, Start Month, End Month */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <select
              className="border rounded px-4 py-2"
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              required
            >
              <option value="Div 1">Div 1</option>
              <option value="Div 2">Div 2</option>
            </select>

            <input
              className="border rounded px-4 py-2"
              placeholder="Start Month"
              name="startMonth"
              value={formik.values.startMonth}
              onChange={formik.handleChange}
              required
            />
            <input
              className="border rounded px-4 py-2"
              placeholder="End Month"
              name="endMonth"
              value={formik.values.endMonth}
              onChange={formik.handleChange}
              required
            />
          </div>

          {/* Existing Sessions */}
          {formik.values.sessions.map((session: any, index: number) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-2"
            >
              <input
                className="border rounded px-4 py-2"
                value={session.day}
                disabled
              />
              <input
                className="border rounded px-4 py-2"
                value={session.startTime}
                disabled
              />
              <input
                className="border rounded px-4 py-2"
                value={session.endTime}
                disabled
              />
              <button
                type="button"
                className="border border-red-500 text-red-500 px-4 py-2 rounded"
                onClick={() => handleRemoveSession(index)}
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Session */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <select
              className="border rounded px-4 py-2"
              value={formik.values.newSession.day}
              onChange={(e) =>
                formik.setFieldValue('newSession', {
                  ...formik.values.newSession,
                  day: e.target.value
                })
              }
            >
              <option value="">Select Day</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              className="border rounded px-4 py-2"
              placeholder="Start Time"
              type="time"
              value={formik.values.newSession.startTime}
              onChange={(e) =>
                formik.setFieldValue('newSession', {
                  ...formik.values.newSession,
                  startTime: e.target.value
                })
              }
            />
            <input
              className="border rounded px-4 py-2"
              placeholder="End Time"
              type="time"
              value={formik.values.newSession.endTime}
              onChange={(e) =>
                formik.setFieldValue('newSession', {
                  ...formik.values.newSession,
                  endTime: e.target.value
                })
              }
            />
            <button
              type="button"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={handleAddSession}
            >
              Add
            </button>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingItem ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateSessionModal;