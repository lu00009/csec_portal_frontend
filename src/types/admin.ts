import { Member } from './member';

export interface Head {
    id: string
    name: string
    avatar: string
    division: string
    role: string
    email: string
    permissions: string[]
    permissionStatus: 'active' | 'inactive'
  }
  
  export interface Role {
    id: string
    name: string
    status: "active" | "inactive"
    permissions: string[]
  }
  
  export interface Rule {
    id: string
    name: string
    description: string
    value: number
  }
  
  export interface ClubRules {
    maxAbsences: number
    warningAfter: number
    suspendAfter: number
    fireAfter: number
  }
  
  export type { Member }
  