import React, { useState } from "react";
import { Table, Input, Select, Tooltip } from "antd";

const { Search } = Input;
const { Option } = Select;

const AntdTable = ({
  columns,
  data,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  rowClassName,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // 🔍 Search Functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
  };

  // 📌 Modified Columns for Sorting, Width Control & Overflow Handling
  const modifiedColumns = columns.map((col) => ({
    ...col,
    sorter: col.sortable
      ? (a, b) => (a[col.dataIndex] > b[col.dataIndex] ? 1 : -1)
      : false,
    title: col.sortable ? (
      <span>
        {col.title} <span style={{ fontSize: "12px", opacity: 0.6 }}></span>
      </span>
    ) : (
      col.title
    ),
    width: col.width || "fit-content", // Allow developer-defined width, default to fit-content
    ellipsis: col.ellipsis !== false, // Enable text truncation if not explicitly disabled
    render: (text, record) => {
      const cellValue = col.render ? col.render(text, record) : text;

      // 🛠️ Handle JSX & Normal Text Separately
      if (React.isValidElement(cellValue)) {
        return cellValue; // If JSX, render as it is
      } else {
        return col.ellipsis !== false ? (
          //   <Tooltip title={text}>
          <span
            className="text-truncate d-inline-block"
            style={{ maxWidth: col.width || 150 }}
          >
            {text}
          </span>
        ) : (
          //   </Tooltip>
          text
        );
      }
    },
    fixed: col.fixed ,
  }));

  return (
    <div style={{ overflowX: "auto", padding: "10px" }}>
      {/* 🔍 Search & Pagination Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Search
          placeholder="Search..."
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 200 }}
        />
        <Select value={pageSize} onChange={setPageSize} style={{ width: 120 }}>
          {pageSizeOptions.map((size) => (
            <Option key={size} value={size}>
              {size} per page
            </Option>
          ))}
        </Select>
      </div>

      {/* 🏆 Responsive Table */}
      <Table
        columns={modifiedColumns}
        dataSource={filteredData}
        pagination={{ pageSize }}
        scroll={{ x: 1200, y: 400 }} // Floating header enabled
        rowClassName={rowClassName || (() => "")}
        rowHoverable={false}
        bordered
      />
    </div>
  );
};

export default AntdTable;
