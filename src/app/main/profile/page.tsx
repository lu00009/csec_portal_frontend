'use client';
import Attendance from '@/components/profile/attendance';
import HeadsUp from '@/components/profile/headsup';
import OptionalInfo from '@/components/profile/optionalinfo';
import Progress from '@/components/profile/progress';
import RequiredInfo from '@/components/profile/requiredinfo';
import Resources from '@/components/profile/resources';
import { useUserStore } from '@/stores/userStore';
import { useEffect, useState } from 'react';
import {
  FiUser as FiProfile,
  FiInfo as FiRequired,
  FiBook as FiResources
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { LuClipboardList } from 'react-icons/lu';
import { MdEventAvailable, MdWorkOutline } from 'react-icons/md';

const UserProfile = () => {
  const [activeView, setActiveView] = useState<'profile' | 'attendance' | 'progress' | 'headsup'>('profile');
  const [activeTab, setActiveTab] = useState<'required' | 'optional' | 'resources'>('required');
  const { user, fetchUserById } = useUserStore();

  // Always fetch the logged-in user's data
  useEffect(() => {
    if (user?._id) {
      fetchUserById(user._id);
    }
  }, [fetchUserById, user?._id]);


  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* Sidebar Navigation */}
      <div className="w-50">
        <div className="bg-white rounded-lg p-4">
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                activeView === 'profile'
                  ? 'text-white bg-[#003087]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiProfile className="mr-2" />
              My Profile
            </button>
            <button
              onClick={() => setActiveView('attendance')}
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
              onClick={() => setActiveView('progress')}
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
              onClick={() => setActiveView('headsup')}
              className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                activeView === 'headsup'
                  ? 'text-white bg-[#003087] font-bold'
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
      <div className="flex-1">
        {activeView === 'profile' ? (
          <>
            {/* Profile Header */}
            <div className="bg-white p-6 shadow-sm">
              <div className="flex items-center">
                <div className="bg-gray-200 rounded-full h-16 w-16 flex items-center justify-center">
                  <span className="text-2xl text-gray-600">
                    {user?.firstName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-gray-800">{user?.firstName || 'My Profile'}</h2>
                  <p className="text-sm text-gray-600">
                    {user?.clubRole ? `${user.clubRole.charAt(0).toUpperCase()}${user.clubRole.slice(1)}` : 'Member'}
                    {user?.division && ` • ${user.division}`}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex border-b border-gray-200 justify-around">
              <button
                onClick={() => setActiveTab('required')}
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
                onClick={() => setActiveTab('optional')}
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
                onClick={() => setActiveTab('resources')}
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
              {activeTab === 'required' && <RequiredInfo user={user} />}
              {activeTab === 'optional' && <OptionalInfo user={user} />}
              {activeTab === 'resources' && <Resources user={user} />}
            </div>
          </>
        ) : activeView === 'attendance' ? (
          <Attendance user={user?._id} />
        ) : activeView === 'progress' ? (
          <Progress user={user} />
        ) : (
          <HeadsUp user={user} />
        )} 
      </div>
    </div>
  );
};

export default UserProfile;