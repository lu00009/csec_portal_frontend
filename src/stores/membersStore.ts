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
  heads: Member[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  fetchHeads: () => Promise<void>;
  addMember: (member: Omit<Member, '_id' | 'createdAt'>) => Promise<void>;
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  canAddMember: () => boolean;
  canEditMember: (targetDivision?: string) => boolean;
  canDeleteMember: () => boolean;
  deleteHead: (id: string) => Promise<void>;
  resetError: () => void;
  
}

const useMembersStore = create<MembersState>((set, get) => ({
  members: [],
  heads: [],
  loading: false,
  error: null,

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
      const store = useUserStore.getState();
      if (!store.refreshToken) throw new Error('Not authenticated');
  
      const makeRequest = async (attemptRefresh = true): Promise<Response> => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.refreshToken}`
        };
  
        const response = await fetch(`${BASE_URL}/members`, { headers });
  
        // First check if response is HTML
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('text/html')) {
          throw new Error('Server returned HTML instead of JSON. Check API endpoint.');
        }
  
        if (response.status === 401 && attemptRefresh) {
          try {
            await store.refreshSession();
            return makeRequest(false); // Retry once with new token
          } catch (refreshError) {
            throw new Error('Session expired. Please log in again.');
          }
        }
  
        if (!response.ok) {
          // Try to parse error JSON, fallback to status text
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: response.statusText };
          }
          throw new Error(errorData.message || `Failed with status ${response.status}`);
        }
  
        return response;
      };
  
      const response = await makeRequest();
      const data = await response.json();
      set({ members: data.members, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load members';
      set({ error: errorMessage, loading: false });
      throw err;
    }
  },  fetchHeads: async () => {
    set({ loading: true, error: null });
    try {
      const store = useUserStore.getState();
      if (!store.refreshToken) throw new Error('Not authenticated');

      const makeRequest = async (attemptRefresh = true): Promise<Response> => {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${store.refreshToken}`
        };

        const response = await fetch(`${BASE_URL}/members/heads`, { headers });

        if (response.status === 401 && attemptRefresh) {
          try {
            await store.refreshSession();
            return makeRequest(false); // Retry once with new token
          } catch (refreshError) {
            throw new Error('Session expired. Please log in again.');
          }
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Failed with status ${response.status}`);
        }

        return response;
      };

      const response = await makeRequest();
      const data = await response.json();
      console.log('Heads data:', data); // Debugging line
      
      // Filter heads client-side if no dedicated endpoint
      const heads = data.filter((member: Member) => 
        ['Vice President', 'CPD President', 'Dev President', 
         'CBD President', 'SEC President', 'DS President']
        .includes(member.clubRole)
      );
      
      set({ heads, loading: false });
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Failed to load heads',
        loading: false
      });
      throw err;
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
          'Authorization': `Bearer ${user.refreshToken}`
        },
        body: JSON.stringify(newMember)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to add member');
      }

      const addedMember = await response.json();
      set((state) => ({ 
        members: [...state.members, addedMember],
        heads: isPresident(addedMember.clubRole) || 
               addedMember.clubRole.includes('President') 
          ? [...state.heads, addedMember] 
          : state.heads,
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
          'Authorization': `Bearer ${user.refreshToken}`
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update member');
      }

      const updatedMember = await response.json();
      set((state) => ({
        members: state.members.map(member => 
          member._id === id ? { ...member, ...updatedMember } : member
        ),
        heads: state.heads.map(head => 
          head._id === id ? { ...head, ...updatedMember } : head
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
          'Authorization': `Bearer ${user.refreshToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete member');
      }

      set((state) => ({
        members: state.members.filter(member => member._id !== id),
        heads: state.heads.filter(head => head._id !== id),
        loading: false
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete member';
      set({ error, loading: false });
      throw error;
    }
  },

  deleteHead: async (id) => {
    const { user } = useUserStore.getState();
    if (!user) throw new Error('Not authenticated');
    
    set({ loading: true });
    try {
      const response = await fetch(`${BASE_URL}/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.refreshToken}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete head');
      }
      
      set((state) => ({
        heads: state.heads.filter(head => head._id !== id),
        members: state.members.filter(member => member._id !== id),
        loading: false
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete head';
      set({ error, loading: false });
      throw error;
    }
  },
  resetError: () => set({ error: null })
}));

export default useMembersStore;