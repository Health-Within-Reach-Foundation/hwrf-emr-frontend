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
      throw new Error(error.response.data.message || "Failed to create GP record");
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
    const response = await apiClient.patch(`/patients/gp-records/${gpRecordId}`, gpRecordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to update GP record");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while updating GP record");
    }
  }
};

const deleteGPRecord = async (gpRecordId) => {
  try {
    const response = await apiClient.delete(`/patients/gp-records/${gpRecordId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(error.response.data.message || "Failed to delete GP record");
    } else {
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
      throw new Error(error.response.data.message || "Failed to fetch patient follow-ups");
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while fetching patient follow-ups");
    }
  }
}

export default {
  addPatient,
  createMammographyDetails,
  getPatients,
  getPatientDetailsById,
  updatePatientDetails,
  addPatientDiagnosis,
  getMammographyDetails,
  updateMammographyDetails,
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
