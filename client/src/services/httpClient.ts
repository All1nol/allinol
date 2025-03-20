import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Interface for HTTP client service
 */
export interface IHttpClient {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
  put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
}

/**
 * Axios implementation of the HTTP client
 */
export class AxiosHttpClient implements IHttpClient {
  private client: AxiosInstance;

  constructor(baseURL?: string, headers?: Record<string, string>) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    
    // Add response interceptor for automatic error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle errors globally (e.g., logging, auth errors)
        if (error.response?.status === 401) {
          // Handle unauthorized access
          console.warn('Unauthorized access detected');
          // Could redirect to login page or refresh token
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T, D = unknown>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }
}

// Create and export a default instance
const API_URL = import.meta.env.VITE_API_URL || '';
const httpClient = new AxiosHttpClient(API_URL);

export default httpClient; 