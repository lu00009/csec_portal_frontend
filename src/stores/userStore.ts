// stores/userStore.ts
import { Member } from '@/types/member';
import { create } from 'zustand';

// 1. Define all possible user roles
type UserRole = 
  | 'President'
  | 'Vice President'
  | 'Competitive Programming Division President'
  | 'Development Division President'
  | 'Capacity Building Division President'
  | 'Cybersecurity Division President'
  | 'Data Science Division President'
  | 'Member';

// 2. Define division types
type Division = 
  | 'Competitive Programming Division' 
  | 'Development Division' 
  | 'Capacity Building Division' 
  | 'Cybersecurity Division' 
  | 'Data Science Division';

interface UserStore {
  // State
  user: Member | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Auth Methods
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<void>;

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
  if (role.includes('Competitive Programming Division')) return 'Competitive Programming Division';
  if (role.includes('Development Division')) return 'Development Division';
  if (role.includes('Capacity Building Division')) return 'Capacity Building Division';
  if (role.includes('Cybersecurity Division')) return 'Cybersecurity Division';
  if (role.includes('Data Science Division')) return 'Data Science Division';
  return null;
};

// Enhanced JWT parser with better error handling
const parseJwt = (token: string | null) => {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT structure');
    }

    const base64Payload = parts[1];
    const paddedPayload = base64Payload.padEnd(
      base64Payload.length + (4 - (base64Payload.length % 4)) % 4,
      '='
    );
    const decodedPayload = atob(paddedPayload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('JWT parsing error:', error);
    return null;
  }
};

// Token validation utility
const isValidToken = (token: string | null): boolean => {
  if (!token) return false;
  const payload = parseJwt(token);
  return !!payload && 
         !!payload.id && 
         (!payload.exp || payload.exp * 1000 > Date.now());
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
  
    set({ isLoading: true, error: null });
    
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken && isValidToken(refreshToken)) {
        set({ refreshToken });
        
        try {
          await get().refreshSession();
        } catch (refreshError) {
          console.warn('Session refresh failed, continuing with existing token:', refreshError);
          // Verify existing token is still valid
          if (isValidToken(refreshToken)) {
            const payload = parseJwt(refreshToken);
            if (payload?.id) {
              const user = await get().fetchUserById(payload.id);
              set({ user });
            }
          } else {
            console.warn('Existing token is invalid - clearing storage');
            localStorage.removeItem('refreshToken');
            set({ refreshToken: null, user: null });
          }
        }
      }
    } catch (error) {
      console.error('Initialization error:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Initialization failed'
      });
    } finally {
      set({ isInitialized: true, isLoading: false });
    }
  },

  // Login method with token validation
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Login failed');
      }
      
      const { refreshToken } = await response.json();
      
      if (!isValidToken(refreshToken)) {
        throw new Error('Invalid token received from server');
      }

      localStorage.setItem('refreshToken', refreshToken);
      set({ refreshToken });
      
      const payload = parseJwt(refreshToken);
      if (!payload?.id) {
        throw new Error('Invalid token payload');
      }

      const userResponse = await fetch(`${BASE_URL}/members/${payload.id}`, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await userResponse.json();
      const normalizedUser = userData.member || userData;
      
      set({ user: normalizedUser, isLoading: false });
      return true;
    } catch (error) {
      localStorage.removeItem('refreshToken');
      set({ 
        user: null,
        refreshToken: null,
        error: error instanceof Error ? error.message : 'Login failed',
        isLoading: false
      });
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

  // Refresh session with proper error handling
  refreshSession: async () => {
    const { refreshToken } = get();
    
    if (!refreshToken) {
      console.error('Refresh attempted with no token');
      throw new Error('No refresh token available');
    }
  
    try {
      const response = await fetch(`${BASE_URL}/members/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });
  
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = `Refresh failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.warn('Could not parse error response', e);
        }
        throw new Error(errorMessage);
      }
  
      const data = await response.json();
      
      // Check if response contains a refresh token
      if (!data?.refreshToken) {
        // If no new token is provided, continue with the existing one
        console.warn('No new refresh token provided - using existing token');
        
        // Verify existing token is still valid
        if (!isValidToken(refreshToken)) {
          throw new Error('Existing token is invalid');
        }
  
        // Fetch user data with existing token
        const payload = parseJwt(refreshToken);
        if (!payload?.id) {
          throw new Error('Invalid token payload');
        }
  
        const user = await get().fetchUserById(payload.id);
        set({ user });
        return refreshToken;
      }
  
      // Validate new token
      if (!isValidToken(data.refreshToken)) {
        throw new Error('Invalid new token format');
      }
  
      // Store and use new token
      localStorage.setItem('refreshToken', data.refreshToken);
      set({ refreshToken: data.refreshToken });
  
      const newPayload = parseJwt(data.refreshToken);
      const user = await get().fetchUserById(newPayload.id);
      set({ user });
      
      return data.refreshToken;
    } catch (error) {
      console.error('Session refresh failed:', error);
      
      // Only clear tokens if the error is critical
      if (error instanceof Error && (
        error.message.includes('invalid') || 
        error.message.includes('expired')
      )) {
        localStorage.removeItem('refreshToken');
        set({ 
          user: null,
          refreshToken: null,
        });
      }
      
      set({ error: error instanceof Error ? error.message : 'Refresh failed' });
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
  
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const data = await response.json();
      const userData = data.member || data;
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update profile');
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
    return isValidToken(refreshToken) && !!user;
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

