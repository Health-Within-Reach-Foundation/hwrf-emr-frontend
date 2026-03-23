import axios from 'axios';
import authServices from './auth-services';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Base API URL
  timeout: 60000,
});

// Add request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
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
  // ✅ Don't intercept auth endpoints — let them fail normally to the caller
  if (originalRequest.url.includes('auth/')) {
    return Promise.reject(error);
  }

  originalRequest._retry = true; // Mark as retried
  const refreshToken = localStorage.getItem('refreshToken');
  const accessToken = localStorage.getItem('accessToken');
  if (!refreshToken) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('No refresh token found, redirecting to login');
    if (originalRequest.url !== 'auth/login') {
      window.location.href = '/auth/sign-in';
    }
    return Promise.reject(error);
  }

  try {
    const { tokens } = await authServices.refreshAccessToken(refreshToken, accessToken);
    if (tokens?.access?.token == null && tokens?.refresh?.token == null) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    } else {
      localStorage.setItem('accessToken', tokens?.access?.token);
    }
    originalRequest.headers.Authorization = `Bearer ${tokens.access.token}`;
    return apiClient(originalRequest);
  } catch (refreshError) {
    console.error('Token refresh failed:', refreshError.message);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    console.log('Redirecting to login from interceptor catch');
    window.location.href = '/auth/sign-in';
    return Promise.reject(refreshError);
  }
}

    return Promise.reject(error);
  }
);

export default apiClient;
