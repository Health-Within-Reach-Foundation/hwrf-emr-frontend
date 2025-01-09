import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
import campManagementService from "../../api/camp-management-service";
import toast from "react-hot-toast";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CampModalForm = ({ show, onClose, users, specialties }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  console.log("users", users);
  console.log("specialties", specialties);
  // Form submission handler
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const { dateRange, ...rest } = values;

      const formData = {
        ...rest,
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      };

      //   onSubmit(formData); // Callback to handle the form submission in the parent component

      const response = await campManagementService.createCamp(formData);
      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.error);
      }
      onClose();
      setLoading(false);
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  // Form layout
  return (
    <Modal
      title="Create a New Camp"
      open={show}
      onCancel={onClose}
      footer={null}
      className="overflow-hidden"
    >
      <Form
    //   className="overflow-auto"
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          address: "",
          city: "",
          state: "",
          specialties: [],
          users: [],
          dateRange: null,
        }}
        style={{ maxHeight: "500px", overflowY: "auto" }}

      >
        <Form.Item
          label="Camp Name"
          name="name"
          rules={[{ required: true, message: "Please enter the camp name!" }]}
        >
          <Input placeholder="Enter camp name" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please enter the address!" }]}
        >
          <Input placeholder="Enter address" />
        </Form.Item>

        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "Please enter the city!" }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: "Please enter the state!" }]}
        >
          <Input placeholder="Enter state" />
        </Form.Item>

        <Form.Item
          label="Date Range"
          name="dateRange"
          rules={[
            {
              required: true,
              message: "Please select the start and end dates!",
            },
          ]}
        >
          <RangePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          label="Specialties"
          name="specialties"
          rules={[
            {
              required: true,
              message: "Please select at least one specialty!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select specialties"
            allowClear
            options={specialties}
          />
        </Form.Item>

        <Form.Item
          label="Users"
          name="users"
          rules={[
            { required: true, message: "Please select at least one user!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select users"
            allowClear
            options={users}
            filterOption={(input, option) => {
              const labelMatch = option.label
                .toLowerCase()
                .includes(input.toLowerCase());
              const phoneMatch = option.phoneNumber
                ? option.phoneNumber.toLowerCase().includes(input.toLowerCase())
                : false;
              return labelMatch || phoneMatch;
            }}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginRight: 8 }}
            loading={loading}
          >
            Submit
          </Button>
          <Button onClick={onClose} loading={loading}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CampModalForm;
