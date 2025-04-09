// components/members/EditMemberForm.tsx
'use client';

import { Member } from '@/types/member';
import { useFormik } from 'formik';
import { FiX } from 'react-icons/fi';

interface EditMemberFormProps {
  member: Member;
  onSave: (updates: Partial<Member>) => Promise<void>;
  onClose: () => void;
}

const statusOptions = ['Active', 'Inactive', 'Needs Attention'];
const campusStatusOptions = ['On Campus', 'Off Campus', 'Withdrawn'];

export default function EditMemberForm({ member, onSave, onClose }: EditMemberFormProps) {
  const formik = useFormik({
    initialValues: {
      attendance: member.attendance,
      status: member.attendance,
      email: member.email,
      campusStatus: member.campusStatus,
      division: member.division,
      group: member.group
    },
    onSubmit: async (values) => {
      try {
        await onSave(values);
        onClose();
      } catch (error) {
        console.error('Failed to update member:', error);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-white/15 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-[400px] border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attendance</label>
            <input
              type="text"
              name="attendance"
              value={formik.values.attendance}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 41h"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Campus Status</label>
            <select
              name="campusStatus"
              value={formik.values.campusStatus}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {campusStatusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
            <input
              type="text"
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <input
              type="text"
              name="group"
              value={formik.values.group}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}