import React from "react";
import { Input, Radio, Checkbox, Select } from "antd";
import OptionsManager from "./OptionsManager";
import "./FieldRenderer.module.scss";

const { TextArea } = Input;

const FieldRenderer = ({ field, onFieldUpdate }) => {
  const handleTitleChange = (e) => {
    onFieldUpdate({ ...field, title: e.target.value });
  };

  const handleValueChange = (e) => {
    onFieldUpdate({ ...field, value: e.target.value });
  };

  const handleOptionsUpdate = (newOptions) => {
    onFieldUpdate({ ...field, options: newOptions });
  };

  return (
    <div className="field-container">
      <div className="field-title">
        <Input
          value={field.title}
          onChange={handleTitleChange}
          bordered={false}
          placeholder="Field title"
          className="title-input"
        />
      </div>

      {(() => {
        switch (field.type) {
          case "input":
            return (
              <Input
                placeholder="Enter text"
                value={field.value}
                onChange={handleValueChange}
                className="value-input"
              />
            );
          case "phone":
            return (
              <Input
                type="tel"
                placeholder="Enter phone number"
                value={field.value}
                onChange={handleValueChange}
                className="value-input"
              />
            );
          case "maidId":
            return (
              <Input
                placeholder="Enter Maid ID"
                value={field.value}
                onChange={handleValueChange}
                className="value-input"
              />
            );
          case "textarea":
            return (
              <TextArea
                placeholder="Enter text"
                rows={4}
                value={field.value}
                onChange={handleValueChange}
                className="value-input"
              />
            );
          case "radio":
            return (
              <>
                <Radio.Group
                  options={field.options.map((opt) => ({ label: opt, value: opt }))}
                  value={field.value}
                  onChange={(e) => onFieldUpdate({ ...field, value: e.target.value })}
                />
                <OptionsManager options={field.options} onOptionsUpdate={handleOptionsUpdate} />
              </>
            );
          case "checkbox":
            return (
              <>
                <Checkbox.Group
                  options={field.options}
                  value={field.value}
                  onChange={(checkedValues) =>
                    onFieldUpdate({ ...field, value: checkedValues })
                  }
                />
                <OptionsManager options={field.options} onOptionsUpdate={handleOptionsUpdate} />
              </>
            );
          case "select":
            return (
              <>
                <Select
                  options={field.options.map((opt) => ({ label: opt, value: opt }))}
                  value={field.value}
                  onChange={(value) => onFieldUpdate({ ...field, value })}
                  style={{ width: "100%" }}
                />
                <OptionsManager options={field.options} onOptionsUpdate={handleOptionsUpdate} />
              </>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export default FieldRenderer;
