// Updated types based on the API response structure
export interface Session {
  _id: string
  sessionTitle: string
  division: string
  groups: string[]
  startDate: string
  endDate: string
  sessions: SessionTime[]
  status: "Planned" | "Ended"
}

export interface SessionTime {
  _id: string
  day: string
  startTime: string
  endTime: string
}

export interface Member {
  _id: string
  firstName?: string
  lastName?: string
  division: string
  group: string
  attendance?: "present" | "absent" | null
  excused?: boolean
  headsUpNote?: string
}

export interface AttendanceRecord {
  _id: string
  date: string
  status: "Present" | "Absent" | "Excused"
  sessionTitle: string
  day: string
  startTime: string
  endTime: string
  headsUp?: string
}

export interface AttendanceSummary {
  week: SummaryPeriod
  month: SummaryPeriod
  overall: SummaryPeriod
}

export interface SummaryPeriod {
  percentage: number
  total: number
  present: number
  headsUp: {
    count: number
    percentage: number
  }
  records: AttendanceRecord[]
}

export interface AttendanceSubmission {
  sessionId: string
  memberId: string
  status: "present" | "absent"
  excused: boolean
  headsUpNote?: string
}
