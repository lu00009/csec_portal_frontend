// src/stores/adminStore.ts
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axios from "axios";
import { toast } from "sonner";

interface Head {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  clubRole: string;
  permissionStatus?: string;
  permissions?: string[];
}

interface Role {
  id: string;
  name: string;
  status: string;
  permissions: string[];
}

interface Rule {
  ClubRules:{
    _id: string;
    name: string;
    description: string;
    value: number;
  }
 
}

interface Member {
  _id: string;
  name: string;
 clubRole: string;
 permissionStatus?: string;
 permissions?: string[];
}

interface AdminState {
  heads: Head[];
  roles: Role[];
  rules: Rule[];
  members: Member[];
  selectedMembers: string[];
  loading: boolean;
  error: string | null;

  // Heads actions
  fetchHeads: (token: string) => Promise<void>;
  addHead: (head: Omit<Head, "_id">, token: string) => Promise<void>;
  updateHead: (id: string, updates: Partial<Head>, token: string) => Promise<void>;
  removeHead: (id: string, token: string) => Promise<void>;

  // Roles actions
  fetchRoles: (token: string) => Promise<void>;
  addRole: (role: Omit<Role, "id">, token: string) => Promise<void>;
  updateRole: (id: string, updates: Partial<Role>, token: string) => Promise<void>;
  removeRole: (id: string, token: string) => Promise<void>;

  // Rules actions
  fetchRules: (token: string) => Promise<void>;
  updateRule: (id: string, value: number, token: string) => Promise<void>;

  // Members actions
  fetchMembers: (token: string) => Promise<void>;
  toggleMemberSelection: (id: string) => void;
  clearSelectedMembers: () => void;
  banMembers: (token: string) => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        heads: [],
        roles: [],
        rules: [],
        members: [],
        selectedMembers: [],
        loading: false,
        error: null,

