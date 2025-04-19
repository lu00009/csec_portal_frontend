import { toast } from 'react-hot-toast';
import { create } from 'zustand';
import { UserRole, useUserStore } from './userStore';

interface Division {
  id: string
  name: string
  headName: string
  headEmail: string
  createdAt: string
}

interface DivisionStore {
  divisions: Division[]
  loading: boolean
  error: string | null
  fetchDivisions: () => Promise<void>
  createDivision: (data: {
    divisionName: string
    headName: string
    email: string
  }) => Promise<void>
  canCreateDivision: (user: { member?: { clubRole?: UserRole } } | null) => boolean
  resetError: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export const useDivisionStore = create<DivisionStore>((set, get) => ({
  divisions: [],
  loading: false,
  error: null,

  fetchDivisions: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/divisions/allDivisions`, {
        headers: {
          'Authorization': `Bearer ${useUserStore.getState().user?.member.refreshToken}` // Use access token
        }
      })
      
      if (!response.ok) throw new Error('Failed to fetch divisions')
      
      const data = await response.json()
      // Handle both nested and flat responses
      const divisions = data.divisions || data || []
      set({ divisions })
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to load divisions' })
    } finally {
      set({ loading: false })
    }
  },

  createDivision: async ({ divisionName, headName, email }) => {
    const { user } = useUserStore.getState()
    
    const mappedUser = user ? { member: { clubRole: user.member.clubRole } } : null;
    if (!get().canCreateDivision(mappedUser)) {
      toast.error('You lack permission to create divisions')
      return
    }

    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/divisions/createDivision`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.member.refreshToken}` // Use access token
        },
        body: JSON.stringify({ 
          divisionName, 
          headName, 
          email 
        })
      })

      if (response.status === 403) {
        throw new Error('Forbidden: Check your permissions')
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create division')
      }

      const newDivision = await response.json()
      set(state => ({ 
        divisions: [...state.divisions, newDivision.division || newDivision] // Handle nested response
      }))
      toast.success('Division created successfully!')
      return newDivision
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create division'
      set({ error: errorMessage })
      toast.error(errorMessage)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  canCreateDivision: (user) => {
    const role = user?.member?.clubRole;
    return role === 'President' || role === 'Vice President';
  },

  resetError: () => set({ error: null })
}))