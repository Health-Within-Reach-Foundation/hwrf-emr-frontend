import apiClient from "./axios-client";

const getAllSpecialties = async () => {
    try {
      const response = await apiClient.get(`/superadmin/specialities`);
      return response.data; // Assuming `data` contains the department list
    } catch (error) {
      console.error("Error fetching clinic departments:", error);
      throw error; // Re-throw to handle in the component
    }
  };


  export default {
    getAllSpecialties
  }