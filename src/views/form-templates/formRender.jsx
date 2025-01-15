import React from "react";
import { Input, Radio, Checkbox, Select, Form, Button, Card } from "antd";
import "./DynamicForm.scss"; // Importing the CSS file

const { TextArea } = Input;

const DynamicForm = ({ onSubmit }) => {
  const jsonData = [
    {
      id: "1736497422296",
      type: "phone",
      title: "name",
      value: "Rohan",
      options: null,
    },
    {
      id: "1736497433985",
      type: "phone",
      title: "phone number",
      value: "",
      options: null,
    },
    {
      id: "1736497444472",
      type: "maidId",
      title: "Email",
      value: "",
      options: null,
    },
    {
      id: "1736497452593",
      type: "radio",
      title: "New Field",
      value: "",
      options: ["Rohan", "yash", "veer", "kedar", "navin"],
    },
    {
      id: "1736497504441",
      type: "checkbox",
      title: "checkbox",
      value: "",
      options: ["yash", "navin", "veer"],
    },
    {
      id: "1736497541449",
      type: "select",
      title: "select field",
      value: "",
      options: ["Option 1"],
    },
    {
      id: "1736497607409",
      type: "textarea",
      title: "text area field",
      value: "",
      options: null,
    },
  ];

  const [form] = Form.useForm();

  const renderField = (field) => {
    switch (field.type) {
      case "input":
        return <Input placeholder={field.title} />;
      case "phone":
        return <Input type="tel" placeholder={field.title} />;
      case "maidId":
        return <Input placeholder={field.title} />;
      case "textarea":
        return <TextArea rows={4} placeholder={field.title} />;
      case "radio":
        return (
          <Radio.Group
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
          />
        );
      case "checkbox":
        return (
          <Checkbox.Group
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
          />
        );
      case "select":
        return (
          <Select
            options={field.options.map((opt) => ({ label: opt, value: opt }))}
            placeholder={field.title}
            style={{ width: "100%" }}
          />
        );
      default:
        return null;
    }
  };

  const handleFinish = (values) => {
    onSubmit(values);
  };

  return (
    <div className="dynamic-form-container">
      <Card className="dynamic-form-card" >
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          {jsonData.map((field) => (
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
