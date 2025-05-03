import { API_BASE_URL, getHeaders, handleApiResponse } from "../config/api";
import { storage } from "../utils/storage";

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<T> {
    const {
      requiresAuth = false,
      headers: customHeaders,
      ...restConfig
    } = config;
    let headers = { ...customHeaders };

    if (requiresAuth) {
      const token = await storage.getToken();
      if (!token) {
        throw new Error("Authentication required");
      }
      headers = { ...headers, ...getHeaders(token) };
    } else {
      headers = { ...headers, ...getHeaders() };
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...restConfig,
      headers,
    });
    return handleApiResponse(response);
  }

  get<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: "GET",
    });
  }

  post<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  patch<T>(endpoint: string, data?: any, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, config: RequestConfig = {}) {
    return this.request<T>(endpoint, {
      ...config,
      method: "DELETE",
    });
  }
}

export const apiClient = new ApiClient();
