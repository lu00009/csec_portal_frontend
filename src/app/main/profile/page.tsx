'use client';
import { useState } from 'react';
import RequiredInfo from '@/components/profile/requiredinfo';
import OptionalInfo from '@/components/profile/optionalinfo';
import Resources from '@/components/profile/resources';
import Attendance from '@/components/profile/attendance';
import Progress from '@/components/profile/progress';
import HeadsUp from '@/components/profile/headsup';
import {
  FiUser as FiProfile,
  FiCalendar as FiAttendance,
  FiTrendingUp as FiProgress,
  FiAlertCircle as FiHeadsUp,
  FiInfo as FiRequired,
  FiPlusCircle as FiOptional,
  FiBook as FiResources
} from 'react-icons/fi';

const MemberProfile = () => {
  const [activeView, setActiveView] = useState<'profile' | 'attendance' | 'progress' | 'headsup'>('profile');
  const [activeTab, setActiveTab] = useState<'required' | 'optional' | 'resources'>('required');

  return (
    <div className="bg-gray-50 min-h-screen p-6 flex">
      {/* Sidebar Navigation */}
      <div className="w-64 pr-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-4">Navigation</h3>
          <div className="space-y-2">
            <button
              onClick={() => setActiveView('profile')}
              className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                activeView === 'profile'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiProfile className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveView('attendance')}
              className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                activeView === 'attendance'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiAttendance className="mr-2" />
              Attendance
            </button>
            <button
              onClick={() => setActiveView('progress')}
              className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                activeView === 'progress'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiProgress className="mr-2" />
              Progress
            </button>
            <button
              onClick={() => setActiveView('headsup')}
              className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                activeView === 'headsup'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <FiHeadsUp className="mr-2" />
              Heads Up
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {activeView === 'profile' ? (
          <>
            {/* Profile Tabs */}
            <div className="flex border-b border-gray-200">
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
                <FiOptional className="inline mr-2" />
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
              {activeTab === 'required' && <RequiredInfo />}
              {activeTab === 'optional' && <OptionalInfo />}
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
  );
};

export default MemberProfile;