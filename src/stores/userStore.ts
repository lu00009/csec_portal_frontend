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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

// Mock users database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'President User',
    email: 'president@example.com',
    role: 'president',
    token: 'mock-president-token'
  },
  {
    id: '2',
    name: 'Head of Design',
    email: 'design-head@example.com',
    role: 'divisionHead',
    division: 'Design',
    token: 'mock-head-token'
  },
  {
    id: '3',
    name: 'Regular Member',
    email: 'member@example.com',
    role: 'member',
    token: 'mock-member-token'
  },
];

const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation - in real app, this would be an API call
      const foundUser = mockUsers.find(user => user.email === email);
      
      if (!foundUser) {
        throw new Error('User not found');
      }
      
      // Mock password validation
      if (password !== 'password123') {
        throw new Error('Invalid password');
      }
      
      set({ user: foundUser });
      
      // Store user in localStorage to persist across refreshes
      localStorage.setItem('user', JSON.stringify(foundUser));
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
  
  // Initialize from localStorage if available
  initialize: () => {
    const storedUser = localStorage.getItem('members');
    if (storedUser) {
      set({ user: JSON.parse(storedUser) });
    }
  }
}));


export default useUserStore;
export type { User, UserRole };


