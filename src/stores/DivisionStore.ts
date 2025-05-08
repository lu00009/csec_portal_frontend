import { Member } from '@/types/member';
import { create } from 'zustand';
import { useUserStore } from './userStore';

interface Division {
  _id?: string;
  name: string;
  description?: string;
  members: Member[];
  slug: string;
  groups: string[];
  memberCount: number;
  groupMemberCounts: { [key: string]: number };
  groupMembers?: { [group: string]: Member[] };
}

interface DivisionsState {
  divisions: Division[];
  currentDivision: Division | null;
  members: Member[];
  totalMembers: number;
  loading: boolean;
  error: string | null;
  showAddDivisionDialog: boolean;
  showAddGroupDialog: boolean;
  showAddMemberDialog: boolean;
  setShowAddDivisionDialog: (show: boolean) => void;
  setShowAddGroupDialog: (show: boolean) => void;
  setShowAddMemberDialog: (show: boolean) => void;
  fetchDivisions: () => Promise<void>;
  fetchDivisionGroups: (divisionName: string) => Promise<void>;
  fetchGroupMembers: (division: string, group: string, query?: { search?: string; page?: number; limit?: number; status?: string }) => Promise<void>;
  addDivision: (division: Omit<Division, '_id'>) => Promise<void>;
  updateDivision: (id: string, updates: Partial<Division>) => Promise<void>;
  deleteDivision: (id: string) => Promise<void>;
  addMemberToDivision: (division: string, member: Omit<Member, '_id'>) => Promise<void>;
  addMember: (division: string, group: string, member: Omit<Member, '_id'>) => Promise<void>;
  addGroup: (division: string, groupName: string) => Promise<void>;
}

