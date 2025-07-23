import { get } from "jquery";
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

const getCampById = async (campId) => {
  try {
    // Make the GET request to fetch camp details by ID
    const response = await apiClient.get(`/clinics/camps/${campId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch camp details"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching camp details"
      );
    }
  }
};

export const getCampsAnalytics = async (startDate,endDate) => {
  try {
    const response = await apiClient.post("/clinics/camps/analytics", 
{endDate, startDate}

    );
    console.log("responsesaaa", response);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch camps analytics"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching camps analytics"
      );
    }
  }
}
// export const getdoctorAnalytics = async () => {
//   try {
//     const response = await apiClient.get("/clinics/camps/analytics");
//     console.log("response", response);
//     return response.data;
    
//   } catch (error) {
//     if (error.response) {
//       console.error("Error response:", error.response.data);
//       throw new Error(
//         error.response.data.message || "Failed to fetch camps analytics"
//       );
//     } else {
//       console.error("Unexpected error:", error.message);
//       throw new Error(
//         "An unexpected error occurred while fetching camps analytics"
//       );
//     }
//   }
// }

// export const getDoctorAnalytics = async (startDate, endDate) => {
//   try {
//     const response = await apiClient.get(`/analytics/camps?start=${startDate}&end=${endDate}`);
//     if (!response.ok) throw new Error('Network response was not ok');
    
//     const result = await response.json();

//     if (!result.success) throw new Error(result.message || 'Unknown error');

//     const doctorWise = result.data.dentistryAnalytics.doctorWiseData;
//     const formatted = Object.entries(doctorWise).map(([name, data]) => ({
//       name: name === 'undefined' ? 'Unknown' : name,
//       ...data,
//       totalEarnings: data.onlineEarnings + data.offlineEarnings,
//     }));

//     const summary = result.data.dentistryAnalytics;

//     return { doctorData: formatted, summary };

//   } catch (error) {
//     throw error;
//   }
// };

export default {
  getCamps,
  getCampById,
  createCamp,
  selectCamp,
  updateCampById,
  getCampsAnalytics,
  // getdoctorAnalytics,
  // getDoctorAnalytics
};
