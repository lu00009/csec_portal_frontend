import { 
  fetchAllSessions as apiFetchAllSessions,
  fetchMemberAttendanceRecords as apiFetchMemberAttendance,
  fetchSessionData as apiFetchSessionData,
  submitAttendance as apiSubmitAttendance,
  fetchMemberAttendanceRecords as apiFetchMemberAttendanceRecords 
} from "@/lib/api";
import type { MemberAttendanceRecords, Member, Session } from "@/types/attendance";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AttendanceState {
  currentSession: Session | null;
  members: Member[];
  selectedMember: string | null;
  memberSummary: MemberAttendanceRecords | null;
  memberAttendanceRecords: MemberAttendanceRecords | null;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  sessions: Session[];
  totalSessions: number;
  currentPage: number;
  itemsPerPage: number;

  // Actions
  fetchSessions: (page?: number, limit?: number) => Promise<void>;
  setPagination: (page: number, limit: number) => void;
  fetchSessionMembers: (sessionId: string) => Promise<void>;
  fetchMemberSummary: (memberId: string) => Promise<void>;
  fetchMemberAttendanceRecords: (memberId: string) => Promise<void>;
  updateMemberAttendance: (memberId: string, status: "present" | "absent" | "excused") => void;
  updateMemberExcused: (memberId: string, excused: boolean) => void;
  addHeadsUpNote: (memberId: string, note: string) => void;
  saveAttendance: (sessionId: string) => Promise<void>;
  setSelectedMember: (memberId: string | null) => void;
  clearError: () => void;
  clearSuccess: () => void;
}

export const useAttendanceStore = create<AttendanceState>()(
  devtools(
    persist(
      (set, get) => ({
        currentSession: null,
        members: [],
        selectedMember: null,
        memberSummary: null,
        memberAttendanceRecords: null,
        isLoading: false,
        error: null,
        success: null,
        sessions: [],
        totalSessions: 0,
        currentPage: 1,
        itemsPerPage: 4,

        fetchSessions: async (page = get().currentPage, limit = get().itemsPerPage) => {
          set({ isLoading: true, error: null });
          try {
            const { sessions, totalSessions } = await apiFetchAllSessions(page, limit);
            set({ sessions, totalSessions, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch sessions",
              isLoading: false,
            });
          }
        },

        setPagination: (page, limit) => {
          set({ currentPage: page, itemsPerPage: limit });
        },

        fetchSessionMembers: async (sessionId) => {
          set({ isLoading: true, error: null });
          try {
            const { session, members } = await apiFetchSessionData(sessionId);
            const mappedMembers = members.map((member) => ({
              ...member,
              attendance: null,
              excused: false,
            }));
            set({
              currentSession: session,
              members: mappedMembers,
              isLoading: false,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch session data",
              isLoading: false,
            });
          }
        },

        fetchMemberSummary: async (memberId) => {
          set({ isLoading: true, error: null });
          try {
            const summary = await apiFetchMemberAttendance(memberId);
            set({ memberSummary: summary, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to fetch member summary",
              isLoading: false,
            });
          }
        },

        fetchMemberAttendanceRecords: async (memberId) => {
          set({ isLoading: true, error: null });
          try {
            console.log('[Store] Fetching records for:', memberId);
            const data = await apiFetchMemberAttendanceRecords(memberId);
            
            console.log('[Store] Received data:', JSON.stringify(data, null, 2));
            
            // Validate records exist
            const hasRecords = data.week.records.length > 0 || 
                              data.month.records.length > 0 || 
                              data.overall.records.length > 0;
            
            if (!hasRecords) {
              console.warn('[Store] No records found in response');
            }
        
            set({
              memberAttendanceRecords: data,
              isLoading: false,
            });
          } catch (error) {
            console.error('[Store] Error details:', {
              error,
              memberId,
              time: new Date().toISOString()
            });
            set({
              error: error instanceof Error ? error.message : "Failed to fetch records",
              isLoading: false,
            });
          }
        },

        updateMemberAttendance: (memberId, status) => {
          set((state) => ({
            members: state.members.map((member) =>
              member._id === memberId ? { ...member, attendance: status } : member,
            ),
          }));
        },

        updateMemberExcused: (memberId, excused) => {
          set((state) => ({
            members: state.members.map((member) =>
              member._id === memberId ? { ...member, excused } : member,
            ),
          }));
        },

        addHeadsUpNote: (memberId, note) => {
          set((state) => ({
            members: state.members.map((member) =>
              member._id === memberId ? { ...member, headsUpNote: note } : member,
            ),
          }));
        },

        saveAttendance: async (sessionId) => {
          set({ isLoading: true, error: null, success: null });
          try {
            const { members } = get();
            const membersWithAttendance = members.filter((member) => member.attendance !== null);

            const payload = {
              sessionId,
              records: membersWithAttendance.map((member) => ({
                memberId: member._id,
                status: member.attendance!,
                excused: member.excused || false,
                ...(member.headsUpNote && { headsUp: member.headsUpNote })
              })),
            };

            await apiSubmitAttendance(payload);
            set({ isLoading: false, success: "Attendance saved successfully!" });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Failed to save attendance",
              isLoading: false,
            });
          }
        },

        setSelectedMember: (memberId) => {
          set({ selectedMember: memberId });
        },

        clearError: () => {
          set({ error: null });
        },

        clearSuccess: () => {
          set({ success: null });
        },
      }),
      {
        name: "attendance-storage",
      },
    ),
  ),
);