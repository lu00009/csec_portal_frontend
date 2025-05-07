// stores/attendanceStore.ts
import axios from 'axios';
import { create } from 'zustand';

type RecordItem = {
  _id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Excused';
  sessionTitle: string;
  startTime: string;
  endTime: string;
};

type AttendanceState = {
  records: RecordItem[];
  loading: boolean;
  error: string | null;
  fetchRecords: (memberId: string) => Promise<void>;
};

export const useProfileAttendanceStore = create<AttendanceState>((set) => ({
  records: [],
  loading: false,
  error: null,

  fetchRecords: async (memberId: string) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/attendance/member/${memberId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      const fetchedRecords = res.data?.overall?.records || [];
      set({ records: fetchedRecords, error: null });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      set({ 
        records: [],
        error: error instanceof Error ? error.message : 'Failed to fetch attendance records'
      });
    } finally {
      set({ loading: false });
    }
  },
}));
