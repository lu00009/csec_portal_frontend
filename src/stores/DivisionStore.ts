import { divisionsApi } from "@/lib/api/divisions-api";
import { create } from "zustand";

interface Division {
  name: string;
  slug: string;
  groups: string[];
  description: string;
  memberCount: number;
  groupMemberCounts: { [key: string]: number };
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
  profilePicture?: string;
  group?: string;
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
  groupMembers: { [division: string]: { [group: string]: Member[] } };

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
  groupMembers: {},
  
  setShowAddGroupDialog: (show) => set({ showAddGroupDialog: show }),
  setShowAddMemberDialog: (show) => set({ showAddMemberDialog: show }),

  fetchDivisions: async (search = '') => {
    set({ isLoading: true, error: null });
    try {
      const divisionNames = await divisionsApi.getAllDivisions();
      
      const divisionsWithGroups = await Promise.all(
        divisionNames.map(async (name) => {
          const groups = await divisionsApi.getDivisionGroups(name);
          
          // Get member counts for each group
          const groupMemberCounts: { [key: string]: number } = {};
          let totalMemberCount = 0;
          
          for (const group of groups) {
            try {
              const response = await divisionsApi.getGroupMembers(name, group, { limit: 1 });
              groupMemberCounts[group] = response.totalGroupMembers || 0;
              totalMemberCount += response.totalGroupMembers || 0;
            } catch (error) {
              console.error(`Error fetching members for group ${group}:`, error);
              groupMemberCounts[group] = 0;
            }
          }

          return {
            name,
            slug: name.toLowerCase().replace(/\s+/g, "-"),
            groups,
            description: `${name} Division Information`,
            memberCount: totalMemberCount,
            groupMemberCounts
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
      const newDivisionName = await divisionsApi.createDivision({
        divisionName: payload.name,
        headName: payload.head,
        email: payload.email
      });
      set((state) => ({
        divisions: [...state.divisions, {
          name: newDivisionName,
          slug: newDivisionName.toLowerCase().replace(/\s+/g, "-"),
          groups: [],
          description: `${newDivisionName} Division Information`,
          memberCount: 0,
          groupMemberCounts: {}
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
      console.log("Fetched division groupsdeeeeeeeeeeeee:", response); // Debug log
      set({
        currentDivision: {
          name: divisionName,
          slug: divisionName.toLowerCase().replace(/\s+/g, "-"),
          groups: response || [], // Map the groups array from the API response
          description: `${divisionName} Division Information`,
          memberCount: response.length || 0, // Use the length property for member count
          groupMemberCounts: {}
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
      const membersWithDefaults = response.groupMembers.map((member: any) => ({
        _id: member._id,
        name: member.name || member.email.split('@')[0] || 'Unknown',
        email: member.email,
        status: member.status || "Unknown",
        campusStatus: member.campusStatus || 'unknown',
        lastAttendance: member.lastAttendance || 'N/A',
        membershipStatus: member.membershipStatus || 'active',
        profilePicture: member.profilePicture,
        group: group // Add group information to each member
      }));
      // Store per group
      set((state) => ({
        groupMembers: {
          ...state.groupMembers,
          [division]: {
            ...(state.groupMembers[division] || {}),
            [group]: membersWithDefaults
          }
        },
        // Also update the flat members array for current view
        members: membersWithDefaults,
        totalMembers: response.totalGroupMembers || 0,
        currentPage: filters.page || 1,
      }));
      // Update the division's group member count in the store
      set((state) => ({
        divisions: state.divisions.map(div => 
          div.name === division
            ? {
                ...div,
                groupMemberCounts: {
                  ...div.groupMemberCounts,
                  [group]: response.totalGroupMembers || 0
                },
                memberCount: Object.values({
                  ...div.groupMemberCounts,
                  [group]: response.totalGroupMembers || 0
                }).reduce((sum, count) => sum + count, 0)
              }
            : div
        )
      }));
    } catch (error) {
      set({ error: "Failed to fetch group members", isLoading: false });
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },

  addMember: async (division, group, member) => {
    try {
      await divisionsApi.createMember(division, group, {
        email: member.email,
        generatedPassword: member.password
      });
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

