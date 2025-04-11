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
  const { user} = useUserStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if ( !user) {
      router.push('/main/dashboard');
      router.refresh();
    }
  }, [user, router, isInitialized]);

  if ( !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed h-full w-[250px]">
        <Sidebar  />
      </div>
      
      {/* Main content area */}
      <div className="flex-1 ml-[250px]">
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