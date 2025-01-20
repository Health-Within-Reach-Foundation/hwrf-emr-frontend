import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
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
import { Link } from "react-router-dom";
import { Badge, Dropdown, Menu } from "antd";
import { useAuth } from "../utilities/AuthProvider";
import toast from "react-hot-toast";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [filters, setFilters] = useState({ status: "", queueType: "" });
  const [patientList, setPatientList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedQueueType, setSelectedQueueType] = useState(null); // Tracks the selected department

  const statusOptions = [
    { value: "registered", label: "Registered" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const columns = [
    {
      data: "patientRegNo",
      title: "Reg. No",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.patientId}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      data: "patientName",
      title: "Name",
      // render: (data, row) => {
      //   return (
      //     <a href={`/patient/patient-profile/${row.patientId}`} className="">
      //       {data}
      //     </a>
      //   );
      // },
    },
    {
      data: "patientSex",
      title: "Sex",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.patientId}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      data: "appointmentDate",
      title: "Queue Date",
      render: (data, row) => {
        // console.log(data,row);
        return (
          <a href={`/patient/patient-profile/${row.patientId}`} className="">
            <DateCell date={data} />
          </a>
        );
      },
    },
    {
      data: "tokenNumber",
      title: "Token Number",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.patientId}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      data: "queueType",
      title: "Queue Type",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.patientId}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      data: "status",
      title: "Status",
      render: (data, row) => {
        // Define a color mapping for different statuses
        const statusColors = {
          "in queue": "success",
          in: "processing",
          out: "warning",
        };

        return (
          <a href={`/patient/patient-profile/${row.patientId}`} className="">
            <Badge
              size="default"
              dot
              // color={statusColors[data] || "default"}
              status={statusColors[data]}
              text={data.charAt(0).toUpperCase() + data.slice(1)} // Capitalize status
            />
          </a>
        );
      },
    },
    {
      data: null,
      title: "Action",
      render: (data, row) => {
        // Define the menu options using the new menu structure with icons and proper alignment
        const menu = {
          items: [
            {
              key: "1",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="ri-login-box-line"></i>
                  <span>Mark as In</span>
                </div>
              ),
              onClick: () =>
                handleMarkAppointment(row.id, {
                  status: "in",
                }),
            },
            {
              key: "2",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="ri-logout-box-line"></i>
                  <span>Mark as Out</span>
                </div>
              ),
              onClick: () =>
                handleMarkAppointment(row.id, {
                  status: "out",
                }),
            },
            // Uncomment if needed
            // {
            //   key: "3",
            //   label: (
            //     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            //       <i className="ri-queue-line"></i>
            //       <span>In Queue</span>
            //     </div>
            //   ),
            //   onClick: () =>
            //     handleMarkAppointment(row.id, {
            //       status: "in-queue",
            //     }),
            // },
          ],
        };

        return (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button type="primary" size="sm">
              Action
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handleMarkAppointment = async (rowId, rowBody) => {
    try {
      const response = await appointmentServices.markAppointment(
        rowId,
        rowBody
      );
      if (response.success) {
        toast.success(response?.message);
      }
    } catch (error) {
      console.error("Error while marking appointment:", error);
      toast.error(error.message);
    } finally {
      setLoading(false);
      fetchAppointments(date);
    }
  };

  const fetchAppointments = async (selectedDate) => {
    try {
      setLoadingAppointments(true);
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const dateString = adjustedDate.toISOString().split("T")[0];
      const response = await appointmentServices.getAppointments(dateString);
      setAppointments(
        response?.data.sort((a, b) => a.tokenNumber - b.tokenNumber) || []
      );
      setFilteredAppointments(response?.data.sort((a, b) => a.tokenNumber - b.tokenNumber) || []);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoadingAppointments(false);
    }
  };

  const getPatientList = async () => {
    try {
      setLoadingPatient(true);
      const response = await patientServices.getPatients();
      setPatientList(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoadingPatient(false);
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

  // useEffect(() => {
  // }, [date]);

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

  const handleQueueTypeSort = (queueType) => {
    if (selectedQueueType === queueType.label) {
      // If the same department button is clicked again, reset the filter
      setSelectedQueueType(null);
      setFilteredAppointments(appointments);
    } else {
      // Apply the filter for the selected department
      setSelectedQueueType(queueType.label);
      const filtered = appointments.filter(
        (appointment) => appointment.queueType === queueType.label
      );
      setFilteredAppointments(filtered);
    }
  };

  useEffect(() => {
    fetchAppointments(date);
    getPatientList();
    getSpecialtyDepartmentsByClinic();
  }, []);

  useEffect(() => {
    fetchAppointments(date);
  }, [date]);

  if (loading || loadingPatient || loadingAppointments) {
    return <Loading />;
  }

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

            {/* Department Buttons */}

            <div className="d-flex flex-column">
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
              <div className="d-flex align-items-center flex-row-reverse mb-3 gap-2">
                {departmentList.map((department) => (
                  <Button
                    size="sm"
                    key={department.value}
                    variant={
                      selectedQueueType === department.label
                        ? "primary" // Highlight the selected button
                        : "outline-primary"
                    }
                    onClick={() => handleQueueTypeSort(department)}
                  >
                    {department.label}
                  </Button>
                ))}
                Sort By:
              </div>
            </div>
          </Row>

          <CustomTable
            key={filteredAppointments.length} // Force re-render when data changes
            columns={columns}
            data={filteredAppointments}
            enableFilters={false}
            // filtersConfig={filterComponents}
            // onApplyFilters={applyFilters}
            // onResetFilters={resetFilters}
          />
        </Col>
      </Row>

      <AppointmentForm
        show={show}
        modalClose={() => setShow(false)}
        patients={patientList}
        departments={departmentList}
        onSave={() => fetchAppointments(date)}
      />
    </>
  );
};

export default Appointment;
