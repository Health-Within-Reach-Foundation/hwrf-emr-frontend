import toast from "react-hot-toast";
import apiClient from "./axios-client";

// Refresh token function
const onBoardClinic = async (clinicDetails) => {
  try {
    const response = await apiClient.post("auth/onboard-clinic", clinicDetails);

    if (response.status === 201) {
      // return {
      //   success: true,
      //   message: response.data.message,
      //   clinic: response.data.clinic,
      //   admin: response.data.admin,
      // };
      toast.success(response.data.message);
    } else {
      toast.error("Error please try again");
      throw new Error("Unexpected status code: " + response.status);
    }
  } catch (error) {
    // Handle specific error responses based on the API documentation
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return {
          success: false,
          message:
            data.message || "Validation error or clinic/admin already exists.",
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: data.message || "Internal server error occurred.",
        };
      }
    }

    // Handle any unexpected errors
    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

const getClinics = async (status) => {
  try {
    const queryParams = {
      status: status,
      sortBy: "createdAt",
      order: "desc",
    };

    // Make the GET request with query parameters
    const response = await apiClient.get("/superadmin/clinics", {
      params: queryParams,
    });

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to fetch clinics");
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching clinics");
    }
  }
};

const getClinicById = async (clinicId) => {
  try {
    // Make the GET request with query parameters
    const response = await apiClient.get(`/clinics/${clinicId}`);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch clinic details"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching clinic");
    }
  }
};

const approveClinic = async (clinicId) => {
  try {
    // Make the GET request with query parameters
    const response = await apiClient.patch(
      `/superadmin/approve-clinic/${clinicId}`,
      {
        status: "active",
      }
    );

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to approve");
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while approving clinic");
    }
  }
};

const getUsersByClinic = async () => {
  try {
    const response = await apiClient.get(`/clinics/user/all`);
    return response.data; // Assuming `data` contains the user list
  } catch (error) {
    console.error("Error fetching clinic users:", error);
    throw error; // Re-throw to handle in the component
  }
};

export default {
  onBoardClinic,
  getClinics,
  getClinicById,
  approveClinic,
  getUsersByClinic,
};
