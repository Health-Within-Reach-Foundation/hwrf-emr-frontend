import React, { useState, useEffect } from "react";
import { Row, Col, Button, Dropdown } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Select from "react-select";
import AppointmentForm from "../components/appointment-form";
import appointmentServices from "../api/appointment-services";
import patientServices from "../api/patient-services";
import clinicServices from "../api/clinic-services";
import CustomTable from "../components/custom-table";
import { Loading } from "../components/loading";
import DateCell from "../components/date-cell";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({ status: "", queueType: "" });
  const [patientList, setPatientList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const statusOptions = [
    { value: "registered", label: "Registered" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const columns = [
    { data: "patientRegNo", title: "Reg. No" },
    { data: "patientName", title: "Name" },
    { data: "patientSex", title: "Sex" },
    {
      data: "appointmentDate",
      title: "Queue Date",
      render: (data) => {
        return <DateCell date={data} />;
      },
    },
    {
      data: "tokenNumber",
      title: "Token Number",
    },
    {
      data: "queueType",
      title: "Queue Type",
    },
    { data: "status", title: "Status" },
    {
      title: "View",
      data: "patientId",
      render: (data) =>
        `<a href="/patient/patient-profile/${data}" class="btn btn-primary btn-sm">View</a>`,
    },
  ];

  const fetchAppointments = async (selectedDate) => {
    try {
      setLoading(true);
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const dateString = adjustedDate.toISOString().split("T")[0];
      const response = await appointmentServices.getAppointments(dateString);
      setAppointments(response?.data || []);
      setFilteredAppointments(response?.data || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPatientList = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getPatients();
      setPatientList(
        response.data.map((patient) => ({
          value: patient.id,
          label: patient.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getSpecialtyDepartmentsByClinic();
      setDepartmentList(
        response.data.map((department) => ({
          value: department.id,
          label: department.departmentName,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments(date);
  }, [date]);

  useEffect(() => {
    getPatientList();
    getSpecialtyDepartmentsByClinic();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const filterComponents = [
    {
      key: "status",
      component: Select,
      props: {
        options: statusOptions,
        value: statusOptions.find((opt) => opt.value === filters.status),
        onChange: (selected) =>
          setFilters((prev) => ({ ...prev, status: selected?.value || "" })),
      },
    },
    {
      key: "queueType",
      component: Select,
      props: {
        options: departmentList,
        value: departmentList.find((opt) => opt.value === filters.queueType),
        onChange: (selected) =>
          setFilters((prev) => ({ ...prev, queueType: selected?.label || "" })),
      },
    },
  ];

  const applyFilters = () => {
    let filteredData = appointments;
    if (filters.status) {
      filteredData = filteredData.filter(
        (appointment) => appointment.status === filters.status
      );
    }
    if (filters.queueType) {
      filteredData = filteredData.filter(
        (appointment) => appointment.queueType === filters.queueType
      );
    }
    setFilteredAppointments(filteredData);
    // setShowFilters(false); // Close the filter panel after applying
  };

  const resetFilters = () => {
    setFilters({ status: "", queueType: "" });
    setFilteredAppointments(appointments); // Reset to all appointments
    // setShowFilters(false); // Close the filter panel after resetting
  };

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              {/* Date Picker with Label */}
              <Col md={6} className="mb-3">
                <label htmlFor="appointmentDate" className="form-label">
                  Select Queue Date
                </label>
                <Flatpickr
                  value={date}
                  onChange={([selectedDate]) => setDate(selectedDate)}
                  id="appointmentDate"
                  className="inline_flatpickr w-auto"
                />
              </Col>
            </Col>
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-end align-items-center mb-3"
            >
              {/* Buttons Section */}
              <div className="d-flex gap-2">
                <Button
                  variant="primary"
                  onClick={() => setShow(true)}
                  className="mb-3"
                  style={{ width: "auto" }} // Keeps the button width to content size
                >
                  Add to Queue
                </Button>
              </div>
            </Col>
          </Row>

          <CustomTable
            key={filteredAppointments.length} // Force re-render when data changes
            columns={columns}
            data={filteredAppointments}
            enableFilters
            filtersConfig={filterComponents}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
          />
        </Col>
      </Row>
      <AppointmentForm
        show={show}
        modalClose={() => setShow(false)}
        patients={patientList}
        departments={departmentList}
      />
    </>
  );
};

export default Appointment;
