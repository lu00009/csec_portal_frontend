import axios from 'axios';
import { Resource } from '@/stores/resourceStore';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE + '/resources';

export const getResources = async (): Promise<Resource[]> => {
  const response = await axios.get(API_BASE_URL, {
    headers: {
      'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data.Resources || [];
};


export const addResourceApi = async (resource: Omit<Resource, '_id' | '__v'>): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.post(`${API_BASE_URL}/addResource`, resource, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if(response.status === 201) {
      console.log('Resource added successfully:', response.data);
    }
    if (![200, 201].includes(response.status)) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Failed to add resource:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to add resource');
    } else {
      console.error('Failed to add resource:', error);
      throw new Error('Failed to add resource');
    }
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
