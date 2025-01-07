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

const getAppointments = async (appointmentDate) => {
  try {
    const response = await apiClient.get(`/clinics/appointments/?appointmentDate=${appointmentDate}`);
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
export default {
  bookAppointment,
  getAppointments
};
