import { Table } from 'antd';
import React, { useEffect, useState } from 'react';

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
}) => {
  const [filteredData, setFilteredData] = useState(data);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [currentPageLocal, setCurrentPageLocal] = useState(currentPage);

  // Update data
  useEffect(() => {
    setFilteredData(data);
    setCurrentPageLocal(currentPage);
  }, [data, currentPage]);

  // 📌 Modified Columns
  const modifiedColumns = columns.map((col) => ({
    ...col,
    sorter: !isServerSide && col.sortable ? (a, b) => (a[col.dataIndex] > b[col.dataIndex] ? 1 : -1) : false,
    title: col.sortable ? (
      <span>
        {col.title} <span style={{ fontSize: '12px', opacity: 0.6 }}></span>
      </span>
    ) : (
      col.title
    ),
    width: col.width || 'fit-content',
    ellipsis: col.ellipsis !== false,
    render: (text, record) => {
      const cellValue = col.render ? col.render(text, record) : text;

      if (React.isValidElement(cellValue)) {
        return cellValue;
      } else {
        return col.ellipsis !== false ? (
          <span className="text-truncate d-inline-block" style={{ maxWidth: col.width || 150 }}>
            {text}
          </span>
        ) : (
          text
        );
      }
    },
    fixed: col.fixed,
  }));

  const displayData = isServerSide ? data : filteredData;
  const totalItems = isServerSide ? totalRecords : displayData.length;

  const pageSizeValue = pageSize;
  const currentPageValue = currentPageLocal;

  const lastPage = Math.ceil(totalItems / pageSizeValue);
  const isLastPage = currentPageValue === lastPage || (isServerSide && !data.length);

  // Pagination
  const paginationConfig = isServerSide
    ? {
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
      }
    : {
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
    <div style={{ overflowX: 'auto', padding: '10px' }}>
      <Table
        columns={modifiedColumns}
        dataSource={displayData}
        pagination={paginationConfig}
        scroll={{ x: 1200, y: 400 }}
        rowClassName={rowClassName || (() => '')}
        rowHoverable={false}
        bordered
        summary={isLastPage && summary ? summary : undefined}
        loading={loading}
      />
    </div>
  );
};

export default AntdTable;
