import React, { useState } from "react";
import { Button, Input, List } from "antd";

const OptionsManager = ({ options, onOptionsUpdate }) => {
  const [newOption, setNewOption] = useState("");

  const handleAddOption = () => {
    if (newOption.trim()) {
      onOptionsUpdate([...options, newOption.trim()]);
      setNewOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = options.filter((_, i) => i !== index);
    onOptionsUpdate(updatedOptions);
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <Input
        value={newOption}
        onChange={(e) => setNewOption(e.target.value)}
        placeholder="Enter new option"
        onPressEnter={handleAddOption}
      />
      <Button
        type="primary"
        onClick={handleAddOption}
        style={{ marginTop: "5px" }}
      >
        Add Option
      </Button>
      {/* Display options using div and map */}
      <div style={{ marginTop: "10px" }}>
        {options.map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "5px",
              padding: "5px",
              border: "1px solid #d9d9d9",
              borderRadius: "4px",
            }}
          >
            <span>{item}</span>
            <Button
              type="text"
              danger
              onClick={() => handleDeleteOption(index)}
              style={{ padding: "5px", fontSize: "16px" }}
            >
              <i className="ri-delete-bin-line"></i>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsManager;
