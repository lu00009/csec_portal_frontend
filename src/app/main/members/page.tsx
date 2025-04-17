'use client';

import { useState, useEffect } from 'react';
import EditMemberForm from '@/components/form/EditForm';
import MemberForm from '@/components/form/MemberForm';
import MembersTable from '@/components/members/MembersTable';
import useMembersStore from '@/stores/membersStore';
import { Member } from '@/types/member';

export default function MembersPage() {
  const {
    members = [],
    loading,
    error,
    fetchMembers,
    canAddMember
  } = useMembersStore();

  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<Member | null>(null);

  useEffect(() => {
    if (members.length === 0 && !loading) {
      fetchMembers();
    }
  }, [members.length, loading, fetchMembers]);

  const handleEdit = (member: Member) => {
    setCurrentMember(member);
    setIsEditFormOpen(true);
  };

  const handleDelete = (id: string) => {
    console.log('Delete member with id:', id);
    // Implement actual delete logic here
  };

  const handleAddMember = () => {
    setIsAddFormOpen(true);
  };

  const closeForms = () => {
    setIsAddFormOpen(false);
    setIsEditFormOpen(false);
    setCurrentMember(null);
  };

  const handleSaveMember = async (newMember: Omit<Member, '_id' | 'createdAt'>) => {
      console.log('Saving new member:', newMember);
      closeForms();
      // Implement actual save logic here
    };

  const handleUpdateMember = async (updatedMember: Partial<Member>) => {
    console.log('Updating member:', updatedMember);
    closeForms();
    // Implement actual update logic here
  };

  return (
    <div className="space-y-6">
      <MembersTable
        members={members}
        loading={loading}
        error={error}
        canEdit={canAddMember()}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAddMember={handleAddMember}
      />

      {/* Add Member Modal */}
      {isAddFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <MemberForm
              onSave={handleSaveMember}
              onClose={closeForms}
              divisions={[]}
              groups={[]}
            />
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {isEditFormOpen && currentMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <EditMemberForm
              member={currentMember}
              onSave={handleUpdateMember}
              onClose={closeForms}
              divisions={[]}
              groups={[]}
            />
          </div>
        </div>
      )}
    </div>
  );
}