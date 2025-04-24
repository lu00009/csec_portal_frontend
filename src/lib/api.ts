// lib/api.ts
import { useUserStore } from '@/stores/userStore'; // Adjust the import path as needed

export async function fetchMemberById(id: string) {
  if (!id || id === 'undefined') {
    throw new Error('Invalid member ID');
  }

  const res = await fetch(`https://csec-portal-backend-1.onrender.com/api/members/${id}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${useUserStore.getState().refreshToken}`,


    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch member: ${res.statusText}`);
  }

  return await res.json();
}


