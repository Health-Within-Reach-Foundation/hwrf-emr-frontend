import apiClient from "./axios-client";

const createRole = async (roleData) => {
  try {
    const response = await apiClient.post("/clinics/role-permission", roleData);
    return response.data;
  } catch (error) {
    console.error("Error creating role:", error);
    throw error;
  }
};

const getRoles = async () => {
  try {
    const response = await apiClient.get("/clinics/role-permission");
    return response.data;
  } catch (error) {
    console.error("Error fetching roles:", error);
    throw error;
  }
};

const getAllPermissions = async () => {
  try {
    const response = await apiClient.get(
      "/clinics/role-permission/all-permissions"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all permissions: ", error);
    throw error;
  }
};

const updateRole = async (roleId, roleData) => {
  try {
    const response = await apiClient.patch(
      `/clinics/role-permission/?roleId=${roleId}`,
      roleData
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching all permissions: ", error);
    throw error;
  }
};

export default {
  createRole,
  getRoles,
  getAllPermissions,
  updateRole,
};
