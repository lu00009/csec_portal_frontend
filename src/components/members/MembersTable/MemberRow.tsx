'use client';

import { Member } from '@/types/member';

interface MemberRowProps {
  member: Member;
  canEdit: boolean;
  onProfileClick: (memberId: string) => void;
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
}

export default function MemberRow({
  member,
  canEdit,
  onProfileClick,
  onEdit,
  onDelete
}: MemberRowProps) {
  const fullName = `${member.firstName} ${member.middleName || ''} ${member.lastName}`.trim();

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            {member.profilePicture ? (
              <img 
                className="h-10 w-10 rounded-full" 
                src={member.profilePicture} 
                alt={fullName} 
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">
                  {member.firstName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div 
              className="text-sm font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => onProfileClick(member._id)}
            >
              {fullName}
            </div>
            <div className="text-sm text-gray-500">{member.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.member_id}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.division}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
          member.status === 'Active' ? 'bg-green-100 text-green-800' :
          member.status === 'Inactive' ? 'bg-red-100 text-red-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {member.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.year}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.clubRole}
      </td>
      {canEdit && (
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <button
            onClick={() => onEdit(member)}
            className="text-indigo-600 hover:text-indigo-900 mr-4"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(member._id)}
            className="text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </td>
      )}
    </tr>
  );
}