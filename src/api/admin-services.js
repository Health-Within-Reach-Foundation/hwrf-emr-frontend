import apiClient from "./axios-client";

const inviteUser = async (userFormBody) => {
  try {
    // Make the POST request
    const response = await apiClient.post(`/clinics/users`, userFormBody);

    // Since the response has no content, we can assume success if no error is thrown
    return { success: true };
  } catch (error) {
    // Extract and handle error message
    const errorMessage =
      error.response?.data?.message || "An error occurred. Please try again.";
    return { success: false, error: errorMessage };
  }
};

const getAllFormTemplates = async () => {
  try {
    const response = await apiClient.get(`/clinics/form-template`);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch form templates"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching form templates"
      );
    }
  }
};

export default {
  inviteUser,
  getAllFormTemplates,
};
