import { Pie, Bar } from "react-chartjs-2";
import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Accordion } from "react-bootstrap";
import { Form, Input, DatePicker, Select, Tabs, Button, Tooltip } from "antd";
import campManagementService from "../../api/camp-management-service";
import { Loading } from "../../components/loading";
import dayjs from "dayjs";
import clinicServices from "../../api/clinic-services";
import toast from "react-hot-toast";
import AntdTable from "../../components/antd-table";
import DentistryAnalytics from "../../components/camp/dentistry-analytics";
import MammographyAnalytics from "../../components/camp/mammography-analytics";
import GPAnalytics from "../../components/camp/gp-analytics";
import { useAuth } from "../../utilities/AuthProvider";
import BackButton from "../../components/back-button";

const CampDetails = () => {
  const { campId } = useParams();
  const { user, userRoles, permissions } = useAuth();
  const [campData, setCampData] = useState(null);
  const [campLoading, setCampLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [treatingDoctorsOptions, setTreatingDoctorsOptions] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);

  const fetchCampDetails = async () => {
    try {
      const response = await campManagementService.getCampById(campId);
      console.log(response);
      response.data?.patients?.map((patient, index) => {
        patient.key = index;
        return patient;
      });

      response.data?.users?.map((user) => {
        user.key = user.id;
        return user;
      });

      setCampData(response.data);
      // setEditData(response.data); // Initialize edit form with existing data
      setEditData({
        name: response.data.name || "",
        location: response.data.location || "",
        city: response.data.city || "",
        startDate: response.data.startDate || "",
        endDate: response.data.endDate || "",
        vans: response.data.vans || [], // Ensure it's an array
        specialties: response.data.specialties?.map((s) => s.id) || [], // Store only IDs
      });
    } catch (error) {
      console.error("Error fetching camp details:", error);
    } finally {
      setCampLoading(false);
    }
  };

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setServiceLoading(true);
      const response = await clinicServices.getSpecialtyDepartmentsByClinic();
      setSpecialtiesOptions(
        response.data.map((department) => ({
          value: department.id,
          label: department.departmentName,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setServiceLoading(false);
    }
  };

  const getDoctors = async () => {
    setUsersLoading(true);
    try {
      const response = await clinicServices.getUsersByClinic();
      const filteredUsers = response.data.filter((eachUser) => {
        const isDoctor = eachUser?.roles?.some(
          (role) => role?.roleName === "doctor"
        );
        return isDoctor;
      });

      const formattedUsers = filteredUsers.map((user) => ({
        value: user?.name,
        text: user?.name,
      }));
      setTreatingDoctorsOptions(formattedUsers);
    } catch (error) {
    } finally {
      setUsersLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (value, field) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value, // Directly update the array
    }));
  };

  useEffect(() => {
    getDoctors();
    fetchCampDetails();
    getSpecialtyDepartmentsByClinic();
  }, [campId]);

  if (campLoading || serviceLoading || usersLoading) {
    return <Loading />;
  }

  if (!campData) {
    return <p className="text-center mt-5">No camp data found.</p>;
  }

  const {
    name,
    status,
    location,
    city,
    startDate,
    endDate,
    vans,
    specialties,
    patients,
    users,
  } = campData;

  // Handle Save Changes
  const handleSave = async () => {
    try {
      setCampLoading(true);
      console.log(editData);
      const response = await campManagementService.updateCampById(
        campId,
        editData
      );
      if (response.success) {
        toast.success(response.message);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating camp details:", error);
      toast.error(error.message);
    } finally {
      fetchCampDetails();
      setCampLoading(false);
    }
  };
  const newPatientColumns = [
    {
      title: "Token Number",
      dataIndex: "tokenNumber",
      key: "tokenNumber",
      sortable: true,
      width: 150,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Service Taken",
      dataIndex: "serviceTaken",
      key: "serviceTaken",
      filters: [
        { text: "Mammography", value: "Mammography" },
        { text: "Dentistry", value: "Dentistry" },
        { text: "GP", value: "GP" },
      ],
      onFilter: (value, record) => record.serviceTaken === value,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Collected Amount",
      dataIndex: "collectedAmount",
      width: 150,
      key: "collectedAmount",
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text?.offlineAmount + text?.onlineAmount}
        </Link>
      ),
    },
    {
      title: "Cash",
      dataIndex: "collectedAmount",
      width: 150,
      key: "collectedAmount",
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text?.offlineAmount}
        </Link>
      ),
    },
    {
      title: "Online Amount",
      dataIndex: "collectedAmount",
      width: 150,
      key: "collectedAmount",
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text?.onlineAmount}
        </Link>
      ),
    },
    {
      title: "Treated doctors",
      dataIndex: "treatingDoctors",
      key: "treatingDoctors",
      width: 200,
      filters: treatingDoctorsOptions,
      onFilter: (value, record) => {
        return (
          Array.isArray(record?.treatingDoctors) &&
          record.treatingDoctors.some((doctor) => doctor?.label === value)
        );
      },
      sortable: true,
      render: (text, record) => {
        const uniqueDoctors = record?.treatingDoctors?.reduce((acc, doctor) => {
          if (!acc?.some((d) => d?.value === doctor?.value)) {
            acc.push(doctor);
          }
          return acc;
        }, []);
        return (
          <Link to={`/patient/patient-profile/${record.id}`}>
            {uniqueDoctors?.map((doctor) => doctor?.label)?.join(", ")}
          </Link>
        );
      },
    },
    {
      title: "Total amount paid",
      dataIndex: "paidAmount",
      width: 150,
      key: "paidAmount",
      render: (text, record) =>
        permissions
          .map((permission) => permission.action)
          .includes("camps:finance") ? (
          <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
        ) : (
          <Link to={`/patient/patient-profile/${record.id}`}>-</Link>
        ),
    },
  ];
  const newStaffColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
  ];

  return (
    <Container className="mt-4">
      {/* Camp Details Card with Edit Option */}
      <BackButton />
      <Row className="mb-4 w-full">
        <Col xs={12} md={12} lg={12}>
          <Accordion>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Camp Details</Accordion.Header>
              <Accordion.Body>
                <div>
                  <h4 className="mb-0">
                    {isEditing ? "Edit Camp Details" : name}
                  </h4>
                  <Badge bg={status === "active" ? "success" : "secondary"}>
                    {status}
                  </Badge>
                </div>
                <div>
                  {isEditing ? (
                    <Form layout="vertical">
                      <Form.Item label="Name">
                        <Input
                          type="text"
                          name="name"
                          value={editData.name}
                          onChange={handleChange}
                        />
                      </Form.Item>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Location">
                            <Input
                              type="text"
                              name="location"
                              value={editData.location}
                              onChange={handleChange}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="City">
                            <Input
                              type="text"
                              name="city"
                              value={editData.city}
                              onChange={handleChange}
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Start Date">
                            <DatePicker
                              style={{ width: "100%" }}
                              name="startDate"
                              format="YYYY-MM-DD"
                              value={
                                editData.startDate
                                  ? dayjs(editData.startDate)
                                  : null
                              } // ✅ Convert string to dayjs
                              onChange={(date, dateString) =>
                                setEditData({
                                  ...editData,
                                  startDate: dateString,
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="End Date">
                            <DatePicker
                              style={{ width: "100%" }}
                              format="YYYY-MM-DD"
                              name="endDate"
                              value={
                                editData.endDate
                                  ? dayjs(editData.endDate)
                                  : null
                              } // ✅ Convert string to dayjs
                              onChange={(date, dateString) =>
                                setEditData({
                                  ...editData,
                                  endDate: dateString,
                                })
                              }
                            />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item label="Vans">
                            <Select
                              mode="multiple"
                              value={editData.vans}
                              placeholder="Select Van"
                              allowClear
                              onChange={(value) =>
                                handleMultiSelectChange(value, "vans")
                              }
                              options={[
                                { value: "BharatBenz", label: "BharatBenz" },
                                { value: "Force", label: "Force" },
                                { value: "TATA", label: "TATA" },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item label="Clinic Services">
                            <Select
                              mode="multiple"
                              placeholder="Select services"
                              allowClear
                              value={editData.specialties} // ✅ Now contains only IDs
                              onChange={(value) =>
                                handleMultiSelectChange(value, "specialties")
                              }
                              options={specialtiesOptions} // Options from API
                            />
                          </Form.Item>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end">
                        <Button
                          variant="outlined"
                          onClick={() => setIsEditing(false)}
                          className="me-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          className="bg-primary"
                          type="primary"
                          variant="primary"
                          onClick={handleSave}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <Row>
                        <Col md={6}>
                          <p>
                            <strong>Location:</strong> {location}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p>
                            <strong>City:</strong> {city}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p>
                            <strong>Start Date:</strong>{" "}
                            {new Date(startDate).toLocaleDateString()}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p>
                            <strong>End Date:</strong>{" "}
                            {new Date(endDate).toLocaleDateString()}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p>
                            <strong>Vans:</strong> {vans?.join(", ") || "N/A"}
                          </p>
                        </Col>
                        <Col md={6}>
                          <p>
                            <strong>Clinic Services:</strong>{" "}
                            {specialties
                              ?.map((s) => s.departmentName)
                              .join(", ")}
                          </p>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end mt-3">
                        <Tooltip
                          zIndex={1000}
                          title={
                            new Date(startDate) <
                              new Date() - 7 * 24 * 60 * 60 * 1000 &&
                            !userRoles.includes("admin")
                              ? "Permission denied, You can only edit camps that are created today or within 7 days, To edit contact admin "
                              : "Edit camp details"
                          }
                          placement="top"
                          color="#0a58b8"
                        >
                          <Button
                            type="primary"
                            className="bg-primary"
                            disabled={
                              new Date(startDate) <
                                new Date() - 7 * 24 * 60 * 60 * 1000 &&
                              !userRoles.includes("admin")
                            }
                            onClick={() => setIsEditing(true)}
                          >
                            Edit Details
                          </Button>
                        </Tooltip>
                      </div>
                    </>
                  )}
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row className="mb-4 w-full">
        <Col xs={12} md={12} lg={12}>
          <CampAnalytics
            patients={patients}
            analytics={campData?.analytics}
            serviceTabs={campData?.specialties?.map(
              (service) => service?.departmentName
            )}
          />
        </Col>
      </Row>

      {/* Patients Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Patients Attended</h5>
            </Card.Header>
            <Card.Body>
              <AntdTable
                columns={newPatientColumns}
                data={patients}
                pageSizeOptions={[50, 100, 150, 200]}
                defaultPageSize={50}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Staff Section */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Staff</h5>
            </Card.Header>
            <Card.Body>
              <AntdTable
                columns={newStaffColumns}
                data={users}
                pageSizeOptions={[50, 100, 150, 200]}
                defaultPageSize={50}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CampDetails;

const CampAnalytics = ({ patients, analytics, serviceTabs = [] }) => {
  console.log("analytics in camp page --> ", analytics);
  const serviceCounts = patients.reduce((acc, patient) => {
    const service = patient.serviceTaken;
    if (service) {
      acc[service] = (acc[service] || 0) + 1;
    }
    return acc;
  }, {});

  const doctorWiseData = analytics.dentistryAnalytics.doctorWiseData;

  const doctorWiseEarnings = Object.keys(doctorWiseData).map((doctor) => ({
    doctor,
    patientsTreated: doctorWiseData[doctor].patientsTtreated,
    totalEarnings: doctorWiseData[doctor].totalEarnings,
    onlineEarnings: doctorWiseData[doctor].onlineEarnings,
    offlineEarnings: doctorWiseData[doctor].offlineEarnings,
    treatmentStatuses: doctorWiseData[doctor].treatmentStatuses,
  }));

  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#33FFF6",
    "#F633FF",
    "#FF9633",
    "#F6FF33",
    "#33F6FF",
    // You can add more colors as needed.
  ];

  const doctorWiseEarningsData = useMemo(() => {
    return {
      labels: doctorWiseEarnings.map((data) => data.doctor),
      datasets: [
        {
          data: doctorWiseEarnings.map(
            (data) => data.onlineEarnings + data.offlineEarnings
          ),
          backgroundColor: colors.slice(0, doctorWiseEarnings.length),
        },
      ],
    };
  }, [doctorWiseEarnings]);

  return (
    <Card className="shadow-sm mb-4">
      <Card.Header>
        <h5>Camp Analytics</h5>
      </Card.Header>
      <Card.Body>
        <Row>
          <div className="d-flex justify-content-end text-right">
            <Col xs={12} md={3} lg={2}>
              {/* <p className="text-decoration-underline">
                Total Patients Registered:{" "}
                <strong> {analytics?.totalPatients}</strong>
              </p> */}
              <p className="text-decoration-underline card-title">
                Total Patients Registered:{" "}
                <strong> {analytics?.totalAttended}</strong>
              </p>
              {/* <p className="text-decoration-underline">
                Camp missed Patients: <strong> {analytics?.missed}</strong>
              </p> */}
            </Col>
          </div>
        </Row>

        <Tabs
          defaultActiveKey="1"
          size="large"
          style={{
            marginBottom: 32,
          }}
          items={serviceTabs?.map((_, i) => {
            const id = String(i + 1);
            return {
              label: `${_}`,
              key: id,
              children:
                _ === "Dentistry" ? (
                  <DentistryAnalytics
                    dentistryAnalytics={analytics?.dentistryAnalytics}
                  />
                ) : _ === "Mammography" ? (
                  <MammographyAnalytics
                    mammoAnalytics={analytics?.mammoAnalytics}
                  />
                ) : _ === "GP" ? (
                  <GPAnalytics gpAnalytics={analytics?.gpAnalytics} />
                ) : (
                  `Comming Soon ...`
                ),
            };
          })}
        />

        {/* <Row className="mt-4">
          <Col xs={12} md={6}>
            <h6>Dentistry Analytics</h6>
            <p>
              <strong>Total Dentistry Patients:</strong>{" "}
              {analytics.dentistryAnalytics.totalDentistryPatients}
            </p>
            <p>
              <strong>Total Attended:</strong>{" "}
              {analytics.dentistryAnalytics.totalAttended}
            </p>
            <p>
              <strong>Missed:</strong> {analytics.dentistryAnalytics.missed}
            </p>
            <p>
              <strong>OPD:</strong> {analytics.dentistryAnalytics.opdPatients}
            </p>
            <p>
              <strong>Total Treatments:</strong>{" "}
              {analytics.dentistryAnalytics.totalTreatments}
            </p>
            <p>
              <strong>Crown treatment earnings:</strong>{" "}
              {analytics.dentistryAnalytics.crownEarnings}
            </p>
            <p>
              <strong>Total Earnings:</strong>{" "}
              {analytics.dentistryAnalytics.totalEarnings}
            </p>
            <p>
              <strong>Online :</strong>{" "}
              {analytics.dentistryAnalytics.onlineEarnings}
            </p>
            <p>
              <strong>Cash:</strong>{" "}
              {analytics.dentistryAnalytics.offlineEarnings}
            </p>
          </Col>

          <Col xs={12} md={6}>
            <h6>Doctor Wise Earnings</h6>
            <div
              style={{
                width: "100%",
                maxWidth: "400px",
                height: "400px",
                overflow: "hidden",
              }}
            >
              <Pie data={doctorWiseEarningsData} />
            </div>
          </Col>
        </Row> */}
      </Card.Body>
    </Card>
  );
};
