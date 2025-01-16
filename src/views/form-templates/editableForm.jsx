import React, { useState } from "react";
import { Button, Dropdown, message, Card } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import FieldRenderer from "./FieldRenderer";
import "./editableForm.scss";
import DynamicForm from "./formRender";

const DynamicFields = () => {
  const [fields, setFields] = useState([]);

  const handleMenuClick = ({ key }) => {
    setFields((prevFields) => [
      ...prevFields,
      {
        id: `${Date.now()}`,
        type: key,
        title: "New Field",
        value: "",
        options:
          key === "radio" || key === "checkbox" || key === "select"
            ? ["Option 1"]
            : null,
      },
    ]);
  };

  const menuItems = [
    { label: "Input", key: "input" },
    { label: "Phone Number", key: "phone" },
    { label: "Mail ID", key: "mailId" },
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
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
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

  const handleDeleteField = (id) => {
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#f0f2f5",
        gap: 2,
      }}
    >
      <Card style={{ width: "100%", padding: "20px" }}>
        <div className="d-flex flex-row-reverse">
          <Dropdown menu={menu} trigger={["click"]} className="">
            <Button
              type="primary"
              className="add-field-button"
              style={{ marginBottom: "20px" }}
            >
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
                    <Draggable
                      key={field.id}
                      draggableId={field.id}
                      index={index}
                    >
                      {(provided) => (
                        // <div
                        //   ref={provided.innerRef}
                        //   {...provided.draggableProps}
                        //   {...provided.dragHandleProps}
                        //   style={{
                        //     marginBottom: "20px",
                        //     ...provided.draggableProps.style,
                        //   }}
                        // >
                        //   <FieldRenderer
                        //     field={field}
                        //     onFieldUpdate={handleFieldUpdate}
                        //   />
                        //   <i className="ri-drag-move-2-line"></i>
                        // </div>
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            marginBottom: "5px",
                            padding: "30px",
                            border: "1px solid",
                            borderRadius: "8px",
                            position: "relative", // Allow absolute positioning for drag handle
                            ...provided.draggableProps.style,
                          }}
                        >
                          <div
                            {...provided.dragHandleProps}
                            style={{
                              position: "absolute",
                              top: "0px", // Adjust spacing as needed
                              right: "0px", // Align to the top-right corner
                              cursor: "grab",
                              zIndex: 300,
                              width: "fit-content",
                            }}
                          >
                            <i
                              className="ri-drag-move-2-line"
                              style={{ fontSize: "20px", color: "#3978cd" }}
                            ></i>
                          </div>
                          <FieldRenderer
                            field={field}
                            onFieldUpdate={handleFieldUpdate}
                          />{" "}
                          {/* Delete Icon */}
                          <div
                            onClick={() => handleDeleteField(field.id)}
                            style={{
                              position: "absolute",
                              bottom: "0px",
                              right: "0px",
                              cursor: "pointer",
                              zIndex: 300,
                              fontSize: "20px",
                              color: "#ff4d4f",
                              width: "fit-content",
                            }}
                          >
                            <i className="ri-delete-bin-7-line"></i>{" "}
                          </div>
                          {/* Fixed drag handle */}
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
      <DynamicForm data={fields} />
    </div>
  );
};

export default DynamicFields;
