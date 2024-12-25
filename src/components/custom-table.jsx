import React, { useRef } from "react";
import {
  Table as BootstrapTable,
  Button,
  Offcanvas,
  Form,
} from "react-bootstrap";
import newUseDataTable from "./hooks/newUseDatatable";

const CustomTable = ({
  columns,
  data,
  url,
  enableSearch = true,
  enableFilters = true,
  filtersConfig = [],
}) => {
  const tableRef = useRef(null);
  const [showFilters, setShowFilters] = React.useState(false);

  newUseDataTable({
    tableRef,
    columns,
    data,
    url,
    globalSearchEnabled: enableSearch,
    filters: filtersConfig,
  });

  return (
    <div>
      {/* <div className="d-flex mb-3"> */}
        {/* {enableSearch && <input type="text" id="globalSearch" className="form-control" placeholder="Search..." />} */}
        {enableFilters && (
          <div className="d-flex text-center my-3 ">
            <Button onClick={() => setShowFilters(true)} className="ms-auto">
              Filters
            </Button>
          </div>
        )}
      {/* </div> */}
      <BootstrapTable ref={tableRef} striped bordered hover />
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
            <Form.Group className="mb-3" key={filter.key}>
              <Form.Label>{filter.label}</Form.Label>
              <Form.Control
                id={`filter-${filter.key}`}
                type="text"
                placeholder={`Filter by ${filter.label}`}
              />
            </Form.Group>
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CustomTable;
