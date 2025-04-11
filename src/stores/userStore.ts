// stores/userStore.ts
import { Member } from '@/types/member'; // Import your types
import { create } from 'zustand';

 export type UserRole = 'President' | 'Vice President' | 'CPD President' | 'Dev President' | 'CBD President' | 'SEC President' | 'DS President' | 'Member';

 type UserStore = {
  user: Member | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  fetchUserById: (id: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  getRole: () => UserRole | null;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE;

const useUserStore = create<UserStore>((set, get) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${BASE_URL}/members/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      console.log('Login response:', data); // Debug log
  
      if (!response.ok) throw new Error(data.message || 'Login failed');
  
      // Store the token
      localStorage.setItem('token', data.token);
      
      // Decode the token to get user ID
      const payload = JSON.parse(atob(data.token.split('.')[1]));
      console.log('Token payload:', payload); // Debug log
      
      // Fetch complete user data using the ID from token
      const userResponse = await fetch(`${BASE_URL}/members/${payload.id}`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      
      if (!userResponse.ok) throw new Error('Failed to fetch user data');
      
      const userData = await userResponse.json();
      console.log('User data:', userData); // Debug log
      
      // Update Zustand state with both token and user data
      set({ 
        token: data.token,
        user: userData,
        error: null
      });
      
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ error: message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUserById: async (id: string) => {
    const { token } = get();
    if (!token) return;

    set({ isLoading: true });
    try {
      const res = await fetch(`${BASE_URL}/members/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to fetch user');
      }

      const userData: Member = await res.json();
      set({ user: userData });
    } catch (err) {
      console.error('Error fetching user:', err);
      if (err instanceof Error) {
        set({ error: err.message });
      }
      get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  refreshToken: async () => {
    try {
      const res = await fetch(`${BASE_URL}/members/refresh`, {
        credentials: 'include',
      });
  
      const data = await res.json();
  
      if (!res.ok) throw new Error(data.message || 'Failed to refresh token');
  
      localStorage.setItem('token', data.token);
      set({ token: data.token });
  
      // Safely handle user refetch
      const currentState = get();
      if (currentState.user && currentState.user._id) {
        await currentState.fetchUserById(currentState.user._id);
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      get().logout();
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },

  getRole: () => {
    return get().user?.clubRole || null;
  },

  getDivision: () => {
    return get().user?.division || null;
  }
}));

export { useUserStore };

