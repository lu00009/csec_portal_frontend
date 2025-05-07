'use client';

import { Resource } from '@/types/resource';
import { useFormik } from 'formik';
import { FiX } from 'react-icons/fi';
import * as Yup from 'yup';

// Props for ResourceModal component
type ResourceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Resource, '_id' | '__v'>) => void;
  currentResource: Resource | null;
  currentDivision: string | null;
  divisions: string[];
};

// Define validation schema
const validationSchema = Yup.object({
  resourceName: Yup.string().required('Resource name is required'),
  resourceLink: Yup.string().url('Enter a valid URL').required('Resource link is required'),
  division: Yup.string().required('Division is required'),
});

const ResourceModal = ({ isOpen, onClose, onSubmit, currentResource, currentDivision, divisions }: ResourceModalProps) => {
  // Initialize Formik with validation
  const formik = useFormik({
    initialValues: {
      resourceName: currentResource?.resourceName || '',
      resourceLink: currentResource?.resourceLink || '',
      division: currentResource?.division || currentDivision || '',
    },
    enableReinitialize: true,
    validationSchema,  
    onSubmit: (values) => {
      onSubmit(values);
      onClose();
    },
  });

  // Return null if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/50"></div>
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md z-10 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">{currentResource ? 'Edit Resource' : 'Add Resource'}</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 transition-colors"
          >
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
              className="w-full border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            {formik.touched.resourceName && formik.errors.resourceName && (
              <div className="text-red-500 dark:text-red-400 text-sm mt-1">{formik.errors.resourceName}</div>
            )}
          </div>

          <div>
            <input
              type="text"
              name="resourceLink"
              placeholder="Resource Link"
              value={formik.values.resourceLink}
              onChange={formik.handleChange}
              className="w-full border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            {formik.touched.resourceLink && formik.errors.resourceLink && (
              <div className="text-red-500 dark:text-red-400 text-sm mt-1">{formik.errors.resourceLink}</div>
            )}
          </div>

          <div>
            <select
              name="division"
              value={formik.values.division}
              onChange={formik.handleChange}
              className="w-full border rounded px-4 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="" className="dark:bg-gray-700">Select Division</option>
              {divisions.map((div) => (
                <option key={div} value={div} className="dark:bg-gray-700">
                  {div}
                </option>
              ))}
            </select>
            {formik.touched.division && formik.errors.division && (
              <div className="text-red-500 dark:text-red-400 text-sm mt-1">{formik.errors.division}</div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="border px-4 py-2 rounded dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            >
              {currentResource ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResourceModal;
