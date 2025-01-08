import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import clinicServices from "../../api/clinic-services";
import toast from "react-hot-toast";

const RoleModalForm = ({ showModal, setShowModal, getRoles }) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const data = await clinicServices.createRole({
        roleName,
        roleDescription,
      });
      setShowModal(false);
      setRoleName("");
      setRoleDescription("");
      toast.success(data.message);
      await getRoles();
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    if (!roleName.trim()) errors.roleName = "Role name is required.";
    if (!roleDescription.trim())
      errors.roleDescription = "Role description is required.";
    return errors;
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Role Name</Form.Label>
            <Form.Control
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              isInvalid={!!errors.roleName}
              placeholder="Enter role name"
            />
            <Form.Control.Feedback type="invalid">
              {errors.roleName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              isInvalid={!!errors.roleDescription}
              placeholder="Enter role description"
            />
            <Form.Control.Feedback type="invalid">
              {errors.roleDescription}
            </Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={() => setShowModal(false)}
              className="me-2"
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoleModalForm;
