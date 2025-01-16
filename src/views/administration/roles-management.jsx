import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Loading } from "../../components/loading";
import CustomTable from "../../components/custom-table";
import RoleModalForm from "../../components/administration/role-form";
import rolePermissionService from "../../api/role-permission-service";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(null); // Holds the role being edited or null for creation

  const columns = [
    { title: "Role Name", data: "roleName" },
    { title: "Role Description", data: "roleDescription" },
    {
      title: "Actions",
      data: null,
      render: (_, row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEditRole(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  // Fetch all roles
  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await rolePermissionService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all permissions
  const getAllPermissions = async () => {
    try {
      setLoading(true);
      const response = await rolePermissionService.getAllPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new role
  const handleCreateRole = () => {
    setCurrentRole(null); // Clear currentRole for new role creation
    setShowModal(true);
  };

  // Handle editing an existing role
  const handleEditRole = (role) => {
    setCurrentRole(role); // Set the current role for editing
    setShowModal(true);
  };

  useEffect(() => {
    getRoles();
    getAllPermissions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="mt-4">
      <h2>Role Management</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Existing Roles</h5>
        <Button variant="primary" onClick={handleCreateRole}>
          Create Role
        </Button>
      </div>

      {/* Custom Table */}
      <CustomTable data={roles} columns={columns} enableFilters={false} />

      {/* Create/Edit Role Modal */}
      <RoleModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        getRoles={getRoles}
        permissions={permissions}
        currentRole={currentRole} // Pass the current role or null
      />
    </Container>
  );
};

export default Roles;
