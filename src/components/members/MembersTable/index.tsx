'use client';

import { Member } from '@/types/member';
import { useRouter } from 'next/navigation';
import MemberRow from './MemberRow';
import MembersHeader from './MembersHeader';

interface MembersTableProps {
  members: Member[];
  loading: boolean;
  error: string | null;
  canEdit: boolean;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onAddMember: () => void;
}

export default function MembersTable({
  members,
  loading,
  error,
  canEdit,
  onEdit,
  onDelete,
  onAddMember
}: MembersTableProps) {
  const router = useRouter();

  const handleProfileClick = (memberId: string) => {
    router.push(`/members/${memberId}`);
  };

  if (loading) return <div className="p-4 text-center">Loading members...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <MembersHeader canEdit={canEdit} onAddMember={onAddMember} />
      
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
              {canEdit && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <MemberRow 
                key={member._id}
                member={member}
                canEdit={canEdit}
                onProfileClick={handleProfileClick}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}