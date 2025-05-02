// stores/attendanceStore.ts
import { create } from 'zustand';
import axios from 'axios';

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
  fetchRecords: (memberId: string) => Promise<void>;
};

export const useAttendanceStore = create<AttendanceState>((set) => ({
  records: [],
  loading: false,

  fetchRecords: async (memberId: string) => {
    set({ loading: true });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/attendance/member/${memberId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }

      );
      const fetchedRecords = res.data?.overall?.records || [];
      set({ records: fetchedRecords });
    } catch (error) {
      console.error('Error fetching attendance:', error);
      set({ records: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
