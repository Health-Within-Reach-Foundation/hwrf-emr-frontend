import React, { useEffect } from "react";
import { Drawer, Select, Button, Form } from "antd";
import userServices from "../../api/user-services";
import toast from "react-hot-toast";

const UserDrawer = ({
  open,
  onClose,
  userData,
  allRoles,
  allSpecialties,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  console.log("userData", userData);
  // Find the doctor role ID dynamically
  const doctorRoleId = allRoles?.find((role) => role.label === "doctor")?.value;

  // Watch selected roles
  const selectedRoles = Form.useWatch("roles", form) || [];

  // Check if doctor role is selected
  const isDoctorSelected = selectedRoles.includes(doctorRoleId);

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        roles: userData?.roles?.map((role) => role.id),
        specialty: userData?.specialties[0]?.id || null,
      });
    }
  }, [userData, form]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      console.log("values", values);
      const userBody = {
        roles: values.roles,
        specialties: isDoctorSelected ? [values?.specialty] : null,
      };

      console.log("userBody", userBody);
      const response = await userServices.updateUser(userData.id, userBody);
      if (response.success) {
        toast.success(response.message);
        onClose();
        onSave();
      } else {
        toast.error("Failed to update! Try again later.");
      }
    } catch (error) {
      console.error("Error saving roles and specialty:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Manage Roles and Specialty"
      placement="right"
      open={open}
      onClose={onClose}
      width={400}
      footer={
        <div style={{ textAlign: "right" }}>
          <Button
            onClick={onClose}
            style={{ marginRight: 8 }}
            loading={loading}
            className="btn-secondary rounded-0"
            variant="solid"
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={handleSave}
            loading={loading}
            className="btn-primary rounded-0"
            variant="solid"
          >
            Save
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        {/* Roles Selection - Multi-select */}
        <Form.Item
          name="roles"
          label="Roles"
          rules={[
            { required: true, message: "Please select at least one role!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select roles"
            options={allRoles}
          />
        </Form.Item>

        {/* Specialty Selection - Single-select, only visible if doctor is selected */}
        {isDoctorSelected && (
          <Form.Item
            name="specialty"
            label="Specialty"
            rules={[{ required: true, message: "Please select a specialty!" }]}
          >
            <Select
              placeholder="Select specialty"
              options={allSpecialties}
              allowClear
            />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  );
};

export default UserDrawer;
