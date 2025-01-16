import React, { useState } from "react";
import { Input, Radio, Checkbox, Select, Form, Button, Card } from "antd";
import "./DynamicForm.scss"; // Importing the CSS file

const { TextArea } = Input;

const DynamicForm = ({ onSubmit, data }) => {
  const [formData, setFormData] = useState(
    data.reduce((acc, field) => {
      acc[field.title] = field.value || "";
      return acc;
    }, [])
  );
// Update state on input change
  const handleFieldChange = (title, value) => {
    setFormData((prev) => ({
      ...prev,
      [title]: value,
    }));
  };

  const [form] = Form.useForm();


  const renderField = (field) => {
    switch (field.type) {
      case "input":
        return (
          <Input
            id={field.id}
            placeholder={field.title}
            defaultValue={field.value}
            onChange={(e) => handleFieldChange(field.title, e.target.value)}
          />
        );
      case "phone":
        return (
          <Input
            id={field.id}
            type="tel"
            placeholder={field.title}
            defaultValue={field.value}
            onChange={(e) => handleFieldChange(field.title, e.target.value)}
          />
        );
      case "mailId":
        return (
          <Input
            placeholder={field.title}
            defaultValue={field.value}
            id={field.id}
            onChange={(e) => handleFieldChange(field.title, e.target.value)}
          />
        );
      case "textarea":
        return (
          <TextArea
            rows={4}
            placeholder={field.title}
            defaultValue={field.value}
            id={field.id}
            onChange={(e) => handleFieldChange(field.title, e.target.value)}
          />
        );
      case "radio":
        return (
          <Radio.Group
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            defaultValue={field.value}
            id={field.id}
            onChange={(e) => handleFieldChange(field.title, e.target.value)}
          />
        );
      case "checkbox":
        return (
          <Checkbox.Group
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            defaultValue={field.value}
            onChange={(e) => handleFieldChange(field.title, e.target.value)}
            id={field.id}
          />
        );
      case "select":
        return (
          <Select
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            defaultValue={field.value}
            placeholder={field.title}
            style={{ width: "100%" }}
            onChange={(label, option) => {
              handleFieldChange(option.label, option.value);
            }}
            id={field.id}
          />
        );
      default:

    }
  };

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <div className="dynamic-form-container">
      <Card className="dynamic-form-card" >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {formData.map((field) => (
            <Form.Item
              key={field.id}
              name={field.title}
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
      </Card>

    </div>
  );
};

export default DynamicForm;
