import { Input, Select, Table } from "antd";
import React, { useEffect, useState } from "react";

const { Search } = Input;
const { Option } = Select;

const AntdTable = ({
  columns,
  data,
  pageSizeOptions = [50, 100, 150, 200],
  defaultPageSize = 50,
  rowClassName,
  summary,
  totalRecords = 0,
  currentPage = 1,
  onPaginationChange = () => {},
  isServerSide = false,
  loading = false,
  searchValue = "",
  onSearch = () => {},
}) => {
  const [searchText, setSearchText] = useState(searchValue);
  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPageLocal, setCurrentPageLocal] = useState(currentPage);

  // 🔍 Search Functionality (Client-side only, ignored if server-side)
  const handleSearch = (value) => {
    if (isServerSide) return; // Disable client-side search for server-side pagination
    
    setSearchText(value);
    const filtered = data.filter((item) =>
      Object.values(item).some((field) =>
        String(field).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filtered);
    setCurrentPageLocal(1);
  };

  // If data changes, update filteredData
  useEffect(() => {
    setFilteredData(data);
    setCurrentPageLocal(currentPage);
  }, [data, currentPage]);

  // 📌 Modified Columns for Sorting, Width Control & Overflow Handling
  const modifiedColumns = columns.map((col) => ({
    ...col,
    sorter: !isServerSide && col.sortable
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

  // Calculate pagination metadata
  const displayData = isServerSide ? data : filteredData;
  const totalItems = isServerSide ? totalRecords : displayData.length;
  const pageSizeValue = pageSize;
  const currentPageValue = isServerSide ? currentPageLocal : Math.ceil((currentPageLocal - 1) * pageSize / (filteredData.length || 1)) + 1;
  const lastPage = Math.ceil(totalItems / pageSizeValue);
  const isLastPage = currentPageValue === lastPage || (isServerSide && !data.length);

  // Server-side pagination configuration
  const paginationConfig = isServerSide ? {
    pageSize: pageSizeValue,
    current: currentPageValue,
    total: totalItems,
    showSizeChanger: true,
    pageSizeOptions: pageSizeOptions.map(String),
    onChange: (page, size) => {
      setCurrentPageLocal(page);
      setPageSize(size);
      const offset = (page - 1) * size;
      onPaginationChange(offset, size);
    },
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    disabled: loading,
  } : {
    pageSize: pageSizeValue,
    current: currentPageValue,
    showSizeChanger: true,
    pageSizeOptions: pageSizeOptions.map(String),
    onChange: (page, size) => {
      setCurrentPageLocal(page);
      setPageSize(size);
    },
  };

  return (
    <div style={{ overflowX: "auto", padding: "10px" }}>
      {/* 🔍 Search & Pagination Controls */}
      {!isServerSide && (
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
        </div>
      )}
      {/* 🔍 Search for Server-Side Pagination */}
      {isServerSide && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Search
            placeholder="Search by name..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: 300 }}
            allowClear
            loading={loading}
          />
        </div>
      )}

      {/* 🏆 Responsive Table */}
      <Table
        columns={modifiedColumns}
        dataSource={displayData}
        pagination={paginationConfig}
        scroll={{ x: 1200, y: 400 }}
        rowClassName={rowClassName || (() => "")}
        rowHoverable={false}
        bordered
        summary={isLastPage && summary ? summary : undefined}
        loading={loading}
      />
    </div>
  );
};

export default AntdTable;