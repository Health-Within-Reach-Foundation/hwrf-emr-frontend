import apiClient from "./axios-client";

const updateUser = async (userId, userData) => {
  try {
    const response = await apiClient.patch(
      `/clinics/users/${userId}`,
      userData
    );

    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to update user");
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while updating user");
    }
  }
};
export default {
  updateUser,
};
