import React from "react";
import { Input, Switch, Button, Space, Divider } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";

const FieldProperties = ({ field, updateField }) => {
  // Handle property updates
  const handleChange = (key, value) => {
    updateField(field.id, { ...field, [key]: value });
  };

  // Handle option updates for Select, Radio, Checkbox
  const handleOptionChange = (index, value) => {
    const newOptions = [...field.options];
    newOptions[index] = value;
    handleChange("options", newOptions);
  };

  // Add a new option
  const addOption = () => {
    handleChange("options", [...(field.options || []), ""]);
  };

  // Remove an option
  const removeOption = (index) => {
    const newOptions = [...field.options];
    newOptions.splice(index, 1);
    handleChange("options", newOptions);
  };

  return (
    <div style={{ marginTop: 10 }}>
      {/* Label Input */}
      <label>Label:</label>
      <Input
        value={field.label}
        onChange={(e) => handleChange("label", e.target.value)}
        placeholder="Enter field label"
      />
      {/* Key Input */}
      <label style={{ marginTop: 10, display: "block" }}>Key:</label>
      <Input
        value={field.key}
        onChange={(e) => handleChange("key", e.target.value)}
        placeholder="Enter unique key"
      />
      {/* Special Properties for Certain Fields */}
      {field.type === "select" && (
        <>
          <Divider />
          <label>Multiple:</label>
          <Switch
            checked={field.multiple || false}
            onChange={(checked) => handleChange("multiple", checked)}
          />
        </>
      )}
      {field.type === "file" && (
        <>
          <Divider />
          <label>Accept:</label>
          <Input
            value={field.accept || ""}
            onChange={(e) => handleChange("accept", e.target.value)}
            placeholder="e.g. image/*, .pdf"
          />
        </>
      )}
      {/* Options for Select, Radio, and Checkbox */}
      {(field.type === "select" ||
        field.type === "radio" ||
        field.type === "checkbox") && (
        <>
          <Divider />
          <label>Options:</label>
          {field.options?.map((option, index) => (
            <Space key={index} style={{ display: "flex", marginBottom: 8 }}>
              <Input
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeOption(index)}
              />
              {/* <Checkbox  */}
            </Space>
          ))}
          <Button type="dashed" icon={<PlusOutlined />} onClick={addOption}>
            Add Option
          </Button>
        </>
      )}
      
    </div>
  );
};

export default FieldProperties;
