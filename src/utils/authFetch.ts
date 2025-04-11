// utils/authFetch.ts
import { useUserStore } from '@/stores/userStore';

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const token = useUserStore.getState().user?.token;

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || 'Fetch failed');
  }

  return res.json();
};
