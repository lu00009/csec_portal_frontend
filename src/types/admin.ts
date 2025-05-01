export interface Head {
    id: string
    name: string
    avatar: string
    division: string
    role: string
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
  