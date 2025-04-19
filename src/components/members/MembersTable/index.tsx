'use client';

import useMembersStore from '@/stores/membersStore'; // Adjust the import path as needed
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import MemberRow from './MemberRow';
import MembersHeader from './MembersHeader';

export default function MembersTable() {
  const router = useRouter();
  const {
    members,
    loading,
    error,
    fetchMembers,
    canEditMember,
    canDeleteMember,
    canAddMember,
    addMember,
    updateMember,
    deleteMember,
    resetError
  } = useMembersStore();

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleProfileClick = (memberId: string) => {
    router.push(`/main/members/${memberId}`);
  };

  const handleAddMember = () => {
    // You might want to navigate to an add member page or show a modal
    // For now, I'll assume you have a function in your store to handle this
    addMember({
      // Default member data
      firstName: '',
      email: '',
      division: '',
      attendance: '',
      year: '',
      status: 'active',
      clubRole: 'Member'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="p-4 text-center">Loading members...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="p-4 text-red-500">Error: {error}</div>
        <button onClick={resetError} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Retry
        </button>
      </div>
    );
  }

  const safeMembers = Array.isArray(members) ? members : [];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <MembersHeader 
        canEdit={canAddMember()} 
        onAddMember={handleAddMember} 
      />
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {(canEditMember() || canDeleteMember()) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {safeMembers.map((member) => (
              <MemberRow 
                key={member._id}
                member={member}
                canEdit={canEditMember(member.division)}
                // canDelete={canDeleteMember()}
                onProfileClick={handleProfileClick}
                onEdit={(member) => updateMember(member._id, member)}
                onDelete={deleteMember}
              />
            ))}
            {safeMembers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}