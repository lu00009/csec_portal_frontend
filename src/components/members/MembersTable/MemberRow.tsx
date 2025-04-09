import { Member } from '@/types/member';
import Image from 'next/image';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin6Line } from "react-icons/ri";

interface MemberRowProps {
  member: Member;
  canEdit: boolean;
  onProfileClick: (id: string) => void;
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
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <button 
            onClick={() => onProfileClick(member.id)}
            className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"
          >
            {member.profilePicture ? (
              <Image
                src={member.profilePicture}
                alt={member.name}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <span className="text-gray-600 font-medium">
                {member.name.charAt(0)}
              </span>
            )}
          </button>
          <div className="ml-4">
            <div 
              className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
              onClick={() => onProfileClick(member.id)}
            >
              {member.name}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.memberId}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.division}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
          member.attendance === 'Active' ? 'bg-green-100 text-green-700' :
          member.attendance === 'Inactive' ? 'bg-yellow-100 text-yellow-400' :
          member.attendance === 'Needs Attention' ? 'bg-red-200 text-red-500' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {member.attendance}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.year }
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
          member.campusStatus === 'On Campus' ? 'bg-green-100 text-green-700' :
          member.campusStatus === 'Off Campus' ? 'bg-yellow-100 text-yellow-400' :
          member.campusStatus === 'Withdrawn' ? 'bg-red-200 text-red-500' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {member.campusStatus}
        </span>
      </td>
      {canEdit && (
        <td className="px-6 py-4 whitespace-nowrap text-2xl font-medium">
          <button
            onClick={() => onEdit(member)}
            className="text-blue-600 hover:text-blue-900 mr-4"
          >
            <CiEdit />
          </button>
          <button
            onClick={() => onDelete(member.id)}
            className="text-red-600 hover:text-red-900"
          >
          <RiDeleteBin6Line />
          </button>
        </td>
      )}
    </tr>
  );
}