import React, { useState } from "react";
import { Drawer, Select, Button, Form } from "antd";
import userServices from "../../api/user-services";
import toast from "react-hot-toast";

const RoleSpecialtyDrawer = ({
  open,
  onClose,
  userId,
  userData,
  allRoles,
  allDepartments,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  console.log(userData, "in user drawer page", allDepartments);
  const handleSave = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const userBody = {
        roles: values.roles,
        specialties: values.departments,
      };

      console.log(userBody);
      const response = await userServices.updateUser(userData.id, userBody);
      if (response.success) {
        toast.success(response.message);
      } else {
        toast.error("Failed to update! try later");
      }
      console.log(values.roles, values.departments);
      //   onSave(userId, values.roles, values.specialties);
      onClose();
    } catch (error) {
      console.error("Error saving roles and specialties:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      title="Manage Roles and Specialties"
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
          >
            Cancel
          </Button>
          <Button type="primary" onClick={handleSave} loading={loading}>
            Save
          </Button>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          roles: userData?.roles?.map((role) => role.id),
          departments: userData?.department?.map((dept) => dept.id),
        }}
      >
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
        <Form.Item
          name="departments"
          label="Department"
          rules={[
            {
              required: true,
              message: "Please select at least one department!",
            },
          ]}
        >
          <Select
            mode="multiple"
            // value={}
            placeholder="Select department"
            options={allDepartments}
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default RoleSpecialtyDrawer;
