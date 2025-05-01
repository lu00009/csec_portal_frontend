// utils/authFetch.ts
import { useUserStore } from '@/stores/userStore';

interface AuthFetchOptions extends RequestInit {
  attemptRefresh?: boolean; // Whether to try refreshing on 401
  requiredRoles?: string[]; // Roles required to access
}

export const authFetch = async <T = any>(
  url: string,
  options: AuthFetchOptions = {}
): Promise<T> => {
  const store = useUserStore.getState();

  const executeRequest = async (): Promise<Response> => {
    const { token } = store;

    // Validate token exists
    if (!token) {
      store.logout();
      throw new Error('No authentication token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    const response = await fetch(url, { 
      ...options, 
      headers,
    });

    // If token expired (401), try refreshing once
    if (response.status === 401 && options.attemptRefresh !== false) {
      try {
        await store.refreshSession();
        return executeRequest(); // Retry with new token
      } catch (refreshError) {
        store.logout();
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response;
  };

  try {
    // Check authentication first
    if (!store.isAuthenticated()) {
      throw new Error('Not authenticated');
    }

    // Check roles if specified
    if (options.requiredRoles && !store.hasAnyRole(options.requiredRoles)) {
      throw new Error('Unauthorized: Insufficient permissions');
    }

    const response = await executeRequest();
    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Auth fetch error:', error);
    throw error;
  }
};