import React, { useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import Select from "react-select"; // For searchable dropdowns
import Flatpickr from "react-flatpickr";
import appointmentServices from "../api/appointment-services";
import toast from "react-hot-toast";

const AppointmentForm = ({ show, modalClose, patients, departments }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // State for loading effect

  const handlePatientChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedPatient(selectedOption);
  };

  const handleDepartmentChange = (selectedOption) => {
    console.log(selectedOption);
    setSelectedDepartment(selectedOption);
  };

  const handleSave = async () => {
    if (!selectedPatient || !selectedDepartment || !appointmentDate) {
      toast.error("Please fill in all fields!");
      return;
    }
    // Convert appointmentDate to local ISO string without time information
    const localDate = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    ).toISOString(); // Strips the time and sends only the date

    console.log("Local appointmentDate -->", localDate);
    const appointmentData = {
      patientId: selectedPatient.value,
      specialtyId: selectedDepartment.value,
      appointmentDate: localDate,
      status: "registered",
    };

    try {
      setIsLoading(true); // Start loading state

      const response = await appointmentServices.bookAppointment(appointmentData);

      // Assuming response has a success flag or appropriate structure
      if (response?.success) {
        toast.success("Appointment booked successfully!");

        // Reset fields
        setSelectedPatient(null);
        setSelectedDepartment(null);
        setAppointmentDate(null);

        modalClose(); // Close the modal
      } else {
        throw new Error(response?.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error.message);
      toast.error(error.message || "An unexpected error occurred!");
    } finally {
      setIsLoading(false); // End loading state
    }
  };

  return (
    <Modal show={show} onHide={modalClose} centered backdrop="static" animation>
      <Modal.Header>
        <Modal.Title>Add Appointment</Modal.Title>
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
                options={patients}
                value={selectedPatient}
                onChange={handlePatientChange}
                placeholder="Select Patient"
                isSearchable
              />
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
              <Select
                options={departments}
                value={selectedDepartment}
                onChange={handleDepartmentChange}
                placeholder="Select Department"
                isSearchable
              />
            </Col>
          </Row>

          {/* Appointment Date */}
          <Row className="mb-3 align-items-center">
            <Col xs={2}>
              <label className="col-form-label">
                <i className="ri-calendar-line"></i>
              </label>
            </Col>
            <Col xs={10}>
              <Flatpickr
                options={{ minDate: "today" }}
                value={appointmentDate}
                onChange={(date) => setAppointmentDate(date[0])}
                className="form-control"
                placeholder="Select Appointment Date"
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
            setSelectedDepartment(null);
            setAppointmentDate(null);
            modalClose();
          }}
        >
          Discard Changes
        </Button>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isLoading} // Disable button during loading
        >
          {isLoading ? "Saving..." : "Save Appointment"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AppointmentForm;
