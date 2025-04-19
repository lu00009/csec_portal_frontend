// GroupStore.ts
import { create } from 'zustand'

interface GroupStore {
  loading: boolean
  error: string | null
  createGroup: (data: {
    division: string
    group: string
    refreshToken: string
  }) => Promise<void>
  resetError: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE

export const useGroupStore = create<GroupStore>((set) => ({
  loading: false,
  error: null,

  createGroup: async ({ division, group, refreshToken }) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${API_BASE}/groups/createGroup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
        body: JSON.stringify({ division, group })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create group')
      }

      return await response.json()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create group'
      set({ error: errorMessage })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  resetError: () => set({ error: null })
}))