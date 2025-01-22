import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import rolePermissionService from "../../api/role-permission-service";
import { Select } from "antd";

const RoleModalForm = ({
  showModal,
  setShowModal,
  getRoles,
  permissions = [],
  currentRole = null, // Receives the role being edited or null
}) => {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Populate form fields if editing an existing role
  useEffect(() => {
    if (currentRole) {
      setRoleName(currentRole.roleName || "");
      setRoleDescription(currentRole.roleDescription || "");
      setSelectedPermissions(
        currentRole.permissions?.map((perm) => perm.id) || []
      );
    } else {
      resetForm(); // Clear form for new role creation
    }
  }, [currentRole]);

  const resetForm = () => {
    setRoleName("");
    setRoleDescription("");
    setSelectedPermissions([]);
    setErrors({});
  };

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
      const payload = {
        roleName,
        roleDescription,
        permissions: selectedPermissions,
      };

      let response;
      if (currentRole) {
        // Update role
        console.log(currentRole.id, payload);
        response = await rolePermissionService.updateRole(
          currentRole.id,
          payload
        );
      } else {
        console.log(payload);
        // Create new role
        response = await rolePermissionService.createRole(payload);
      }
      if (response.success) {
        toast.success(response.message || "Role saved successfully");
      }
      // setShowModal(false);
      // resetForm();
      // await getRoles(); // Refresh roles list
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
      setShowModal(false);
      resetForm();
      await getRoles();
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!roleName.trim()) errors.roleName = "Role name is required.";
    // if (!roleDescription.trim())
    //   errors.roleDescription = "Role description is required.";
    if (selectedPermissions.length === 0)
      errors.selectedPermissions = "At least one permission must be selected.";
    return errors;
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{currentRole ? "Edit Role" : "Create Role"}</Modal.Title>
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
              rows={2}
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              // isInvalid={!!errors.roleDescription}
              placeholder="Enter role description"
            />
            {/* <Form.Control.Feedback type="invalid">
              {errors.roleDescription}
            </Form.Control.Feedback> */}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Permissions</Form.Label>
            <Select
              mode="multiple"
              allowClear
              placeholder="Select permissions"
              dropdownStyle={{ zIndex: 9999 }} // Fix dropdown z-index
              style={{ width: "100%" }}
              value={selectedPermissions}
              onChange={(value) => setSelectedPermissions(value)}
              options={permissions.map((perm) => ({
                label: perm.action,
                value: perm.id,
              }))}
            />
            {errors.selectedPermissions && (
              <div className="text-danger">{errors.selectedPermissions}</div>
            )}
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
              {loading ? "Saving..." : currentRole ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RoleModalForm;
