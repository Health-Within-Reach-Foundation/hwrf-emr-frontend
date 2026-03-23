import apiClient from './axios-client';

// Login function
const login = async (email, password) => {
  try {
    const response = await apiClient.post('auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error.response?.data || error?.message || new Error('Login failed');
  }
};

// ✅ NEW: Verify OTP for 2-step login
const verifyOtp = async (preAuthToken, otp) => {
  try {
    const response = await apiClient.post('auth/verify-otp', { preAuthToken, otp });
    return response.data;
  } catch (error) {
    console.error('OTP verification failed:', error);
    throw error.response?.data || error?.message || new Error('OTP verification failed');
  }
};

// Logout function
const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  console.log('calling log out function ', refreshToken);
  try {
    await apiClient.post('auth/logout', { refreshToken });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return true;
  } catch (error) {
    throw error.response?.data || new Error('Logout failed');
  }
};

// Refresh token function
const refreshAccessToken = async (refreshToken, accessToken) => {
  try {
    const response = await apiClient.post('auth/refresh-tokens', {
      refreshToken,
      accessToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Token refresh failed');
  }
};

// Fetch user data using access token
const getUser = async () => {
  try {
    const response = await apiClient.get('auth/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch user data');
  }
};

const verifyToken = async (jwtToken) => {
  console.log(jwtToken);
  try {
    const response = await apiClient.get(`/auth/verify-token/?token=${jwtToken}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch user data');
  }
};

const resetPassword = async (jwtToken, password) => {
  try {
    const response = await apiClient.post(`/auth/reset-password/?token=${jwtToken}`, {
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
    return { success: false, message: errorMessage };
  }
};

const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post(`/auth//forgot-password`, { email });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Failed to forgot password. Please try again.';
    return { success: false, message: errorMessage };
  }
};

export default {
  login,
  verifyOtp,
  logout,
  refreshAccessToken,
  getUser,
  verifyToken,
  resetPassword,
  forgotPassword,
};