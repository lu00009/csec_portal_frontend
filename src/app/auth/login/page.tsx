'use client';

import LoginForm from '@/components/form/LoginForm';
import { useUserStore } from '@/stores/userStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import toast from 'react-hot-toast';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading, error, isAuthenticated } = useUserStore();
  
  useEffect(() => {
    if (isAuthenticated) {
      const callbackUrl = searchParams.get('callbackUrl');
      if (callbackUrl) {
        // Remove any query parameters from the callback URL
        const cleanUrl = callbackUrl.split('?')[0];
        const decodedUrl = decodeURIComponent(cleanUrl);
        router.replace(decodedUrl);
      } else {
        router.replace('/main/dashboard');
      }
    }
  }, [isAuthenticated, router, searchParams]);

  const handleSubmit = async (values: { email: string; password: string; rememberMe: boolean }) => {
    try {
      const success = await login(values.email, values.password, values.rememberMe);
      
      if (success) {
        toast.success('Login successful! Redirecting...');
        const callbackUrl = searchParams.get('callbackUrl');
        if (callbackUrl) {
          // Remove any query parameters from the callback URL
          const cleanUrl = callbackUrl.split('?')[0];
          const decodedUrl = decodeURIComponent(cleanUrl);
          router.replace(decodedUrl);
        } else {
          router.replace('/main/dashboard');
        }
      } else {
        toast.error(error || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error(error || 'Login failed');
    }
  };

  // Prevent flash of login page when authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md dark:border dark:border-gray-700 dark:shadow-xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">CSEC ASTU</h1>
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-300">Welcome 👋</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Please login here</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}