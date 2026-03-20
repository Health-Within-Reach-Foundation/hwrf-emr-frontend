import toast from 'react-hot-toast';
import apiClient from './axios-client';

const addPatient = async (patientData) => {
  try {
    const response = await apiClient.post('/patients', patientData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to add patient');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while adding patient');
    }
  }
};

// ✅ FIX: accepts filters object (name, address, service) so Apply Filter works
const getPatients = async ({ clinicId, limit = 50, offset = 0, name = '', address = '', service = '' } = {}) => {
  try {
    const params = { limit, offset, name, address, service };
    if (clinicId) params.clinicId = clinicId;

    const response = await apiClient.get('/patients', { params });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch patients');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while fetching patients');
    }
  }
};

const getRecentPatients = async (limit = 50, offset = 0) => {
  try {
    const response = await apiClient.get('/patients/recent');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch recent patients');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while fetching recent patients');
    }
  }
};

const searchPatients = async (searchTerm = '', limit = 50, offset = 0) => {
  try {
    const response = await apiClient.get('/patients/search', {
      params: { searchTerm, limit, offset },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to search patients');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while searching patients');
    }
  }
};

// ✅ FIX: accepts filters so only filtered patients are emailed
const getPatientForExport = async ({ name = '', address = '', service = '' } = {}) => {
  try {
    const response = await apiClient.get('/patients/export', {
      params: { name, address, service },
      timeout: 60000,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch patients for export');
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout:', error.message);
      throw new Error('Export request timed out. Please try again or reduce the number of records.');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while exporting patients');
    }
  }
};

const updatePatientDetails = async (patientId, patientData) => {
  try {
    const response = await apiClient.patch(`/patients/${patientId}`, patientData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to update patient');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while updating patient');
    }
  }
};

const getPatientDetailsById = async (patientId, specialtyId) => {
  try {
    const response = await apiClient.get(`/patients/${patientId}?specialtyId=${specialtyId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch patient details');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while fetching patient details');
    }
  }
};

const addPatientDiagnosis = async (patientDiagnosisData) => {
  try {
    const response = await apiClient.post(`patients/diagnosis`, patientDiagnosisData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to add diagnosis');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while adding patient diagnosis');
    }
  }
};

const updatePatientDiagnosis = async (diagnosisId, patientDiagnosisData) => {
  try {
    const response = await apiClient.patch(`patients/diagnosis/${diagnosisId}`, patientDiagnosisData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to update diagnosis');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while updating patient diagnosis');
    }
  }
};

const addTreatmentByDiagnosis = async (treatmentData) => {
  try {
    const response = await apiClient.post(`patients/treatment`, treatmentData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to add treatment');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while adding patient diagnosis treatment');
    }
  }
};

// ✅ FIX: correct param names (was treatementId/treatementBody in remote — typo)
const updateTreatmentById = async (treatmentId, treatmentData) => {
  try {
    const response = await apiClient.patch(`patients/treatment/${treatmentId}`, treatmentData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to update treatment');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while updating treatment');
    }
  }
};

const createMammographyDetails = async (patientId, mammographyBody) => {
  try {
    const response = await apiClient.post(`patients/mammography/${patientId}`, mammographyBody, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to add mammography details');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while adding patient mammography details');
    }
  }
};

const getMammographyDetails = async (patientId) => {
  try {
    const response = await apiClient.get(`patients/mammography/${patientId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to generate mammography report');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while generating patient mammography report');
    }
  }
};

const updateMammographyDetails = async (patientId, mammographyBody) => {
  try {
    const response = await apiClient.patch(`patients/mammography/${patientId}`, mammographyBody);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to update mammography details');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while updating patient mammography details');
    }
  }
};

const deleteMammographyDetailsById = async (mammographyId) => {
  try {
    const response = await apiClient.delete(`patients/mammography/${mammographyId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to delete mammography details');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while deleting patient mammography details');
    }
  }
};

const deleteDiagnosisById = async (diagnosisId) => {
  try {
    const response = await apiClient.delete(`patients/diagnosis/${diagnosisId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to delete diagnosis');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while deleting patient diagnosis treatment');
    }
  }
};

const createGPRecord = async (gpRecordData) => {
  try {
    const response = await apiClient.post(`/patients/gp-records`, gpRecordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to create GP record');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while creating GP record');
    }
  }
};

// ✅ FIX: use params (not query) so patientId is actually sent
const getGPRecordsByPatient = async (patientId) => {
  try {
    const response = await apiClient.get(`patients/gp-records`, {
      params: { patientId },
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch GP records');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while fetching GP records');
    }
  }
};

const getGPRecordById = async (gpRecordId) => {
  try {
    const response = await apiClient.get(`/patients/gp-records/${gpRecordId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch GP record');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while fetching GP record');
    }
  }
};

const updateGPRecord = async (gpRecordId, gpRecordData) => {
  try {
    const response = await apiClient.patch(`/patients/gp-records/${gpRecordId}`, gpRecordData);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to update GP record');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while updating GP record');
    }
  }
};

const deleteGPRecord = async (gpRecordId) => {
  try {
    const response = await apiClient.delete(`/patients/gp-records/${gpRecordId}`);
    if (response.status === 200) {
      toast.success(response.data.message || 'GP record deleted successfully');
    }
    return response.data.success;
  } catch (error) {
    if (error.response) {
      toast.error(error.response.data.message || 'Failed to delete GP record');
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to delete GP record');
    } else {
      toast.error('An unexpected error occurred while deleting GP record');
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while deleting GP record');
    }
  }
};

const getPatientsFollowUps = async () => {
  try {
    const response = await apiClient.get('/patients/follow-ups');
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Error response:', error.response.data);
      throw new Error(error.response.data.message || 'Failed to fetch patient follow-ups');
    } else {
      console.error('Unexpected error:', error.message);
      throw new Error('An unexpected error occurred while fetching patient follow-ups');
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