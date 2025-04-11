
import { Member } from '@/types/member';
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
  onClick={() => onProfileClick(member._id)}
  className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center"
>
  {member.profilePicture ? (
    <img
      src={`/uploads/${member.profilePicture}`}
      alt={`${member.firstName ?? ''} ${member.lastName ?? ''}`}
      width={40}
      height={40}
      className="object-cover rounded-full"
    />
  ) : (
    <span className="text-gray-600 font-medium">
      {member.firstName?.charAt(0) ?? '?'}
    </span>
  )}
</button>
          <div className="ml-4">
            <div 
              className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
              onClick={() => onProfileClick(member._id)}
            >
              {member.firstName} {member.lastName}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.member_id}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.division}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
          member.Attendance === 'Active' ? 'bg-green-100 text-green-700' :
          member.Attendance === 'Inactive' ? 'bg-yellow-100 text-yellow-400' :
          member.Attendance === 'Needs Attention' ? 'bg-red-200 text-red-500' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {member.Attendance}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {member.year }
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-sm ${
          member.status === 'Active' ? 'bg-green-100 text-green-700' :
          member.status === 'Alumini' ? 'bg-yellow-100 text-yellow-400' :
          member.status === 'Banned' ? 'bg-red-200 text-red-500' :
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
            onClick={() => onDelete(member._id)}
            className="text-red-600 hover:text-red-900"
          >
          <RiDeleteBin6Line />
          </button>
        </td>
      )}
    </tr>
  );
}