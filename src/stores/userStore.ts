// stores/userStore.ts
import { create } from 'zustand';

type UserRole = 'president' | 'divisionHead' | 'member';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division?: string;
};

type UserStore = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const API_BASE = 'https://csec-portal-backend-1.onrender.com/api';

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${API_BASE}/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      const { token } = data;
      localStorage.setItem('token', token);
      await useUserStore.getState().fetchUser();
    } catch (err: unknown) {
      if (err instanceof Error) {
        set({ error: err.message || 'Login error' });
        throw err;
      }
      set({ error: 'An unknown error occurred' });
      throw new Error('An unknown error occurred');
      set({ error: err.message || 'Login error' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE}/members/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const user = await res.json();
      if (!res.ok) throw new Error(user.message || 'Failed to fetch user');

      set({ user });
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null });
  },
}));

export { useUserStore };
export type { User, UserRole };
