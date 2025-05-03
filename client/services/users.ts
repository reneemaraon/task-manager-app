import { storage } from "../utils/storage";
import { apiClient } from "./api";

export interface UsersData {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export const usersService = {
  search: async (search: string): Promise<UsersData[]> => {
    const token = await storage.getToken();
    if (!token) return [];

    try {
      const data = await apiClient.get<UsersData[]>(
        `/users?search=${encodeURIComponent(search)}`,
        { requiresAuth: true }
      );
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
};
