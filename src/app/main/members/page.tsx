'use client';

import MemberForm from '@/components/form/MemberForm';
import MembersTable from '@/components/members/MembersTable';
import { divisions, groups } from '@/data/divisionsAndGroups';
import useMembersStore from '@/stores/membersStore';
import { useUserStore } from '@/stores/userStore';
import { Member } from '@/types/member';
import { useEffect, useState } from 'react';

export default function MembersPage() {
  const { members, loading, error, fetchMembers, addMember, updateMember, deleteMember } = useMembersStore();
  const { user } = useUserStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const canEdit = ['president', 'divisionHead'].includes(user?.role || '');

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleSave = async (newMember: Omit<Member, '_id' | 'createdAt'>) => {
    try {
      if (editingMember) {
        await updateMember({ ...newMember, id: editingMember.id }, editingMember.id);
      } else {
        await addMember(newMember);
      }
      setIsFormOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error('Failed to save member:', err);
    }
  };

  return (
    <>
      <MembersTable
        members={members}
        loading={loading}
        error={error}
        canEdit={canEdit}
        onEdit={(member) => {
          setEditingMember(member);
          setIsFormOpen(true);
        }}
        onDelete={deleteMember}
        onAddMember={() => {
          setEditingMember(null);
          setIsFormOpen(true);
        }}
      />

      {isFormOpen && (
        <MemberForm
          onSave={handleSave}
          onClose={() => {
            setIsFormOpen(false);
            setEditingMember(null);
          }}
          divisions={divisions}
          groups={groups}
          // initialData={editingMember ? {
          //   email: editingMember.email,
          //   division: editingMember.division,
          //   group: editingMember.group,
          //   password: ''
          // } : undefined}
        />
      )}
    </>
  );
}