'use client';

import { Member } from '@/types/member';
import { useFormik } from 'formik';
import { FiX } from 'react-icons/fi';

interface EditMemberFormProps {
  member: Member;
  onSave: (updates: Partial<Member>) => Promise<void>;
  onClose: () => void;
  divisions: string[];
  groups: string[];
}

const statusOptions = ['Active', 'Inactive', 'Pending'];

export default function EditMemberForm({ 
  member, 
  onSave, 
  onClose,
  divisions,
  groups 
}: EditMemberFormProps) {
  const formik = useFormik({
    initialValues: {
      email: member.email,
      division: member.division,
    //   group: member.group,
      status: member.status,
      clubRole: member.clubRole
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
      <div className="bg-white rounded-lg w-[400px] border border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Edit Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
            <select
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              name="group"
            //   value={formik.values.group}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Club Role</label>
            <select
              name="clubRole"
              value={formik.values.clubRole}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option value="Member">Member</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Leader">Leader</option>
            </select>
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