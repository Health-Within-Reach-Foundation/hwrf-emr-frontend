import apiClient from "./axios-client";

const createFormFields = async (formFieldDetails) => {
  try {
    const response = await apiClient.post(
      `/clinics/form-fields`,
      formFieldDetails
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return {
          success: false,
          message:
            data.message || "Validation error or form field already exists.",
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: data.message || "Internal server error occurred.",
        };
      }
    }

    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

const getAllFormFields = async () => {
  try {
    const response = await apiClient.get(`/clinics/form-fields`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch form fields"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred.");
    }
  }
};

const getFormFieldById = async (formFieldId) => {
  try {
    const response = await apiClient.get(`/clinics/form-fields/${formFieldId}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 404) {
        return {
          success: false,
          message: data.message || "Form field not found.",
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: data.message || "Internal server error occurred.",
        };
      }
    }

    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

const updateFormField = async (formFieldId, formFieldDetails) => {
  try {
    const response = await apiClient.patch(
      `/clinics/form-fields/${formFieldId}`,
      formFieldDetails
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        return {
          success: false,
          message: data.message || "Validation error occurred.",
        };
      }

      if (status === 404) {
        return {
          success: false,
          message: data.message || "Form field not found.",
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: data.message || "Internal server error occurred.",
        };
      }
    }

    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

const deleteFormField = async (formFieldId) => {
  try {
    const response = await apiClient.delete(
      `/clinics/form-fields/${formFieldId}`
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 404) {
        return {
          success: false,
          message: data.message || "Form field not found.",
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: data.message || "Internal server error occurred.",
        };
      }
    }

    return {
      success: false,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

export default {
  createFormFields,
  getAllFormFields,
  getFormFieldById,
  updateFormField,
  deleteFormField,
};
