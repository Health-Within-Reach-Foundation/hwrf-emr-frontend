import toast from "react-hot-toast";
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

const getPatients = async (limit = 50, offset = 0) => {
  try {
    // Make the GET request with pagination parameters
    const response = await apiClient.get("/patients", {
      params: {
        limit,
        offset,
      },
    });

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

const getRecentPatients = async (limit = 50, offset = 0) => {
  try {
    // Make the GET request to fetch recent patients
    const response = await apiClient.get("/patients/recent");
    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch recent patients"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching recent patients"
      );
    }
  }
};

/**
 * Fetch ALL patients for the clinic for export (no pagination)
 * Used for Excel/CSV export functionality
 *
 * @param {number} maxRecords - Maximum records to export (default 10000)
 * @returns {Promise<Object>} - { success, data: [all patients], meta: { total, exported } }
 * @throws {Error} - If fetch fails or exceeds max records
 */
/**
 * Search patients by name with server-side pagination
 * Searches across all clinic patients, not just current page
 *
 * @param {string} searchTerm - Name to search for
 * @param {number} limit - Records per page (default 50)
 * @param {number} offset - Pagination offset (default 0)
 * @returns {Promise<Object>} - { success, data: [matching patients], meta: { total, ... } }
 * @throws {Error} - If search fails
 */
const searchPatients = async (searchTerm = "", limit = 50, offset = 0) => {
  try {
    // Make the GET request with search parameters
    const response = await apiClient.get("/patients/search", {
      params: {
        searchTerm,
        limit,
        offset,
      },
    });

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to search patients"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while searching patients");
    }
  }
};

const getPatientForExport = async (maxRecords = 10000) => {
  try {
    // Make the GET request to the export endpoint without pagination
    const response = await apiClient.get("/patients/export", {
      params: {
        maxRecords,
      },
      // Increase timeout for large exports
      timeout: 60000,
    });

    // Return the complete data including metadata
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch patients for export"
      );
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout:", error.message);
      throw new Error(
        "Export request timed out. Please try again or reduce the number of records."
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while exporting patients");
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

const addPatientDiagnosis = async (patientDiagnosisData) => {
  try {
    const response = await apiClient.post(
      `patients/diagnosis`,
      patientDiagnosisData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the Content-Type for FormData
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to add diagnosis");
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while adding patient diagnosis"
      );
    }
  }
};

const updatePatientDiagnosis = async (diagnosisId, patientDiagnosisData) => {
  try {
    const response = await apiClient.patch(
      `patients/diagnosis/${diagnosisId}`,
      patientDiagnosisData
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update diagnosis"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while updating patient diagnosis"
      );
    }
  }
};

const addTreatmentByDiagnosis = async (treatementBody) => {
  try {
    const response = await apiClient.post(`patients/treatment`, treatementBody);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to add treatement"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while adding patient diagnosis treatement"
      );
    }
  }
};

const updateTreatmentById = async (treatementId, treatementBody) => {
  try {
    const response = await apiClient.patch(
      `patients/treatment/${treatementId}`,
      treatementBody
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to add treatement"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while adding patient diagnosis treatement"
      );
    }
  }
};
const createMammographyDetails = async (patientId, mammographyBody) => {
  try {
    const response = await apiClient.post(
      `patients/mammography/${patientId}`,
      mammographyBody
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to add mammography details"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while adding patient mammography details"
      );
    }
  }
};
const getMammographyDetails = async (patientId) => {
  try {
    const response = await apiClient.get(`patients/mammography/${patientId}`);

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to generate mammography report"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while generating patient mammography report"
      );
    }
  }
};
const updateMammographyDetails = async (patientId, mammographyBody) => {
  try {
    const response = await apiClient.patch(
      `patients/mammography/${patientId}`,
      mammographyBody
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update mammography details"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while updating patient mammography details"
      );
    }
  }
};

// delete mammography details by id
const deleteMammographyDetailsById = async (mammographyId) => {
  try {
    const response = await apiClient.delete(
      `patients/mammography/${mammographyId}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to delete mammography details"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while deleting patient mammography details"
      );
    }
  }
};

const deleteDiagnosisById = async (diagnosisId) => {
  try {
    const response = await apiClient.delete(
      `patients/diagnosis/${diagnosisId}`
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to delete diagnosis"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while deleting patient diagnosis treatement"
      );
    }
  }
};

const createGPRecord = async (gpRecordData) => {
  try {
    const response = await apiClient.post(`/patients/gp-records`, gpRecordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to create GP record"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while creating GP record");
    }
  }
};

const getGPRecordsByPatient = async (patientId) => {
  try {
    const response = await apiClient.get(`patients/gp-records`, {
      query: { patientId },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch GP records"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching GP records");
    }
  }
};

const getGPRecordById = async (gpRecordId) => {
  try {
    const response = await apiClient.get(`/patients/gp-records/${gpRecordId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch GP record"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching GP record");
    }
  }
};

const updateGPRecord = async (gpRecordId, gpRecordData) => {
  try {
    const response = await apiClient.patch(
      `/patients/gp-records/${gpRecordId}`,
      gpRecordData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update GP record"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while updating GP record");
    }
  }
};

const deleteGPRecord = async (gpRecordId) => {
  try {
    const response = await apiClient.delete(
      `/patients/gp-records/${gpRecordId}`
    );
    if (response.status === 200) {
      toast.success(response.data.message || "GP record deleted successfully");
    }
    return response.data.success;
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message || "Failed to delete GP record");
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to delete GP record"
      );
    } else {
      toast.error("An unexpected error occurred while deleting GP record");
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while deleting GP record");
    }
  }
};

const getPatientsFollowUps = async () => {
  try {
    const response = await apiClient.get("/patients/follow-ups");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch patient follow-ups"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching patient follow-ups"
      );
    }
  }
};

export default {
  addPatient,
  createMammographyDetails,
  getPatients,
  getRecentPatients,
  searchPatients,
  getPatientForExport,
  getPatientDetailsById,
  updatePatientDetails,
  addPatientDiagnosis,
  getMammographyDetails,
  updateMammographyDetails,
  deleteMammographyDetailsById,
  updatePatientDiagnosis,
  addTreatmentByDiagnosis,
  updateTreatmentById,
  deleteDiagnosisById,
  createGPRecord,
  getGPRecordsByPatient,
  getGPRecordById,
  updateGPRecord,
  deleteGPRecord,
  getPatientsFollowUps,
};
