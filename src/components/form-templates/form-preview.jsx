import React, { useState } from "react";
import { Form, Input, Select, Checkbox, Button, Upload, InputNumber, DatePicker, Radio } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const FormPreview = ({ formFields, onSubmit }) => {
  const [form] = Form.useForm();
  const [formValues, setFormValues] = useState({});

  // Handle form value changes
  const handleChange = (key, value) => {

    setFormValues((prevValues) => ({ ...prevValues, [key]: value }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    form
      .validateFields()
      .then(() => {
        onSubmit(formValues);
      })
      .catch((error) => console.log("Validation Failed:", error));
  };

  return (
    <Form form={form} layout="vertical">
      {formFields.map((field) => {
        switch (field.type) {
          case "text":
          case "email":
            return (
              <Form.Item
                key={field.key}
                label={field.label}
                name={field.key}
                rules={field.required ? [{ required: true, message: `${field.label} is required` }] : []}
              >
                <Input type={field.type} onChange={(e) => handleChange(field.key, e.target.value)} />
              </Form.Item>
            );

          case "number":
            return (
              <Form.Item key={field.key} label={field.label} name={field.key}>
                <InputNumber
                  min={field.min || 0}
                  max={field.max || 1000}
                  style={{ width: "100%" }}
                  onChange={(value) => handleChange(field.key, value)}
                />
              </Form.Item>
            );

          case "select":
            return (
              <Form.Item key={field.key} label={field.label} name={field.key}>
                <Select
                  mode={field.multiple ? "multiple" : "default"}
                  onChange={(value, option) => {
                    console.log(option, value)
                    handleChange(field.key, value)}}
                  options={field?.options?.map((option, index) => ({ value: option, label: option }))}
                >
                  {/* {field.options?.map((option, index) => (
                    <Option key={index} value={option} label={option}>
                      {option}
                    </Option>
                  ))} */}
                </Select>
              </Form.Item>
            );

          case "checkbox":
            return (
              <Form.Item key={field.key} name={field.key} valuePropName="checked">
                <Checkbox onChange={(e) => handleChange(field.key, e.target.checked)}>
                  {field.label}
                </Checkbox>
              </Form.Item>
            );

          case "radio":
            return (
              <Form.Item key={field.key} label={field.label} name={field.key}>
                <Radio.Group onChange={(e) => handleChange(field.key, e.target.value)}>
                  {field.options?.map((option, index) => (
                    <Radio key={index} value={option}>
                      {option}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            );

          case "date":
            return (
              <Form.Item key={field.key} label={field.label} name={field.key}>
                <DatePicker style={{ width: "100%" }} onChange={(date, dateString) => handleChange(field.key, dateString)} />
              </Form.Item>
            );

          case "file":
            return (
              <Form.Item key={field.key} label={field.label} name={field.key}>
                <Upload beforeUpload={() => false} onChange={(info) => handleChange(field.key, info.file)}>
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            );

          default:
            return null;
        }
      })}

      <Button type="primary" onClick={handleFormSubmit}>
        Submit
      </Button>
    </Form>
  );
};

export default FormPreview;
