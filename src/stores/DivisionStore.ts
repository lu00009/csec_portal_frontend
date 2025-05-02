import { divisionsApi } from "@/lib/api/divisions-api";
import { create } from "zustand";

interface Division {
  name: string;
  slug: string;
  groups: string[];
  description: string;
  memberCount: number;
}

interface Group {
  id: string;
  name: string;
  members: any[];
}

interface Member {
  _id: string;
  name: string;
  email: string;
  status: string;
  campusStatus: string;
  lastAttendance: string;
  membershipStatus: string;
}

interface DivisionsState {
  divisions: Division[];
  isLoading: boolean;
  error: string | null;
  showAddDivisionDialog: boolean;
  currentDivision: Division | null;
  currentDivisionGroups: Group[];
  isLoadingGroups: boolean;
  groupsError: string | null;
  searchTerm: string;
  members: Member[];
  totalMembers: number;
  currentPage: number;
  itemsPerPage: number;
  showAddGroupDialog: boolean;
  showAddMemberDialog: boolean;

  setShowAddGroupDialog: (show: boolean) => void;
  setShowAddMemberDialog: (show: boolean) => void;
  fetchDivisions: (search?: string) => Promise<void>;
  addDivision: (payload: { name: string; head: string; email: string }) => Promise<void>;
  setShowAddDivisionDialog: (show: boolean) => void;
  fetchDivisionGroups: (divisionName: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  addGroup: (divisionName: string, groupName: string) => Promise<void>;
  fetchGroupMembers: (
    division: string,
    group: string,
    filters?: {
      search?: string;
            page?: number;
      limit?: number;
      status?: string;
    }
  ) => Promise<void>;

    addMember: (division: string, group: string, member: { email: string; password: string }) => Promise<void>;
  }

export const useDivisionsStore = create<DivisionsState>((set, get) => ({
  divisions: [],
  isLoading: false,
  error: null,
  showAddDivisionDialog: false,
  showAddGroupDialog: false,
  showAddMemberDialog: false,
  currentDivision: null,
  currentDivisionGroups: [],
members: [],
  totalMembers: 0,
  isLoadingGroups: false,
  groupsError: null,
  searchTerm: '',
  currentPage: 1,
  itemsPerPage: 10,
  
  setShowAddGroupDialog: (show) => set({ showAddGroupDialog: show }),
  setShowAddMemberDialog: (show) => set({ showAddMemberDialog: show }),

  fetchDivisions: async (search = '') => {
    set({ isLoading: true, error: null });
    try {
      const divisionNames = await divisionsApi.getAllDivisions();
      
      const divisionsWithGroups = await Promise.all(
        divisionNames.map(async (name) => {
          const groups = await divisionsApi.getDivisionGroups(name);
          return {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            groups,
            description: `${name} Division Information`,
            memberCount: 0 // Implement actual count if available
          };
        })
      );

      set({ 
        divisions: divisionsWithGroups.filter(div => 
          div.name.toLowerCase().includes(search.toLowerCase())
        )
      });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to load divisions" });
    } finally {
      set({ isLoading: false });
    }
  },

  addDivision: async (payload) => {
    try {
      const newDivisionName = await divisionsApi.createDivision(payload);
      set((state) => ({
        divisions: [...state.divisions, {
          name: newDivisionName,
          slug: newDivisionName.toLowerCase().replace(/\s+/g, "-"),
          groups: [],
          description: `${newDivisionName} Division Information`,
          memberCount: 0
        }]
      }));
    } catch (error) {
      set({ error: "Failed to add division" });
      throw error;
    }
  },

  fetchDivisionGroups: async (divisionName) => {
    set({ isLoading: true, error: null });
    try {
      const response = await divisionsApi.getDivisionGroups(divisionName);
      console.log("Fetched division groups:", response); // Debug log
      set({
        currentDivision: {
          name: divisionName,
          slug: divisionName.toLowerCase().replace(/\s+/g, "-"),
          groups: response.groups || [], // Map the groups array from the API response
          description: `${divisionName} Division Information`,
          memberCount: response.length || 0, // Use the length property for member count
        },
      });
    } catch (error) {
      set({ error: "Failed to fetch division groups", isLoading: false });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addGroup: async (divisionName, groupName) => {
    try {
      await divisionsApi.createGroup(divisionName, groupName);
      set((state) => ({
        divisions: state.divisions.map(div => 
          div.name === divisionName 
            ? { ...div, groups: [...div.groups, groupName] }
            : div
        )
      }));
    } catch (error) {
      throw error;
    }
  },

  fetchGroupMembers: async (
    division: string,
    group: string,
    filters: { search?: string; page?: number; limit?: number; status?: string } = {}
  ) => {
    set({ isLoading: true, error: null });
    try {
      const response = await divisionsApi.getGroupMembers(division, group, filters);
      const membersWithDefaults = response.groupMembers.map((member) => ({
        ...member,
        status: member.status || "Unknown", // Provide a default value for missing status
      }));
      set({
        members: membersWithDefaults,
        totalMembers: response.totalGroupMembers || 0,
        currentPage: filters.page || 1,
      });
    } catch (error) {
      set({ error: "Failed to fetch group members", isLoading: false, members: [] });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addMember: async (division, group, member) => {
    try {
      await divisionsApi.createMember(division, group, member);
      set((state) => ({
        members: [...state.members, {
          _id: Date.now().toString(),
          name: member.email.split('@')[0] || 'Unknown',
          email: member.email,
          status: 'active',
          campusStatus: 'unknown',
          lastAttendance: 'N/A',
          membershipStatus: 'active'
        }]
      }));
console.log("Updated members:", get().members);
    } catch (error) {
      throw error;
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setShowAddDivisionDialog: (show) => set({ showAddDivisionDialog: show }),
}));

