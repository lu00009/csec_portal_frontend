'use client';
import Attendance from '@/components/profile/attendance';
import HeadsUp from '@/components/profile/headsup';
import OptionalInfo from '@/components/profile/optionalinfo';
import Progress from '@/components/profile/progress';
import RequiredInfo from '@/components/profile/requiredinfo';
import Resources from '@/components/profile/resources';
import ProfileHeader from '@/components/profile/header';

import { useUserStore } from '@/stores/userStore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import {
  FiUser as FiProfile,
  FiInfo as FiRequired,
  FiBook as FiResources,
  FiArrowLeft as FiBack
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { LuClipboardList } from 'react-icons/lu';
import { MdEventAvailable, MdWorkOutline } from 'react-icons/md';

const UserProfile = () => {
  const [activeView, setActiveView] = useState<'profile' | 'attendance' | 'progress' | 'headsup'>('profile');
  const [activeTab, setActiveTab] = useState<'required' | 'optional' | 'resources'>('required');
  const [tabHistory, setTabHistory] = useState<('required' | 'optional' | 'resources')[]>(['required']);
  const [viewHistory, setViewHistory] = useState<('profile' | 'attendance' | 'progress' | 'headsup')[]>(['profile']);
  const router = useRouter();

  const { user } = useUserStore();

  const requiredData = {
    profilePicture: user?.member.profilePicture || '/placeholder.svg',
    firstName: user?.member.firstName || 'Not provided',
    lastName: user?.member.lastName || 'Not provided',
    phoneNumber: user?.member.phoneNumber || 'Not provided',
    email: user?.member.email || 'Not provided',
    department: user?.member.department || 'Not provided',
    graduation: user?.member.graduationYear || 'Not provided',
    birth: user?.member.birthDate || 'Not provided',
    gender: user?.member.gender || 'Not provided',
    telegramUsername: user?.member.telegramHandle || 'Not provided',
    joinedDate: user?.member.createdAt || 'Not provided',
  };

  const optionalData = {
    uniId: user?.member.universityId || 'Not provided',
    linkedin: user?.member.linkedinHandle || 'Not provided',
    codeforces: user?.member.codeforcesHandle || 'Not provided',
    leetcode: user?.member.leetcodeHandle || 'Not provided',
    insta: user?.member.instagramHandle || 'Not provided',
    birthdate: user?.member.birthDate || 'Not provided',
    cv: user?.member.cv || 'Not provided',
    joinedDate: user?.member.createdAt || 'Not provided',
    shortbio: user?.member.bio || 'Not provided',
  };

  const handleTabChange = (tab: 'required' | 'optional' | 'resources') => {
    setTabHistory(prev => [...prev, tab]);
    setActiveTab(tab);
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header with full width */}
      <div className="bg-white shadow-sm">
      <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg mb-4 w-full"
              >
                <FiBack className="mr-2" />
              </button>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileHeader
            fullName={`${user?.member.firstName} ${user?.member.lastName}`}
            role={user?.member.role || 'Member'}
            isOwnProfile={true}
            profilePicture={user?.member.profilePicture}
          />
        </div>
      </div>

      {/* Main content container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex">
          {/* Sidebar Navigation */}
          <div className="w-50">
            <div className="bg-white rounded-lg p-4">
              <div className="space-y-2">
                <button
                  onClick={() => handleViewChange('profile')}
                  className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                    activeView === 'profile'
                      ? 'text-white bg-[#003087]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <FiProfile className="mr-2" />
                  Profile
                </button>
                <button
                  onClick={() => handleViewChange('attendance')}
                  className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                    activeView === 'attendance'
                      ? 'text-white bg-[#003087]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <MdEventAvailable className="mr-2" />
                  My Attendance
                </button>
                <button
                  onClick={() => handleViewChange('progress')}
                  className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                    activeView === 'progress'
                      ? 'text-white bg-[#003087]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <HiOutlineDocumentText className="mr-2" />
                  My Progress
                </button>
                <button
                  onClick={() => handleViewChange('headsup')}
                  className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                    activeView === 'headsup'
                      ? 'text-white bg-[#003087]'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  <LuClipboardList className="mr-2" />
                  Heads Up
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 ml-6">
            {activeView === 'profile' ? (
              <>
                {/* Profile Tabs */}
                <div className="flex border-b border-gray-200 justify-around">
                  <button
                    onClick={() => handleTabChange('required')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'required'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FiRequired className="inline mr-2" />
                    Required Info
                  </button>
                  <button
                    onClick={() => handleTabChange('optional')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'optional'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MdWorkOutline className="inline mr-2" />
                    Optional Info
                  </button>
                  <button
                    onClick={() => handleTabChange('resources')}
                    className={`px-4 py-2 font-medium ${
                      activeTab === 'resources'
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <FiResources className="inline mr-2" />
                    Resources
                  </button>
                </div>

                {/* Profile Tab Content */}
                <div className="mt-6">
                  {activeTab === 'required' && <RequiredInfo member={requiredData} />}
                  {activeTab === 'optional' && <OptionalInfo member={optionalData} />}
                  {activeTab === 'resources' && <Resources />}
                </div>
              </>
            ) : activeView === 'attendance' ? (
              <Attendance />
            ) : activeView === 'progress' ? (
              <Progress />
            ) : (
              <HeadsUp />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;