const useDivisionsStore = create<DivisionsState>((set, get) => ({
  divisions: [],
  currentDivision: null,
  members: [],
  totalMembers: 0,
  loading: false,
  error: null,
  showAddDivisionDialog: false,
  showAddGroupDialog: false,
  showAddMemberDialog: false,

  setShowAddDivisionDialog: (show) => set({ showAddDivisionDialog: show }),
  setShowAddGroupDialog: (show) => set({ showAddGroupDialog: show }),
  setShowAddMemberDialog: (show) => set({ showAddMemberDialog: show }),

  fetchDivisions: async () => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/allDivisions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch divisions');
      const data = await response.json();
      set({ 
        divisions: (data.divisions || []).map((name: string) => ({
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
          groups: [],
          members: [],
          memberCount: 0,
          groupMemberCounts: {},
        })),
        loading: false 
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch divisions', loading: false });
    }
  },

  fetchDivisionGroups: async (divisionName) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().token;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/getGroups/${encodeURIComponent(divisionName)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch division groups');
      const data = await response.json();
      set((state) => ({
        currentDivision: {
          name: divisionName,
          slug: divisionName.toLowerCase().replace(/\s+/g, "-"),
          groups: data.groups || [],
          members: [],
          memberCount: 0,
          groupMemberCounts: {},
        },
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch division groups', loading: false });
    }
  },

  fetchGroupMembers: async (division, group, query) => {
    set({ loading: true, error: null });
    try {
      const token = useUserStore.getState().token;
      const queryParams = query ? new URLSearchParams({
        ...(query.search && { search: query.search }),
        ...(query.page && { page: query.page.toString() }),
        ...(query.limit && { limit: query.limit.toString() }),
        ...(query.status && { status: query.status })
      }).toString() : '';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/groups/getMembers?division=${encodeURIComponent(division)}&group=${encodeURIComponent(group)}${queryParams ? `&${queryParams}` : ''}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to fetch group members');
      const data = await response.json();
      set((state) => {
        const groupMembers = { ...(state.currentDivision?.groupMembers || {}) };
        groupMembers[group] = data.groupMembers || [];
        const groupMemberCounts = { ...(state.currentDivision?.groupMemberCounts || {}) };
        groupMemberCounts[group] = (data.groupMembers || []).length;
        return {
          members: data.groupMembers || [],
          totalMembers: data.totalGroupMembers || 0,
          loading: false,
          currentDivision: state.currentDivision
            ? {
                ...state.currentDivision,
                groupMembers,
                groupMemberCounts,
              }
            : state.currentDivision,
        };
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to fetch group members', loading: false });
    }
  },

  addDivision: async (division) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(division),
      });
      if (!response.ok) throw new Error('Failed to add division');
      const newDivision = await response.json();
      set((state) => ({ 
        divisions: [...state.divisions, {
          _id: newDivision._id,
          name: newDivision.name,
          description: newDivision.description,
          members: newDivision.members || [],
          slug: newDivision.name.toLowerCase().replace(/\s+/g, "-"),
          groups: newDivision.groups || [],
          memberCount: newDivision.members?.length || 0,
          groupMemberCounts: newDivision.groupMemberCounts || {}
        }],
        loading: false 
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add division', loading: false });
    }
  },

  updateDivision: async (id, updates) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!response.ok) throw new Error('Failed to update division');
      const updatedDivision = await response.json();
      set((state) => ({
        divisions: state.divisions.map((div) => 
          div._id === id ? {
            _id: div._id,
            name: updatedDivision.name || div.name,
            description: updatedDivision.description || div.description,
            members: updatedDivision.members || div.members,
            slug: (updatedDivision.name || div.name).toLowerCase().replace(/\s+/g, "-"),
            groups: updatedDivision.groups || div.groups,
            memberCount: updatedDivision.members?.length || div.memberCount,
            groupMemberCounts: updatedDivision.groupMemberCounts || div.groupMemberCounts
          } : div
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update division', loading: false });
    }
  },

  deleteDivision: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete division');
      set((state) => ({
        divisions: state.divisions.filter((div) => div._id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete division', loading: false });
    }
  },

  addMemberToDivision: async (division, member) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/${encodeURIComponent(division)}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(member),
      });

      if (!response.ok) {
        throw new Error('Failed to add member');
      }

      const newMember = await response.json();
      const state = get();
      const updatedDivisions = state.divisions.map(d => {
        if (d._id === division) {
          const groupName = member.group || 'default';
          return {
            ...d,
            members: [...d.members, newMember],
            memberCount: d.memberCount + 1,
            groupMemberCounts: {
              ...d.groupMemberCounts,
              [groupName]: (d.groupMemberCounts[groupName] || 0) + 1
            }
          };
        }
        return d;
      });

      set({ divisions: updatedDivisions, loading: false });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add member', loading: false });
    }
  },

  addMember: async (division, group, member) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/${encodeURIComponent(division)}/groups/${encodeURIComponent(group)}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      });
      if (!response.ok) throw new Error('Failed to add member to group');
      const updatedDivision = await response.json();
      set((state) => ({
        divisions: state.divisions.map((div) => 
          div._id === division ? {
            _id: div._id,
            name: div.name,
            description: div.description,
            members: [...div.members.filter(m => m.group !== group), updatedDivision.members || []],
            slug: div.name.toLowerCase().replace(/\s+/g, "-"),
            groups: [...div.groups.filter(g => g !== group), group],
            memberCount: updatedDivision.members?.length || 0,
            groupMemberCounts: {
              ...div.groupMemberCounts,
              [group]: updatedDivision.members?.length || 0
            }
          } : div
        ),
        loading: false,
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add member to group', loading: false });
    }
  },

  addGroup: async (division, groupName) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/divisions/${encodeURIComponent(division)}/groups`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName }),
      });
      if (!response.ok) throw new Error('Failed to add group');
      const updatedDivision = await response.json();
      set((state) => ({
        divisions: state.divisions.map((div) => 
          div.name === division ? {
            ...div,
            groups: [...div.groups, groupName],
            groupMemberCounts: {
              ...div.groupMemberCounts,
              [groupName]: 0
            }
          } : div
        ),
        currentDivision: state.currentDivision?.name === division ? {
          ...state.currentDivision,
          groups: [...state.currentDivision.groups, groupName],
          groupMemberCounts: {
            ...state.currentDivision.groupMemberCounts,
            [groupName]: 0
          }
        } : state.currentDivision,
        loading: false
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to add group', loading: false });
    }
  },
}));

export { useDivisionsStore };

