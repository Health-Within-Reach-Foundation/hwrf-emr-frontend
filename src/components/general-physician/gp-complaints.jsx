// import React, { useState } from "react";
// import { Form, Input, Tag } from "antd";

// const complaintsOptions = [
//   "Fever",
//   "Cough",
//   "Cold",
//   "Loose motion",
//   "Constipation",
//   "Vomiting",
//   "Abdominal pain",
//   "Knee/Joint pain",
//   "Headache",
//   "Other complaints",
// ];

// const ComplaintsInput = ({ value = [], onChange, options = {} }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [suggestions, setSuggestions] = useState([]);

//   // Handle typing in the complaints field
//   const handleInputChange = (e) => {
//     const text = e.target.value;
//     setInputValue(text);

//     if (text) {
//       setSuggestions(
//         complaintsOptions.filter(
//           (option) =>
//             option.toLowerCase().includes(text.toLowerCase()) &&
//             !value.includes(option) // Filter out already selected ones
//         )
//       );
//     } else {
//       setSuggestions([]);
//     }
//   };

//   // Add complaint when clicked
//   const handleSelectComplaint = (complaint) => {
//     if (!value.includes(complaint)) {
//       const updatedComplaints = [...value, complaint];
//       onChange(updatedComplaints);
//     }
//     setInputValue("");
//     setSuggestions([]);
//   };

//   // Remove complaint when clicking the close button
//   const handleRemoveComplaint = (complaint) => {
//     onChange(value.filter((c) => c !== complaint));
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       {/* Render Selected Complaints as Tags */}
//       <div style={{ marginBottom: "8px" }}>
//         {value.map((complaint) => (
//           <Tag
//             key={complaint}
//             closable
//             onClose={() => handleRemoveComplaint(complaint)}
//             style={{ marginBottom: "4px" }}
//           >
//             {complaint}
//           </Tag>
//         ))}
//       </div>

//       {/* Input Field for Typing Complaints */}
//       <Input
//         placeholder="Start typing complaint..."
//         value={inputValue}
//         onChange={handleInputChange}
//       />

//       {/* Dropdown for Suggested Complaints */}
//       {suggestions.length > 0 && (
//         <div
//           style={{
//             position: "absolute",
//             width: "100%",
//             background: "white",
//             boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
//             zIndex: 1000,
//             borderRadius: "4px",
//             marginTop: "4px",
//           }}
//         >
//           {suggestions.map((suggestion) => (
//             <div
//               key={suggestion}
//               style={{
//                 padding: "8px",
//                 cursor: "pointer",
//                 borderBottom: "1px solid #f0f0f0",
//               }}
//               onClick={() => handleSelectComplaint(suggestion)}
//             >
//               {suggestion}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ComplaintsInput;

import React, { useRef, useState } from "react";
import { PlusOutlined, SaveOutlined } from "@ant-design/icons";
import { Select, Divider, Input, Space, Button } from "antd";
import formFieldsServices from "../../api/form-fields.services";
import toast from "react-hot-toast";

const ComplaintsInput = ({ value = [], onChange, formField = {}, disabled = false }) => {
  const [items, setItems] = useState(formField?.options || []); // Existing options
  const [newComplaints, setNewComplaints] = useState([]); // Store new complaints locally
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Handle input change
  const onNameChange = (event) => {
    setName(event.target.value);
  };

  // Add complaint to local state without API call
  const addComplaintLocally = () => {
    if (!name.trim()) return;

    const newComplaint = { label: name, value: name, lock: false };

    // Update local state to reflect the new complaint immediately
    setItems((prev) => [...prev, newComplaint]);
    setNewComplaints((prev) => [...prev, newComplaint]);
    setName("");

    // Automatically select the new complaint
    onChange([...value, name]);

    // Focus input again
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  // Batch API call to save new complaints
  const saveComplaints = async () => {
    if (newComplaints.length === 0) {
      toast.error("No new complaints to save.");
      return;
    }

    setLoading(true);
    try {
      const updateBody = {
        formId: formField.id,
        fieldName: formField.fieldName,
        options: [...items], // Save all updated options
      };
      const response = await formFieldsServices.updateFormFieldsOptions(
        updateBody
      );

      if (response.success) {
        toast.success("New Complaints saved!");
        setNewComplaints([]);
      }
    } catch (error) {
      toast.error("Failed to save complaints!");
    }
    setLoading(false);
  };

  return (
    <Select
      mode="multiple"
      style={{ width: "100%" }}
      placeholder="Select or add complaints"
      value={value}
      onChange={onChange}
      disabled={disabled}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{ margin: "8px 0" }} />
          <Space style={{ padding: "0 8px 4px", display: "flex" }}>
            <Input
              placeholder="Add new complaint"
              ref={inputRef}
              value={name}
              className="border-primary"
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button
              type="primary"
              onClick={addComplaintLocally}
              className="bg-primary btn-primary"
            >
              <PlusOutlined />
            </Button>
          </Space>
          {newComplaints.length > 0 && (
            <div style={{ padding: "8px 8px 4px", textAlign: "right" }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                onClick={saveComplaints}
                className="btn-primary bg-primary"
              >
                Save Changes
              </Button>
            </div>
          )}
        </>
      )}
      options={items}
    />
  );
};

export default ComplaintsInput;
