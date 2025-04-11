// stores/membersStore.ts
import { Member } from '@/types/member';
import {
  canAddMembers,
  canDeleteMembers,
  canEditMembers,
  canManageDivision,
  isPresident
} from '@/utils/roles';
import { create } from 'zustand';
import { useUserStore } from './userStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

interface MembersState {
  members: Member[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<Member, '_id' | 'createdAt'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  canAddMember: () => boolean;
  canEditMember: (targetDivision?: string) => boolean;
  canDeleteMember: () => boolean;
}

const useMembersStore = create<MembersState>((set, get) => ({
  members: [],
  loading: false,
  error: null,

  // Permission checkers
  canAddMember: () => {
    const { user } = useUserStore.getState();
    return user ? canAddMembers(user.clubRole) : false;
  },

  canEditMember: (targetDivision?: string) => {
    const { user } = useUserStore.getState();
    if (!user) return false;
    return canEditMembers(user.clubRole) && 
           (isPresident(user.clubRole) || 
            canManageDivision(user.clubRole, user.division ?? '', targetDivision));
  },

  canDeleteMember: () => {
    const { user } = useUserStore.getState();
    return user ? canDeleteMembers(user.clubRole) : false;
  },

  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      const { user } = useUserStore.getState();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (user?.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }

      const response = await fetch(`${BASE_URL}/members`, { headers });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch members: ${response.statusText}`);
      }

      const data = await response.json();
      set({ members: data, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to load members',
        members: [],
        loading: false
      });
    }
  },

  addMember: async (newMember) => {
    const { user } = useUserStore.getState();
    
    if (!user || !get().canAddMember()) {
      throw new Error('Unauthorized: You do not have permission to add members');
    }

    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(newMember)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add member');
      }

      const addedMember = await response.json();
      set((state) => ({ 
        members: [...state.members, addedMember],
        loading: false 
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add member';
      set({ error, loading: false });
      throw error;
    }
  },

  updateMember: async (id, updates) => {
    const { user } = useUserStore.getState();
    const memberToUpdate = get().members.find(m => m._id === id);
    
    if (!user || !memberToUpdate || !get().canEditMember(memberToUpdate.division)) {
      throw new Error('Unauthorized: You do not have permission to edit this member');
    }

    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update member');
      }

      const updatedMember = await response.json();
      set((state) => ({
        members: state.members.map(member => 
          member._id === id ? { ...member, ...updatedMember } : member
        ),
        loading: false
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update member';
      set({ error, loading: false });
      throw error;
    }
  },

  deleteMember: async (id) => {
    const { user } = useUserStore.getState();
    
    if (!user || !get().canDeleteMember()) {
      throw new Error('Unauthorized: Only presidents can delete members');
    }

    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete member');
      }

      set((state) => ({
        members: state.members.filter(member => member._id !== id),
        loading: false
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete member';
      set({ error, loading: false });
      throw error;
    }
  }
}));

export default useMembersStore;