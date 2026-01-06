import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/store/auth-store";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add authorization token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState().getTokens();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized - attempt token refresh
    // We check for 401 status OR specific error messages from backend
    if (
      (error.response?.status === 401 && originalRequest) ||
      ((error.response?.data as any)?.error === "TokenExpiredError" && originalRequest)
    ) {
      // Prevent infinite loop: if the error is from the refresh endpoint, don't try to refresh again
      if (originalRequest.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      // If we are already refreshing, we might queue requests? 
      // For simplicity in this fix, we'll just try to refresh.
      
      try {
        const store = useAuthStore.getState();
        
        // Attempt to refresh the session
        const newAccessToken = await store.refreshSession();

        if (newAccessToken) {
          // Update the failed request's authorization header
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          // Retry original request
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, logout user is handled in refreshSession, but we ensure here too
        // useAuthStore.getState().logout();
        
        // Redirect logic is already in store or here. 
        // We'll keep it simple: failed refresh means we can't do anything.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
