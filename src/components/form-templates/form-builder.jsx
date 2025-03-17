import React from "react";
import { Button, Card, Select, Space, Divider, message } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import { useFormBuilder } from "../hooks/use-form-builder";
import FieldProperties from "./field-properties";
import axios from "axios"; // Import Axios for API requests
import FormPreview from "./form-preview";

// Available field types
const fieldOptions = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Email", value: "email" },
  { label: "Select", value: "select" },
  { label: "File Upload", value: "file" },
  { label: "Date", value: "date" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Paragraph", value: "textarea" },
  { label: "Switch", value: "switch" },
  { label: "Slider", value: "slider" },
  { label: "Rate", value: "rate" },
  { label: "Color Picker", value: "color" },
  { label: "Password", value: "password" },
  { label: "Phone", value: "phone" },
  { label: "URL", value: "url" },
  { label: "Time", value: "time" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "Cascader", value: "cascader" },
  { label: "Rate", value: "rate" },
  { label: "Transfer", value: "transfer" },
  { label: "Mentions", value: "mentions" },
  { label: "TreeSelect", value: "treeSelect" },
  { label: "Upload", value: "upload" },
  { label: "AutoComplete", value: "autoComplete" },
  { label: "Input Search", value: "inputSearch" },
  { label: "Input Group", value: "inputGroup" },
  { label: "Input Number", value: "inputNumber" },
  { label: "Input Password", value: "inputPassword" },
  { label: "Input Text", value: "inputText" },
  { label: "Input Text Area", value: "inputTextArea" },
  { label: "Input Search", value: "inputSearch" },
  { label: "Input Group", value: "inputGroup" },
  { label: "Input Number", value: "inputNumber" },
  { label: "Input Password", value: "inputPassword" },
  { label: "Input Text", value: "inputText" },
  { label: "Input Text Area", value: "inputTextArea" },
  { label: "Input Search", value: "inputSearch" },
  { label: "Input Group", value: "inputGroup" },
  { label: "Input Number", value: "inputNumber" },
  { label: "Input Password", value: "inputPassword" },
  { label: "Input Text", value: "inputText" },
];

const FormBuilder = () => {
  const { fields, addField, updateField, removeField, reorderFields } =
    useFormBuilder();

  // Handle Drag & Drop reordering
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedFields = [...fields];
    const [movedItem] = reorderedFields.splice(result.source.index, 1);
    reorderedFields.splice(result.destination.index, 0, movedItem);
    reorderFields(reorderedFields);
  };

  // Handle form submission (Save to backend)
  const handleSubmit = async () => {
    if (fields.length === 0) {
      message.warning("Please add at least one field before saving.");
      return;
    }

    try {
      //   const response = await axios.post("https://your-backend-url.com/api/forms", {
      //     formName: "Custom Form", // You can modify this or add an input for users to name their form
      //     fields: fields,
      //   });

      //   message.success("Form saved successfully!");
      console.log("Form created --> ", fields);
      //   console.log("Saved Form Response:", response.data);
    } catch (error) {
      message.error("Failed to save form. Please try again.");
      console.error("Save Form Error:", error);
    }
  };

  return (
    <Card title="Dynamic Form Builder">
      {/* Field Add Dropdown */}
      <div className="d-flex justify-content-end mb-3">
        <div className="d-flex flex-column gap-2">
          <label className="text-start"> Select the field to add </label>
          <Select
            placeholder="Select field type"
            style={{ width: 200 }}
            options={fieldOptions}
            onSelect={(value) => addField(value)}
            // onChange={addField}
          />
        </div>
      </div>
      {/* <Button type="primary" icon={<PlusOutlined />} onClick={() => addField("text")}>
          Add Field
        </Button> */}

      {/* Drag & Drop Field List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="formFields">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {fields.map((field, index) => (
                <Draggable key={field.id} draggableId={field.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style, // Keep React-Beautiful-DND styles
                        padding: 10,
                        marginBottom: 10,
                        background: snapshot.isDragging ? "#e6f7ff" : "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 4,
                        boxShadow: snapshot.isDragging
                          ? "0px 0px 10px rgba(0,0,0,0.1)"
                          : "none",
                      }}
                    >
                      <Card>
                        <Space
                          style={{
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <span>
                            {field.label} (Type: {field.type})
                          </span>
                          <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => removeField(field.id)}
                          />
                        </Space>
                        {/* Field Properties Editor */}
                        <FieldProperties
                          field={field}
                          updateField={updateField}
                        />
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Divider />

      {/* JSON Output Preview */}
      {/* <pre style={{ background: "#f5f5f5", padding: "10px" }}>
        {JSON.stringify(fields, null, 2)}
      </pre> */}

      <Divider />
      {/* Save Form Button */}
      <Button
        type="primary"
        icon={<SaveOutlined />}
        onClick={handleSubmit}
        className="mb-3"
      >
        Save Form
      </Button>

      <FormPreview
        formFields={fields}
        onSubmit={(formState) => {
          console.log(formState);
        }}
      />
    </Card>
  );
};

export default FormBuilder;
