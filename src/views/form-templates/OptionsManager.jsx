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
      <Button type="primary" onClick={handleAddOption} style={{ marginTop: "5px" }}>
        Add Option
      </Button>
      <List
        dataSource={options}
        renderItem={(item, index) => (
          <List.Item
            actions={[
              <Button type="text" danger onClick={() => handleDeleteOption(index)}>
                Delete
              </Button>,
            ]}
          >
            {item}
          </List.Item>
        )}
        style={{ marginTop: "10px" }}
      />
    </div>
  );
};

export default OptionsManager;
