import type { Group, Member, Session } from "@/types/attendance"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

// Generate dummy data
const dummyGroups: Group[] = [
  { id: "1", name: "Group 1", memberCount: 30 },
  { id: "2", name: "Group 2", memberCount: 25 },
  { id: "3", name: "Group 3", memberCount: 20 },
]

const dummyDivisions = ["Dev Division", "Design Division", "Marketing Division", "HR Division"]

const dummyMembers: Member[] = [
  {
    id: "1",
    name: "Dianne Russell",
    position: "UI/UX Designer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "present",
    excused: false,
  },
  {
    id: "2",
    name: "Arlene McCoy",
    position: "Frontend Developer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "absent",
    excused: true,
  },
  {
    id: "3",
    name: "Cody Fisher",
    position: "Product Designer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "present",
    excused: false,
  },
  {
    id: "4",
    name: "Theresa Webb",
    position: "Backend Developer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "absent",
    excused: false,
  },
  {
    id: "5",
    name: "Ronald Richards",
    position: "Full-stack Developer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "present",
    excused: true,
  },
  {
    id: "6",
    name: "Wade Warren",
    position: "UI Designer",
    avatar: "/placeholder.svg",
    groupId: "2",
    attendance: "present",
    excused: false,
  },
  {
    id: "7",
    name: "Brooklyn Simmons",
    position: "Product Manager",
    avatar: "/placeholder.svg",
    groupId: "2",
    attendance: "absent",
    excused: false,
  },
  {
    id: "8",
    name: "Kristin Watson",
    position: "Frontend Developer",
    avatar: "/placeholder.svg",
    groupId: "2",
    attendance: "present",
    excused: true,
  },
  {
    id: "9",
    name: "Jacob Jones",
    position: "Full-stack Developer",
    avatar: "/placeholder.svg",
    groupId: "2",
    attendance: "absent",
    excused: false,
  },
  {
    id: "10",
    name: "Cody Fisher",
    position: "Full-stack Developer",
    avatar: "/placeholder.svg",
    groupId: "2",
    attendance: "present",
    excused: false,
  },
  {
    id: "11",
    name: "Darlene Robertson",
    position: "UI Designer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "present",
    excused: false,
  },
  {
    id: "12",
    name: "Floyd Miles",
    position: "Backend Developer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "present",
    excused: false,
  },
  {
    id: "13",
    name: "Savannah Nguyen",
    position: "Product Manager",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "present",
    excused: false,
  },
  {
    id: "14",
    name: "Marvin McKinney",
    position: "UI/UX Designer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "absent",
    excused: true,
  },
  {
    id: "15",
    name: "Kathryn Murphy",
    position: "Product Designer",
    avatar: "/placeholder.svg",
    groupId: "1",
    attendance: "absent",
    excused: false,
  },
]

const dummySessions: Session[] = [
  {
    id: "1",
    title: "Development weekly session",
    division: "Dev Division",
    date: "Wednesday, Jul 31, 2023",
    status: "ended",
    groups: ["1", "2"],
  },
  {
    id: "2",
    title: "Development weekly session",
    division: "Dev Division",
    date: "Wednesday, Aug 7, 2023",
    status: "planned",
    groups: ["1", "2"],
  },
  {
    id: "3",
    title: "Design team meeting",
    division: "Design Division",
    date: "Wednesday, Aug 14, 2023",
    status: "ended",
    groups: ["1", "3"],
  },
  {
    id: "4",
    title: "Development weekly session",
    division: "Dev Division",
    date: "Wednesday, Aug 21, 2023",
    status: "planned",
    groups: ["1", "2", "3"],
  },
  {
    id: "5",
    title: "Marketing strategy session",
    division: "Marketing Division",
    date: "Thursday, Aug 22, 2023",
    status: "planned",
    groups: ["2", "3"],
  },
  {
    id: "6",
    title: "HR onboarding review",
    division: "HR Division",
    date: "Friday, Aug 23, 2023",
    status: "planned",
    groups: ["1"],
  },
  {
    id: "7",
    title: "Design review session",
    division: "Design Division",
    date: "Monday, Aug 26, 2023",
    status: "planned",
    groups: ["1", "2"],
  },
  {
    id: "8",
    title: "Marketing campaign planning",
    division: "Marketing Division",
    date: "Tuesday, Aug 27, 2023",
    status: "planned",
    groups: ["3"],
  },
]

interface AttendanceState {
  sessions: Session[]
  groups: Group[]
  members: Member[]
  divisions: string[]

  // Actions
  updateMemberAttendance: (memberId: string, status: "present" | "absent") => void
  updateMemberExcused: (memberId: string, excused: boolean) => void
  addHeadsUpNote: (memberId: string, type: string, reason: string) => void

  // API integration placeholders
  fetchSessions: () => Promise<void>
  fetchGroups: () => Promise<void>
  fetchMembers: (groupId: string) => Promise<void>
  saveAttendance: (groupId: string) => Promise<void>
}

export const useAttendanceStore = create<AttendanceState>()(
  devtools(
    persist(
      (set, get) => ({
        sessions: dummySessions,
        groups: dummyGroups,
        members: dummyMembers,
        divisions: dummyDivisions,

        updateMemberAttendance: (memberId, status) =>
          set((state) => ({
            members: state.members.map((member) =>
              member.id === memberId ? { ...member, attendance: status } : member,
            ),
          })),

        updateMemberExcused: (memberId, excused) =>
          set((state) => ({
            members: state.members.map((member) => (member.id === memberId ? { ...member, excused } : member)),
          })),

        addHeadsUpNote: (memberId, type, reason) => {
          // In a real implementation, you would store this information
          console.log(`Added heads up for member ${memberId}: ${type} - ${reason}`)
        },

        // API integration placeholders - these would be implemented when the API is ready
        fetchSessions: async () => {
          // This would be replaced with an actual API call
          console.log("Fetching sessions from API...")
          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500))
          // For now, we're using the dummy data
          return Promise.resolve()
        },

        fetchGroups: async () => {
          console.log("Fetching groups from API...")
          await new Promise((resolve) => setTimeout(resolve, 500))
          return Promise.resolve()
        },

        fetchMembers: async (groupId) => {
          console.log(`Fetching members for group ${groupId} from API...`)
          await new Promise((resolve) => setTimeout(resolve, 500))
          return Promise.resolve()
        },

        saveAttendance: async (groupId) => {
          const members = get().members.filter((m) => m.groupId === groupId)
          console.log(`Saving attendance for group ${groupId}:`, members)
          await new Promise((resolve) => setTimeout(resolve, 500))
          return Promise.resolve()
        },
      }),
      {
        name: "attendance-storage",
      },
    ),
  ),
)
