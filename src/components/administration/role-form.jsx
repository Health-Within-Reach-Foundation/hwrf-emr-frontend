import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Row, Col, Checkbox } from "antd";
import toast from "react-hot-toast";
import rolePermissionService from "../../api/role-permission-service";
import { transformText } from "../../utilities/utility-function";

const { TextArea } = Input;

const RoleModalForm = ({
  showModal,
  setShowModal,
  getRoles,
  permissions = [],
  currentRole = null, // Receives the role being edited or null
}) => {
  const [form] = Form.useForm(); // Ant Design's useForm hook for form management
  const [loading, setLoading] = useState(false);
  console.log("userROle -->  ", currentRole);
  // Populate form fields if editing an existing role
  useEffect(() => {
    if (currentRole) {
      const selectedPermissions =
        currentRole.permissions?.map((perm) => perm.id) || [];
      form.setFieldsValue({
        roleName: currentRole.roleName || "",
        roleDescription: currentRole.roleDescription || "",
        permissions: selectedPermissions,
      });
    } else {
      form.resetFields(); // Clear form for new role creation
    }
  }, [currentRole, form]);

  // Handle form submission
  const handleSubmit = async (values) => {
    const { roleName, roleDescription, permissions } = values;

    try {
      setLoading(true);
      const payload = { roleName, roleDescription, permissions };

      let response;
      if (currentRole) {
        // Update role
        response = await rolePermissionService.updateRole(
          currentRole.id,
          payload
        );
      } else {
        // Create new role
        response = await rolePermissionService.createRole(payload);
      }

      if (response.success) {
        toast.success(response.message || "Role saved successfully");
      }
      setShowModal(false);
      await getRoles(); // Refresh roles list
    } catch (error) {
      console.error("Error saving role:", error);
      toast.error("Failed to save role. Please try again.");
    } finally {
      setLoading(false);
      form.resetFields();
    }
  };

  // Group permissions by category and sort by fixed order (read, write, no access)
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const category = perm.action.split(":")[0]; // Extract category (e.g., "administration", "camps")
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(perm);
    return acc;
  }, {});

  // Custom sorting for each category to ensure "read", "write", and "no access" come first
  const sortedPermissions = Object.keys(groupedPermissions).reduce(
    (acc, category) => {
      const sortedCategory = groupedPermissions[category].sort((a, b) => {
        const aAction = a.action.split(":")[1]; // Get the action type (e.g., "read", "write")
        const bAction = b.action.split(":")[1];

        const order = ["read", "write", "no access"];
        const aIndex = order.indexOf(aAction);
        const bIndex = order.indexOf(bAction);

        return aIndex - bIndex; // Sorting based on the fixed order
      });

      acc[category] = sortedCategory;
      return acc;
    },
    {}
  );

  return (
    <Modal
      open={showModal}
      onCancel={() => setShowModal(false)}
      centered
      footer={null}
      maskClosable={false}
      width={900}
    >
      <h3>{currentRole ? "Edit Role" : "Create Role"}</h3>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        initialValues={{
          permissions: [], // Set initial permissions to an empty array
        }}
      >
        <Form.Item
          label="Role Name"
          name="roleName"
          rules={[{ required: true, message: "Role name is required." }]}
        >
          <Input placeholder="Enter role name" />
        </Form.Item>

        <Form.Item label="Role Description" name="roleDescription">
          <TextArea rows={4} placeholder="Enter role description" />
        </Form.Item>

        <Form.Item
          label="Permissions"
          name="permissions"
          rules={[
            {
              required: true,
              message: "At least one permission must be selected.",
            },
          ]}
        >
          <Checkbox.Group className="w-100">
            <div className="w-100">
              {Object.keys(sortedPermissions).map((category) => (
                <div key={category}>
                  <h6>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </h6>
                  <Row gutter={[16, 16]} className="mb-2">
                    {sortedPermissions[category].map((perm) => (
                      <Col
                        xs={24}
                        sm={12}
                        md={8}
                        lg={6}
                        key={perm.id}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Checkbox
                          value={perm.id}
                          style={{ marginRight: 8 }}
                          className="w-auto"
                        >
                          {transformText(perm.action.split(":")[1])}{" "}
                        </Checkbox>
                      </Col>
                    ))}
                  </Row>
                </div>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={() => setShowModal(false)}
            style={{ marginRight: "10px" }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={loading}
          >
            {currentRole ? "Update" : "Create"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default RoleModalForm;
