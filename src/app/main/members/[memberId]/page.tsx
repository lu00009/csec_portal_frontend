'use client';
import LoadingSpinner from '@/components/LoadingSpinner';
import Attendance from '@/components/profile/attendance';
import ProfileHeader from '@/components/profile/header';
import HeadsUp from '@/components/profile/headsup';
import OptionalInfo from '@/components/profile/optionalinfo';
import Progress from '@/components/profile/progress';
import RequiredInfo from '@/components/profile/requiredinfo';
import Resources from '@/components/profile/resources';
import { useUserStore } from '@/stores/userStore';
import { Member } from '@/types/member';
import React, { useEffect, useState } from 'react';
import { FiUser as FiProfile, FiInfo as FiRequired, FiBook as FiResources } from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { LuClipboardList } from 'react-icons/lu';
import { MdEventAvailable, MdWorkOutline } from 'react-icons/md';

type PageParams = {
  memberId: string;
};

const MemberProfilePage = ({ params }: { params: PageParams }) => {
  const { memberId } = React.use(params);
  
  const [activeView, setActiveView] = useState<'profile' | 'attendance' | 'progress' | 'headsup'>('profile');
  const [activeTab, setActiveTab] = useState<'required' | 'optional' | 'resources'>('required');
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserStore();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
  
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        if (!memberId || memberId === 'undefined') {
          throw new Error('Invalid member ID');
        }

        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/members/${memberId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useUserStore.getState().token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
        }

        const memberData = await res.json();
        setMember(memberData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load member data');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId, user?.member.refreshToken]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex">
        <div className="w-50 bg-white dark:bg-gray-800 p-4"></div>
        <div className="flex-1 p-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error Loading Profile</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex">
        <div className="w-50 bg-white dark:bg-gray-800 p-4"></div>
        <div className="flex-1 p-4">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Member Not Found</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">The requested member does not exist.</p>
          </div>
        </div>
      </div>
    );
  }

  const requiredData = {
    firstName: member.member.firstName || 'Not provided',
    lastName: member.member.lastName || 'Not provided',
    phoneNumber: member.member.phoneNumber || 'Not provided',
    email: member.member.email || 'Not provided',
    department: member.member.division || 'Not provided',
    graduation: member.member.graduationYear || 'Not provided',
    birth: member.member.birthDate || 'Not provided',
    gender: member.member.gender || 'Not provided',
    telegramUsername: member.member.telegramHandle || 'Not provided',
    joinedDate: member.member.createdAt || 'Not provided',
    avatar: member.member.avatar || '', // Add avatar field
  };

  const optionalData = {
    uniId: member.member.universityId || 'Not provided',
    linkedin: member.member.linkedinHandle || 'Not provided',
    codeforces: member.member.codeforcesHandle || 'Not provided',
    leetcode: member.member.leetcodeHandle || 'Not provided',
    insta: member.member.instagramHandle || 'Not provided',
    birthdate: member.member.birthDate || 'Not provided',
    cv: member.member.cv || 'Not provided',
    joinedDate: member.member.createdAt || 'Not provided',
    shortbio: member.member.bio || 'Not provided',
  };

  const resourcesData = {
    resources: Array.isArray(user?.member?.resources) ? user.member.resources : [],
  }

  return (
    <>
      <ProfileHeader
        fullName={`${member?.member.firstName} ${member.member.lastName}`}
        role={member.member.role || 'Member'}
        isOwnProfile={false}
        profilePicture={member.member.profilePicture}
        id={member.member._id}
      />
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex">
        <div className="w-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <div className="space-y-2">
              <button 
                onClick={() => setActiveView('profile')} 
                className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                  activeView === 'profile' 
                    ? 'text-white bg-[#003087] dark:bg-blue-900' 
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <FiProfile className="mr-2" />
                Profile
              </button>
              <button 
                onClick={() => setActiveView('attendance')} 
                className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                  activeView === 'attendance' 
                    ? 'text-white bg-[#003087] dark:bg-blue-900' 
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <MdEventAvailable className="mr-2" />
                Attendance
              </button>
              <button 
                onClick={() => setActiveView('progress')} 
                className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                  activeView === 'progress' 
                    ? 'text-white bg-[#003087] dark:bg-blue-900' 
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <HiOutlineDocumentText className="mr-2" />
                Progress
              </button>
              <button 
                onClick={() => setActiveView('headsup')} 
                className={`w-full flex items-center px-4 py-2 font-medium rounded-lg ${
                  activeView === 'headsup' 
                    ? 'text-white bg-[#003087] dark:bg-blue-900 font-bold' 
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                <LuClipboardList className="mr-2" />
                Heads Up
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1">
          {activeView === 'profile' ? (
            <>
              <div className="flex border-b border-gray-200 dark:border-gray-700 justify-around">
                <button 
                  onClick={() => setActiveTab('required')} 
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'required' 
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <FiRequired className="inline mr-2" />
                  Required Info
                </button>
                <button 
                  onClick={() => setActiveTab('optional')} 
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'optional' 
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <MdWorkOutline className="inline mr-2" />
                  Optional Info
                </button>
                <button 
                  onClick={() => setActiveTab('resources')} 
                  className={`px-4 py-2 font-medium ${
                    activeTab === 'resources' 
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100'
                  }`}
                >
                  <FiResources className="inline mr-2" />
                  Resources
                </button>
              </div>

              <div className="mt-6">
                {activeTab === 'required' && <RequiredInfo member={requiredData} />}
                {activeTab === 'optional' && <OptionalInfo member={optionalData} />}
                {activeTab === 'resources' && <Resources id={member.member._id} />}
              </div>
            </>
          ) : activeView === 'attendance' ? (
            <Attendance id={member.member._id} />
          ) : activeView === 'progress' ? (
            <Progress id={member.member._id} />
          ) : (
            <HeadsUp id={member.member._id} />
          )}
        </div>
      </div>
    </>
  );
};

export default MemberProfilePage;