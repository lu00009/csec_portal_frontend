import { fetchAllSessions, fetchMemberAttendance, fetchSessionData, submitAttendance } from "@/lib/api"
import type { AttendanceSubmission, AttendanceSummary, Member, Session } from "@/types/attendance"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface AttendanceState {
  currentSession: Session | null
  members: Member[]
  selectedMember: string | null
  memberSummary: AttendanceSummary | null
  isLoading: boolean
  error: string | null
  sessions: Session[]
  totalSessions: number
  currentPage: number
  itemsPerPage: number
  // Actions
  fetchSessions: (page?: number, limit?: number) => Promise<void>
  setPagination: (page: number, limit: number) => void
  fetchSessionMembers: (sessionId: string) => Promise<void>
  fetchMemberSummary: (memberId: string) => Promise<void>
  updateMemberAttendance: (memberId: string, status: "present" | "absent") => void
  updateMemberExcused: (memberId: string, excused: boolean) => void
  addHeadsUpNote: (memberId: string, note: string) => void
  saveAttendance: (sessionId: string) => Promise<void>
  setSelectedMember: (memberId: string | null) => void
  clearError: () => void
}

export const useAttendanceStore = create<AttendanceState>()(
  devtools(
    persist(
      (set, get) => ({
        currentSession: null,
        members: [],
        selectedMember: null,
        memberSummary: null,
        isLoading: false,
        error: null,
        sessions: [],
        totalSessions: 0,
        currentPage: 1,
        itemsPerPage: 4,

        fetchSessions: async (page = get().currentPage, limit = get().itemsPerPage) => {
          set({ isLoading: true, error: null })
          try {
            const { sessions, totalSessions } = await fetchAllSessions(page, limit)
            set({ sessions, totalSessions: totalSessions, isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch sessions",
              isLoading: false,
            })
          }
        },

        setPagination: (page, limit) => {
          set({ currentPage: page, itemsPerPage: limit })
        },
    

        fetchSessionMembers: async (sessionId) => {
          set({ isLoading: true, error: null })
          try {
            const { session, members } = await fetchSessionData(sessionId)

            // Map the API response to our internal format
            const mappedMembers = members.map((member) => ({
              ...member,
              attendance: null,
              excused: false,
            }))

            set({
              currentSession: session,
              members: mappedMembers,
              isLoading: false,
            })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch session data",
              isLoading: false,
            })
          }
        },

        fetchMemberSummary: async (memberId) => {
          set({ isLoading: true, error: null })
          try {
            const summary = await fetchMemberAttendance(memberId)
            set({ memberSummary: summary, isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch member summary",
              isLoading: false,
            })
          }
        },

        updateMemberAttendance: (memberId, status) => {
          set((state) => ({
            members: state.members.map((member) =>
              member._id === memberId ? { ...member, attendance: status } : member,
            ),
          }))
        },

        updateMemberExcused: (memberId, excused) => {
          set((state) => ({
            members: state.members.map((member) => (member._id === memberId ? { ...member, excused } : member)),
          }))
        },

        addHeadsUpNote: (memberId, note) => {
          set((state) => ({
            members: state.members.map((member) =>
              member._id === memberId ? { ...member, headsUpNote: note } : member,
            ),
          }))
        },

        saveAttendance: async (sessionId) => {
          set({ isLoading: true, error: null })
          try {
            const { members } = get()

            // Filter members with attendance data
            const membersWithAttendance = members.filter((member) => member.attendance !== null)

            // Submit attendance for each member
            const promises = membersWithAttendance.map((member) => {
              const data: AttendanceSubmission = {
                sessionId,
                memberId: member._id,
                status: member.attendance!,
                excused: member.excused || false,
                headsUpNote: member.headsUpNote,
              }

              return submitAttendance(data)
            })

            await Promise.all(promises)
            set({ isLoading: false })
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to save attendance",
              isLoading: false,
            })
          }
        },

        setSelectedMember: (memberId) => {
          set({ selectedMember: memberId })
        },

        clearError: () => {
          set({ error: null })
        },
      }),
      {
        name: "attendance-storage",
      },
    ),
  ),
)
