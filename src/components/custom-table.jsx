import React, { useRef, useState } from "react";
import { Table as BootstrapTable, Button, Offcanvas } from "react-bootstrap";
import newUseDataTable from "./hooks/newUseDatatable";

const CustomTable = ({
  columns,
  data,
  url,
  enableSearch = true,
  enableFilters = true,
  filtersConfig = [],
  rowOnClick = null, // Optional row click handler
  onApplyFilters, // Function to call when Apply Filters is clicked
  onResetFilters, // Function to call when Reset Filters is clicked
}) => {
  const tableRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize DataTable
  newUseDataTable({
    tableRef,
    columns, // Ensure columns are passed correctly here
    data,
    url,
    globalSearchEnabled: enableSearch,
    filters: filtersConfig,
    rowOnClick, // Pass row click handler
    pageLength: 50, // Set default entries per page to 50
    lengthMenu: [50, 75, 100, 200], // Customize entries per page options
  });

  const tableRowStyle = rowOnClick ? { cursor: "pointer" } : {};

  return (
    <div>
      {enableFilters && (
        <div className="d-flex text-center my-3">
          <Button onClick={() => setShowFilters(true)} className="ms-auto">
            Filters
          </Button>
        </div>
      )}
      <BootstrapTable ref={tableRef} striped bordered hover style={tableRowStyle} />
      {enableFilters && (
        <Offcanvas
          show={showFilters}
          onHide={() => setShowFilters(false)}
          placement="end"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Filters</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {filtersConfig.map((filter) => (
              <div key={filter.key} className="mb-3">
                <filter.component {...filter.props} />
              </div>
            ))}
            <div className="d-flex justify-content-between">
              <Button variant="secondary" onClick={onResetFilters}>
                Reset
              </Button>
              <Button variant="primary" onClick={onApplyFilters}>
                Apply
              </Button>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      )}
    </div>
  );
};

export default CustomTable;
