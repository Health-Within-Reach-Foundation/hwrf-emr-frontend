import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
// import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.css";
import Select from "react-select";
import AppointmentForm from "../components/appointment-form";
import appointmentServices from "../api/appointment-services";
import patientServices from "../api/patient-services";
import clinicServices from "../api/clinic-services";
import CustomTable from "../components/custom-table";
import { Loading } from "../components/loading";
import DateCell from "../components/date-cell";
import { Badge, Dropdown, Menu } from "antd";
import toast from "react-hot-toast";
import CurrentCampDetailsHeader from "../components/camp/currentcamp-detail-header";
import { RiAddLine, RiRefreshLine } from "@remixicon/react";
import { transformText } from "../utilities/utility-function";
import { useAuth } from "../utilities/AuthProvider";
import campManagementService from "../api/camp-management-service";
import { render } from "katex";

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
  const { user } = useAuth();

  const statusOptions = [
    { value: "registered", label: "Registered" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const columns = [
    {
      data: "tokenNumber",
      title: "Token Number",
      render: (data, row) => {
        return <a href={`/patient/patient-profile/${row.patientId}`}>{data}</a>;
      },
    },
    {
      data: "patientName",
      title: "Name",
    },
    {
      data: "patientSex",
      title: "Sex",
      render: (data, row) => {
        return <a href={`/patient/patient-profile/${row.patientId}`}>{data}</a>;
      },
    },
    {
      data: "patientMobile",
      title: "Mobile No.",
    },
    {
      data: "queueType",
      title: "Service Type",
      render: (data, row) => {
        return <a href={`/patient/patient-profile/${row.patientId}`}>{data}</a>;
      },
    },
    {
      data: "primaryDoctor",
      title: "Primary Doctor",
      render: (data, row) => {
        return <a href={`/patient/patient-profile/${row.patientId}`}>{data}</a>;
      },
    },
    // {
    //   data: "appointmentDate",
    //   title: "Queue Date",
    //   render: (data, row) => {
    //     // console.log(data,row);
    //     return <a href={`/patient/patient-profile/${row.patientId}`}>{data}</a>;
    //   },
    // },
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
        const status = row.status;

        return (
          <a
            href={`/patient/patient-profile/${row.patientId}`}
            className={
              row.status === "in"
                ? "bg-info-subtle p-2 text-black"
                : row.status === "in queue"
                ? "bg-success-subtle p-2 text-black"
                : row.status === "out"
                ? "bg-warn-subtle p-2 text-black"
                : "p-2 text-black"
            }
          >
            <Badge
              size="default"
              dot
              // color={statusColors[data] || "default"}
              status={statusColors[data]}
              text={transformText(data)} // Capitalize status
            />
          </a>
        );
      },
    },
    // add column named last updated staus and it will be show the timestamp comming from the data key named statusUpdatedAt
    {
      data: "statusUpdatedAt",
      title: "Last Updated Status",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.patientId}`}>
            <DateCell date={data} dateFormat="MMM D, h:mm A"/>
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
                  <span>In</span>
                </div>
              ),
              onClick: () =>
                handleMarkAppointment(row.id, {
                  status: "in",
                  // statusUpdatedAt: new Date().toLocaleString("en-CA"),
                  statusUpdatedAt: new Date(),
                }),
            },
            {
              key: "2",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="ri-logout-box-line"></i>
                  <span>Out</span>
                </div>
              ),
              onClick: () =>
                handleMarkAppointment(row.id, {
                  status: "out",
                  // statusUpdatedAt: new Date().toLocaleString("en-CA"),
                  statusUpdatedAt: new Date(),
                }),
            },
            {
              key: "3",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i class="ri-calendar-schedule-line"></i>
                  <span>In Queue</span>
                </div>
              ),
              onClick: () =>
                handleMarkAppointment(row.id, {
                  status: "in queue",
                  // statusUpdatedAt: new Date().toLocaleString("en-CA"),
                  statusUpdatedAt: new Date(),
                }),
            },
            // {
            //   data: "patientRegNo",
            //   title: "Reg. No",
            //   render: (data, row) => {
            //     return (
            //       <a href={`/patient/patient-profile/${row.patientId}`} className="">
            //         {"HWRF-".concat(data)}
            //       </a>
            //     );
            //   },
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
      fetchAppointments();
    }
  };

  const fetchAppointments = async (selectedDate = date) => {
    try {
      setLoadingAppointments(true);
      const adjustedDate = new Date(
        selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
      );
      const dateString = adjustedDate.toISOString().split("T")[0];
      const response = await appointmentServices.getAppointments();
      console.log(response);
      setAppointments(
        response?.data.sort((a, b) => a.tokenNumber - b.tokenNumber) || []
      );
      setFilteredAppointments(
        response?.data.sort((a, b) => a.tokenNumber - b.tokenNumber) || []
      );
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

  const fetchCampDetails = async () => {
    try {
      setLoading(true);
      const response = await campManagementService.getCampById(
        user.currentCampId
      );
      setDepartmentList(
        response.data.specialties.map((department) => ({
          value: department.id,
          label: department.departmentName,
        }))
      );
    } catch (error) {
      console.error("Error fetching camp details:", error);
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

  // const handleQueueTypeSort = (queueType) => {
  //   if (selectedQueueType === queueType.label) {
  //     // If the same department button is clicked again, reset the filter
  //     localStorage.setItem("")
  //     setSelectedQueueType(null);
  //     setFilteredAppointments(appointments);
  //   } else {
  //     // Apply the filter for the selected department
  //     setSelectedQueueType(queueType.label);
  //     const filtered = appointments.filter(
  //       (appointment) => appointment.queueType === queueType.label
  //     );
  //     setFilteredAppointments(filtered);
  //   }
  // };

  const handleQueueTypeSort = (queueType) => {
    const userId = user?.id; // Replace with your actual user authentication logic
    const currentRoute = window.location.pathname; // Get current route
    const localStorageKey = `${currentRoute}_${userId}`; // Key for localStorage

    if (selectedQueueType === queueType.label) {
      // If the same department button is clicked again, reset the filter
      localStorage.removeItem(localStorageKey);
      setSelectedQueueType(null);
      setFilteredAppointments(appointments);
    } else {
      // Apply the filter for the selected department
      setSelectedQueueType(queueType.label);

      // Save the sortedBy value in localStorage
      localStorage.setItem(localStorageKey, queueType.label);

      const filtered = appointments.filter(
        (appointment) => appointment.queueType === queueType.label
      );
      setFilteredAppointments(filtered);
    }
  };
  const refreshData = async () => {
    await Promise.all([fetchAppointments(), getPatientList()]);
    // toast.success("Data refreshed successfully!");
  };

  // useEffect(() => {
  //   if (!show) {
  //     const interval = setInterval(refreshData, 9000); // 3 minutes
  //     return () => clearInterval(interval); // Clear interval on component unmount
  //   }
  // }, []);
  // Effect to retrieve and apply filter on component mount
  useEffect(() => {
    const userId = user?.id; // Replace with your actual user authentication logic
    const currentRoute = window.location.pathname; // Get current route
    const localStorageKey = `${currentRoute}_${userId}`; // Key for localStorage

    const savedQueueType = localStorage.getItem(localStorageKey);
    if (savedQueueType) {
      setSelectedQueueType(savedQueueType);
      const filtered = appointments.filter(
        (appointment) => appointment.queueType === savedQueueType
      );
      setFilteredAppointments(filtered);
    }
  }, [appointments, user?.id]); // Dependencies for effect
  useEffect(() => {
    fetchAppointments();
    getPatientList();
    // getSpecialtyDepartmentsByClinic();
    fetchCampDetails();
  }, []);

  // useEffect(() => {
  //   fetchAppointments(date);
  // }, [date]);

  if (loading || loadingPatient || loadingAppointments) {
    return <Loading />;
  }

  return (
    <>
      <CurrentCampDetailsHeader />
      <Row>
        <Col>
          <Row className="align-items-center">
            <Col
              xs={12}
              md={6}
              className="d-flex justify-content-between align-items-center mb-3"
            >
              {/* Filterig the appointments by queue */}
              {/* <Col md={6} className="mb-3">
                <label htmlFor="appointmentDate" className="form-label">
                  Select Queue Date
                </label>
                <Flatpickr
                  value={date}
                  onChange={([selectedDate]) => setDate(selectedDate)}
                  id="appointmentDate"
                  className="inline_flatpickr w-auto"
                />
              </Col> */}
            </Col>

            {/* Department Buttons */}

            <div className="d-flex flex-column">
              <div className="d-flex flex-row-reverse gap-2">
                <Button
                  variant="primary"
                  onClick={() => setShow(true)}
                  disabled={user?.currentCampId === null}
                  className="mb-3"
                  title={
                    user?.currentCampId === null ? "Please select camp!" : null
                  }
                  style={{ width: "auto" }} // Keeps the button width to content size
                >
                  <RiAddLine />
                  Add to Queue
                </Button>
                <Button
                  variant="outline-primary"
                  onClick={refreshData}
                  className="mb-3"
                  style={{ width: "auto" }}
                >
                  <RiRefreshLine />
                </Button>
              </div>
              <div className="d-flex align-items-center flex-row mb-3 gap-2">
                Sort By:
                {departmentList.map((department) => (
                  <Button
                    size="lg"
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
