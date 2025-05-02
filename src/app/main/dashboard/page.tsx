'use client';

import AttendanceOverview from "@/components/home/attendanceOverview";
import CalendarSidebar from "@/components/home/CalendarSidebar";
import StatsPage from "@/components/home/statsCard";
import UpcomingEvent from "@/components/home/UpcomingEvent";
import LoadingSpinner from '@/components/LoadingSpinner'; // Create this component
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, initialize, isInitialized } = useUserStore();

  useEffect(() => {
    // Initialize authentication state
    initialize();
    
    // Redirect if not authenticated after initialization
    if (isInitialized && !isAuthenticated()) {
      router.replace('/auth/login');
    }
  }, [initialize, isAuthenticated, isInitialized, router]);

  // Show loading state while checking authentication
  if (!isInitialized || !isAuthenticated()) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner  />
        <p className="ml-2 text-gray-600">Verifying session...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Main content area */}
      <div className="flex-1 w-[800px] h-[50px]">
        <UpcomingEvent />
        <StatsPage />
        <AttendanceOverview />
        <div className="absolute right-0 top-20 h-full w-[300px] bg-white shadow-sm border-l border-gray-200 overflow-y-auto">
          <CalendarSidebar />
        </div>
      </div>
    </div>
  );
}