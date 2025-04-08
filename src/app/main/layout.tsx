// app/(main)/layout.tsx
'use client';

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
  const { user, initialize } = useUserStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initialize();
    setIsInitialized(true);
  }, [initialize]);

  useEffect(() => {
    if (isInitialized && !user) {
      router.push('/login');
    }
  }, [user, router, isInitialized]);

  if (!isInitialized || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - Fixed width */}
      <div className="fixed h-full">
        <Sidebar role={user.role} />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 ml-[250px]"> {/* Adjust margin to match sidebar width */}
        {/* Top Header - Sticky positioned */}
        <div className="sticky top-0 z-10">
          <TopHeader />
        </div>
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}