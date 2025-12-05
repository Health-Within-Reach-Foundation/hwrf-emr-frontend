import React, { useState, useEffect } from "react";
import { Table, Input, Select, Tooltip } from "antd";

const { Search } = Input;
const { Option } = Select;

const AntdTable = ({
  columns,
  data,
  pageSizeOptions = [5, 10, 20],
  defaultPageSize = 10,
  rowClassName,
  summary,
}) => {
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPage, setCurrentPage] = useState(1);

  // 🔍 Search Functionality
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // If data changes, update filteredData
  useEffect(() => {
    setFilteredData(data);
    setCurrentPage(1); // Reset to first page if data changes externally
  }, [data]);

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
    width: col.width || "fit-content",
    ellipsis: col.ellipsis !== false,
    render: (text, record) => {
      const cellValue = col.render ? col.render(text, record) : text;
      if (React.isValidElement(cellValue)) {
        return cellValue;
      } else {
        return col.ellipsis !== false ? (
          <span
            className="text-truncate d-inline-block"
            style={{ maxWidth: col.width || 150 }}
          >
            {text}
          </span>
        ) : (
          text
        );
      }
    },
    fixed: col.fixed,
  }));

  // Calculate if current page is the last page
  const totalItems = filteredData.length;
  const lastPage = Math.ceil(totalItems / pageSize);
  const isLastPage = currentPage === lastPage;

  // Table pagination configuration
  const paginationConfig = {
    pageSize,
    current: currentPage,
    showSizeChanger: true,
    pageSizeOptions: pageSizeOptions.map(String),
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  };

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
        {/* <Select value={pageSize} onChange={setPageSize} style={{ width: 120 }}>
          {pageSizeOptions.map((size) => (
            <Option key={size} value={size}>
              {size} per page
            </Option>
          ))}
        </Select> */}
      </div>

      {/* 🏆 Responsive Table */}
      <Table
        columns={modifiedColumns}
        dataSource={filteredData}
        pagination={paginationConfig}
        scroll={{ x: 1200, y: 400 }}
        rowClassName={rowClassName || (() => "")}
        rowHoverable={false}
        bordered
        summary={isLastPage && summary ? summary : undefined}
      />
    </div>
  );
};

export default AntdTable;