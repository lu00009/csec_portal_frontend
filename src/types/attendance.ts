export interface Session {
    id: string
    title: string
    division: string
    date: string
    status: "planned" | "ended"
    groups: string[]
  }
  
  export interface Group {
    id: string
    name: string
    memberCount: number
  }
  
  export interface Member {
    id: string
    name: string
    position: string
    avatar: string
    groupId: string
    attendance: "present" | "absent" | null
    excused: boolean
    headsUpNotes?: {
      type: string
      reason: string
      timestamp: string
    }[]
  }
  