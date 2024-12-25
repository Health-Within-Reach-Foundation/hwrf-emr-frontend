import React, { Fragment } from "react";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import { Link } from "react-router-dom";

// Images

import CustomTable from "../../components/custom-table";

const PatientList = () => {
  const columns = [
    { title: "ID", data: "id" },
    { title: "Name", data: "name" },
    { title: "Gender", data: "gender" },
    { title: "Register Date", data: "registerDate" },
  ];

  const data = [
    { id: 1, name: "John Doe", gender: "Male", registerDate: "2023-12-01" },
    { id: 2, name: "Jane Doe", gender: "Female", registerDate: "2023-11-15" },
  ];

  const filters = [
    { key: "registerDate", label: "Register Date" },
    { key: "gender", label: "Gender" },
  ];

  return (
    <>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
              <Card.Header.Title>
                <h4 className="card-title">Patients List</h4>
              </Card.Header.Title>
            </Card.Header>
          </Card>
        </Col>

        <div>
          <CustomTable
            columns={columns}
            data={data}
            enableSearch
            enableFilters
            filtersConfig={filters}
          />
        </div>
      </Row>
    </>
  );
};

export default PatientList;
