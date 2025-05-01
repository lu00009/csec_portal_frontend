export type Division = {
    id: string
    name: string
    memberCount: number
    head: string
    groups: string[]
  }
  
  export type Group = {
    id: string
    name: string
    memberCount: number
  }
  
  export type Member = {
    id: string
    name: string
    email: string
    memberId: string
    role: string
    status: string
    attendance: string
    avatar: string
    clubRole: string
    campusStatus: string
  }