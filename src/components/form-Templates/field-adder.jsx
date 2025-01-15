import React, { useState } from "react";
import { Modal, Form, Input, Select, Button } from "antd";
import { v4 as uuidv4 } from "uuid";

const { Option } = Select;

const FieldAdder = ({ visible, onClose, onAddField }) => {
  const [form] = Form.useForm();

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newField = { id: uuidv4(), ...values };
      onAddField(newField);
      form.resetFields();
    });
  };

  return (
    <Modal
      title="Add New Field"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="add" type="primary" onClick={handleAdd}>
          Add Field
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Field Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="type" label="Field Type" rules={[{ required: true }]}>
          <Select placeholder="Select a type">
            <Option value="text">Text</Option>
            <Option value="textarea">Textarea</Option>
            <Option value="select">Select</Option>
            <Option value="checkbox">Checkbox</Option>
            <Option value="radio">Radio</Option>
            <Option value="file">File Input</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="options"
          label="Options (comma-separated, for select/radio/checkbox)"
        >
          <Input placeholder="Option 1, Option 2, Option 3" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldAdder;
