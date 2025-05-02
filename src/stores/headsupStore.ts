// stores/useHeadsUpStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface HeadsUpItem {
  title: string;
  message: string;
}

interface HeadsUpStore {
  headsUp: HeadsUpItem[];
  fetchHeadsUp: ( id: string) => Promise<void>;
}

export const useHeadsUpStore = create<HeadsUpStore>((set) => ({
  headsUp: [],
  fetchHeadsUp: async (id) => {
    try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/attendance/member/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('headsup response data:', res.data);

      const headsUpData = res.data?.overall?.records?.headsup || [];
      set({ headsUp: headsUpData });
    } catch (error) {
      console.error('Failed to fetch heads-up data:', error);
      set({ headsUp: [] });
    }
  },
}));
