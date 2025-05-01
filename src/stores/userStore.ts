import { Member } from '@/types/member';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type UserRole =
  | 'President'
  | 'Vice President'
  | 'Competitive Programming Division President'
  | 'Development Division President'
  | 'Capacity Building Division President'
  | 'Cybersecurity Division President'
  | 'Data Science Division President'
  | 'Member';

type Division = 'CPD' | 'Dev' | 'CBD' | 'SEC' | 'DS';

interface UserStore {
  user: Member | null;
  refreshToken: string | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  token: string | null;

  initialize: () => Promise<void>;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  logout: () => void;
  refreshSession: () => Promise<void>;

  fetchUserById: (id: string) => Promise<Member>;
  updateUserProfile: (updates: Partial<Member>) => Promise<void>;

  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  hasDivisionAccess: (division: Division) => boolean;
  isPresident: () => boolean;
  isDivisionHead: () => boolean;

  isAuthenticated: () => boolean;
  getAuthHeader: () => { Authorization: string } | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

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
    const base64Payload = token.split('.')[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
};

const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      refreshToken: null,
      isLoading: false,
      isInitialized: false,
      error: null,
      token: null,

      login: async (email, password, rememberMe) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${BASE_URL}/members/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
      
          const data = await response.json();
      
          if (!response.ok || !data.token || !data.refreshToken) {
            throw new Error(data.message || 'Login failed');
          }
      
          const { token, refreshToken } = data;
          
          // Immediately set tokens in store
          set({ token, refreshToken }); // <-- Critical fix
          
          // Store tokens in appropriate storage
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem('token', token);
          storage.setItem('refreshToken', refreshToken);
          localStorage.setItem('rememberMe', String(rememberMe));
      
          // Get FRESH token from store
          const currentToken = get().token; // <-- Important
          if (!currentToken) throw new Error('Token not set');
          
          // Fetch user with updated token
          const payload = parseJwt(currentToken);
          if (!payload?.id) throw new Error('Invalid token payload');
          
          const user = await get().fetchUserById(payload.id);
          set({ user, isLoading: false });
      
          return true;
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Login failed';
          set({ error: message, isLoading: false });
          return false;
        }
      },
    // Updated refreshSession method in userStore.ts
