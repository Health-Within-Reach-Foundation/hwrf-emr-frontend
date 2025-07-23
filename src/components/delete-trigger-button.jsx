import React from "react";
import { Popconfirm, Button } from "antd";
import { DeleteOutlined, UndoOutlined } from "@ant-design/icons";

export default function DeletePopover({
  title,
  description,
  onDelete,
  children,
  isDeleteAction = true,
  disabled = false,
  size = "middle",
}) {
  return (
    <Popconfirm
      placement="bottom"
      title={
        <div style={{ display: "flex", alignItems: "center" }}>
          {isDeleteAction ? (
            <DeleteOutlined
              style={{ fontSize: "1.25rem", marginRight: "0.5rem" }}
            />
          ) : (
            <UndoOutlined
              style={{ fontSize: "1.25rem", marginRight: "0.5rem" }}
            />
          )}
          <span>{title}</span>
        </div>
      }
      description={description}
      onConfirm={onDelete}
      okText="Yes"
      cancelText="No"
      disabled={disabled}
    >
      <Button
        bordered
        size={size}
        disabled={disabled}
        title={disabled ? "Can't Delete" : undefined}
        type="default"
        variant="outlined"
        danger
        style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        icon={isDeleteAction ? <DeleteOutlined /> : <UndoOutlined />}
      >
        {children}
      </Button>
    </Popconfirm>
  );
}
