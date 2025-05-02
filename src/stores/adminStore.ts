import type { Head, Role, Rule } from "@/types/admin";
import axios from "axios";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Dummy data for rules and divisions (no API provided)
const dummyRules: Rule[] = [
  { id: "1", name: "New Absences", description: "Head must approve this for request for review", value: 1 },
  { id: "2", name: "Warning After", description: "Send warning notification after this many absences", value: 3 },
  { id: "3", name: "Suspend After", description: "Suspend member automatically", value: 5 },
  { id: "4", name: "Fire After", description: "Remove member from the team after this many absences", value: 7 },
];

const dummyDivisions = ["CPO", "Development", "Cyber", "Data Science", "Design", "Marketing", "HR"];

interface AdminState {
  heads: Head[];
  roles: Role[];
  rules: Rule[];
  divisions: string[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchHeads: () => Promise<void>;
  fetchRoles: () => Promise<void>;
  addHead: (head: Omit<Head, "id">) => Promise<void>;
  updateHead: (id: string, head: Partial<Head>) => void;
  removeHead: (id: string) => void;

  addRole: (role: Omit<Role, "id">) => Promise<void>;
  updateRole: (id: string, role: Partial<Role>) => void;
  removeRole: (id: string) => void;

  updateRule: (id: string, value: number) => void;
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set, get) => ({
        heads: [],
        roles: [],
        rules: dummyRules,
        divisions: dummyDivisions,
        loading: false,
        error: null,

        // Fetch heads from API
        fetchHeads: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axios.get("https://csec-portal-backend-1.onrender.com/api/members/heads", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            });
            set({ heads: response.data, loading: false });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch heads", loading: false });
          }
        },

        // Fetch roles from API
        fetchRoles: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axios.get("https://csec-portal-backend-1.onrender.com/api/admin/permissions", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            });
            set({ roles: response.data, loading: false });
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to fetch roles", loading: false });
          }
        },
        fetchRules: async () => {
          set({ loading: true, error: null });
          try {
            const response = await axios.get("https://csec-portal-backend-1.onrender.com/api/admin/rules", {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`
              }
            });
            set({ rules: response.data, loading: false });
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : "Failed to fetch rules",
              loading: false 
            });
          }
        },
        
        updateRule: async (id, value) => {
          set({ loading: true, error: null });
          try {
            await axios.put(`https://csec-portal-backend-1.onrender.com/api/admin/rules/${id}`, 
              { value },
              { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
            );
            set(state => ({
              rules: state.rules.map(rule => 
                rule.id === id ? { ...rule, value } : rule
              ),
              loading: false
            }));
          } catch (error) {
            set({ 
              error: error instanceof Error ? error.message : "Failed to update rule",
              loading: false 
            });
          }
        },
        // Add head via API
        addHead: async (head) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post(
              "https://csec-portal-backend-1.onrender.com/api/members/heads",
              head,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );
            set((state) => ({
              heads: [...state.heads, response.data],
              loading: false,
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to add head", loading: false });
            throw error;
          }
        },

        updateHead: (id, updatedHead) =>
          set((state) => ({
            heads: state.heads.map((head) => (head.id === id ? { ...head, ...updatedHead } : head)),
          })),

        removeHead: (id) =>
          set((state) => ({
            heads: state.heads.filter((head) => head.id !== id),
          })),

        // Add role via API
        addRole: async (role) => {
          set({ loading: true, error: null });
          try {
            const response = await axios.post(
              "https://csec-portal-backend-1.onrender.com/api/admin/permissions",
              role,
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
              }
            );
            set((state) => ({
              roles: [...state.roles, response.data],
              loading: false,
            }));
          } catch (error) {
            set({ error: error instanceof Error ? error.message : "Failed to add role", loading: false });
            throw error;
          }
        },

        updateRole: (id, updatedRole) =>
          set((state) => ({
            roles: state.roles.map((role) => (role.id === id ? { ...role, ...updatedRole } : role)),
          })),

        removeRole: (id) =>
          set((state) => ({
            roles: state.roles.filter((role) => role.id !== id),
          })),

        updateRule: (id, value) =>
          set((state) => ({
            rules: state.rules.map((rule) => (rule.id === id ? { ...rule, value } : rule)),
          })),
      }),
      {
        name: "admin-storage",
      }
    )
  )
);