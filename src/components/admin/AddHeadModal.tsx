'use client';

import useMembersStore from '@/stores/membersStore';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';

interface HeadFormValues {
  firstName: string;
  lastName: string;
  email: string;
  division: string;
  clubRole: string;
}

interface AddHeadModalProps {
  onClose: () => void;
  initialData?: HeadFormValues | null;
  isEdit?: boolean;
}

export default function HeadFormModal({ onClose, initialData, isEdit = false }: AddHeadModalProps) {
  const router = useRouter();
  const { addHead, updateHead } = useMembersStore();
  const [initialValues, setInitialValues] = useState<HeadFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    division: '',
    clubRole: '',
  });

  // Set initial values when initialData changes
  useEffect(() => {
    if (initialData) {
      setInitialValues(initialData);
    }
  }, [initialData]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Required'),
    lastName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    division: Yup.string().required('Required'),
    clubRole: Yup.string().required('Required'),
  });

  const handleSubmit = async (values: HeadFormValues) => {
    try {
      if (isEdit && initialData) {
        // For edit mode, we need to include the ID (assuming it's in initialData)
        await updateHead({ ...values, _id: (initialData as any)._id });
      } else {
        await addHead(values);
      }
      onClose();
      router.refresh();
    } catch (error) {
      console.error(`Failed to ${isEdit ? 'update' : 'add'} head:`, error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">
          {isEdit ? 'Edit Head' : 'Add Head'}
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <Field
                  name="firstName"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <Field
                  name="lastName"
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="division" className="block text-sm font-medium text-gray-700">
                  Division
                </label>
                <Field
                  name="division"
                  as="select"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select division</option>
                  <option value="CPD">CPD</option>
                  <option value="Development">Development</option>
                  <option value="Cyber">Cyber</option>
                  <option value="Data Science">Data Science</option>
                </Field>
                <ErrorMessage name="division" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="clubRole" className="block text-sm font-medium text-gray-700">
                  Club Role
                </label>
                <Field
                  name="clubRole"
                  as="select"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a role</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Head">Head</option>
                </Field>
                <ErrorMessage name="clubRole" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Processing...'
                  ) : isEdit ? (
                    'Update Head'
                  ) : (
                    'Add Head'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}