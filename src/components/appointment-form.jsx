// import React, { useState } from "react";
// import { Modal, Button, Row, Col, Form } from "react-bootstrap";
// import {Select} from "antd"; // For searchable dropdowns
// import Flatpickr from "react-flatpickr";
// import appointmentServices from "../api/appointment-services";
// import toast from "react-hot-toast";

// const AppointmentForm = ({ show, modalClose, patients, departments }) => {
//   const [selectedPatient, setSelectedPatient] = useState({});
//   const [selectedDepartment, setSelectedDepartment] = useState([]);
//   const [appointmentDate, setAppointmentDate] = useState(null);
//   const [isLoading, setIsLoading] = useState(false); // State for loading effect

//   console.log("departments --> ", departments, patients);

//   const handlePatientChange = (selectedOption) => {
//     console.log(selectedOption);
//     setSelectedPatient(selectedOption);
//   };

//   const handleDepartmentChange = (selectedOption) => {
//     console.log(selectedOption);
//     setSelectedDepartment(selectedOption);
//   };

//   const handleSave = async () => {
//     if (!selectedPatient || !selectedDepartment || !appointmentDate) {
//       toast.error("Please fill in all fields!");
//       return;
//     }
//     // Convert appointmentDate to local ISO string without time information
//     const localDate = new Date(
//       appointmentDate.getFullYear(),
//       appointmentDate.getMonth(),
//       appointmentDate.getDate()
//     ).toISOString(); // Strips the time and sends only the date

//     console.log("Local appointmentDate -->", localDate);
//     const appointmentData = {
//       patientId: selectedPatient.value,
//       specialtyId: selectedDepartment.value,
//       appointmentDate: localDate,
//       status: "registered",
//     };

//     try {
//       setIsLoading(true); // Start loading state

//       // const response = await appointmentServices.bookAppointment(appointmentData);

//       // Assuming response has a success flag or appropriate structure
//       // if (response?.success) {
//       //   toast.success("Appointment booked successfully!");

//       //   // Reset fields
//       //   setSelectedPatient(null);
//       //   setSelectedDepartment(null);
//       //   setAppointmentDate(null);

//       //   modalClose(); // Close the modal
//       // } else {
//       //   throw new Error(response?.message || "Failed to book appointment.");
//       // }
//     } catch (error) {
//       console.error("Error booking appointment:", error.message);
//       toast.error(error.message || "An unexpected error occurred!");
//     } finally {
//       setIsLoading(false); // End loading state
//     }
//   };

//   return (
//     <Modal show={show} onHide={modalClose} centered backdrop="static" animation>
//       <Modal.Header>
//         <Modal.Title>Add Appointment</Modal.Title>
//         <button
//           type="button"
//           className="btn-close"
//           aria-label="Close"
//           onClick={modalClose}
//         ></button>
//       </Modal.Header>
//       <Modal.Body>
//         <Form>
//           {/* Select Patient */}
//           <Row className="mb-3 align-items-center">
//             <Col xs={2}>
//               <label className="col-form-label">
//                 <i className="ri-group-line"></i>
//               </label>
//             </Col>
//             <Col xs={10}>
//               <Select
//                 placeholder="Select Patient"
//                 value={selectedPatient}
//                 options={patients}
//                 onChange={handlePatientChange}
//                 allowClear
//                 className="w-100 my-2"
//               />
//             </Col>
//           </Row>

//           {/* Select Department */}
//           <Row className="mb-3 align-items-center">
//             <Col xs={2}>
//               <label className="col-form-label">
//                 <i className="ri-building-line"></i>
//               </label>
//             </Col>
//             <Col xs={10}>
//               <Select
//                 mode="multiple"
//                 placeholder="Select departement"
//                 value={selectedDepartment}
//                 options={departments}
//                 onChange={handleDepartmentChange}
//                 allowClear
//                 // filterOption={(input, option) =>
//                 //   option.label.toLowerCase().includes(input.toLowerCase())
//                 // }
//                 className="w-100 my-2"
//               />
//             </Col>
//           </Row>

//           {/* Appointment Date */}
//           <Row className="mb-3 align-items-center">
//             <Col xs={2}>
//               <label className="col-form-label">
//                 <i className="ri-calendar-line"></i>
//               </label>
//             </Col>
//             <Col xs={10}>
//               <Flatpickr
//                 options={{ minDate: "today" }}
//                 value={appointmentDate}
//                 onChange={(date) => setAppointmentDate(date[0])}
//                 className="form-control"
//                 placeholder="Select Appointment Date"
//               />
//             </Col>
//           </Row>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer className="border-0">
//         <Button
//           variant="secondary"
//           onClick={() => {
//             setSelectedPatient(null);
//             setSelectedDepartment(null);
//             setAppointmentDate(null);
//             modalClose();
//           }}
//         >
//           Discard Changes
//         </Button>
//         <Button
//           variant="primary"
//           onClick={handleSave}
//           disabled={isLoading} // Disable button during loading
//         >
//           {isLoading ? "Saving..." : "Save Appointment"}
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default AppointmentForm;

import React, { useState } from "react";
import { Modal, Button, Row, Col, Form } from "react-bootstrap";
import { Select, Checkbox } from "antd"; // For searchable dropdowns and checkboxes
import { Link } from "react-router-dom"; // For navigation
import Flatpickr from "react-flatpickr";
import toast from "react-hot-toast";
import appointmentServices from "../api/appointment-services";

const AppointmentForm = ({ show, modalClose, patients, departments }) => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log(
    "patients and departments",
    patients,
    departments,
    selectedPatient
  );

  const handlePatientChange = (value) => {
    const selectedOption = patients.find((patient) => patient.value === value);
    setSelectedPatient(selectedOption);
  };

  const handleDepartmentChange = (checkedValues) => {
    setSelectedDepartments(checkedValues);
  };

  const handleSave = async () => {
    if (!selectedPatient || !selectedDepartments.length || !appointmentDate) {
      toast.error("Please fill in all fields!");
      return;
    }

    const localDate = new Date(
      appointmentDate.getFullYear(),
      appointmentDate.getMonth(),
      appointmentDate.getDate()
    ).toISOString(); // Strips the time and sends only the date

    const appointmentData = {
      patientId: selectedPatient.value,
      specialties: selectedDepartments,
      appointmentDate: localDate,
      status: "registered",
    };

    try {
      setIsLoading(true); // Start loading state
      console.log("Appointment Data:", appointmentData);
      const response = await appointmentServices.bookAppointment(
        appointmentData
      );

      if (response?.success) {
        toast.success("Appointment booked successfully!");

        // Reset fields
        setSelectedPatient(null);
        setSelectedDepartments(null);
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
                defaultValue="xys"
                value={selectedPatient?.value || null} // Use selectedPatient.value or null
                options={patients}
                onChange={handlePatientChange}
                dropdownStyle={{ zIndex: 9999 }} // Fix dropdown z-index
                className="w-100 my-2"
                showSearch
                filterOption={(input, option) => {
                  const labelMatch = option.label.toLowerCase().includes(input.toLowerCase());
                  const phoneMatch = option.phoneNumber
                    ? option.phoneNumber.toLowerCase().includes(input.toLowerCase())
                    : false;
                  return labelMatch || phoneMatch;
                }}
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
            setSelectedDepartments([]);
            setAppointmentDate(null);
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
