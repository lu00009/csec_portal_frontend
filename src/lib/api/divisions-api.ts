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
    divisionName: string,
    groupName: string,
    filters: {
      search?: string;
      campusStatus?: string;
      attendance?: string;
      membershipStatus?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<{ members: any[]; total: number }> => {
    try {
      const params = new URLSearchParams({
        division: divisionName,
        group: groupName,
        ...(filters.search && { search: filters.search }),
        ...(filters.campusStatus && { campusStatus: filters.campusStatus }),
        ...(filters.attendance && { attendance: filters.attendance }),
        ...(filters.membershipStatus && { membershipStatus: filters.membershipStatus }),
        ...(filters.page && { page: filters.page.toString() }),
        ...(filters.limit && { limit: filters.limit.toString() }),
      });

      const response = await apiClient.get(`/groups/getMembers?${params.toString()}`);
      return {
        members: response.data.members || [],
        total: response.data.total || 0
      };
    } catch (error) {
      console.error("Members fetch error:", error);
      return { members: [], total: 0 };
    }
  },

  createDivision: async (payload: { name: string; head: string; email: string }) => {
    try {
      await apiClient.post("/divisions/create", payload);
      return payload.name;
    } catch (error) {
      console.error("Error creating division:", error);
      throw error;
    }
  },

  createGroup: async (divisionName: string, groupName: string) => {
    try {
      await apiClient.post("/groups/create", {
        division: divisionName,
        name: groupName
      });
      return groupName;
    } catch (error) {
      console.error("Group creation error:", error);
      throw error;
    }
  },

  createMember: async (division: string, group: string, member: { email: string; password: string }) => {
    try {
      const response = await apiClient.post("/members/create", {
        division,
        group,
        email: member.email,
        password: member.password,
        role: "member"
      });
      return response.data;
    } catch (error) {
      console.error("Error creating member:", error);
      throw error;
    }
  },
};