// app/(main)/layout.tsx
'use client';
import LoadingSpinner from '@/components/LoadingSpinner';
import Sidebar from '@/components/layouts/Sidebar';
import TopHeader from '@/components/layouts/TopHeader';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const {
    user,
    isInitialized,
    isAuthenticated,
    isLoading,
    initialize
  } = useUserStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize().finally(() => setIsCheckingAuth(false));
    } else {
      setIsCheckingAuth(false);
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (!isCheckingAuth && !isLoading && !isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isCheckingAuth, isLoading, isAuthenticated, router]);

  if (isCheckingAuth || (!isInitialized && isLoading)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoadingSpinner />
        <p className="mt-4 text-gray-500">Initializing application...</p>
      </div>
    );
  }

  if (isAuthenticated() && user) {
    return (
      <div className="flex min-h-screen">
        <div className="fixed h-full w-[250px]">
          <Sidebar user={user} />
        </div>
        
        <div className="flex-1 ml-[250px]">
          <div className="sticky top-0 z-10">
            <TopHeader user={user} />
          </div>
          
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return null;
}