import apiClient from "./axios-client";

const addPatient = async (patientData) => {
  try {
    // Make the POST request with patient data in the request body
    const response = await apiClient.post("/patients", patientData);

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to add patient");
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while adding patient");
    }
  }
};

const getPatients = async (clinicId) => {
  try {
    // Make the GET request with clinic ID as a query parameter
    const response = await apiClient.get("/patients");

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch patients"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching patients");
    }
  }
};

const updatePatientDetails = async (patientId, patientData) => {
  try {
    const response = await apiClient.patch(
      `/patients/${patientId}`,
      patientData
    );
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update patient"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while updating patient");
    }
  }
};

const getPatientDetailsById = async (patientId, specialtyId) => {
  try {
    // Make the GET request with patient ID as a path parameter
    const response = await apiClient.get(
      `/patients/${patientId}?specialtyId=${specialtyId}`
    );

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch patient details"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching patient details"
      );
    }
  }
};

export default {
  addPatient,
  getPatients,
  getPatientDetailsById,
  updatePatientDetails,
};
