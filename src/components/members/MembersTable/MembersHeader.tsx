import Search from '@/components/layouts/Search';
import MembersFilter from './MembersFilter';
import { AddMemberModal } from './add-member-modal';

interface MembersHeaderProps {
  canEdit: boolean;
  onAddMember: () => void;
  onSearch: (term: string) => void;
  searchTerm?: string;
  divisions: string[];
  groups: string[];
  statuses: string[];
  campusStatuses: string[];
  onFilter: (filters: {
    search: string;
    division: string;
    group: string;
    status: string;
    campusStatus: string;
  }) => void;
  onReset: () => void;
}

export default function MembersHeader({ 
  canEdit, 
  onSearch,
  searchTerm,
  divisions,
  groups,
  statuses,
  campusStatuses,
  onFilter,
  onReset
}: MembersHeaderProps) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <Search 
            placeholder="Search members..." 
            onSearch={onSearch}
            value={searchTerm}
          />
        </div>
        
        <div className="flex items-center gap-4">
          <MembersFilter
            divisions={divisions}
            groups={groups}
            statuses={statuses}
            campusStatuses={campusStatuses}
            onFilter={onFilter}
            onReset={onReset}
          />
          
          {canEdit && <AddMemberModal />}
        </div>
      </div>
    </div>
  );
}