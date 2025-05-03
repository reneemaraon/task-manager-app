import { storage } from "../utils/storage";
import { apiClient } from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  password_confirmation: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
    updated_at: string;
    created_at: string;
  };
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>("/login", credentials);
    await storage.setToken(data.token);
    await storage.setUser(data.user);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const data = await apiClient.post<AuthResponse>("/register", userData);
    await storage.setToken(data.token);
    await storage.setUser(data.user);
    return data;
  },

  logout: async (): Promise<void> => {
    const token = await storage.getToken();
    if (token) {
      try {
        await apiClient.post("/logout", {}, { requiresAuth: true });
      } catch (error) {
        console.error("Logout API error:", error);
      }
    }
    await storage.clearAll();
  },

  validateToken: async (): Promise<AuthResponse | null> => {
    const token = await storage.getToken();
    if (!token) return null;

    try {
      return await apiClient.get<AuthResponse>("/user/", {
        requiresAuth: true,
      });
    } catch (error) {
      console.error("Token validation error:", error);
      await storage.clearAll();
      return null;
    }
  },
};
