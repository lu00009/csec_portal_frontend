// components/forms/LoginForm.tsx
'use client';

import { loginValidation } from '@/lib/loginValidation';
import { Field, Form, Formik } from 'formik';
import { FiLock, FiMail } from 'react-icons/fi';


interface LoginFormProps {

export interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => void;
  isLoading: boolean;

  initialValues?: {
    email: string;
    password: string;
    rememberMe: boolean;
  };

  onSubmit: (values: any) => void;

}

export const LoginForm = ({
  initialValues = {
    email: '',
    password: '',
    rememberMe: false
  },
  onSubmit
}: LoginFormProps) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={loginValidation}
      onSubmit={onSubmit}
    >
      {({ errors, touched }) => (
        <Form className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  name="email"
                  type="email"
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.email && touched.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <Field
                  name="password"
                  type="password"
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.password && touched.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                />
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <Field
              name="rememberMe"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
              Remember Me
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
export default LoginForm;