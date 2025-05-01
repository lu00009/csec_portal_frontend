import type { AttendanceSubmission, Member, MemberAttendanceRecords, Session } from "@/types/attendance";
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Create an Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to inject the token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Function to fetch sessions and members for a specific session
export async function fetchSessionData(sessionId: string): Promise<{ session: Session; members: Member[] }> {
  try {
    const response = await apiClient.get(`/attendance/data/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching session data:", error);
    throw error;
  }
}

// Function to fetch member's attendance summary
export const fetchMemberAttendanceRecords = async (memberId: string): Promise<MemberAttendanceRecords> => {
  try {
    console.log(`[API] Fetching records for member ${memberId}`);
    const response = await apiClient.get(`/attendance/member/${memberId}`);

    console.log('[API] Raw response:', {
      status: response.status,
      data: response.data,
    });

    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid response format');
    }

    return {
      week: response.data.week || { records: [], percentage: 0, total: 0, present: 0, headsUp: { count: 0, percentage: 0 } },
      month: response.data.month || { records: [], percentage: 0, total: 0, present: 0, headsUp: { count: 0, percentage: 0 } },
      overall: response.data.overall || { records: [], percentage: 0, total: 0, present: 0, headsUp: { count: 0, percentage: 0 } }
    };
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
};

// Function to submit attendance
export async function submitAttendance(data: AttendanceSubmission): Promise<any> {
  try {
    const response = await apiClient.post('/attendance', data);
    return response.data;
  } catch (error) {
    console.error("Error submitting attendance:", error);
    throw error;
  }
}

export async function fetchAllSessions(page = 1, limit = 4): Promise<{ sessions: Session[]; totalSessions: number }> {
  try {
    const response = await apiClient.get('/sessions', {
      params: {
        page,
        limit
      }
    });
    return {
      sessions: response.data.sessions,
      totalSessions: response.data.totalSessions,
    };
  } catch (error) {
    console.error("Error fetching sessions:", error);
    throw error;
  }
}

export async function fetchMemberById(id: string) {
  if (!id || id === 'undefined') {
    throw new Error('Invalid member ID');
  }

  try {
    const response = await apiClient.get(`/members/${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Failed to fetch member: ${error.response?.statusText || error.message}`);
    } else {
      throw new Error(`Failed to fetch member: ${String(error)}`);
    }
  }
}