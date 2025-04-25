import { Member } from '@/types/member';
import { create } from 'zustand';

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

  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
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

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  refreshToken: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  initialize: async () => {
    if (typeof window === 'undefined') {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true });
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Init refreshToken:', refreshToken);
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

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok || !data.refreshToken) {
        throw new Error(data.message || 'Login failed');
      }

      const { refreshToken } = data;
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

  logout: () => {
    localStorage.removeItem('refreshToken');
    set({
      user: null,
      refreshToken: null,
      error: null,
    });
  },

  refreshSession: async () => {
    const { refreshToken } = get();
    if (!refreshToken) throw new Error('No refresh token available');

    try {
      const response = await fetch(`${BASE_URL}/members/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`,
        },
      });

      const data = await response.json();
      console.log('Refreshed token data:', data);

      if (!response.ok || !data.refreshToken) {
        throw new Error('Failed to refresh session');
      }

      const newRefreshToken = data.refreshToken;
      localStorage.setItem('refreshToken', newRefreshToken);
      set({ refreshToken: newRefreshToken });

      const payload = parseJwt(newRefreshToken);
      if (!payload?.id) throw new Error('Invalid token payload');

      const user = await get().fetchUserById(payload.id);
      set({ user });
    } catch (error) {
      console.error('Session refresh failed:', error);
      get().logout();
      throw error;
    }
  },

  fetchUserById: async (id) => {
    const { refreshToken } = get();
    if (!refreshToken) throw new Error('Not authenticated');

    const response = await fetch(`${BASE_URL}/members/${id}`, {
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      await get().refreshSession();
      return get().fetchUserById(id);
    }

    if (!response.ok) throw new Error('Failed to fetch user');

    const user = await response.json();
    set({ user });
    return user;
  },

  updateUserProfile: async (updates) => {
    const { user, refreshToken } = get();
    if (!user || !refreshToken) throw new Error('Not authenticated');

    const response = await fetch(`${BASE_URL}/members/${user.member._id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
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
    const { refreshToken, user } = get();
    if (!refreshToken || !user) return false;
    try {
      const payload = parseJwt(refreshToken);
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
  getAuthHeader: () => {
    const { refreshToken } = get();
    return refreshToken ? { Authorization: `Bearer ${refreshToken}` } : null;
  },
}));

if (typeof window !== 'undefined') {
  useUserStore.getState().initialize();
}

export { useUserStore };
export type { Division, UserRole };
