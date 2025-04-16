// lib/api.ts
export async function fetchMemberById(id: string) {
  if (!id || id === 'undefined') {
    throw new Error('Invalid member ID');
  }
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE;
  const res = await fetch(`${API_BASE_URL}/members/${id}`, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch member: ${res.statusText}`);
  }

  return await res.json();
}