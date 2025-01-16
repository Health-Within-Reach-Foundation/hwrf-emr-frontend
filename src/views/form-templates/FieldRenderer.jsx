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
      <div className="field-title mb-2">
        <label htmlFor="field-title">Field Title</label>
        <Input
          value={field.title}
          onChange={handleTitleChange}
          id="field-title"
          placeholder="Field title"
          className="title-input"
        />
      </div>

      {
        <>
          <label htmlFor="field-value-title">Input</label>

          {(() => {
            switch (field.type) {
              case "input":
                return (
                  <Input
                    placeholder="Enter text"
                    id={field.id}
                    value={field.value}
                    onChange={handleValueChange}
                    className="value-input"
                  />
                );
              case "phone":
                return (
                  <Input
                    id={field.id}
                    type="tel"
                    placeholder="Enter phone number"
                    value={field.value}
                    onChange={handleValueChange}
                    className="value-input"
                  />
                );
              case "mailId":
                return (
                  <Input
                    id={field.id}
                    placeholder="Enter Mail ID"
                    value={field.value}
                    onChange={handleValueChange}
                    className="value-input"
                  />
                );
              case "textarea":
                return (
                  <TextArea
                    placeholder="Enter text"
                    id={field.id}
                    rows={4}
                    defaultValue={field.value}
                    onChange={handleValueChange}
                    className="value-input"
                  />
                );
              case "radio":
                return (
                  <>
                    <Radio.Group
                      id={field.id}
                      options={field.options.map((opt) => ({
                        label: opt,
                        value: opt,
                      }))}
                      value={field.value}
                      onChange={(e) =>
                        onFieldUpdate({ ...field, value: e.target.value })
                      }
                    />
                    <OptionsManager
                      options={field.options}
                      id={field.id}
                      onOptionsUpdate={handleOptionsUpdate}
                    />
                  </>
                );
              case "checkbox":
                return (
                  <>
                    <Checkbox.Group
                      options={field.options}
                      id={field.id}
                      value={field.value}
                      onChange={(checkedValues) =>
                        onFieldUpdate({ ...field, value: checkedValues })
                      }
                    />
                    <OptionsManager
                      options={field.options}
                      onOptionsUpdate={handleOptionsUpdate}
                      id={field.id}
                    />
                  </>
                );
              case "select":
                return (
                  <>
                    <Select
                      id={field.id}
                      options={field.options.map((opt) => ({
                        label: opt,
                        value: opt,
                      }))}
                      value={field.value}
                      onChange={(value) => onFieldUpdate({ ...field, value })}
                      style={{ width: "100%" }}
                    />
                    <OptionsManager
                      id={field.id}
                      options={field.options}
                      onOptionsUpdate={handleOptionsUpdate}
                    />
                  </>
                );
              default:
                return null;
            }
          })()}
        </>
      }
    </div>
  );
};

export default FieldRenderer;
