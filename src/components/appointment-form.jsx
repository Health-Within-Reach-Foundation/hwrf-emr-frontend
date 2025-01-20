import React, { useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Select, Checkbox } from "antd"; // For searchable dropdowns and checkboxes
import { Link } from "react-router-dom"; // For navigation
import toast from "react-hot-toast";
import appointmentServices from "../api/appointment-services";

const AppointmentForm = ({
  show,
  modalClose,
  patients,
  departments,
  onSave,
}) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Patient select handler
  const handlePatientChange = (value) => {
    // Find the selected patient object based on the value
    const selectedOption = patients.find((patient) => patient.id === value);
    console.log("Selected Patient:", selectedOption);
    setSelectedPatient(selectedOption); // Set the selected patient
  };

  const handleDepartmentChange = (checkedValues) => {
    setSelectedDepartments(checkedValues);
  };

  const handleSave = async () => {
    if (!selectedPatient || !selectedDepartments.length) {
      toast.error("Please fill in all fields!");
      return;
    }

    // Set today's date as appointment date
    const appointmentDate = new Date().toLocaleDateString("en-CA");

    // const dateString = appointmentDate.toLocaleDateString("en-CA"); // Outputs 'YYYY-MM-DD'

    const appointmentData = {
      patientId: selectedPatient.id, // Ensure correct patient ID
      specialties: selectedDepartments,
      appointmentDate,
      // appointmentDate: appointmentDate.toISOString().split("T")[0], // Sends only "YYYY-MM-DD"
      status: "in queue",
    };

    try {
      setIsLoading(true); // Start loading state
      console.log("Appointment Data:", appointmentData);
      const response = await appointmentServices.bookAppointment(
        appointmentData
      );

      if (response?.success) {
        toast.success(response.message);

        // Reset fields
        setSelectedPatient(null);
        setSelectedDepartments([]);
        modalClose(); // Close the modal
      } else {
        throw new Error(response?.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error.message);
      toast.error(error.message || "An unexpected error occurred!");
    } finally {
      setIsLoading(false); // End loading state
      onSave();
    }
  };

  return (
    <Modal show={show} onHide={modalClose} centered backdrop="static" animation>
      <Modal.Header>
        <Modal.Title>Add to queue</Modal.Title>
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={modalClose}
        ></button>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Select Patient */}
          <Row className="mb-3 align-items-center">
            <Col xs={2}>
              <label className="col-form-label">
                <i className="ri-group-line"></i>
              </label>
            </Col>
            <Col xs={10}>
              <Select
                placeholder="Select Patient"
                value={selectedPatient?.id || null} // Use `value` instead of `defaultValue`
                options={patients.map((patient) => ({
                  value: patient.id, // Ensure `id` is used as value
                  label: (
                    <div className="d-flex justify-content-between align-items-center p-2">
                      <span className="fw-medium">{patient.name}</span>
                      <span className="text-muted ms-2 fst-italic">
                        {patient.mobile}
                      </span>
                    </div>
                  ),
                  name: patient.name,
                  phoneNumber: patient.mobile,
                }))}
                onChange={handlePatientChange} // Correctly updates state on change
                dropdownStyle={{ zIndex: 9999 }} // Fix dropdown z-index
                className="w-100 my-2"
                showSearch
                filterOption={(input, option) => {
                  const labelMatch = option.name
                    .toLowerCase()
                    .includes(input.toLowerCase());
                  const phoneMatch = option.phoneNumber
                    .toLowerCase()
                    .includes(input.toLowerCase());
                  return labelMatch || phoneMatch;
                }}
                allowClear
              />
              {/* Link to Create Patient */}
              <div className="mt-2">
                <Link to="/patient/add-patient" className="text-primary">
                  Create a new patient
                </Link>
              </div>
            </Col>
          </Row>

          {/* Select Department */}
          <Row className="mb-3 align-items-center">
            <Col xs={2}>
              <label className="col-form-label">
                <i className="ri-building-line"></i>
              </label>
            </Col>
            <Col xs={10}>
              <Checkbox.Group
                options={departments}
                value={selectedDepartments}
                onChange={handleDepartmentChange}
              />
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0">
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedPatient(null);
            setSelectedDepartments([]);
            modalClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentForm;
