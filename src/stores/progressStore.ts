// stores/attendanceStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface ProgressDataItem {
  label: string;
  percent: number;
  color: string;
  par: string;
}

interface AttendanceData {
  overall: number;
  lastWeek: number;
  lastMonth: number;
  progressData: ProgressDataItem[];
}

interface AttendanceStore {
  attendanceData: AttendanceData | null;
  loading: boolean;
  error: string | null;
  fetchAttendanceData: (memberId: string) => Promise<void>;
}

export const useAttendanceStore = create<AttendanceStore>((set) => ({
  attendanceData: null,
  loading: false,
  error: null,
  fetchAttendanceData: async (memberId: string,) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE}/attendance/member/${memberId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const apiData = response.data;
      console.log('API response data:', apiData);

      // Transform the API response to match your UI structure
      const transformedData: AttendanceData = {
        overall: apiData.overall?.percentage,
        lastWeek: apiData.week?.percentage ,
        lastMonth: apiData.month?.percentage ,
        progressData: [
          {
            label: 'Heads Up',
            percent: apiData.overall?.headsUp?.percentage,
            color: '#003087',
            par: `${apiData.overall?.headsUp?.count } `
          },
          {
            label: 'Present',
            percent: apiData.overall?.percentage,
            color: '#003087',
            par: `${apiData.overall?.present }/${apiData.overall?.total } sessions`
          },
          {
            label: 'Absent',
            percent: 100 - (apiData.overall?.percentage ),
            color: '#003087',
            par: `${(apiData.overall?.total ) - (apiData.overall?.present)} sessions`
          }
        ]
      };
      console.log('Transformed data:', transformedData);

      set({ attendanceData: transformedData, loading: false });
    } catch (error) {
      const errorMessage = axios.isAxiosError(error) 
        ? error.response?.data?.message || error.message
        : 'Failed to fetch attendance data';
      
      console.error('Error fetching attendance data:', error);
      set({ error: errorMessage, loading: false });
    }
  }
}));