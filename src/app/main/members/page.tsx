'use client';

import EditMemberForm from '@/components/form/EditForm';
import MemberForm from '@/components/form/MemberForm';
import MembersTable from '@/components/members/MembersTable'; // adjust import path if needed
import useMembersStore from '@/stores/membersStore';
import { Member } from '@/types/member';
import { useEffect } from 'react';

export default function MembersPage() {
  const members = useMembersStore((state) => state.members);
  const loading = useMembersStore((state) => state.loading);
  const error = useMembersStore((state) => state.error);
  const fetchMembers = useMembersStore((state) => state.fetchMembers);
  const canAddMember = useMembersStore((state) => state.canAddMember);

  // Edit/Delete/Add actions
  const onEdit = (member: Member) => {
    console.log('Edit:', member);
    <EditMemberForm
      member={member}
      onSave={async (updatedMember) => {
        console.log('Save:', updatedMember);
        return Promise.resolve();
      }}
      onClose={() => console.log('Close form')}
      divisions={[]} 
      groups={[]} 
    />;
   
    
  };

  const onDelete = (id: string) => {
    console.log('Delete:', id);
    // TODO: Implement delete logic
  };

  const onAddMember = () => {
    console.log('Add member clicked');
    <MemberForm
      onSave={async (newMember) => {
        console.log('Save:', newMember);
        return Promise.resolve();
      }}
      onClose={() => console.log('Close form')}
      divisions={[]} 
      groups={[]}
    />
  };

  useEffect(() => {
    if (members.length === 0 && !loading) {
      fetchMembers();
    }
  }, [members, loading, fetchMembers]);
  

  return (
    <MembersTable
      members={members}
      loading={loading}
      error={error}
      canEdit={canAddMember()}
      onEdit={onEdit}
      onDelete={onDelete}
      onAddMember={onAddMember}
    />
  );
}