refreshSession: async () => {
  const { refreshToken } = get();
  try {
    // Validate refresh token existence
    if (!refreshToken) {
      console.error('No refresh token available');
      get().logout();
      throw new Error('Session expired');
    }

    // Parse and validate refresh token
    const payload = parseJwt(refreshToken);
    if (!payload || !payload.exp) {
      console.log('Invalid refresh token format');
      get().logout();
      throw new Error('Invalid session');
    }

    // Check refresh token expiration with 5-minute buffer
    if (payload.exp * 1000 < Date.now() - 300000) {
      console.log('Refresh token expired');
      get().logout();
      throw new Error('Session expired');
    }

    // Get rememberMe preference
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;

    // Make refresh request
    const response = await fetch(`${BASE_URL}/members/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Refresh failed with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Validate response format
    if (!data.token || !data.refreshToken) {
      throw new Error('Invalid refresh response');
    }

    // Store new tokens
    storage.setItem('token', data.token);
    storage.setItem('refreshToken', data.refreshToken);

    // Update store state
    set({
      token: data.token,
      refreshToken: data.refreshToken,
    });

    // Fetch updated user data
    const newPayload = parseJwt(data.token);
    if (!newPayload?.id) {
      throw new Error('Invalid token payload');
    }

    const user = await get().fetchUserById(newPayload.id);
    set({ user });
  } catch (error) {
    console.error('Session refresh failed:', error);
    
    // Clear invalid tokens
    get().logout();
    
    // Only throw specific errors
    if (error instanceof Error) {
      throw new Error(error.message.includes('401') 
        ? 'Session expired. Please log in again.'
        : 'Failed to refresh session');
    }
    
    throw new Error('Failed to refresh session');
  }
},

// Updated initialize function
initialize: async () => {
  if (typeof window === 'undefined') {
    set({ isInitialized: true });
    return;
  }

  set({ isLoading: true });
  try {
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    const storage = rememberMe ? localStorage : sessionStorage;

    const token = storage.getItem('token');
    const refreshToken = storage.getItem('refreshToken');

    // Exit if no tokens found
    if (!token || !refreshToken) {
      set({ isInitialized: true, isLoading: false });
      return;
    }

    // Set tokens first to prevent race conditions
    set({ token, refreshToken });

    // Validate refresh token first
    const refreshPayload = parseJwt(refreshToken);
    if (!refreshPayload?.exp || refreshPayload.exp * 1000 < Date.now()) {
      console.log('Refresh token validation failed');
      get().logout();
      return;
    }

    // Validate access token
    const accessPayload = parseJwt(token);
    if (!accessPayload?.id) {
      console.log('Invalid access token');
      get().logout();
      return;
    }

    // Refresh if access token expired (with 1-minute buffer)
    if (accessPayload.exp * 1000 < Date.now() - 60000) {
      console.log('Access token needs refresh');
      await get().refreshSession();
    } else {
      // Directly load user if token is valid
      const user = await get().fetchUserById(accessPayload.id);
      set({ user });
    }
  } catch (error) {
    console.error('Initialization error:', error);
    get().logout();
  } finally {
    set({ isInitialized: true, isLoading: false });
  }
},
     // Add to your logout function
logout: () => {
  // Clear all possible storage locations
  ['localStorage', 'sessionStorage'].forEach(storageType => {
    (window[storageType as 'localStorage' | 'sessionStorage'] as Storage).removeItem('token');
    (window[storageType as 'localStorage' | 'sessionStorage'] as Storage).removeItem('refreshToken');
  });
  // Clear rememberMe flag
  localStorage.removeItem('rememberMe');
  // Reset store state
  set({
    user: null,
    token: null,
    refreshToken: null,
    isLoading: false,
    error: null,
  });
},
      fetchUserById: async (id) => {
        try {
          // Get fresh token from store
          const { token } = get();
          if (!token) throw new Error('Not authenticated');
      
          const response = await fetch(`${BASE_URL}/members/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });
      
          if (response.status === 401) {
            // Attempt refresh and retry
            await get().refreshSession();
            return get().fetchUserById(id);
          }
      
          if (!response.ok) {
            throw new Error(`User fetch failed: ${response.status}`);
          }
      
          const user = await response.json();
          set({ user });
          return user;
        } catch (error) {
          console.error('Fetch user error:', error);
          throw error;
        }
      },

      updateUserProfile: async (updates) => {
        const { user, token } = get();
        if (!user || !token) throw new Error('Not authenticated');

        const response = await fetch(`${BASE_URL}/members/${user.member._id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates),
        });

        if (!response.ok) throw new Error('Failed to update profile');
        const updatedUser = await response.json();
        set({ user: updatedUser });
      },

      hasRole: (role) => get().user?.member.clubRole === role,
      hasAnyRole: (roles) => !!get().user && roles.includes(get().user!.member.clubRole),
      hasDivisionAccess: (division) => {
        const { user } = get();
        if (!user) return false;
        if (isPresidentRole(user.member.clubRole)) return true;
        const userDivision = getDivisionFromRole(user.member.clubRole);
        return userDivision === division;
      },
      isPresident: () => isPresidentRole(get().user?.member.clubRole as UserRole || 'Member'),
      isDivisionHead: () => isDivisionHeadRole(get().user?.member.clubRole || 'Member'),
      isAuthenticated: () => {
        const { token, refreshToken, user } = get();
        
        if (!token || !refreshToken || !user) return false;
        
        try {
          const refreshPayload = parseJwt(refreshToken);
          // Consider 5-minute buffer for token expiration
          return refreshPayload.exp * 1000 > Date.now() - 300000;
        } catch {
          return false;
        }
      },
      getAuthHeader: () => {
        const { token } = get();
        return token ? { Authorization: `Bearer ${token}` } : null;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          return rememberMe ? localStorage.getItem(name) : sessionStorage.getItem(name);
        },
        setItem: (name, value) => {
          const rememberMe = localStorage.getItem('rememberMe') === 'true';
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(name, value);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          sessionStorage.removeItem(name);
        },
      })),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export { useUserStore };
export type { Division, UserRole };

