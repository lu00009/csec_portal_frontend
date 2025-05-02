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
  
  // Actions
  fetchDivisions: (search?: string) => Promise<void>;
  addDivision: (payload: { name: string; head: string; email: string }) => Promise<void>;
  setShowAddDivisionDialog: (show: boolean) => void;
  fetchDivisionGroups: (divisionName: string) => Promise<void>;
  setSearchTerm: (term: string) => void;
  addGroup: (divisionName: string, groupName: string) => Promise<void>;
  fetchGroupMembers: (
    divisionName: string,
    groupName: string,
    filters?: {
      search?: string;
      campusStatus?: string;
      membershipStatus?: string;
      page?: number;
      limit?: number;}
    
  ) => Promise<void>;

    addMember: (division: string, group: string, member: { email: string; password: string }) => Promise<void>;
  }


export const useDivisionsStore = create<DivisionsState>((set, get) => ({
  divisions: [],
  isLoading: false,
  error: null,
  showAddDivisionDialog: false,
  currentDivision: null,
  currentDivisionGroups: [],
  members: [],
  totalMembers: 0,
  isLoadingGroups: false,
  groupsError: null,
  searchTerm: '',
  members: [],
  totalMembers: 0,
  currentPage: 1,
  itemsPerPage: 10,

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
    set({ isLoadingGroups: true, groupsError: null });
    try {
      const groups = await divisionsApi.getDivisionGroups(divisionName);
      
      const groupsWithMembers = await Promise.all(
        groups.map(async (groupName, index) => {
          const members = await divisionsApi.getGroupMembers(divisionName, groupName);
          return {
            name: groupName,
            id: `group-${index + 1}`,
            members: members.map(member => ({
              id: member._id,
              name: member.name || member.email?.split("@")[0] || "Unknown",
              email: member.email,
              role: member.clubRole || "Member",
              clubRole: member.clubRole,
            }))
          };
        })
      );

      set({ currentDivisionGroups: groupsWithMembers });
    } catch (error) {
      set({ groupsError: error instanceof Error ? error.message : "Failed to load groups" });
    } finally {
      set({ isLoadingGroups: false });
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

  fetchGroupMembers: async (divisionName, groupName, filters = {}) => {
    try {
      const response = await divisionsApi.getGroupMembers(divisionName, groupName, {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10
      });
      
      set({
        members: response.members,
        totalMembers: response.total,
        currentPage: filters.page || 1
      });
    } catch (error) {
      console.error("Error fetching members:", error);
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
    } catch (error) {
      throw error;
    }
  },

  setSearchTerm: (term) => set({ searchTerm: term }),
  setShowAddDivisionDialog: (show) => set({ showAddDivisionDialog: show }),
}));