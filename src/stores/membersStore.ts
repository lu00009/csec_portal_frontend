// stores/membersStore.ts
import { Member } from '@/types/member';
import { create } from 'zustand';
import useUserStore from './userStore';

// Complete mock data with all required fields
const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Darlene Robertson',
    memberId: 'UGR/25605/14',
    division: 'Design',
    attendance: 'Needs Attention',
    campusStatus: 'On Campus',
    group: 'CPD',
    email: 'darlene@example.com',
    profilePicture: null,
    year: '3rd',
    role:'divisionHead'
  },
  {
    id: '2',
    name: 'Floyd Miles',
    memberId: 'UGR/25605/15',
    division: 'Development',
    attendance: 'Inactive',
    campusStatus: 'Off Campus',
    group: 'Development Team',
    email: 'floyd@example.com',
    profilePicture: null,
    year: '2nd',
    role:'member'
  },
  {
    id: '3',
    name: 'Cody Fisher',
    memberId: 'UGR/25605/16',
    division: 'CPD',
    attendance: 'Active',
    campusStatus: 'Withdrawn',
    group: 'CPD Team',
    email: 'cody@example.com',
    profilePicture: null,   
    year: '4th',
    role:'president'
  },
  {
    id: '3',
    name: 'Cody Fisher',
    memberId: 'UGR/25605/16',
    division: 'CPD',
    attendance: 'Active',
    campusStatus: 'Withdrawn',
    group: 'CPD Team',
    email: 'cody@example.com',
    profilePicture: null,   
    year: '4th',
    role:'president'
  },
  {
    id: '3',
    name: 'Cody Fisher',
    memberId: 'UGR/25605/16',
    division: 'CPD',
    attendance: 'Active',
    campusStatus: 'Withdrawn',
    group: 'CPD Team',
    email: 'cody@example.com',
    profilePicture: null,   
    year: '4th',
    role:'president'
  },
  {
    id: '3',
    name: 'Cody Fisher',
    memberId: 'UGR/25605/16',
    division: 'CPD',
    attendance: 'Active',
    campusStatus: 'Withdrawn',
    group: 'CPD Team',
    email: 'cody@example.com',
    profilePicture: null,   
    year: '4th',
    role:'president'
  }
];

type MembersStore = {
  members: Member[];
  loading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  addMember: (member: Omit<Member, 'id'>) => Promise<Member>; // Updated return type
  updateMember: (id: string, updates: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  getMemberById: (id: string) => Member | undefined;
};

const useMembersStore = create<MembersStore>((set, get) => ({
  members: [],
  loading: false,
  error: null,
  
  fetchMembers: async () => {
    set({ loading: true, error: null });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ members: mockMembers });
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const addedMember: Member = {
        ...newMember,
        id: Math.random().toString(36).substring(2, 9),
        memberId: `MEM-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
        attendance: newMember.attendance || 'Active',
        campusStatus: newMember.campusStatus || 'On Campus'
      };
      
      set((state) => ({
        members: [...state.members, addedMember],
      }));
      
      return addedMember;
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to add member';
      set({ error });
      throw new Error(error);
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        members: state.members.map(member => 
          member.id === id ? { ...member, ...updates } : member
        )
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update member';
      set({ error });
      throw new Error(error);
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
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        members: state.members.filter(member => member.id !== id)
      }));
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete member';
      set({ error });
      throw new Error(error);
    } finally {
      set({ loading: false });
    }
  },
  
  getMemberById: (id) => {
    return get().members.find(member => member.id === id);
  }
}));

export default useMembersStore;