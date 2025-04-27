
import type { AttendanceSubmission, MemberAttendanceRecords, Member, Session } from "@/types/attendance";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

// Function to fetch sessions and members for a specific session
export async function fetchSessionData(sessionId: string): Promise<{ session: Session; members: Member[] }> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/data/${sessionId}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching session data:", error)
    throw error
  }
}

// Function to fetch member's attendance summary

export const fetchMemberAttendanceRecords = async (memberId: string): Promise<MemberAttendanceRecords> => {
  try {
    console.log(`[API] Fetching records for member ${memberId}`);
    
    const response = await fetch(`${API_BASE_URL}/attendance/member/${memberId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch records. Status: ${response.status}`);
    }

    const data = await response.json();

    console.log('[API] Raw response:', {
      status: response.status,
      data,
    });

    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response format');
    }

    return {
      week: data.week || { records: [], percentage: 0, total: 0, present: 0, headsUp: { count: 0, percentage: 0 } },
      month: data.month || { records: [], percentage: 0, total: 0, present: 0, headsUp: { count: 0, percentage: 0 } },
      overall: data.overall || { records: [], percentage: 0, total: 0, present: 0, headsUp: { count: 0, percentage: 0 } }
    };
    
  } catch (error) {
    console.error('[API] Fetch error:', error);
    throw error;
  }
};


// Function to submit attendance
export async function submitAttendance(data: AttendanceSubmission): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error submitting attendance:", error)
    throw error
  }
}

export async function fetchAllSessions(page = 1, limit = 4): Promise<{ sessions: Session[]; totalSessions: number }> {
  try {
    const response = await fetch(`${API_BASE_URL}/sessions?page=${page}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    return {
      sessions: data.sessions,
      totalSessions: data.totalSessions,
    }
  } catch (error) {
    console.error("Error fetching sessions:", error)
    throw error
  }
}



export async function fetchMemberById(id: string) {
  if (!id || id === 'undefined') {
    throw new Error('Invalid member ID');
  }

  const res = await fetch(`https://csec-portal-backend-1.onrender.com/api/members/${id}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`, // ← maybe change this key!


    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch member: ${res.statusText}`);
  }

  return await res.json();
}

