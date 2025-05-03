'use client';

import LoginForm from '@/components/form/LoginForm';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, initialize } = useUserStore();
  
  useEffect(() => {
    // Initialize auth state when component mounts
    initialize();
    
    // Redirect if already authenticated
    if (isAuthenticated()) {
      router.push('/main/dashboard');
    }
  }, [initialize, isAuthenticated, router]);

  const handleSubmit = async (values: { email: string; password: string; rememberMe: boolean }) => {
    try {
      const success = await login(values.email, values.password, values.rememberMe);
      if (success) {
        toast.success('Login successful! Redirecting...');
        router.push('/main/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (err) {
      toast.error('Login failed');
    }
  };

  if (isAuthenticated()) {
    return null; // Prevent flash of login page
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
      <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-4 mb-4">
        <p className="text-red-700 dark:text-red-300">{error}</p>
      </div>
    )}

    <LoginForm 
      onSubmit={handleSubmit} 
      isLoading={isLoading}
      // Add dark mode props if your LoginForm has custom components
    />
  </div>
</div>
  );
}