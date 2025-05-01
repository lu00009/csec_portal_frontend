import axios from 'axios';
import { Resource } from '@/stores/resourceStore';
import { authFetch } from '@/utils/authFetch';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE + '/resources';


export const getResources = async (): Promise<Resource[]> => {
  const data = await authFetch<{ Resources: Resource[] }>(API_BASE_URL);
  return data.Resources || [];
};


export const addResourceApi = async (resource: Omit<Resource, '_id' | '__v'>): Promise<void> => {
  const response = await axios.post(`${API_BASE_URL}/addResource`, resource, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to add resource');
  }
};

export const updateResourceApi = async (id: string, updates: Partial<Resource>): Promise<void> => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updates, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to update resource');
  }
};

export const deleteResourceApi = async (id: string): Promise<void> => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (response.status !== 200) {
    throw new Error('Failed to delete resource');
  }
};
