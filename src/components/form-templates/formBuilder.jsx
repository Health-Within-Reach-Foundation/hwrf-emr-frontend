// FormBuilder.js
import React, { useState } from "react";

const FormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("My Form");

  const addField = (type) => {
    const newField = {
      id: Date.now(),
      type,
      label: `${type} Label`,
      value: "",
      options: type === "radio" || type === "checkbox" ? ["Option 1", "Option 2"] : null,
    };
    setFields([...fields, newField]);
  };

  const updateField = (id, updatedField) => {
    setFields(fields.map((field) => (field.id === id ? updatedField : field)));
  };

  const deleteField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  return (
    <div>
      <h2>{formName}</h2>
      <input
        type="text"
        placeholder="Form Name"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
      />
      <div>
        <button onClick={() => addField("text")}>Add Text Field</button>
        <button onClick={() => addField("number")}>Add Number Field</button>
        <button onClick={() => addField("radio")}>Add Radio Button</button>
        <button onClick={() => addField("checkbox")}>Add Checkbox</button>
      </div>
      <div>
        {fields.map((field) => (
          <FieldEditor
            key={field.id}
            field={field}
            updateField={updateField}
            deleteField={deleteField}
          />
        ))}
      </div>
      {/* <PreviewForm fields={fields} /> */}
    </div>
  );
};

export default FormBuilder;
