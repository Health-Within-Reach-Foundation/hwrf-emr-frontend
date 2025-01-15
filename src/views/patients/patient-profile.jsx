import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  Modal,
  Alert,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Drawer, Input, TreeSelect, Select } from "antd"; // Import TreeSelect from antd
// import Select from "react-select";
import { useParams } from "react-router-dom";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";
import CustomTable from "../../components/custom-table";
import toast from "react-hot-toast";
import PatientDiagnosisForm from "../../components/patient-diagnosis-form";
import PatientTreatmentForm from "../../components/patient-treatment-form";

const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [openTreatmentDrawer, setOpenTreatmentDrawer] = useState(false);

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordForm, setRecordForm] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [editingPatient, setEditingPatient] = useState(false);

  // Define columns for CustomTable
  const columns = [
    {
      title: "Appointment Date",
      data: "appointmentDate",
      render: (data) => new Date(data).toLocaleDateString(),
    },
    {
      title: "Status",
      data: "status",
      render: (data) => data.charAt(0).toUpperCase() + data.slice(1), // Capitalize first letter
    },
    // {
    //   title: "Actions",
    //   data: null,
    //   render: (_, record) => (
    //     <Button
    //       variant="primary"
    //       onClick={() => handleOpenDrawer(record, hasMedicalRecord(record))}
    //     >
    //       {hasMedicalRecord(record) ? "Edit Record" : "Add Record"}
    //     </Button>
    //   ),
    // },
  ];

  const dentistryColumns = [
    {
      title: "Diagnosis date",
      data: "createdAt",
      // render: (data) => new Date(data).toLocaleDateString(),
      render: (data, row) => {
        // console.log(data, row);
        return (
          <a href={`/patient/patient-profile/${row.patientId}/${row.id}`} className="">
            {new Date(data).toLocaleDateString()}
          </a>
        );
      },
    },
    {
      title: "Complaints",
      data: "complaints",
      // render: (data) => data?.join(", "),
      render: (data, row) => {
        // console.log(data, row);
        return (
          <a href={`/patient/patient-profile/${row.patientId}/${row.id}`} className="">
            {data?.join(", ")}
          </a>
        );
      },
    },
    {
      title: "View Diagnosis",
      data: null,
      render: (_, record) => {
        // console.log(record);
        return (
          <Button
            size="sm"
            variant="primary"
            onClick={() => handleOpenDrawer(record, true)}
          >
            View/Edit
          </Button>
        );
      },
    },
  ];

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getPatientDetailsById(
        id,
        user?.specialties[0]?.id
      );
      const { data } = response;
      console.log("patient profile data with medical records -->", data);
      setPatientData(data);
      setAppointments(data.appointments);
      setMedicalRecords(data.medicalRecords || []);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDrawer = (diagnosis, editMode) => {
    setIsEdit(editMode);
    setSelectedDiagnosis(editMode ? diagnosis : null);
    setDrawerVisible(true);
  };
  const handleInputChange = (key, value) => {
    setPatientData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSavePatientData = async () => {
    // const patientBody = { patientData };
    const patientBody = {
      name: patientData.name,
      address: patientData.address,
      age: patientData.age,
      sex: patientData.sex,
      mobile: patientData.mobileNumber,
    };
    try {
      const response = await patientServices.updatePatientDetails(
        id,
        patientBody
      );
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Error while updating patient !");
    }
  };

  const handleSaveRecord = async () => {
    try {
      setLoading(true);
      // Logic for saving record
      fetchPatientData();
      setDrawerVisible(false);
    } catch (error) {
      console.error("Error saving record:", error);
    } finally {
      setLoading(false);
    }
  };

  const createEmptyRecord = () => ({
    complaints: [],
    treatment: [],
    dentalQuadrant: [],
    xrayStatus: false,
    file: null,
    status: "",
    notes: "",
    billing: { totalCost: 0, paid: 0, remaining: 0 },
  });

  const hasMedicalRecord = (appointment) =>
    medicalRecords.some((rec) => rec.appointmentId === appointment.id);

  useEffect(() => {
    fetchPatientData();
  }, [id]);

  if (loading) return <Loading />;
  if (!patientData) return <Alert variant="danger">Patient not found</Alert>;

  const handleAddDiagnosis = () => {
    setRecordForm({}); // Clear the form for a new diagnosis
    setDrawerVisible(true);
  };

  return (
    <Container>
      {/* Patient Basic Details */}
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <h4>Patient Profile</h4>
              <Button
                variant="primary"
                onClick={() => setEditingPatient(!editingPatient)}
              >
                {editingPatient ? "Cancel Edit" : "Edit Profile"}
              </Button>
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
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Mobile</Form.Label>
                      <Form.Control
                        disabled={!editingPatient}
                        value={patientData.mobile}
                        onChange={(e) =>
                          handleInputChange("mobile", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("age", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
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
        </Col>
      </Row>
      {/* Patient Basic Details */}

      <Card>
        <Card.Header>
          <h4>Patient Medical Records</h4>
        </Card.Header>
        <Card.Body>
          <Tabs defaultActiveKey="dentistry">
            {/* Dentistry Tab */}
            <Tab eventKey="dentistry" title="Dentistry">
              <h5 className="mt-3">Diagnoses</h5>

              <Button
                variant="primary"
                // className="float-end"
                onClick={() => handleOpenDrawer(null, false)}
              >
                Add Diagnosis
              </Button>
              <CustomTable
                columns={dentistryColumns}
                data={patientData?.diagnoses}
                enableFilters={false}
              />
            </Tab>

            {/* GP Tab */}
            <Tab eventKey="gp" title="GP">
              <h5 className="mt-3">General Practice Content</h5>
              <p>Coming soon...</p>
            </Tab>

            {/* Mammography Tab */}
            <Tab eventKey="mammography" title="Mammography">
              <h5 className="mt-3">Mammography Content</h5>
              <p>Coming soon...</p>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>

      {/* <Row className="mt-4">
        <Col>
          <CustomTable columns={columns} data={appointments} />
        </Col>
      </Row> */}

      {/* Patient Diagnosis Form Drawer */}
      <PatientDiagnosisForm
        isEdit={isEdit}
        drawerVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        diagnosisData={selectedDiagnosis}
        patientData={patientData}
        onSave={() => {}}
      />

      {/* <PatientTreatmentForm
        drawerVisible={openTreatmentDrawer}
        onClose={() => setOpenTreatmentDrawer(false)}
        treatmentData={patientData?.treatments || []}
        onSave={() => {}}
      /> */}
    </Container>
  );
};

export default PatientProfile;
