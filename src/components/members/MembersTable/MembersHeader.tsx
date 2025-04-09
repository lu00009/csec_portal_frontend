import Search from '@/components/layouts/Search';
import { FiPlusCircle } from "react-icons/fi";

interface MembersHeaderProps {
  canEdit: boolean;
  onAddMember: () => void;
}

export default function MembersHeader({ canEdit, onAddMember }: MembersHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <Search/>
      {canEdit && (
        <button
          onClick={onAddMember}
          className="flex items-center px-4 py-2 bg-blue-900 text-white rounded-md hover:bg-blue-700"
        >
          <FiPlusCircle className="mr-2" />
          Add Member
        </button>
      )}
    </div>
  );
}