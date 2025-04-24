
import type { AttendanceSubmission, AttendanceSummary, Member, Session } from "@/types/attendance";

const API_BASE_URL = "https://csec-portal-backend-1.onrender.com/api"

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
export async function fetchMemberAttendance(memberId: string): Promise<AttendanceSummary> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance/member/${memberId}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error fetching member attendance:", error)
    throw error
  }
}

// Function to submit attendance
export async function submitAttendance(data: AttendanceSubmission): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/attendance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch member: ${res.statusText}`);
  }

  return await res.json();
}

