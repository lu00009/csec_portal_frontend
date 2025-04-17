// app/members/[memberId]/page.tsx
'use client';
import React from 'react';
import LoadingSpinner from '@/components/LoadingSpinner';
import Attendance from '@/components/profile/attendance';
import ProfileHeader from '@/components/profile/header';
import HeadsUp from '@/components/profile/headsup';
import OptionalInfo from '@/components/profile/optionalinfo';
import Progress from '@/components/profile/progress';
import RequiredInfo from '@/components/profile/requiredinfo';
import Resources from '@/components/profile/resources';
import { useUserStore } from '@/stores/userStore';
import { use, useEffect, useState } from 'react';
import {
  FiUser as FiProfile,
  FiInfo as FiRequired,
  FiBook as FiResources
} from 'react-icons/fi';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { LuClipboardList } from 'react-icons/lu';
import { MdEventAvailable, MdWorkOutline } from 'react-icons/md';

interface Member {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  division: string;
  year: string;
  telegramUsername: string;
  createdAt: string;
  universityId?: string;
  linkedin?: string;
  codeforces?: string;
  leetcode?: string;
  instagram?: string;
  birthDate?: string;
  cvUrl?: string;
  bio?: string;
  gender?: string;
}


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
            'Authorization': `Bearer ${useUserStore.getState().refreshToken}`,
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
  }, [memberId, user?.refreshToken]);

  console.log('refresh token:', user?.refreshToken);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <div className="w-50 bg-white p-4"></div>
        <div className="flex-1 p-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-red-600">Error Loading Profile</h2>
            <p className="mt-2 text-gray-600">{error}</p>
            <div className="mt-4 p-3 bg-gray-100 rounded text-sm">
              <p>Member ID attempted: {memberId}</p>
              <p>Endpoint: {`${API_BASE_URL}/members/${memberId}`}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="bg-gray-50 min-h-screen flex">
        <div className="w-50 bg-white p-4"></div>
        <div className="flex-1 p-4">
          <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold text-red-600">Member Not Found</h2>
            <p className="mt-2 text-gray-600">The requested member does not exist.</p>
          </div>
        </div>
      </div>
    );
  } 

  const requiredData = {
    firstName: member.firstName || 'Not provided',
    lastName: member.lastName || 'Not provided',
    phoneNumber: member.phoneNumber || 'Not provided',
    email: member.email || 'Not provided',
    department: member.division || 'Not provided',
    graduation: member.year || 'Not provided',
    birth: member.birthDate || 'Not provided',
    gender: member.gender || 'Not provided',
    telegramUsername: member.telegramUsername || 'Not provided',
    joinedDate: member.createdAt || 'Not provided',
  };

  const optionalData = {
    uniId: member.universityId || 'Not provided',
    linkedin: member.linkedin || 'Not provided',
    codeforces: member.codeforces || 'Not provided',
    leetcode: member.leetcode || 'Not provided',
    insta: member.instagram || 'Not provided',
    birthdate: member.birthDate || 'Not provided',
    cv: member.cvUrl || 'Not provided',
    joinedDate: member.createdAt || 'Not provided',
    shortbio: member.bio || 'Not provided',
  };

  return (
    <> 
      <ProfileHeader
        fullName={`${member.firstName} ${member.lastName}`}
        role={member.division || 'Member'}
        lastSeen="Last seen 2h 30m ago"
      />
      <div className="bg-gray-50 min-h-screen flex">
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
                Profile
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
                Attendance
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
                Progress
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

        <div className="flex-1">
          {activeView === 'profile' ? (
            <>
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
    </>
  );
};

export default MemberProfilePage;