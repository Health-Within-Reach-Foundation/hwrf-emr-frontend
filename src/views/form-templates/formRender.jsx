import React, { useState, useEffect } from "react";
import { Input, Radio, Checkbox, Select, Form, Button, DatePicker, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "./DynamicForm.scss";

const { TextArea } = Input;
const { Option } = Select;


const DynamicForm = ({ data, onSubmit = () => {}  }) => {
  const [formState, setFormState] = useState({});
  const [form] = Form.useForm();

  // Initialize form state from the data prop
  useEffect(() => {
    const initialState = data.reduce((acc, field) => {
      acc[field.id] = field.value || (field.type === "checkbox" ? [] : "");
      return acc;
    }, {});
    setFormState(initialState);
  }, [data]);

  // Handle field value change
  const handleFieldChange = (id, value) => {
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Render a specific field based on its type
  const renderField = (field) => {
    switch (field.type) {
      case "input":
        return (
          <Input
            id={field.id}
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "phone":
        return (
          <Input
            id={field.id}
            type="tel"
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "mailId":
        return (
          <Input
            id={field.id}
            type="email"
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "password":
        return (
          <Input.Password
            id={field.id}
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "number":
        return (
          <Input
            id={field.id}
            type="number"
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "textarea":
        return (
          <TextArea
            id={field.id}
            rows={4}
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "radio":
        return (
          <Radio.Group
            id={field.id}
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            value={formState[field.id]}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          />
        );
      case "checkbox":
        return (
          <Checkbox.Group
            id={field.id}
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            value={formState[field.id]}
            onChange={(checkedValues) => handleFieldChange(field.id, checkedValues)}
          />
        );
      case "select":
        return (
          <Select
            id={field.id}
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            placeholder={field.title}
            value={formState[field.id]}
            onChange={(value) => handleFieldChange(field.id, value)}
          />
        );
      case "date":
        return (
          <DatePicker
            id={field.id}
            placeholder={field.title}
            value={formState[field.id] ? moment(formState[field.id]) : null}
            onChange={(date, dateString) => handleFieldChange(field.id, dateString)}
          />
        );
      case "file":
        return (
          <Upload.Dragger
            id={field.id}
            name="files"
            beforeUpload={(file) => {
              handleFieldChange(field.id, file.name);
              return false; // Prevent automatic upload
            }}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to upload</p>
          </Upload.Dragger>
        );
      default:
        return <p>Unsupported field type: {field.type}</p>;
    }
  };

  // Handle form submission
  const handleFinish = () => {
    onSubmit(formState); // Pass form state to parent component
  };

  return (
    <div className="dynamic-form-container">
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        {data.map((field) => (
          <Form.Item
            key={field.id}
            name={field.id}
            label={field.title}
            rules={[{ required: true, message: `${field.title} is required!` }]}
          >
            {renderField(field)}
          </Form.Item>
        ))}

        <Form.Item>
          <Button type="primary" htmlType="submit" className="submit-button">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default DynamicForm;

