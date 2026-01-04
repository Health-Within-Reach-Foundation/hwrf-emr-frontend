import { RiAddLine, RiRefreshLine } from "@remixicon/react";
import { Badge, Button, Dropdown } from "antd";
import "flatpickr/dist/flatpickr.css";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import appointmentServices from "../api/appointment-services";
import campManagementService from "../api/camp-management-service";
import AntdTable from "../components/antd-table";
import AppointmentForm from "../components/appointment-form";
import CurrentCampDetailsHeader from "../components/camp/currentcamp-detail-header";
import DateCell from "../components/date-cell";
import { Loading } from "../components/loading";
import { useAuth } from "../utilities/AuthProvider";
import { transformText } from "../utilities/utility-function";
import patientServices from "../api/patient-services";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientLoading, setPatientLoading] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [departmentList, setDepartmentList] = useState([]);
  const [selectedQueueType, setSelectedQueueType] = useState(null);
  const { user } = useAuth();

  const queuePatientColumns = [
    {
      title: "Token Number",
      dataIndex: "tokenNumber",
      key: "tokenNumber",
      sortable: true,
      width: 180,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.patientId}`}>{text}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "patientName",
      key: "patientName",
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.patientId}`}>{text}</Link>
      ),
    },
    {
      title: "Sex",
      dataIndex: "patientSex",
      key: "patientSex",
      sortable: true,
      width: 120,
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      onFilter: (value, record) => {
        console.log(value, record);
        return record.patientSex === value;
      },
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.patientId}`}>{text}</Link>
      ),
    },
    {
      title: "Mobile No.",
      dataIndex: "patientMobile",
      key: "patientMobile",
      sortable: false,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.patientId}`}>{text}</Link>
      ),
    },
    {
      title: "Service Type",
      dataIndex: "queueType",
      key: "queueType",
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.patientId}`}>{text}</Link>
      ),
    },
    {
      title: "Primary Doctor",
      dataIndex: "primaryDoctor",
      key: "primaryDoctor",
      width: 150,
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.patientId}`}>{text}</Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sortable: true,
      filters: [
        { text: "In Queue", value: "in queue" },
        { text: "In", value: "in" },
        { text: "Out", value: "out" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text, record) => {
        // Define a color mapping for different statuses
        const statusColors = {
          "in queue": "success",
          in: "processing",
          out: "warning",
        };

        return (
          <Link
            to={`/patient/patient-profile/${record.patientId}`}
            // className={
            //   record.status === "in"
            //     ? "bg-info-subtle p-2 text-black"
            //     : record.status === "in queue"
            //     ? "bg-success-subtle p-2 text-black"
            //     : record.status === "out"
            //     ? "bg-warn-subtle p-2 text-black"
            //     : "p-2 text-black"
            // }
          >
            <Badge
              size="default"
              dot
              status={statusColors[text]}
              text={transformText(text)} // Capitalize status
            />
          </Link>
        );
      },
    },
    {
      title: "Last Updated Status",
      dataIndex: "statusUpdatedAt",
      key: "statusUpdatedAt",
      render: (text, record) => {
        return (
          <a href={`/patient/patient-profile/${record.patientId}`}>
            <DateCell date={text} dateFormat="MMM D, h:mm A" />
          </a>
        );
      },
    },
    {
      title: "Action",
      dataIndex: null,
      key: "action",
      render: (text, record) => {
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
                handleMarkAppointment(record.id, {
                  status: "in",
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
                handleMarkAppointment(record.id, {
                  status: "out",
                  statusUpdatedAt: new Date(),
                }),
            },
            {
              key: "3",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <i className="ri-calendar-schedule-line"></i>
                  <span>In Queue</span>
                </div>
              ),
              onClick: () =>
                handleMarkAppointment(record.id, {
                  status: "in queue",
                  statusUpdatedAt: new Date(),
                }),
            },
          ],
        };

        return (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button className="bg-primary" type="primary" size="sm">
              Action
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const handleMarkAppointment = async (rowId, rowBody) => {
    try {
      const response = await appointmentServices.updateAppointment(
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
      response.data.map((appointment) => {
        appointment.key = appointment.id;
        return appointment;
      });

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

  const getRecentPatients = async () => {
    try {
      setPatientLoading(true);
      const response = await patientServices.getRecentPatients();
      if (response) {
        const options = response.map((patient) => ({
          value: patient.id,
          label: (
            <div className="d-flex justify-content-between align-items-center p-2">
              <span className="fw-medium">{patient.name}</span>
              <span className="text-muted ms-2 fst-italic">
                {patient.mobileNumber}
              </span>
            </div>
          ),
          name: patient.name,
          mobile: patient.mobileNumber,
        }));
        setRecentPatients(options);
      }
    } catch (error) {
      console.error("Error fetching recent patients:", error);
    } finally {
      setPatientLoading(false);
    }
  };

  // useEffect(() => {
  // }, [date]);

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
    await Promise.all([fetchAppointments()]);
    // Note: Removed getPatientList() - patients are now fetched on-demand in AppointmentForm
  };

  // useEffect(() => {
  //   if (!show) {
  //     const interval = setInterval(refreshData, 9000); // 3 minutes
  //     return () => clearInterval(interval); // Clear interval on component unmount
  //   }
  // }, []);

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
    fetchCampDetails();
    getRecentPatients();
  }, []);

  const customRowClass = (record) => {
    if (record.status === "in queue") return "row-success";
    if (record.status === "in") return "row-info";
    if (record.status === "out") return "row-warning";
    return "";
  };

  // useEffect(() => {
  //   fetchAppointments(date);
  // }, [date]);

  if (loading || loadingAppointments) {
    return <Loading />;
  }

  return (
    <>
      <CurrentCampDetailsHeader />
      <Row>
        <Col>
          <Row className="align-items-center">
            {/* Department Buttons */}

            <div className="d-flex flex-column">
              <div className="d-flex flex-row-reverse gap-2">
                <Button
                  className="bg-primary"
                  type="primary"
                  variant="primary"
                  onClick={() => setShow(true)}
                  disabled={user?.currentCampId === null}
                  title={
                    user?.currentCampId === null ? "Please select camp!" : null
                  }
                  style={{ width: "auto" }} // Keeps the button width to content size
                >
                  <RiAddLine />
                  Add to Queue
                </Button>
                <Button
                  className="bg-primary"
                  type="primary"
                  variant="outline-primary"
                  onClick={refreshData}
                  // className="mb-3"
                  style={{ width: "auto" }}
                >
                  <RiRefreshLine />
                </Button>
              </div>
              <div className="d-flex align-items-center flex-row mb-3 gap-2">
                Sort By:
                {departmentList.map((department) => (
                  <Button
                    key={department.value}
                    size="lg"
                    onClick={() => handleQueueTypeSort(department)}
                    style={{
                      backgroundColor:
                        selectedQueueType === department.label
                          ? "#0a58b8"
                          : "transparent",
                      color:
                        selectedQueueType === department.label
                          ? "#fff"
                          : "#0a58b8",
                      border: "1px solid #0a58b8",
                    }}
                  >
                    {department.label}
                  </Button>
                ))}
              </div>
            </div>
          </Row>

          {/* <CustomTable
            key={filteredAppointments.length} // Force re-render when data changes
            columns={columns}
            data={filteredAppointments}
            enableFilters={false}
            // filtersConfig={filterComponents}
            // onApplyFilters={applyFilters}
            // onResetFilters={resetFilters}
          /> */}
          {/* code for passing atnd table */}

          <div className="antd-table-container">
            <AntdTable
              key={filteredAppointments.length} // Force re-render when data changes
              columns={queuePatientColumns}
              data={filteredAppointments}
              pageSizeOptions={[50, 100, 150, 200]}
              defaultPageSize={50}
              rowClassName={customRowClass}
            />
          </div>
        </Col>
      </Row>

      <AppointmentForm
        show={show}
        recentPatients={recentPatients}
        modalClose={() => setShow(false)}
        departments={departmentList}
        onSave={() => fetchAppointments(date)}
      />
    </>
  );
};

export default Appointment;
