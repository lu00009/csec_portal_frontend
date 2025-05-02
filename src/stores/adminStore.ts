import { useUserStore } from "@/stores/userStore";
import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const dummyRules = [
  { id: "1", name: "New Absences", description: "Head must approve this for request for review", value: 1 },
  { id: "2", name: "Warning After", description: "Send warning notification after this many absences", value: 3 },
  { id: "3", name: "Suspend After", description: "Suspend member automatically", value: 5 },
  { id: "4", name: "Fire After", description: "Remove member from the team after this many absences", value: 7 },
];

const dummyDivisions = ["CPO", "Development", "Cyber", "Data Science", "Design", "Marketing", "HR"];

interface AdminState {
  roles: Array<{ id: string; name: string; permissions: string[]; status: string }>;
  rules: Array<{ id: string; name: string; description: string; value: number }>;
  divisions: string[];
  loading: boolean;
  error: string | null;
  heads: Array<{
    id: string;
    name: string;
    division: string;
    role: string;
    email: string;
  }>;

  // Actions
  fetchHeads: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  fetchRules: () => Promise<void>;
  updateRule: (id: string, value: number) => Promise<void>;
  addHead: (head: { name: string; division: string; role: string; avatar?: string }) => Promise<void>;
  addRole: (role: { name: string; permissions: string[]; status: "active" | "inactive" }) => Promise<void>;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => {
        const { getAuthHeader, refreshSession } = useUserStore.getState();

        const fetchWithAuth = async (url: string, options: any = {}) => {
          console.debug(`Attempting request to: ${url}`);
          try {
            let headers = getAuthHeader();
            if (!headers) {
              console.debug("No auth headers found, refreshing session");
              await refreshSession();
              headers = getAuthHeader();
              if (!headers) throw new Error("Authentication failed after refresh");
            }

            const response = await axios({
              url,
              headers,
              ...options,
            });

            if (response.status < 200 || response.status >= 300) {
              throw new Error(`API responded with status ${response.status}`);
            }

            console.debug(`Request to ${url} succeeded`, response.data);
            return response;
          } catch (error) {
            console.error(`Request to ${url} failed:`, error);
            throw error;
          }
        };

        const processClubRole = (clubRole: string) => {
          const divisionMatch = clubRole.match(/(.+?) Division/);
          const roleMatch = clubRole.match(/Division (.+)/);
          return {
            division: divisionMatch ? divisionMatch[1] : "Unknown Division",
            role: roleMatch ? roleMatch[1] : "Unknown Role",
          };
        };

        return {
          heads: [],
          roles: [],
          rules: dummyRules,
          divisions: dummyDivisions,
          loading: false,
          error: null,

         // Update the fetchHeads function:
fetchHeads: async () => {
  console.debug("Starting to fetch heads");
  set({ loading: true, error: null });
  try {
    const response = await fetchWithAuth("https://csec-portal-backend-1.onrender.com/api/members/heads");
    
    // Validate API response structure
    if (!response.data || !Array.isArray(response.data.heads)) {
      throw new Error("Invalid API response format - expected array");
    }

    const rawHeads = response.data.heads;
    const processedHeads = rawHeads.map((head: any) => ({
      id: head._id,
      name: `${head.firstName} ${head.lastName}`,
      ...processClubRole(head.clubRole),
      email: head.email
    }));

    set({ heads: processedHeads, loading: false });
  } catch (error) {
    console.error("Failed to fetch heads:", error);
    set({
      heads: [], // Force reset to empty array
      error: error instanceof Error ? error.message : "Failed to fetch heads",
      loading: false
    });
  }
},
          fetchRoles: async () => {
            console.debug("Starting to fetch roles");
            set({ loading: true, error: null });
            try {
              const response = await fetchWithAuth("https://csec-portal-backend-1.onrender.com/api/admin/permissions");
              set({ roles: response.data, loading: false });
            } catch (error) {
              console.error("Failed to fetch roles:", error);
              set({
                error: error instanceof Error ? error.message : "Failed to fetch roles",
                loading: false,
                roles: [],
              });
            }
          },

          fetchRules: async () => {
            console.debug("Starting to fetch rules");
            set({ loading: true, error: null });
            try {
              const response = await fetchWithAuth("https://csec-portal-backend-1.onrender.com/api/admin/rules");
              set({ rules: response.data, loading: false });
            } catch (error) {
              console.error("Failed to fetch rules:", error);
              set({
                error: error instanceof Error ? error.message : "Failed to fetch rules",
                loading: false,
                rules: dummyRules,
              });
            }
          },

          updateRule: async (id, value) => {
            console.debug(`Updating rule ${id} to value ${value}`);
            set({ loading: true, error: null });
            try {
              await fetchWithAuth(`https://csec-portal-backend-1.onrender.com/api/admin/rules/${id}`, {
                method: "PUT",
                data: { value },
              });

              set((state) => ({
                rules: state.rules.map((rule) =>
                  rule.id === id ? { ...rule, value } : rule
                ),
                loading: false,
              }));
            } catch (error) {
              console.error("Failed to update rule:", error);
              set({
                error: error instanceof Error ? error.message : "Failed to update rule",
                loading: false,
              });
            }
          },

          addHead: async (head) => {
            console.debug("Adding new head:", head);
            set({ loading: true, error: null });
            try {
              await fetchWithAuth("https://csec-portal-backend-1.onrender.com/api/admin/heads", {
                method: "POST",
                data: {
                  name: head.name,
                  division: head.division,
                  role: head.role,
                  avatar: head.avatar || "/placeholder.svg",
                },
              });
              await get().fetchHeads(); // Refresh heads list
            } catch (error) {
              console.error("Failed to add head:", error);
              set({
                error: error instanceof Error ? error.message : "Failed to add head",
                loading: false,
              });
              throw error;
            }
          },

          addRole: async (role) => {
            console.debug("Adding new role:", role);
            set({ loading: true, error: null });
            try {
              await fetchWithAuth("https://csec-portal-backend-1.onrender.com/api/admin/roles", {
                method: "POST",
                data: role,
              });
              await get().fetchRoles(); // Refresh roles list
            } catch (error) {
              console.error("Failed to add role:", error);
              set({
                error: error instanceof Error ? error.message : "Failed to add role",
                loading: false,
              });
              throw error;
            }
          },
        };
      },
      {
        name: "admin-storage",
      }
    )
  )
);