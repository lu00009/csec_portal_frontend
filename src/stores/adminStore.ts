import type { Head, Role, Rule } from "@/types/admin"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

// Generate dummy data
const dummyHeads: Head[] = [
  {
    id: "1",
    name: "Corinne Robertson",
    avatar: "/placeholder.svg?height=40&width=40",
    division: "CPO",
    role: "Head",
  },
  {
    id: "2",
    name: "Floyd Miles",
    avatar: "/placeholder.svg?height=40&width=40",
    division: "Development",
    role: "Head",
  },
  {
    id: "3",
    name: "Dianne Russell",
    avatar: "/placeholder.svg?height=40&width=40",
    division: "Cyber",
    role: "Head",
  },
  {
    id: "4",
    name: "Cody Fisher",
    avatar: "/placeholder.svg?height=40&width=40",
    division: "Data Science",
    role: "Head",
  },
  {
    id: "5",
    name: "Jacob Jones",
    avatar: "/placeholder.svg?height=40&width=40",
    division: "All",
    role: "Vice President",
  },
]

const dummyRoles: Role[] = [
  {
    id: "1",
    name: "Vice President",
    status: "active",
    permissions: ["Add Members", "Manage Members", "Schedule Sessions", "Create a Division"],
  },
  {
    id: "2",
    name: "Dev Head",
    status: "active",
    permissions: ["Upload Resources", "Manage Members", "Schedule Sessions", "Mark Attendance"],
  },
  {
    id: "3",
    name: "CBO President",
    status: "inactive",
    permissions: ["Schedule Sessions", "View All Division"],
  },
]

const dummyRules: Rule[] = [
  {
    id: "1",
    name: "New Absences",
    description: "Head must approve this for request for review",
    value: 1,
  },
  {
    id: "2",
    name: "Warning After",
    description: "Send warning notification after this many absences",
    value: 3,
  },
  {
    id: "3",
    name: "Suspend After",
    description: "Suspend member automatically",
    value: 5,
  },
  {
    id: "4",
    name: "Fire After",
    description: "Remove member from the team after this many absences",
    value: 7,
  },
]

const dummyDivisions = ["CPO", "Development", "Cyber", "Data Science", "Design", "Marketing", "HR"]

interface AdminState {
  heads: Head[]
  roles: Role[]
  rules: Rule[]
  divisions: string[]

  // Actions
  addHead: (head: Omit<Head, "id">) => void
  updateHead: (id: string, head: Partial<Head>) => void
  removeHead: (id: string) => void

  addRole: (role: Omit<Role, "id">) => void
  updateRole: (id: string, role: Partial<Role>) => void
  removeRole: (id: string) => void

  updateRule: (id: string, value: number) => void
}

export const useAdminStore = create<AdminState>()(
  devtools(
    persist(
      (set) => ({
        heads: dummyHeads,
        roles: dummyRoles,
        rules: dummyRules,
        divisions: dummyDivisions,

        addHead: (head) =>
          set((state) => ({
            heads: [...state.heads, { id: Date.now().toString(), ...head }],
          })),

        updateHead: (id, updatedHead) =>
          set((state) => ({
            heads: state.heads.map((head) => (head.id === id ? { ...head, ...updatedHead } : head)),
          })),

        removeHead: (id) =>
          set((state) => ({
            heads: state.heads.filter((head) => head.id !== id),
          })),

        addRole: (role) =>
          set((state) => ({
            roles: [...state.roles, { id: Date.now().toString(), ...role }],
          })),

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
      },
    ),
  ),
)
