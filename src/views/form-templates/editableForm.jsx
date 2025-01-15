import React, { useState } from "react";
import { Button, Dropdown, message, Card } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FieldRenderer from "./FieldRenderer";
import "./editableForm.scss";


const DynamicFields = () => {
  const [fields, setFields] = useState([
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
  ]);

  const handleMenuClick = ({ key }) => {
    setFields((prevFields) => [
      ...prevFields,
      {
        id: `${Date.now()}`,
        type: key,
        title: "New Field",
        value: "",
        options: key === "radio" || key === "checkbox" || key === "select" ? ["Option 1"] : null,
      },
    ]);
  };

  const menuItems = [
    { label: "Input", key: "input" },
    { label: "Phone Number", key: "phone" },
    { label: "Maid ID", key: "maidId" },
    { label: "Radio Button", key: "radio" },
    { label: "Checkbox", key: "checkbox" },
    { label: "Select Field", key: "select" },
    { label: "Textarea", key: "textarea" },
  ];

  const menu = {
    items: menuItems,
    onClick: handleMenuClick,
  };

  const handleFieldUpdate = (updatedField) => {
    setFields((prevFields) =>
      prevFields.map((field) => (field.id === updatedField.id ? updatedField : field))
    );
  };

  const handleSave = () => {
    const jsonData = fields.map(({ id, type, title, value, options }) => ({
      id,
      type,
      title,
      value,
      options,
    }));
    console.log("Saved JSON:", JSON.stringify(jsonData, null, 2));
    message.success("Data saved successfully!");
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedFields = Array.from(fields);
    const [movedField] = reorderedFields.splice(source.index, 1);
    reorderedFields.splice(destination.index, 0, movedField);

    setFields(reorderedFields);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // height: "100vh",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: "60%", padding: "20px" }}>
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
                          {...provided.dragHandleProps}
                          style={{
                            marginBottom: "20px",
                            ...provided.draggableProps.style,
                          }}
                        >
                          <FieldRenderer field={field} onFieldUpdate={handleFieldUpdate} />
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
        <Dropdown menu={menu} trigger={["click"]}>
            <Button type="primary" className="add-field-button" style={{ marginBottom: "20px" }}>
              Add Field
            </Button>
          </Dropdown>
      </Card>
    </div>
  );
};

export default DynamicFields;
