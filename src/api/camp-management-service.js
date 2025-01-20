import apiClient from "./axios-client";

const getCamps = async () => {
  try {
    // Make the GET request with query parameters
    const response = await apiClient.get("/clinics/camps");

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to fetch camps");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching camps");
    }
  }
};

const createCamp = async (campData) => {
  try {
    const response = await apiClient.post("/clinics/camps", campData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to create camp");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while creating camp");
    }
  }
};

const selectCamp = async (campId) => {
  try {
    const response = await apiClient.post("/clinics/camps/set-camp", {
      campId,
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to select camp");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while selecting camp");
    }
  }
};

const updateCampById = async (campId, campData) => {
  try {
    const response = await apiClient.patch(
      `/clinics/camps/${campId}`,
      campData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to update camp");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while updating camp");
    }
  }
};

export default {
  getCamps,
  createCamp,
  selectCamp,
  updateCampById,
};
