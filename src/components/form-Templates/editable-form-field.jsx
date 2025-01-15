import React from "react";
import { Form, Input, Button, Select, Space } from "antd";
import { DeleteOutlined, DragOutlined } from "@ant-design/icons";

const { Option } = Select;

const EditableField = ({ field, isEditing, onDelete, dragProvided }) => (
  <div
    {...dragProvided.draggableProps}
    {...dragProvided.dragHandleProps}
    ref={dragProvided.innerRef}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: "1rem",
      ...dragProvided.draggableProps.style,
    }}
  >
    <Form.Item label={field.title} style={{ flexGrow: 1 }}>
      {field.type === "text" && <Input placeholder={field.title} />}
      {field.type === "textarea" && <Input.TextArea placeholder={field.title} />}
      {field.type === "select" && (
        <Select mode={field.multiple ? "multiple" : null} placeholder={field.title}>
          {field.options?.map((option) => (
            <Option key={option} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      )}
    </Form.Item>
    {isEditing && (
      <Space>
        <Button
          type="link"
          icon={<DeleteOutlined />}
          onClick={() => onDelete(field.id)}
          danger
        />
        <DragOutlined />
      </Space>
    )}
  </div>
);

export default EditableField;
