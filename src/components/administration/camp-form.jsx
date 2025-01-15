import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
import campManagementService from "../../api/camp-management-service";
import toast from "react-hot-toast";
import moment from "moment"; // Import moment to get the current date

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
        form={form}
        layout="vertical"
        initialValues={{
          name: "",
          location: "",
          city: "",
          // vans: [],
          specialties: [],
          users: [],
          dateRange: [moment(), moment()], // Set today's date as the default range
        }}
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        {/* Date Range */}
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

        {/* Camp Name */}
        <Form.Item
          label="Camp Name"
          name="name"
          rules={[{ required: true, message: "Please enter the camp name!" }]}
        >
          <Input placeholder="Enter camp name" />
        </Form.Item>

        {/* Location (Address renamed) */}
        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter the location!" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        {/* Camp City */}
        <Form.Item
          label="Camp City"
          name="city"
          rules={[{ required: true, message: "Please enter the city!" }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        {/* <Form.Item
          label="Vans"
          name="vans"
          rules={[
            { required: true, message: "Please select at least one van!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Van"
            allowClear
            options={[
              { value: "Van 1", label: "Van 1" },
              { value: "Van 2", label: "Van 2" },
              { value: "Van 3", label: "Van 3" },
            ]}
          />
        </Form.Item> */}
        {/* Services (Specialties renamed) */}
        <Form.Item
          label="Services"
          name="specialties"
          rules={[
            { required: true, message: "Please select at least one service!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select services"
            allowClear
            options={specialties}
          />
        </Form.Item>

        {/* Staff Attending (Users renamed) */}
        <Form.Item
          label="Staff Attending"
          name="users"
          rules={[
            {
              required: true,
              message: "Please select at least one staff member!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select staff"
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

        {/* Submit/Cancel Buttons */}
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
