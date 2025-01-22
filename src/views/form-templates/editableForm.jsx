import React, { useState } from "react";
import { Button, Dropdown, message, Card } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FieldRenderer from "./FieldRenderer"; // Field editing component
import DynamicForm from "./formRender"; // Form rendering component
import "./editableForm.scss"; // Custom styles

const DynamicFields = () => {
  const [fields, setFields] = useState([]);

  // Add a new field
  const handleMenuClick = ({ key }) => {
    setFields((prevFields) => [
      ...prevFields,
      {
        id: `${Date.now()}`,
        type: key,
        title: `New ${key.charAt(0).toUpperCase() + key.slice(1)}`, // Default title
        value: "",
        options:
          ["radio", "checkbox", "select"].includes(key) // Add options for specific field types
            ? ["Option 1"]
            : null,
      },
    ]);
  };

  // Menu items for adding fields
  const menuItems = [
    { label: "Input", key: "input" },
    { label: "Phone Number", key: "phone" },
    { label: "Mail ID", key: "mailId" },
    { label: "Password", key: "password" },
    { label: "Number", key: "number" },
    { label: "Date", key: "date" },
    { label: "Radio Button", key: "radio" },
    { label: "Checkbox", key: "checkbox" },
    { label: "Select Field", key: "select" },
    { label: "Textarea", key: "textarea" },
    { label: "File Upload", key: "file" },
  ];

  const menu = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  // Update a field's configuration
  const handleFieldUpdate = (updatedField) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
  };

  // Save JSON data
  const handleSave = () => {
    console.log("Saved JSON:", JSON.stringify(fields, null, 2));
    message.success("Form saved successfully!");
  };

  // Handle drag and drop
  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(source.index, 1);
    reorderedFields.splice(destination.index, 0, movedField);

    setFields(reorderedFields);
  };

  // Delete a field
  const handleDeleteField = (id) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  return (
    <div style={{ display: "flex", background: "#f0f2f5", gap: 2 }}>
      <Card style={{ width: "100%", padding: "20px" }}>
        <div className="d-flex flex-row-reverse">
          <Dropdown menu={menu} trigger={["click"]}>
            <Button type="primary" style={{ marginBottom: "20px" }}>
              Add Field
            </Button>
          </Dropdown>
        </div>

        <div className="dynamic-fields-container">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            marginBottom: "5px",
                            padding: "20px",
                            border: "1px solid #d9d9d9",
                            borderRadius: "8px",
                            position: "relative",
                            ...provided.draggableProps.style,
                          }}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              position: "absolute",
                              top: "10px",
                              right: "10px",
                              cursor: "grab",
                            }}
                          >
                            <i className="ri-drag-move-2-line" style={{ fontSize: "20px", color: "#3978cd" }} />
                          </div>

                          {/* Render Field */}
                          <FieldRenderer field={field} onFieldUpdate={handleFieldUpdate} />

                          {/* Delete Button */}
                          <div
                            onClick={() => handleDeleteField(field.id)}
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              cursor: "pointer",
                              color: "#ff4d4f",
                            }}
                          >
                            <i className="ri-delete-bin-7-line" style={{ fontSize: "20px" }} />
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {fields.length > 0 && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <Button type="primary" onClick={handleSave}>
                Save Data
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Preview the generated form */}
      <DynamicForm
        data={fields}
        onSubmit={(formState) => console.log("Form Submitted Data --> :", formState)}
      />
    </div>
  );
};

export default DynamicFields;