        // Heads
        fetchHeads: async (token) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.get(
              "https://csec-portal-backend-1.onrender.com/api/members/heads",
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            
            // Check if response.data is an array or needs to be extracted differently
            const headsData = Array.isArray(response.data) 
              ? response.data 
              : response.data.heads || [];
              
            set({ heads: headsData, loading: false });
          } catch (error) {
            set({ error: "Failed to fetch heads", loading: false });
            toast.error("Failed to fetch heads");
          }
        },

        addHead: async (head, token) => {
          set({ loading: true, error: null });
          try {
            await axios.post(
              "https://csec-portal-backend-1.onrender.com/api/admin/heads",
              {
                division: head.clubRole.includes("Division") 
                  ? head.clubRole.split(" Division")[0] + " Division"
                  : head.clubRole,
                name: `${head.firstName} ${head.lastName}`,
                email: head.email,
                role: head.clubRole,
              },
              {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              }
            );
            await get().fetchHeads(token);
            toast.success("Head added successfully");
          } catch (error) {
            set({ error: "Failed to add head", loading: false });
            toast.error("Failed to add head");
          }
        },

        updateHead: async (id, updates, token) => {
          set({ loading: true, error: null });
          try {
            // Implement update API call if available
            // await axios.put(`/api/heads/${id}`, updates, { headers... });
            await get().fetchHeads(token);
            toast.success("Head updated successfully");
          } catch (error) {
            set({ error: "Failed to update head", loading: false });
            toast.error("Failed to update head");
          }
        },

        removeHead: async (id, token) => {
          set({ loading: true, error: null });
          try {
            // Implement delete API call if available
            // await axios.delete(`/api/heads/${id}`, { headers... });
            await get().fetchHeads(token);
            toast.success("Head removed successfully");
          } catch (error) {
            set({ error: "Failed to remove head", loading: false });
            toast.error("Failed to remove head");
          }
        },

        // Roles
        fetchRoles: async (token) => {
          set({ loading: true, error: null });
          try {
            // Implement roles API call if available
            // const response = await axios.get("/api/roles", { headers... });
            // set({ roles: response.data, loading: false });

            set({ loading: false });
          } catch (error) {
            set({ error: "Failed to fetch roles", loading: false });
            toast.error("Failed to fetch roles");
          }
        },

        addRole: async (role, token) => {
          set({ loading: true, error: null });
          try {
            await axios.post(
              "https://csec-portal-backend-1.onrender.com/api/admin/permissions",
              {
                role: role.name,
                permissions: role.permissions,
                permissionStatus: role.status.toUpperCase(),
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            await get().fetchRoles(token);
            toast.success("Role added successfully");
          } catch (error) {
            set({ error: "Failed to add role", loading: false });
            toast.error("Failed to add role");
          }
        },

        updateRole: async (id, updates, token) => {
          set({ loading: true, error: null });
          try {
            // Implement update API call if available
            // await axios.put(`/api/roles/${id}`, updates, { headers... });
            await get().fetchRoles(token);
            toast.success("Role updated successfully");
          } catch (error) {
            set({ error: "Failed to update role", loading: false });
            toast.error("Failed to update role");
          }
        },

        removeRole: async (id, token) => {
          set({ loading: true, error: null });
          try {
            // Implement delete API call if available
            // await axios.delete(`/api/roles/${id}`, { headers... });
            await get().fetchRoles(token);
            toast.success("Role removed successfully");
          } catch (error) {
            set({ error: "Failed to remove role", loading: false });
            toast.error("Failed to remove role");
          }
        },

        // Rules
    fetchRules: async (token) => {
  set({ loading: true, error: null });
  try {
    console.log("Fetching rules...");
    const response = await axios.get(
      "https://csec-portal-backend-1.onrender.com/api/rules",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    
    // Check if response.data is an array or needs to be extracted differently
    const rulesData = response.data || [];
      
    set({ rules: rulesData, loading: false });
    console.log('rules fetched',rulesData
    );
  } catch (error) {
    set({ error: "Failed to fetch rules", loading: false });
    toast.error("Failed to fetch rules");
  }
},

        updateRule: async (id, value, token) => {
          set({ loading: true, error: null });
          try {
            // Implement update API call if available
            // await axios.put(`/api/rules/${id}`, { value }, { headers... });
            await get().fetchRules(token);
            toast.success("Rule updated successfully");
          } catch (error) {
            set({ error: "Failed to update rule", loading: false });
            toast.error("Failed to update rule");
          }
        },

        // Members
        fetchMembers: async (token) => {
          set({ loading: true, error: null });
          try {
            // Implement members API call
            // This is a placeholder - replace with actual API call
            const dummyMembers: Member[] = [
              {
                _id: "1",
                name: "Darlene Robertson",
                memberId: "UGR/25605/14",
                division: "Design",
                status: "Active",
                year: "4th",
                campusStatus: "On Campus",
              },
              {
                _id: "2",
                name: "Floyd Miles",
                memberId: "UGR/25605/14",
                division: "Development",
                status: "Active",
                year: "5th",
                campusStatus: "Off Campus",
              },
              {
                _id: "3",
                name: "Cody Fisher",
                memberId: "UGR/25605/14",
                division: "CPD",
                status: "Needs Attention",
                year: "3rd",
                campusStatus: "Withdrawn",
              },
            ];
            set({ members: dummyMembers, loading: false });
          } catch (error) {
            set({ error: "Failed to fetch members", loading: false });
            toast.error("Failed to fetch members");
          }
        },

        toggleMemberSelection: (id) => {
          set((state) => {
            const selected = [...state.selectedMembers];
            const index = selected.indexOf(id);
            if (index === -1) {
              selected.push(id);
            } else {
              selected.splice(index, 1);
            }
            return { selectedMembers: selected };
          });
        },

        clearSelectedMembers: () => {
          set({ selectedMembers: [] });
        },

        banMembers: async (token) => {
          const { selectedMembers, members } = get();
          if (selectedMembers.length === 0) {
            toast.warning("No members selected");
            return;
          }

          set({ loading: true, error: null });
          try {
            const emails = members
              .filter((member) => selectedMembers.includes(member._id))
              .map((member) => member.email); // Assuming email is available

            await axios.put(
              "https://csec-portal-backend-1.onrender.com/api/admin/banMembers",
              { emails },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            
            await get().fetchMembers(token);
            set({ selectedMembers: [] });
            toast.success("Members banned successfully");
          } catch (error) {
            set({ error: "Failed to ban members", loading: false });
            toast.error("Failed to ban members");
          }
        },
      }),
      {
        name: "admin-storage",
      }
    )
  )
);