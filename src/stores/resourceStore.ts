import { create } from 'zustand';

interface Resource {
  _id: string;
  resourceName: string;
  resourceLink: string;
  division: string;
  __v?: number;
}

interface ResourceStore {
  resources: Resource[];
  divisions: string[];
  fetchResources: () => Promise<void>;
  addResource: (resource: Omit<Resource, '_id' | '__v'>) => Promise<void>;
  updateResource: (id: string, resource: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
}

const API_BASE_URL = 'https://csec-portal-backend-1.onrender.com/api/resources';

export const useResourceStore = create<ResourceStore>((set,get) => ({
  resources: [],
  divisions: [],

  fetchResources: async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) throw new Error('Failed to fetch resources');
      
      const data = await response.json();
      const resourcesArray = data.Resources || [];
      
      set({ 
        resources: resourcesArray,
        divisions: [...new Set(resourcesArray.map(r => r.division))]
      });
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  },

  addResource: async (resource) => {
    try {
      const response = await fetch(`${API_BASE_URL}/addResource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`, // ← maybe change this key!
        },
        body: JSON.stringify(resource)
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // get more insight
        throw new Error(`Failed to add resource: ${errorText}`);
      }
  
      await get().fetchResources();
    } catch (error) {
      console.error('Add error:', error);
      console.log('Resource:', resource);
      throw error;
    }
  },
  

  updateResource: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update resource');
      
      // Refresh the list after updating
      await get().fetchResources();
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  deleteResource: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete resource');
      
      // Refresh the list after deleting
      await get().fetchResources();
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}));