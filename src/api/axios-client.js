import axios from "axios";
import authServices from "./auth-services";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base API URL
  timeout: 20000,
});

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized (401) and not retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark as retried
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        window.location.href = "/auth/sign-in"; // Redirect to login if no refresh token
        return Promise.reject(error);
      }

      try {
        const { tokens } = await authServices.refreshAccessToken(refreshToken);
        localStorage.setItem("accessToken", tokens.access.token);
        localStorage.setItem("refreshToken", tokens.refresh.token);

        // Retry the original request with the new access token
        originalRequest.headers.Authorization = `Bearer ${tokens.access.token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError.message);
        // Clear tokens and redirect to login if refresh fails
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/auth/sign-in";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
