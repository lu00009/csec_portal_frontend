'use client';

import LoginForm from '@/components/form/LoginForm';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { user, login, isLoading, error } = useUserStore();

  useEffect(() => {
    if (user) {
      console.log('User state:', user); // Debug log
      toast.success('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/main/dashboard');
      }, 1500);
    }
  }, [user, router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      console.log('Attempting login...'); // Debug log
      const success = await login(values.email, values.password);
      if (!success) {
        toast.error(error || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Logoipsum</h1>
          <h2 className="text-xl font-medium text-gray-600">Welcome 👋</h2>
          <p className="mt-2 text-sm text-gray-600">Please login here</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        {/* Temporary debug button */}
        <button 
          onClick={() => console.log('Current user state:', useUserStore.getState().user)}
          className="mt-4 text-xs text-gray-500"
        >
        </button>
      </div>
    </div>
  );
}
