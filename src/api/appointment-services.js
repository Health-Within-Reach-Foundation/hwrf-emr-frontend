import apiClient from "./axios-client";

const bookAppointment = async (appointmentData) => {
  try {
    // Make the POST request with appointment data in the request body
    const response = await apiClient.post(
      "/clinics/appointments/book",
      appointmentData
    );

    // Return the data from the response
    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to book appointment"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while booking appointment");
    }
  }
};

const getAppointments = async () => {
  try {
    // const response = await apiClient.get(`/clinics/appointments/?appointmentDate=${appointmentDate}`);
    const response = await apiClient.get(`/clinics/appointments`);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to fetch appointments"
      );
    } else {
      console.error("Unexpected error:", error.message);
      throw new Error(
        "An unexpected error occurred while fetching appointments"
      );
    }
  }
};

const markAppointment = async (appointmentId, appointmentData) => {
  console.log(appointmentData, appointmentId)
  try {
    const response = await apiClient.patch(`/clinics/appointments/mark/${appointmentId}`, appointmentData)

    return response.data;
  } catch (error) {
    // Handle potential errors
    if (error.response) {
      // Handle specific error responses from the API
      console.error("Error response:", error.response.data);
      throw new Error(
        error.response.data.message || "Failed to update appointment"
      );
    } else {
      // Handle other types of errors
      console.error("Unexpected error:", error.message);
      throw new Error("An unexpected error occurred while updating appointment");
    }
  }
}
export default {
  bookAppointment,
  getAppointments,
  markAppointment,
};
