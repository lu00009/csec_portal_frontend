'use client';
import Attendance from '@/components/profile/attendance';
import ProfileHeader from '@/components/profile/header';
import HeadsUp from '@/components/profile/headsup';
import OptionalInfo from '@/components/profile/optionalinfo';
import Progress from '@/components/profile/progress';
import RequiredInfo from '@/components/profile/requiredinfo';

import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  FiArrowLeft as FiBack,
  FiBell,
  FiCalendar,
  FiInfo,
  FiInfo as FiRequired,
  FiTrendingUp,
  FiUser
} from 'react-icons/fi';


const UserProfile = () => {
  const [activeView, setActiveView] = useState<'profile' | 'attendance' | 'progress' | 'headsup'>('profile');
  const [activeTab, setActiveTab] = useState<'required' | 'optional'>('required');
  const [tabHistory, setTabHistory] = useState<('required' | 'optional')[]>(['required']);
  const [viewHistory, setViewHistory] = useState<('profile' | 'attendance' | 'progress' | 'headsup')[]>(['profile']);
  const router = useRouter();

  const { user } = useUserStore();

  const requiredData = {
    profilePicture: user?.member?.profilePicture?.toString() || `https://robohash.org/${user?.member?._id}?set=set3`,
    firstName: user?.member?.firstName || 'Not provided',
    lastName: user?.member?.lastName || 'Not provided',
    phoneNumber: user?.member?.phoneNumber || 'Not provided',
    email: user?.member?.email || 'Not provided',
    department: user?.member?.department || 'Not provided',
    graduation: user?.member?.graduationYear || 'Not provided',
    birth: user?.member?.birthDate || 'Not provided',
    gender: user?.member?.gender || 'Not provided',
    telegramUsername: user?.member?.telegramHandle || 'Not provided',
    joinedDate: user?.member?.createdAt || 'Not provided',
  };

  const optionalData = {
    uniId: user?.member?.universityId || 'Not provided',
    linkedin: user?.member?.linkedinHandle || 'Not provided',
    codeforces: user?.member?.codeforcesHandle || 'Not provided',
    leetcode: user?.member?.leetcodeHandle || 'Not provided',
    insta: user?.member?.instagramHandle || 'Not provided',
    birthdate: user?.member?.birthDate || 'Not provided',
    cv: user?.member?.cv || 'Not provided',
    joinedDate: user?.member?.createdAt || 'Not provided',
    shortbio: user?.member?.bio || 'Not provided',
  };
  

  const handleTabChange = (tab: 'required' | 'optional') => {
    setActiveTab(tab);
    setTabHistory(prev => [...prev, tab]);
  };

  const handleViewChange = (view: 'profile' | 'attendance' | 'progress' | 'headsup') => {
    setViewHistory(prev => [...prev, view]);
    setActiveView(view);
    // Reset tab history when switching views
    if (view === 'profile') {
      setTabHistory(['required']);
    }
  };

  const handleBack = () => {
    if (activeView === 'profile') {
      // Handle back for tabs within profile view
      if (tabHistory.length > 1) {
        const newHistory = [...tabHistory];
        newHistory.pop(); // Remove current tab
        setTabHistory(newHistory);
        setActiveTab(newHistory[newHistory.length - 1]);
      } else {
        // If no more tab history, go back to previous page
        router.back();
      }
    } else {
      // Handle back for views
      if (viewHistory.length > 1) {
        const newHistory = [...viewHistory];
        newHistory.pop(); // Remove current view
        setViewHistory(newHistory);
        setActiveView(newHistory[newHistory.length - 1]);
      } else {
        // If no more view history, go back to profile view
        setActiveView('profile');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow dark:shadow-lg">
          {/* Sticky header with constrained width */}
          <div className="bg-white dark:bg-gray-800 shadow-sm dark:shadow-gray-900/30 sticky top-[64px] z-[5]">
            <div className="px-6">
              <div className="flex items-center justify-between py-4">
                {/* Back button with proper alignment */}
                <button
                  onClick={handleBack}
                  className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-200"
                >
                  <FiBack className="mr-2 text-lg" />
                  <span className="text-sm font-medium">Back</span>
                </button>
              </div>
              
              {/* Profile header with better vertical spacing */}
              <div className="pb-6 pt-4">
                <ProfileHeader
                  fullName={`${user?.member?.firstName} ${user?.member?.lastName}`}
                  role={user?.member?.clubRole || 'Member'}
                  isOwnProfile={true}
                  profilePicture={
                    user?.member?.profilePicture
                      ? user.member.profilePicture.toString()
                      : `https://robohash.org/${user?.member?._id}?set=set3`
                  }
                  id={user?.member?._id || ''}
                  lastSeen={user?.member?.lastSeen || new Date().toISOString()}
                />
              </div>

              {/* Navigation buttons */}
              <div className="flex space-x-4 border-b dark:border-gray-700 pb-4">
                <button
                  onClick={() => handleViewChange('profile')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === 'profile'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <FiUser className="mr-2" />
                  <span className="text-sm font-medium">Profile</span>
                </button>
                <button
                  onClick={() => handleViewChange('attendance')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === 'attendance'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <FiCalendar className="mr-2" />
                  <span className="text-sm font-medium">Attendance</span>
                </button>
                <button
                  onClick={() => handleViewChange('progress')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === 'progress'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <FiTrendingUp className="mr-2" />
                  <span className="text-sm font-medium">Progress</span>
                </button>
                <button
                  onClick={() => handleViewChange('headsup')}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeView === 'headsup'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <FiBell className="mr-2" />
                  <span className="text-sm font-medium">Heads Up</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {activeView === 'profile' ? (
              <>
                <div className="flex space-x-4 border-b dark:border-gray-700">
                  <button
                    onClick={() => handleTabChange('required')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'required'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiRequired className="inline mr-2" />
                    Required Information
                  </button>
                  <button
                    onClick={() => handleTabChange('optional')}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeTab === 'optional'
                        ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    <FiInfo className="inline mr-2" />
                    Optional Information
                  </button>
                </div>

                {/* Profile Tab Content */}
                <div className="mt-6">
                  {activeTab === 'required' && <RequiredInfo member={requiredData} />}
                  {activeTab === 'optional' && <OptionalInfo member={optionalData} />}
                </div>
              </>
            ) : activeView === 'attendance' ? (
              <Attendance id={user?.member?._id || ''} />
            ) : activeView === 'progress' ? (
              <Progress id={user?.member?._id || ''} />
            ) : (
              <HeadsUp id={user?.member?._id || ''} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;