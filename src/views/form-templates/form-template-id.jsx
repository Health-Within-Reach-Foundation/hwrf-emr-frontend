import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Button, Form, Input, Space, Typography, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import EditableField from "../../components/form-templates/editable-form-field";
import FieldAdder from "../../components/form-templates/field-adder";


const { Title } = Typography;

const FormTemplateById = () => {
  const { formId } = useParams(); // Extract formId from route params
  const location = useLocation(); // Access state passed from previous page
  const [formFields, setFormFields] = useState(location.state?.template?.formData || []);
  const [isEditing, setIsEditing] = useState(false);
  const [showFieldAdder, setShowFieldAdder] = useState(false);

  const handleSave = () => {
    // Handle saving logic here, e.g., make an API call
    message.success("Form template saved successfully!");
    setIsEditing(false);
  };

  const handleDeleteField = (id) => {
    setFormFields((prev) => prev.filter((field) => field.id !== id));
  };

  const handleAddField = (newField) => {
    setFormFields((prev) => [...prev, newField]);
    setShowFieldAdder(false);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = [...formFields];
    const [removed] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, removed);
    setFormFields(reorderedFields);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <Title level={2}>Edit Form Template</Title>
      <Title level={5} style={{ marginBottom: "2rem" }}>
        {location.state?.template?.name || "Untitled Form"}
      </Title>
      <Space style={{ marginBottom: "1rem" }}>
        <Button
          type="primary"
          onClick={() => setIsEditing(!isEditing)}
          icon={<PlusOutlined />}
        >
          {isEditing ? "Cancel Edit" : "Edit Form"}
        </Button>
        {isEditing && (
          <Button type="dashed" onClick={() => setShowFieldAdder(true)}>
            Add New Field
          </Button>
        )}
        <Button
          type="primary"
          onClick={handleSave}
          disabled={!isEditing}
          style={{ marginLeft: "auto" }}
        >
          Save Changes
        </Button>
      </Space>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="fields">
          {(provided) => (
            <Form
              layout="vertical"
              style={{
                border: "1px solid #eaeaea",
                padding: "1rem",
                borderRadius: "8px",
                background: "#fff",
              }}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {formFields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(dragProvided) => (
                    <EditableField
                      field={field}
                      isEditing={isEditing}
                      onDelete={handleDeleteField}
                      dragProvided={dragProvided}
                    />
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Form>
          )}
        </Droppable>
      </DragDropContext>

      <FieldAdder
        visible={showFieldAdder}
        onClose={() => setShowFieldAdder(false)}
        onAddField={handleAddField}
      />
    </div>
  );
};

export default FormTemplateById;
