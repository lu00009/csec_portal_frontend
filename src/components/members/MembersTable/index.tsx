'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import Button from '@/components/ui/button'; // Import your Button component
import useMembersStore from '@/stores/membersStore';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import icons
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
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
    resetError,
    divisions=[],
    groups=[],
    statuses=[],
    campusStatuses=[]
  } = useMembersStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    division: '',
    group: '',
    status: '',
    campusStatus: ''
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [membersPerPage, setMembersPerPage] = useState(10); // Default to 10 items per page

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Reset to first page when filters or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleProfileClick = (memberId: string) => {
    router.push(`/main/members/${memberId}`);
  };

  const handleAddMember = () => {
    addMember({
      member_id: '',
      firstName: '',
      lastName: '',
      email: '',
      division: '',
      Attendance: '',
      year: '',
      status: 'active',
      clubRole: 'Member',
      profilePicture: ''
    });
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilter = (newFilters: {
    search: string;
    division: string;
    group: string;
    status: string;
    campusStatus: string;
  }) => {
    setFilters({
      division: newFilters.division,
      group: newFilters.group,
      status: newFilters.status,
      campusStatus: newFilters.campusStatus
    });
    if (newFilters.search) {
      setSearchTerm(newFilters.search);
    }
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({
      division: '',
      group: '',
      status: '',
      campusStatus: ''
    });
  };

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        member.firstName?.toLowerCase().includes(term) ||
        member.member_id?.toLowerCase().includes(term) ||
        member.division?.toLowerCase().includes(term) ||
        member.year?.toString().includes(term) ||
        member.campusStatus?.toLowerCase().includes(term);
      
      if (!matchesSearch) return false;
    }

    if (filters.division && member.member.division !== filters.division) return false;
    if (filters.group && member.member.group !== filters.group) return false;
    if (filters.status && member.member.attendance !== filters.status) return false;
    if (filters.campusStatus && member.member.campusStatus !== filters.campusStatus) return false;

    return true;
  });

  // Pagination calculations
  const totalMembers = filteredMembers.length;
  const totalPages = Math.ceil(totalMembers / membersPerPage);
  const indexOfLastMember = currentPage * membersPerPage;
  const indexOfFirstMember = indexOfLastMember - membersPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const leftOffset = Math.floor(maxVisiblePages / 2);
      const rightOffset = Math.ceil(maxVisiblePages / 2) - 1;

      if (currentPage <= leftOffset) {
        // Near the beginning
        for (let i = 1; i <= maxVisiblePages; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - rightOffset) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - leftOffset; i <= currentPage + rightOffset; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <LoadingSpinner />
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

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <MembersHeader 
          canEdit={canAddMember()} 
          onAddMember={handleAddMember}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          divisions={divisions}
          groups={groups}
          statuses={statuses}
          campusStatuses={campusStatuses}
          onFilter={handleFilter}
          onReset={handleReset}
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
              {currentMembers.map((member) => (
                <MemberRow 
                  key={member._id}
                  member={member}
                  canEdit={canEditMember(member.division)}
                  canDelete={canDeleteMember()}
                  onProfileClick={handleProfileClick}
                  onEdit={updateMember}
                  onDelete={deleteMember}
                />
              ))}
              {currentMembers.length === 0 && (
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

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">
              {indexOfFirstMember + 1}-{Math.min(indexOfLastMember, totalMembers)}
            </span> of <span className="font-medium">{totalMembers}</span> members
          </p>
          
          {/* Items per page selector */}
          <select
            value={membersPerPage}
            onChange={(e) => {
              setMembersPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing page size
            }}
            className="text-sm border rounded px-2 py-1 bg-white"
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
        
        <div className="flex items-center gap-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => goToPage(page as number)}
              >
                {page}
              </Button>
            )
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}