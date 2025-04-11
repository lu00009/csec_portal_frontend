// utils/authFetch.ts
import { useUserStore } from '@/stores/userStore';

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const store = useUserStore.getState();

  let token = store.token;

  const fetchWithToken = async (attemptRefresh = true): Promise<Response> => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401 && attemptRefresh) {
      try {
        await store.refreshToken();
        token = useUserStore.getState().token;
        return fetchWithToken(false); // retry once
      } catch {
        throw new Error('Session expired. Please log in again.');
      }
    }

    return res;
  };

  const response = await fetchWithToken();

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Fetch failed');
  }

  return response.json();
};