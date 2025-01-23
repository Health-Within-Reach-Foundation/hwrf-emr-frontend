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
  Accordion,
} from "react-bootstrap";
import { Drawer, Input, TreeSelect, Select, Checkbox } from "antd"; // Import TreeSelect from antd
// import Select from "react-select";
import { useParams } from "react-router-dom";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";
import CustomTable from "../../components/custom-table";
import toast from "react-hot-toast";
import PatientDiagnosisForm from "../../components/patients/patient-diagnosis-form";
import { dentalQuadrant } from "../../utilities/utility-function";
import DateCell from "../../components/date-cell";
import SelectedDiagnosisTreatementDetaiils from "../../components/patients/diagnosis-treatment";
import BasicPatientProfile from "../../components/patients/basic-patient-profile";
import clinicServices from "../../api/clinic-services";
import MammoReportLexical from "../../components/mammography/mammography-report";
import MammoMedicalHistory from "../../components/mammography/mammography-medical-history";
const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  // const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [medicalRecords, setMedicalRecords] = useState([]);
  const [recordForm, setRecordForm] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [editingPatient, setEditingPatient] = useState(false);
  const [selectedDiagnosisRow, setSelectedDiagnosisRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [checkedRow, setCheckedRow] = useState(null); // Track a single selected row
  const [categorizedDiagnoses, setCategorizedDiagnoses] = useState({});
  const [allDiagnoses, setAllDiagnoses] = useState([]);
  const [allTreatments, setAllTreatments] = useState([]);

  // const handleCheckboxChange = (record) => {
  //   setCheckedRow((prev) => (prev === record.id ? null : record.id)); // Toggle or select a new row
  //   setSelectedDiagnosisRow(record);
  // };

  const handleCheckboxChange = (record, e) => {
    console.log("e -->", e);
    setSelectedDiagnosisRow(record);
    setCheckedRow((prev) => (prev === record.id ? null : record.id)); // Toggle selection
    if (e?.target?.checked === false) {
      setCheckedRow(null);
      const treatments = patientData.diagnoses.flatMap(
        (diagnosis) => diagnosis.treatments
      );
      setAllTreatments(treatments);
    } else {
      if (record) {
        // Filter treatments based on the selected diagnosis
        const treatments = patientData.diagnoses
          .filter((diag) => diag.id === record.id)
          .flatMap((diag) => diag.treatments);
        setAllTreatments(treatments); // Update filtered treatments
      }
      // } else {
      //   const treatments = allDiagnoses.flatMap((diagnosis) => diagnosis.treatments);
      //   setAllTreatments(treatments); // Show all treatments if no diagnosis is selected
      // }
    }
  };

  const dentistryColumns = [
    {
      title: "",
      data: null,
      render: (data, record) => {
        return (
          <Checkbox
            checked={checkedRow === record.id} // Link checkbox to the tracked row
            onChange={(e) => handleCheckboxChange(record, e)}
          />
        );
      },
    },
    {
      title: "Diagnosis date",
      data: "createdAt",
      render: (data, record) => {
        return <DateCell date={new Date(data)} dateFormat="D MMM, YYYY" />;
      },
    },
    // {
    //   title: "Dental Quadrant",
    //   data: "selectedTeeth",
    //   // render: (data) => new Date(data).toLocaleDateString(),
    //   render: (data, record) => {
    //     // console.log(data, row);
    //     return (
    //       <div

    //       // className="cursor-pointer"
    //       // onClick={() => handleSelectDiagnosisRow(record)}
    //       >
    //         {dentalQuadrant(data?.toString().charAt(0))}
    //       </div>
    //     );
    //   },
    // },
    {
      title: "Tooth Number",
      data: "selectedTeeth",
      // render: (data) => new Date(data).toLocaleDateString(),
      render: (data, record) => {
        // console.log(data, row);
        return (
          <div
          // className="cursor-pointer"
          // onClick={() => handleSelectDiagnosisRow(record)}
          >
            {data}
          </div>
        );
      },
    },
    {
      title: "Complaints",
      data: "complaints",
      // render: (data) => data?.join(", "),
      render: (data, record) => {
        // console.log(data, row);
        return (
          <div
          // className="cursor-pointer"
          // onClick={() => handleSelectDiagnosisRow(record)}
          >
            {data?.join(", ")}
          </div>
        );
      },
    },
    {
      title: "Suggested Treatment",
      data: "treatmentSuggested",
      // render: (data) => data?.join(", "),
      render: (data, record) => {
        // console.log(data, row);
        return (
          <div
          // className="cursor-pointer"
          // onClick={() => handleSelectDiagnosisRow(record)}
          >
            {data}
          </div>
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

      setAllDiagnoses(data?.diagnoses);

      if (data.diagnoses.length > 0) {
        // Transform diagnoses to replicate rows for each treatmentSuggested
        const replicatedDiagnoses = data.diagnoses.flatMap((diagnosis) =>
          diagnosis.treatmentsSuggested.map((treatment) => ({
            ...diagnosis,
            treatmentSuggested: treatment, // Include the specific treatment in each row
          }))
        );

        setAllDiagnoses(replicatedDiagnoses); // Save the replicated data
        setAllTreatments(
          data?.diagnoses?.flatMap((diagnosis) => diagnosis?.treatments || [])
        );

        console.log("Replicated Diagnoses: ", replicatedDiagnoses);
      }

      setSelectedDiagnosisRow(null);
      setCheckedRow(null);
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

  // const handleSelectDiagnosisRow = (record) => {
  //   setSelectedDiagnosisRow(record);
  // };

  const handleSavePatientData = async (primaryDoctor = null) => {
    // const patientBody = { patientData };
    const patientBody = {
      name: patientData.name,
      address: patientData.address,
      age: patientData.age,
      sex: patientData.sex,
      mobile: patientData.mobileNumber,
    };
    if (primaryDoctor) {
      patientBody.primaryDoctor = primaryDoctor;
    }
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
  const getUsersbyClinic = async () => {
    setLoading(true);
    try {
      const response = await clinicServices.getUsersByClinic();
      const formattedUsers = response.data
        .filter((eachUser) => {
          return eachUser?.roles
            ?.map((role) => role?.roleName)
            ?.includes("doctor");
        })
        .map((user) => ({
          value: user.id,
          label: user.name,
          phoneNumber: user.phoneNumber,
        }));
      setUsers(formattedUsers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const createEmptyRecord = () => ({
    complaints: [],
    treatmentsSuggested: [],
    dentalQuadrant: [],
    xrayStatus: false,
    file: null,
    status: "",
    notes: "",
    billing: { totalCost: 0, paid: 0, remaining: 0 },
  });

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
    fetchPatientData();
    getUsersbyClinic();
    getSpecialtyDepartmentsByClinic();
  }, [id]);

  if (loading) return <Loading />;

  if (!patientData) return <Alert variant="danger">Patient not found</Alert>;

  return (
    <Container>
      {/* Patient Basic Details */}
      <Row>
        <Col>
          <BasicPatientProfile
            patientData={patientData}
            handleSavePatientData={handleSavePatientData}
            setPatientData={setPatientData}
          />
        </Col>
      </Row>
      {/* Patient Basic Details */}

      <Card>
        <Card.Header>
          <h4>Patient Medical Records</h4>
        </Card.Header>
        <Card.Body>
          <Tabs
            defaultActiveKey="dentistry"
            className="border-bottom mb-3"
            justify
            variant="underline"
          >
            {/* Dentistry Tab */}
            {departmentList
              .map((eachDepartment) => eachDepartment.label)
              .includes("Dentistry") && (
              <Tab eventKey="dentistry" title="Dentistry">
                <label htmlFor="primary-doc" className="form-label">
                  Primary Doctor
                </label>
                <Select
                  placeholder="Select Doctor"
                  className="w-100 mb-3"
                  options={users}
                  defaultValue={patientData?.primaryDoctor?.value}
                  onChange={(value, option) => {
                    // handleInputChange("primaryDoctor", );
                    handleSavePatientData(option);
                  }}
                  filterOption={(input, option) => {
                    const labelMatch = option.label
                      .toLowerCase()
                      .includes(input.toLowerCase());
                    const phoneMatch = option.phoneNumber
                      ? option.phoneNumber
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      : false;
                    return labelMatch || phoneMatch;
                  }}
                />{" "}
                <Card>
                  <Card.Header>
                    <h5 className="mt-3">Diagnoses</h5>
                  </Card.Header>
                  <Card.Body>
                    <Button
                      variant="primary"
                      size="sm"
                      className="my-3"
                      onClick={() => handleOpenDrawer(null, false)}
                    >
                      Add Diagnosis
                    </Button>

                    <div className="d-flex flex-column">
                      <CustomTable
                        columns={dentistryColumns}
                        data={allDiagnoses}
                        // data={categorizedDiagnoses}
                        enableSearch={false}
                        enableFilters={false}
                      />
                    </div>
                  </Card.Body>
                </Card>
                {/* {selectedDiagnosisRow && ( */}
                {/* <Card>
                  <Card.Header>
                    <h5 className="mt-4">Treatments Settings</h5>
                  </Card.Header>
                  <Card.Body>
                    <SelectedDiagnosisTreatementDetaiils
                      treatementsRows={allTreatments}
                      diagnosisData={selectedDiagnosisRow}
                      patientData={patientData}
                      fetchPatientData={fetchPatientData}
                    />
                  </Card.Body>
                </Card> */}
                {/* )} */}
              </Tab>
            )}

            {/* GP Tab */}
            {departmentList
              .map((eachDepartment) => eachDepartment.label)
              .includes("GP") && (
              <Tab eventKey="gp" title="GP">
                <h5 className="mt-3">General Practice Content</h5>
                <p>Coming soon...</p>
              </Tab>
            )}
            {/* Mammography Tab */}

            {departmentList
              .map((eachDepartment) => eachDepartment.label)
              .includes("Mammography") && (
              <Tab eventKey="mammography" title="Mammography">
                {/* <MammoReportLexical patient={patientData}/> */}
                <MammoMedicalHistory patient={patientData}/>
              </Tab>
            )}
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
        onSave={() => fetchPatientData()}
      />
    </Container>
  );
};

export default PatientProfile;
