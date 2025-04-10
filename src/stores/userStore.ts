// stores/userStore.ts
import { create } from 'zustand';

type UserRole = 'president' | 'divisionHead' | 'member';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  division?: string;
  token: string;
};

type UserStore = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  initialize: () => void;
};

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const res = await fetch('https://csec-portal-backend-1.onrender.com/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const user: User = {
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
        division: data.division,
        token: data.token,
      };

      set({ user });
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Login failed' });
      throw err;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null });
  },

  initialize: () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  },
}));

export { useUserStore };
export type { User, UserRole };

