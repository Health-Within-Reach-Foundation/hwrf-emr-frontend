import apiClient from "./axios-client";

const inviteUser = async (userFormBody) => {
    try {
      // Make the POST request
      const response = await apiClient.post(`/clinics/user`, userFormBody);
  
      // Since the response has no content, we can assume success if no error is thrown
      return { success: true };
    } catch (error) {
      // Extract and handle error message
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      return { success: false, error: errorMessage };
    }
  };
  

export default {
  inviteUser,
};
