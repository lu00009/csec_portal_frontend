import { Resource } from '@/types/resource';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE + '/resources';

export const getResources = async (page: number = 1, limit: number = 10): Promise<{ resources: Resource[]; totalCount: number }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}?page=${page}&limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Check for both possible response formats
    const resources = response.data?.resources || response.data?.Resources;
    if (!resources) {
      throw new Error('Invalid response format: No resources data found');
    }

    return {
      resources,
      totalCount: response.data?.totalResources || response.data?.totalCount || resources.length
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch resources';
      console.error('API Error:', error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const addResourceApi = async (resource: Omit<Resource, '_id' | '__v'>): Promise<Resource> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    // Use /addResource endpoint as required by backend
    const response = await axios.post(`${API_BASE_URL}/addResource`, resource, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (![200, 201].includes(response.status)) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    // Check for both possible response formats
    const addedResource = response.data?.resource || response.data?.Resource;
    if (!addedResource) {
      console.error('API Response:', response.data);
      throw new Error('No resource data received in response');
    }

    return addedResource;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to add resource';
      console.error('API Error:', error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const updateResourceApi = async (id: string, updates: Partial<Resource>): Promise<Resource> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, updates, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }

    // Check for both possible response formats
    const updatedResource = response.data?.resource || response.data?.Resource;
    if (!updatedResource) {
      console.error('API Response:', response.data);
      throw new Error('No resource data received in response');
    }

    return updatedResource;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to update resource';
      console.error('API Error:', error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const deleteResourceApi = async (id: string): Promise<void> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No access token found');
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || 'Failed to delete resource';
      console.error('API Error:', error.response?.data);
      throw new Error(errorMessage);
    }
    throw error;
  }
};
