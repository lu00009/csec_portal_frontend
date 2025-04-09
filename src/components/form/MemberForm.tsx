'use client';

import { memberSchema } from '@/lib/memberValidation';
import { Member } from '@/types/member';
import { useFormik } from 'formik';
import { useState } from 'react';
import { FiX } from 'react-icons/fi';

interface MemberFormProps {
  onSave: (member: Omit<Member, 'id'>) => void;
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
    onSubmit: (values) => {
      onSave({
        name: values.email.split('@')[0],
        email: values.email,
        division: values.division,
        group: values.group,
        memberId: `MEM-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        password: values.password,
        attendance: 'Active',
        year: '1st',
        campusStatus: 'On Campus',
        role:'president'
      });
    },
  });

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    formik.setFieldValue('password', password);
  };

  return (
    <div className="fixed inset-0 bg-white/15 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg  w-[383px] h-[592px] max-w-md border border-gray-200">
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option className='text-gray-300' value=""></option>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option className='text-gray-300' value=""></option>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="member@example.com"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <button
                type="button"
                onClick={generatePassword}
                className="text-sm text-white hover:text-blue-800 bg-blue-900 hover:bg-blue-700 rounded-md px-2 py-1"
              > Generate
              </button>
            </div>
            <input
              type="text"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Password"
              readOnly
            />
            {generatedPassword && (
              <div className="mt-2 text-sm text-gray-500">
                Generated Password: {generatedPassword}
              </div>
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