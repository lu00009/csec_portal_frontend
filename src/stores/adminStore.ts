import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Member } from "@/types/member";

interface ClubRules {
  _id: string;
  fireAfter: number;
  maxAbsences: number;
  suspendAfter: number;
  warningAfter: number;
  updatedAt: string;
  __v: number;
}
interface Rule {
  ClubRules: ClubRules;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
  status: "active" | "inactive";
}

interface Head {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  permissions?: string[];
  permissionStatus?: "active" | "inactive";
}

interface AdminState {
  members: Member[];
  roles: Role[];
  rules: Rule | null  
  divisions: string[];
  loading: boolean;
  error: string | null;
  heads: Head[];
  updateHead: (id: string, updates: Partial<Head>) => Promise<void>;
  updateRole: (id: string, updates: Partial<Role>) => Promise<void>;
  getActiveMembers: () => Member[];

  // Actions
  fetchHeads: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchRules: () => Promise<void>;
  updateRule: (id: string, value: number) => Promise<void>;
  addHead: (head: Omit<Head, "id">) => Promise<void>;
  addRole: (role: Omit<Role, "id">) => Promise<void>;
  banMember: (id: string) => Promise<void>;
}

const API_BASE_URL = "https://csec-portal-backend-1.onrender.com/api";

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => {
        const { getAuthHeader, refreshSession } = useUserStore.getState();

        const getAuthHeaders = async () => {
          let headers = getAuthHeader();
          if (!headers) {
            await refreshSession();
            headers = getAuthHeader();
            if (!headers) throw new Error("Authentication failed");
          }
          return headers;
        };

        return {
          heads: [],
          roles: [],
          rules: [
            { id: "1", name: "New Absences", description: "Head must approve this for request for review", value: 1 },
            { id: "2", name: "Warning After", description: "Send warning notification after this many absences", value: 3 },
            { id: "3", name: "Suspend After", description: "Suspend member automatically", value: 5 },
            { id: "4", name: "Fire After", description: "Remove member from the team after this many absences", value: 7 },
          ],
          divisions: ["CPO", "Development", "Cyber", "Data Science", "Design", "Marketing", "HR"],
          loading: false,
          error: null,

          fetchHeads: async () => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              const response = await axios.get(`${API_BASE_URL}/members/heads`, { headers },);
              
              const processedHeads = response.data.heads.map((head: any) => ({
                id: head._id,
                name: `${head.firstName} ${head.lastName}`,
                division: head.division || "Unknown Division",
                role: head.clubRole || "Unknown Role",
                email: head.email,
                avatar: head.profilePicture,
                permissions: head.permissions || [],
                permissionStatus: head.permissionStatus || "inactive",
              }));

              set({ heads: processedHeads, loading: false });
            } catch (error: any) {
              set({
                error: error.message || "Failed to fetch heads",
                loading: false,
                heads: []
              });
            }
          },

          // fetchRoles: async () => {
          //   set({ loading: true, error: null });
          //   try {
          //     const headers = await getAuthHeaders();
          //     const response = await axios.get(`${API_BASE_URL}/admin/permissions`, { headers });
          //     set({ roles: response.data, loading: false });
          //   } catch (error: any) {
          //     set({
          //       error: error.message || "Failed to fetch roles",
          //       loading: false,
          //       roles: []
          //     });
          //   }
          // },

          fetchRules: async () => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              const response = await axios.get(`${API_BASE_URL}/rules`, { headers });
              set({ rules: response.data, loading: false });
            } catch (error: any) {
              set({
                error: error.message || "Failed to fetch rules",
                loading: false,
                rules: []
              });
            }
          },
          addHead: async (head) => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              const response = await axios.post(`${API_BASE_URL}/admin/heads`, {
                name: head.name,
                division: head.division,
                role: head.role,
                avatar: head.avatar || "/placeholder.svg"
              }, { headers });
              
              set(state => ({
                heads: [...state.heads, {
                  ...head,
                  id: response.data._id,
                  email: response.data.email || ""
                }],
                loading: false
              }));
            } catch (error: any) {
              set({
                error: error.message || "Failed to add head",
                loading: false
              });
            }
          },

          addRole: async (role) => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              const response = await axios.post(`${API_BASE_URL}/admin/roles`, role, { headers });
              
              set(state => ({
                roles: [...state.roles, {
                  ...role,
                  id: response.data._id
                }],
                loading: false
              }));
            } catch (error: any) {
              set({
                error: error.message || "Failed to add role",
                loading: false
              });
            }
          },

          banMember: async (id) => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              await axios.post(`${API_BASE_URL}/admin/banMembers`, { memberId: id }, { headers });
              
              set(state => ({
                heads: state.heads.filter(head => head.id !== id),
                loading: false
              }));
            } catch (error: any) {
              set({
                error: error.message || "Failed to ban member",
                loading: false
              });
            }
          },
          updateHead: async (id, updates) => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              await axios.patch(`${API_BASE_URL}/admin/heads/${id}`, updates, { headers });
              set(state => ({
                heads: state.heads.map(head => 
                  head.id === id ? { ...head, ...updates } : head
                ),
                loading: false
              }));
            } catch (error: any) {
              set({
                error: error.message || "Failed to update head",
                loading: false
              });
            }
          },
          
          updateRole: async (id, updates) => {
            set({ loading: true, error: null });
            try {
              const headers = await getAuthHeaders();
              await axios.patch(`${API_BASE_URL}/admin/roles/${id}`, updates, { headers });
              set(state => ({
                roles: state.roles.map(role => 
                  role.id === id ? { ...role, ...updates } : role
                ),
                loading: false
              }));
            } catch (error: any) {
              set({
                error: error.message || "Failed to update role",
                loading: false
              });
            }
          },
          
          getActiveMembers: () => {
            return members.filter(member => member.status === 'active');
          }
        };
      },
      {
        name: "admin-storage",
      }
    )
  )
);