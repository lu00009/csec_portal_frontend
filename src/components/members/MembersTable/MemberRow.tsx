
import { Avatar } from "@/components/ui/avatar";
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
  className="flex-shrink-0"
>
  <Avatar size="md">
    {member.profilePicture ? (
      <Avatar.Image
        alt={`${member.firstName ?? ""} ${member.lastName ?? ""}`}
        src={`http://csec-portal-backend-1.onrender.com/uploads/${member.profilePicture}`}
      />
    ) : (
      // RoboHash will kick in because no `src` is provided, only identifier
      <Avatar.Image
        src={`https://robohash.org/${member._id}?set=set3&size=100x100`}
        alt={`${member.firstName ?? ""} ${member.lastName ?? ""}`}
        identifier={member._id} // or use member.firstName, etc.
      />
    )}
  </Avatar>
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