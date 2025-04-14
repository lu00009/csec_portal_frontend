// stores/userStore.ts
import { Member } from '@/types/member';
import { create } from 'zustand';

// 1. Define all possible user roles
type UserRole = 
  | 'President'
  | 'Vice President'
  | 'CPD President'
  | 'Dev President'
  | 'CBD President'
  | 'SEC President'
  | 'DS President'
  | 'Member'
  | 'Guest';

// 2. Define division types
type Division = 'CPD' | 'Dev' | 'CBD' | 'SEC' | 'DS';

interface UserStore {
  // State
  user: Member | null;
  refreshToken: string | null; // Only using refresh token now
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Auth Methods
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<void>; // Renamed from refreshAccessToken

  // User Methods
  fetchUserById: (id: string) => Promise<Member>;
  updateUserProfile: (updates: Partial<Member>) => Promise<void>;

  // Role Methods
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasDivisionAccess: (division: Division) => boolean;
  isPresident: () => boolean;
  isDivisionHead: () => boolean;

  // Utility Methods
  isAuthenticated: () => boolean;
  getAuthHeader: () => { Authorization: string } | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

// Role helper functions
const isPresidentRole = (role: UserRole) => 
  role === 'President' || role === 'Vice President';

const isDivisionHeadRole = (role: UserRole) => 
  role.includes('President') && !isPresidentRole(role);

const getDivisionFromRole = (role: UserRole): Division | null => {
  if (role.includes('CPD')) return 'CPD';
  if (role.includes('Dev')) return 'Dev';
  if (role.includes('CBD')) return 'CBD';
  if (role.includes('SEC')) return 'SEC';
  if (role.includes('DS')) return 'DS';
  return null;
};
const parseJwt = (token: string | null) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

const useUserStore = create<UserStore>((set, get) => ({
  // Initial State
  user: null,
  refreshToken: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize the store (run on app load)
  initialize: async () => {
    if (typeof window === 'undefined') {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        const payload = parseJwt(refreshToken);
        if (!payload) throw new Error('Invalid token format');

        set({ refreshToken });
        await get().refreshSession();
      }
    } catch (error) {
      console.error('Initialization error:', error);
      get().logout();
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const { refreshToken } = await response.json();
      if (!refreshToken) throw new Error('No refresh token received');

      const payload = parseJwt(refreshToken);
      if (!payload?.id) throw new Error('Invalid token payload');

      localStorage.setItem('refreshToken', refreshToken);
      set({ refreshToken });
      
      const user = await get().fetchUserById(payload.id);
      set({ user });
      
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      set({ error: message, isLoading: false });
      return false;
    }
  },


  // Logout method
  logout: () => {
    localStorage.removeItem('refreshToken');
    set({ 
      user: null,
      refreshToken: null,
      error: null
    });
  },

  // Refresh the entire session (token + user data)
  refreshSession: async () => {
    const { refreshToken } = get();
    if (!refreshToken) throw new Error('No refresh token available');

    try {
      const response = await fetch(`${BASE_URL}/members/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to refresh session');
      }

      const { refreshToken: newRefreshToken } = await response.json();
      localStorage.setItem('refreshToken', newRefreshToken);
      set({ refreshToken: newRefreshToken });
      
      // Fetch user data with the new token
      const payload = JSON.parse(atob(newRefreshToken));
      const userId = payload.id;
      const user = await get().fetchUserById(userId);
      
      set({ user });
    } catch (error) {
      console.error('Session refresh failed:', error);
      get().logout();
      throw error;
    }
  },

  // Fetch user by ID
  fetchUserById: async (id) => {
    const { refreshToken } = get();
    if (!refreshToken) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${BASE_URL}/members/${id}`, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        await get().refreshSession();
        return get().fetchUserById(id); // Retry with new token
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      set({ user: userData });
      return userData;
    } catch (error) {
      console.error('Failed to fetch user:', error);
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (updates) => {
    const { user, refreshToken } = get();
    if (!user || !refreshToken) throw new Error('Not authenticated');

    try {
      const response = await fetch(`${BASE_URL}/members/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      set({ user: updatedUser });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  },

  // Role checking methods
  hasRole: (role) => {
    const { user } = get();
    return user?.clubRole === role;
  },

  hasAnyRole: (roles) => {
    const { user } = get();
    return !!user && roles.includes(user.clubRole);
  },

  hasDivisionAccess: (division) => {
    const { user } = get();
    if (!user) return false;
    
    if (isPresidentRole(user.clubRole)) return true;
    
    const userDivision = getDivisionFromRole(user.clubRole);
    return userDivision === division;
  },

  isPresident: () => {
    const { user } = get();
    return !!user && isPresidentRole(user.clubRole);
  },

  isDivisionHead: () => {
    const { user } = get();
    return !!user && isDivisionHeadRole(user.clubRole);
  },

  // Authentication check
  isAuthenticated: () => {
    const { refreshToken, user } = get();
    if (!refreshToken || !user) return false;
    
    // Verify token expiration
    try {
      const payload = JSON.parse(atob(refreshToken.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  // Utility to get auth header
  getAuthHeader: () => {
    const { refreshToken } = get();
    return refreshToken ? { Authorization: `Bearer ${refreshToken}` } : null;
  }
}));

// Initialize store when loaded
if (typeof window !== 'undefined') {
  useUserStore.getState().initialize();
}

export { useUserStore };
export type { Division, UserRole };

