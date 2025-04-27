'use client';

import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FiX } from 'react-icons/fi';

type Resource = {
  resourceName: string;
  resourceLink: string;
  division: string;
};

type ResourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Resource) => void;
  resource: Resource | null;
  division: string | null;
  divisions: string[];
};

const validationSchema = Yup.object({
  resourceName: Yup.string().required('Resource name is required'),
  resourceLink: Yup.string().url('Enter a valid URL').required('Resource link is required'),
  division: Yup.string().required('Division is required'),
});

const ResourceModal = ({ isOpen, onClose, onSubmit, resource, division, divisions }: ResourceModalProps) => {
  const formik = useFormik({
    initialValues: {
      resourceName: resource?.resourceName || '',
      resourceLink: resource?.resourceLink || '',
      division: resource?.division || division || '',
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0  bg-opacity-30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{resource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="resourceName"
              placeholder="Resource Name"
              value={formik.values.resourceName}
              onChange={formik.handleChange}
              className="w-full border rounded px-4 py-2"
            />
            {formik.touched.resourceName && formik.errors.resourceName && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.resourceName}</div>
            )}
          </div>

          <div>
            <input
              type="text"
              name="resourceLink"
              placeholder="Resource Link"
              value={formik.values.resourceLink}
              onChange={formik.handleChange}
              className="w-full border rounded px-4 py-2"
            />
            {formik.touched.resourceLink && formik.errors.resourceLink && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.resourceLink}</div>
            )}
          </div>

          <div>
            <select
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              className="w-full border rounded px-4 py-2"
            >
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div} value={div}>
                  {div}
                </option>
              ))}
            </select>
            {formik.touched.division && formik.errors.division && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.division}</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              {resource ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;
