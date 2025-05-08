import {
    fetchAllSessions as apiFetchAllSessions,
    fetchMemberAttendanceRecords as apiFetchMemberAttendance,
    fetchMemberAttendanceRecords as apiFetchMemberAttendanceRecords,
    fetchSessionData as apiFetchSessionData,
    submitAttendance as apiSubmitAttendance
} from "@/lib/api/attendanceApi";
import type { Member, MemberAttendanceRecords, Session } from "@/types/attendance";
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
  attendanceTakenSessions: string[];

  // Actions
  fetchSessions: (page?: number, limit?: number) => Promise<void>;
  setPagination: (page: number, limit: number) => void;
  fetchSessionMembers: (sessionId: string) => Promise<void>;
  fetchMemberSummary: (memberId: string) => Promise<void>;
  fetchMemberAttendanceRecords: (memberId: string) => Promise<void>;
  updateMemberAttendance: (memberId: string, status: "Present" | "Absent" | "Excused") => void;
  updateMemberExcused: (memberId: string, excused: boolean) => void;
  addHeadsUpNote: (memberId: string, note: string) => void;
  saveAttendance: (sessionId: string) => Promise<{ status: string; error?: string }>;
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
        attendanceTakenSessions: [],

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
              member._id === memberId ? { ...member, attendance: status } : member
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

        saveAttendance: async (sessionId: string): Promise<{ status: string; error?: string }> => {
          set({ isLoading: true, error: null, success: null });
          try {
            const { members, attendanceTakenSessions, sessions } = get();
            // Prevent duplicate attendance
            if (attendanceTakenSessions.includes(sessionId)) {
              set({ isLoading: false });
              return { status: 'already_taken' };
            }
            // Find session and check if it's ongoing
            const session = sessions.find(s => s._id === sessionId);
            if (!session) {
              set({ isLoading: false });
              return { status: 'invalid_session' };
            }
            // Only allow if session is ongoing
            if (session.status.toLowerCase() !== 'ongoing') {
              set({ isLoading: false });
              return { status: 'not_allowed' };
            }
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
            set(state => ({
              isLoading: false,
              success: 'Attendance saved successfully!',
              attendanceTakenSessions: [...state.attendanceTakenSessions, sessionId],
            }));
            return { status: 'success' };
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save attendance';
            set({
              error: errorMessage,
              isLoading: false,
            });
            return { status: 'error', error: errorMessage };
          }
        },

        setSelectedMember: (memberId: string | null) => {
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