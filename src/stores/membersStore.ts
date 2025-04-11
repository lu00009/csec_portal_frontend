// stores/membersStore.ts
import { Member } from '@/types/member';
import { create } from 'zustand';
import { useUserStore } from './userStore';

const API_BASE_URL = 'https://csec-portal-backend-1.onrender.com/api';

type MembersStore = {
  members: Member[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<Member, '_id' | 'createdAt'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
};

const useMembersStore = create<MembersStore>((set) => ({
  members: [],
  loading: false,
  error: null,

  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${API_BASE_URL}/members`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch members: ${response.statusText}`);
      }

      const data = await response.json();
      set({ members: data });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to load members',
        members: [] 
      });
    } finally {
      set({ loading: false });
    }
  },

  addMember: async (newMember) => {
    const { user } = useUserStore.getState();
    
    if (!user || !['president', 'divisionHead'].includes(user.role)) {
      throw new Error('Unauthorized: Only admins and division heads can add members');
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/members`, {
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
      set((state) => ({ members: [...state.members, addedMember] }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add member';
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  updateMember: async (id, updates) => {
    const { user } = useUserStore.getState();
    
    if (!user || !['president', 'divisionHead'].includes(user.role)) {
      throw new Error('Unauthorized: Only admins and division heads can edit members');
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
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
        )
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update member';
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deleteMember: async (id) => {
    const { user } = useUserStore.getState();
    
    if (!user || user.role !== 'president') {
      throw new Error('Unauthorized: Only presidents can delete members');
    }

    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/members/${id}`, {
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
        members: state.members.filter(member => member._id !== id)
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete member';
      set({ error });
      throw error;
    } finally {
      set({ loading: false });
    }
  }
}));

export default useMembersStore;