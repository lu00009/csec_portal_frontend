// stores/useMemberResourceStore.ts
import { create } from 'zustand';
import axios from 'axios';

interface ResourceItem {
  resourceName: string;
  resourceLink: string;
}

interface MemberResourceState {
  resources: ResourceItem[];
  loading: boolean;
  error: string | null;
  fetchResources: (memberId: string) => Promise<void>;
}

export const useMemberResourceStore = create<MemberResourceState>((set) => ({
  resources: [],
  loading: false,
  error: null,

  fetchResources: async (memberId) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE}/members/${memberId}`
        , {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      const resources = res.data?.member?.resources ;
      console.log('Fetched data:', res.data); // Debugging line
      console.log('Fetched resources:', resources);
      set({ resources, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch resources', loading: false });
    }
  },
}));
