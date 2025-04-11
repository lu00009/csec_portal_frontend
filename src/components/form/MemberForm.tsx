'use client';

import { memberSchema } from '@/lib/memberValidation';
import { Member } from '@/types/member';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface MemberFormProps {
  onSave: (member: Omit<Member, '_id' | 'createdAt'>) => Promise<void>;
  onClose: () => void;
  divisions: string[];
  groups: string[];
}

export default function MemberForm({ onSave, onClose, divisions, groups }: MemberFormProps) {
  const [generatedPassword, setGeneratedPassword] = useState('');

  const formik = useFormik({
    initialValues: {
      email: '',
      division: '',
      group: '',
      password: ''
    },
    validationSchema: memberSchema,
    onSubmit: async (values) => {
      // Extract first name from email for basic profile
      const emailParts = values.email.split('@');
      const firstName = emailParts[0] || 'New';
      
      await onSave({
        firstName: firstName,
        lastName: 'Member', // Default last name
        email: values.email,
        division: values.division,
        // group: values.group,
        member_id: `ugr/${Math.floor(10000 + Math.random() * 90000)}/22`,
        status: 'Active',
        year: '1st year',
        clubRole: 'Member',
        profilePicture: 'Dummy Picture',
        // password: values.password,
        // Other fields will be added by members later
        middleName: '',
        telegramUsername: '',
        phoneNumber: '',
        divisionRole: ''
      });
    },
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    formik.setFieldValue('password', password);
  };

  return (
    <div className="fixed inset-0 bg-white/15 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-[383px] max-w-md border border-gray-200">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold">Add New Member</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Division</label>
            <select
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select Division</option>
              {divisions.map((division) => (
                <option key={division} value={division}>{division}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Group</label>
            <select
              name="group"
              value={formik.values.group}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select Group</option>
              {groups.map((group) => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter Email</label>
            <input
              type="email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="member@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-sm text-white bg-blue-900 hover:bg-blue-700 rounded-md px-2 py-1"
              >
                Generate
              </button>
            </div>
            <input
              type="text"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2"
              placeholder="Click generate to create password"
              readOnly
              required
            />
            {generatedPassword && (
              <p className="text-xs text-gray-500 mt-1">
                Generated password: {generatedPassword}
              </p>
            )}
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
              className="px-4 py-2 bg-blue-900 text-white rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}