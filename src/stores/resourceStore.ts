'use client';

import { create } from 'zustand';
import { getResources, addResourceApi, updateResourceApi, deleteResourceApi } from '@/lib/api/resourceApi';

export interface Resource {
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

export const useResourceStore = create<ResourceStore>((set, get) => ({
  resources: [],
  divisions: [],

  fetchResources: async () => {
    try {
      const resourcesArray = await getResources();
      set({
        resources: resourcesArray,
        divisions: [...new Set(resourcesArray.map((r) => r.division))],
      });
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  addResource: async (resource) => {
    try {
      await addResourceApi(resource);
      await get().fetchResources();
    } catch (error) {
      console.error('Error adding resource:', error);
      throw error;
    }
  },

  updateResource: async (id, resource) => {
    try {
      await updateResourceApi(id, resource);
      await get().fetchResources();
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  },

  deleteResource: async (id) => {
    try {
      await deleteResourceApi(id);
      await get().fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },
}));
