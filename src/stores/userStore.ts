// stores/userStore.ts
import { create } from 'zustand';

type UserRole = 'president' | 'divisionHead' | 'member';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division?: string;
  token?: string;
};

type UserStore = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
};

const LOGIN_URL = process.env.NEXT_PUBLIC_LOGIN_API;
const REFRESH_URL = process.env.NEXT_PUBLIC_REFRESH_API;
const MEMBERS_URL = process.env.NEXT_PUBLIC_MEMBERS_API;


const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${LOGIN_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      const { token } = data;
      localStorage.setItem('token', token);
      set({ token });

      await useUserStore.getState().fetchUser();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred';
      set({ error: message });
      throw new Error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    const { token } = useUserStore.getState();
    if (!token) return;

    try {
      console.log(token);
      const res = await fetch(`${MEMBERS_URL}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();

      if (!res.ok) {
        throw new Error(`${user.message} Failed to fetch user`);
      }

      set({ user });
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  },

  refreshToken: async () => {
    try {
      const res = await fetch(`${REFRESH_URL}`, {
        credentials: 'include', // include refresh token from cookies
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to refresh token');

      localStorage.setItem('token', data.token);
      set({ token: data.token });
    } catch (err) {
      console.error('Token refresh failed:', err);
      useUserStore.getState().logout(); // logout on failure
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export { useUserStore };
export type { User, UserRole };

