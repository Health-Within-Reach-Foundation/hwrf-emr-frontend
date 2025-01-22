import apiClient from "./axios-client";

// Login function
const login = async (email, password) => {
  try {
    const response = await apiClient.post("auth/login", { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Login failed");
  }
};

// Logout function
/**
 *
 * @returns {Boolean}
 */
const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  console.log("calling log out function ", refreshToken);
  try {
    await apiClient.post("auth/logout", { refreshToken });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return true;
  } catch (error) {
    throw error.response?.data || new Error("Logout failed");
    return false;
  }
};

// Refresh token function
const refreshAccessToken = async (refreshToken, accessToken) => {
  try {
    const response = await apiClient.post("auth/refresh-tokens", {
      refreshToken,
      accessToken,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Token refresh failed");
  }
};

// Fetch user data using access token
const getUser = async () => {
  try {
    const response = await apiClient.get("auth/me"); // Assuming "auth/me" validates the token and returns user data
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to fetch user data");
  }
};

const verifyToken = async (jwtToken) => {
  console.log(jwtToken);
  try {
    const response = await apiClient.get(
      `/auth/verify-token/?token=${jwtToken}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error("Failed to fetch user data");
  }
};

const resetPassword = async (jwtToken, password) => {
  try {
    // Call the API endpoint to reset the password
    const response = await apiClient.post(`/auth/reset-password/?token=${jwtToken}`, {
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to reset password. Please try again.";
    return { success: false, message: errorMessage };
  }
};

const forgotPassword = async (email) => {
  try {
    // Call the API endpoint to reset the password
    const response = await apiClient.post(`/auth//forgot-password`, { email });
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      "Failed to forgot password. Please try again.";
    return { success: false, message: errorMessage };
  }
};

export default {
  login,
  logout,
  refreshAccessToken,
  getUser,
  verifyToken,
  resetPassword,
  forgotPassword,
};
