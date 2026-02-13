import { ENV } from '../config/env';

// ─── Types ───

export interface LoginRequest {
  Username: string;
  Password: string;
}

export interface LoginResponse {
  message: string;
  user: {
    Id: number;
    Username: string;
    UserType: string;
    Status: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Service ───

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = ENV.API_BASE_URL;
  }

  // ─── Core request method ───

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      if (__DEV__) console.log('[ApiService] →', options.method || 'GET', url);

      const defaultHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };

      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (__DEV__) console.log('[ApiService] ←', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('[ApiService] Request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        message: 'Network error. Please check your connection and try again.',
      };
    }
  }

  // ─── Public HTTP methods ───

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async del<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' });
  }

  // ─── Domain-specific endpoints ───

  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.post<LoginResponse>('/auth/login', credentials);
  }

  async healthCheck(): Promise<ApiResponse<any>> {
    return this.get('/health');
  }

  async testConnection(): Promise<ApiResponse<any>> {
    return this.get('/test/connection');
  }
}

export const apiService = new ApiService();
export default apiService;
