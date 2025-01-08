import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Modal,
  Form,
  Row,
  Col,
} from "react-bootstrap";
import clinicServices from "../../api/clinic-services";
import { Loading } from "../../components/loading";
import CustomTable from "../../components/custom-table";
import RoleModalForm from "../../components/administration/role-form";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Role Name", data: "roleName" },
    { title: "Role Description", data: "roleDescription" },
  ];

  // Fetch existing roles
  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getRoles();
      console.log(response.data, "roles");
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setErrorAlert("Failed to fetch roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="mt-4">
      <h2>Role Management</h2>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5>Existing Roles</h5>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Create Role
        </Button>
      </div>

      {/* Custom Table */}
      <CustomTable data={roles} columns={columns} enableFilters={false} />

      {/* Create Role Modal */}
      <RoleModalForm showModal={showModal} setShowModal={setShowModal} getRoles={getRoles} />
    </Container>
  );
};

export default Roles;
