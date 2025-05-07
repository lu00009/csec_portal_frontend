// This file contains the API client for managing divisions and groups.
import { useUserStore } from "@/stores/userStore";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

const getAuthStorage = () => {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  return rememberMe ? localStorage : sessionStorage;
};

apiClient.interceptors.request.use(async (config) => {
  const storage = getAuthStorage();
  const token = storage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    const storage = getAuthStorage();
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        await useUserStore.getState().refreshSession();
        const newToken = storage.getItem('token');
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        useUserStore.getState().logout();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const divisionsApi = {
  getAllDivisions: async (): Promise<string[]> => {
    try {
      const response = await apiClient.get("/divisions/allDivisions");
      return response.data.divisions || [];
    } catch (error) {
      console.error("Division fetch error:", error);
      throw error;
    }
  },

  getDivisionGroups: async (divisionName: string): Promise<string[]> => {
    try {
      const response = await apiClient.get(
        `/divisions/getGroups/${encodeURIComponent(divisionName)}`
      );
      return response.data.groups || [];
    } catch (error) {
      console.error("Groups fetch error:", error);
      return [];
    }
  },

  getGroupMembers: async (
    division: string,
    group: string,
    filters: { search?: string; page?: number; limit?: number; status?: string } = {}
  ): Promise<any> => {
    try {
      console.log(`[API] Starting request for members:`, {
        division,
        group,
        filters,
        url: `${API_BASE}/groups/getMembers`
      });

      const response = await apiClient.get("/groups/getMembers", {
        params: {
          division,
          group,
          ...filters
        },
      });

      console.log(`[API] Full response data:`, {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        dataKeys: Object.keys(response.data || {}),
        dataValues: Object.values(response.data || {}),
        headers: response.headers
      });
      
      // Ensure the response has the correct structure
      const data = response.data || {};
      const members = Array.isArray(data.members) ? data.members : [];
      const total = data.total || 0;

      console.log(`[API] Processed response:`, {
        membersCount: members.length,
        total,
        hasMembers: members.length > 0,
        dataKeys: Object.keys(data),
        firstMember: members[0],
        rawData: data
      });

      return {
        groupMembers: members,
        totalGroupMembers: total
      };
    } catch (error: any) {
      console.error(`[API] Error fetching members:`, {
        error: error?.message || 'Unknown error',
        status: error?.response?.status,
        data: error?.response?.data,
        division,
        group,
        filters
      });
      throw error;
    }
  },

  createDivision: async (payload: { divisionName: string; headName: string; email: string }) => {
    try {
      await apiClient.post("/divisions/createDivision", payload);
      return payload.divisionName;
    } catch (error) {
      console.error("Error creating division:", error);
      throw error;
    }
  },

  createGroup: async (divisionName: string, groupName: string) => {
    try {
      await apiClient.post("/groups/createGroup", {
        division: divisionName,
        group: groupName
      });
      return groupName;
    } catch (error) {
      console.error("Group creation error:", error);
      throw error;
    }
  },

  createMember: async (
    division: string,
    group: string,
    member: { firstName: string; lastName: string; email: string; generatedPassword: string }
  ) => {
    try {
      const response = await apiClient.post("/members/createMember", {
        division,
        group,
        email: member.email,
        generatedPassword: member.generatedPassword,
        firstName: member.firstName,
        lastName: member.lastName,
        role: "member"
      });
      return response.data;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  },
};