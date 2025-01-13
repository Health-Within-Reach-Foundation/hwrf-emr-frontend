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
} from "react-bootstrap";
import { Drawer, Input, TreeSelect, Select } from "antd"; // Import TreeSelect from antd
// import Select from "react-select";
import { useParams } from "react-router-dom";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";
import CustomTable from "../../components/custom-table";
import toast from "react-hot-toast";

const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
    {
      title: "Actions",
      data: null,
      render: (_, record) => (
        <Button
          variant="primary"
          onClick={() => handleOpenDrawer(record, hasMedicalRecord(record))}
        >
          {hasMedicalRecord(record) ? "Edit Record" : "Add Record"}
        </Button>
      ),
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

  const handleOpenDrawer = (appointment, isEditMode) => {
    setSelectedAppointment(appointment);
    setIsEdit(isEditMode);
    if (isEditMode) {
      const record = medicalRecords.find(
        (rec) => rec.appointmentId === appointment.id
      );
      setRecordForm(record || createEmptyRecord());
    } else {
      setRecordForm(createEmptyRecord());
    }
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

  const dentalQuadrantOptions = [
    {
      title: "Upper Left",
      value: "upperLeft",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `upperLeft-tooth${i + 1}`,
      })),
    },
    {
      title: "Upper Right",
      value: "upperRight",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `upperRight-tooth${i + 1}`,
      })),
    },
    {
      title: "Lower Left",
      value: "lowerLeft",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `lowerLeft-tooth${i + 1}`,
      })),
    },
    {
      title: "Lower Right",
      value: "lowerRight",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `lowerRight-tooth${i + 1}`,
      })),
    },
  ];

  return (
    <Container>
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
                      console.log("Updated Patient Data: ", patientData);
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

      <Row className="mt-4">
        <Col>
          <CustomTable columns={columns} data={appointments} />
        </Col>
      </Row>

      <Drawer
        title={isEdit ? "Edit Medical Record" : "Add Medical Record"}
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width={600}
      >
        <Form>
          <label>Patient Name </label>
          <Input placeholder="Name of the patient" disabled />
          <Form.Group>
            <Form.Label>Patient Complaints</Form.Label>
            <Select
              mode="multiple"
              options={[
                { value: "toothAche", label: "Tooth Ache" },
                { value: "toothMissing", label: "Tooth Missing" },
                { value: "badBreath", label: "Bad Breath" },
              ]}
              value={recordForm?.complaints}
              onChange={(value) =>
                setRecordForm((prev) => ({ ...prev, complaints: value }))
              }
              className="w-100"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Treatment</Form.Label>
            <Select
              mode="multiple"
              options={[
                { value: "scalingRegular", label: "Scaling Regular" },
                { value: "scalingComplex", label: "Scaling Complex" },
                { value: "rcSimple", label: "RC Simple" },
              ]}
              value={recordForm?.treatment}
              onChange={(value) =>
                setRecordForm((prev) => ({ ...prev, treatment: value }))
              }
              className="w-100"
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Dental Quadrant</Form.Label>
            <TreeSelect
              treeData={dentalQuadrantOptions}
              value={recordForm?.dentalQuadrant}
              onChange={(value) =>
                setRecordForm((prev) => ({ ...prev, dentalQuadrant: value }))
              }
              treeCheckable={true}
              showCheckedStrategy={TreeSelect.SHOW_PARENT}
              placeholder="Please select"
              style={{ width: "100%" }}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="X-ray Status"
              checked={recordForm?.xrayStatus}
              onChange={(e) =>
                setRecordForm((prev) => ({
                  ...prev,
                  xrayStatus: e.target.checked,
                }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setRecordForm((prev) => ({ ...prev, file: e.target.files[0] }))
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Current Status</Form.Label>
            <Select
              mode="multiple"
              value={recordForm?.status}
              onChange={(value) =>
                setRecordForm((prev) => ({ ...prev, status: value }))
              }
              placeholder="Select Status"
              style={{ width: "100%" }}
              options={[
                { value: "completed", label: "Completed" },
                { value: "pending", label: "Pending" },
                { value: "cancelled", label: "Cancelled" },
              ]}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Notes</Form.Label>
            <Form.Control
              as="textarea"
              value={recordForm?.notes}
              onChange={(e) =>
                setRecordForm((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Cost</Form.Label>
            <Form.Control
              type="number"
              value={recordForm?.billing.totalCost}
              onChange={(e) =>
                setRecordForm((prev) => ({
                  ...prev,
                  billing: { ...prev.billing, totalCost: e.target.value },
                }))
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Paid</Form.Label>
            <Form.Control
              type="number"
              value={recordForm?.billing.paid}
              onChange={(e) =>
                setRecordForm((prev) => ({
                  ...prev,
                  billing: { ...prev.billing, paid: e.target.value },
                }))
              }
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Remaining</Form.Label>
            <Form.Control
              type="number"
              value={recordForm?.billing.remaining}
              onChange={(e) =>
                setRecordForm((prev) => ({
                  ...prev,
                  billing: { ...prev.billing, remaining: e.target.value },
                }))
              }
            />
          </Form.Group>
          {/* Add the rest of the form fields */}
          <Button className="mt-3" onClick={handleSaveRecord}>
            {isEdit ? "Update Record" : "Add Record"}
          </Button>
        </Form>
      </Drawer>
    </Container>
  );
};

export default PatientProfile;
