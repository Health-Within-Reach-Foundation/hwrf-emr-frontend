import { Select } from "antd";
import React, { useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";

const BasicPatientProfile = ({
  patientData,
  handleSavePatientData,
  setPatientData,
}) => {
  const [editingPatient, setEditingPatient] = useState(false);
  const handleInputChange = (key, value) => {
    setPatientData((prev) => ({ ...prev, [key]: value }));
  };
  return (
    <Card>
      <Card.Header>
        <h4>Patient Profile</h4>
        {/* <p className="fw-bold text-decoration-underline">Registration No. : {"HWRF-".concat(patientData.regNo)}</p> */}
        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={() => setEditingPatient(!editingPatient)}
          >
            {editingPatient ? "Cancel Edit" : "Edit Profile"}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Form>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  disabled={!editingPatient}
                  value={patientData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Mobile</Form.Label>
                <Form.Control
                  disabled={!editingPatient}
                  value={patientData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  disabled={!editingPatient}
                  value={patientData.age || ""}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Sex</Form.Label>
                <Select
                  style={{ width: "100%" }}
                  disabled={!editingPatient}
                  value={patientData.sex || ""}
                  onChange={(value) => handleInputChange("sex", value)}
                  options={[
                    { label: "Male", value: "male" },
                    { label: "Female", value: "female" },
                    { label: "Other", value: "other" },
                  ]}
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  as="input"
                  rows={"1"}
                  disabled={!editingPatient}
                  value={patientData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          {editingPatient && (
            <Button
              className="mt-3"
              onClick={() => {
                // console.log("Updated Patient Data: ", patientData);
                setEditingPatient(false);
                handleSavePatientData();
              }}
            >
              Save Details
            </Button>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default BasicPatientProfile;
