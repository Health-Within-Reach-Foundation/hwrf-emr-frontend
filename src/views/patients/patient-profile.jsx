import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import { Select  } from "antd"; // Import TreeSelect from antd
import { useParams } from "react-router-dom";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";
import CustomTable from "../../components/custom-table";
import toast from "react-hot-toast";
import PatientDiagnosisForm from "../../components/patients/patient-diagnosis-form";
import DateCell from "../../components/date-cell";
import BasicPatientProfile from "../../components/patients/basic-patient-profile";
import clinicServices from "../../api/clinic-services";
import { transformText } from "../../utilities/utility-function";
import { RiAddLine } from "@remixicon/react";
import campManagementService from "../../api/camp-management-service";
import CurrentCampDetailsHeader from "../../components/camp/currentcamp-detail-header";
import MammoMedicalHistory from "../../components/mammography/mammography-medical-history";

const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // const [loading, setLoading] = useState(true);
  const [patientLoading, setPatientLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [campLoading, setCampLoading] = useState(true);
  const { user, userRoles } = useAuth();
  const [selectedDiagnosisRow, setSelectedDiagnosisRow] = useState(null);
  const [users, setUsers] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [checkedRow, setCheckedRow] = useState(null); // Track a single selected row
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
      setCheckedRow(null)
      const treatments = patientData.diagnoses.flatMap((diagnosis) => diagnosis.treatments);
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
    // {
    //   title: "",
    //   data: null,
    //   render: (data, record) => {
    //     return (
    //       <Checkbox
    //         checked={checkedRow === record.id} // Link checkbox to the tracked row
    //         onChange={(e) => handleCheckboxChange(record, e)}
    //       />
    //     );
    //   },
    // },
    {
      title: "Diagnosis date",
      data: "createdAt",
      render: (data, record) => {
        const status = record?.treatment?.status;
        return (
          <DateCell
            date={new Date(data)}
            dateFormat="D MMM, YYYY"
            className={
              status === "started"
                ? "bg-info-subtle p-1 text-black"
                : status === "completed"
                ? "bg-success-subtle p-1 text-black"
                : ""
            }
          />
        );
      },
    },
    {
      title: "Tooth Number",
      data: "selectedTeeth",
      render: (data, record) => {
        const status = record?.treatment?.status;
        return (
          <div
            className={
              status === "started"
                ? "bg-info-subtle p-1 text-black"
                : status === "completed"
                ? "bg-success-subtle p-1 text-black"
                : ""
            }
          >
            {data}
          </div>
        );
      },
    },
    {
      title: "Complaints",
      data: "complaints",
      render: (data, record) => {
        const status = record?.treatment?.status;
        return (
          <div
            className={
              status === "started"
                ? "bg-info-subtle p-1 text-black"
                : status === "completed"
                ? "bg-success-subtle p-1 text-black"
                : ""
            }
          >
            {data?.join(", ")}
          </div>
        );
      },
    },
    {
      title: "Suggested Treatment",
      data: "treatmentSuggested",
      render: (data, record) => {
        const status = record?.treatment?.status;

        return (
          <div
            className={
              status === "started"
                ? "bg-info-subtle p-1 text-black"
                : status === "completed"
                ? "bg-success-subtle p-1 text-black"
                : ""
            }
          >
            {data}
          </div>
        );
      },
    },
    {
      title: "Treatment Progress",
      data: "treatmentSuggested",
      render: (data, record) => {
        const status = record?.treatment?.status;

        return (
          <div
            className={
              status === "started"
                ? "bg-info-subtle p-1 text-black"
                : status === "completed"
                ? "bg-success-subtle p-1 text-black"
                : ""
            }
          >
            {record.treatment === null
              ? "Not Started"
              : transformText(record?.treatment?.status)}
          </div>
        );
      },
    },
    {
      title: "View Diagnosis",
      data: null,
      render: (data, record) => {
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
      setPatientLoading(true);
      const response = await patientServices.getPatientDetailsById(
        id,
        user?.specialties[0]?.id
      );
      const { data } = response;
      console.log("patient profile data with medical records -->", data);
      setPatientData(data);
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
        if (selectedDiagnosis !== null) {
          console.log("old", selectedDiagnosis);
          setSelectedDiagnosis(
            data.diagnoses.find(
              (dignosis) => dignosis?.id === selectedDiagnosis.id
            )
          );
        } else {
          setDrawerVisible(false);
        }
      }

      // setSelectedDiagnosisRow(null);
      setCheckedRow(null);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setPatientLoading(false);
    }
  };

  const handleOpenDrawer = (diagnosis, editMode) => {
    setIsEdit(editMode);
    setSelectedDiagnosis(editMode ? diagnosis : null);
    setDrawerVisible(true);
  };

  const handleSavePatientData = async (primaryDoctor = null) => {
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
    setUsersLoading(true);
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
      setUsersLoading(false);
    }
  };

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setCampLoading(true);
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
      setCampLoading(false);
    }
  };

  const fetchCampDetails = async () => {
    try {
      setCampLoading(true);
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
      setCampLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
    getUsersbyClinic();
    if (userRoles.includes("admin")) {
      getSpecialtyDepartmentsByClinic();
    } else {
      fetchCampDetails();
    }
  }, []);

  // if (patientData === null)
  //   return <Alert variant="danger my-3">Patient not found</Alert>;

  if (patientLoading || usersLoading || campLoading) return <Loading />;

  return (
    <Container>
      {/* Patient Basic Details */}
      <CurrentCampDetailsHeader />

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
            fill
            transition={true}
          >
            {/* Dentistry Tab */}
            {departmentList
              .map((eachDepartment) => eachDepartment.label)
              .includes("Dentistry") && (
                <Tab eventKey="dentistry" title="Dentistry" >
                <label htmlFor="primary-doc" className="form-label">
                  Primary Doctor
                </label>
                <Select
                  placeholder="Select Doctor"
                  className="w-100 mb-3"
                  options={users}
                  value={patientData?.primaryDoctor?.value}
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
                    <div className="d-flex justify-content-end">
                      <Button
                        variant="primary"
                        size="sm"
                        className="my-3"
                        onClick={() => handleOpenDrawer(null, false)}
                      >
                        <RiAddLine />
                        Add Diagnosis
                      </Button>
                    </div>
                    <div className="d-flex flex-column diagnoses-table">
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
                <MammoMedicalHistory
                  patient={patientData?.mammography}
                  onSave={fetchPatientData}
                  patientId={patientData?.id}
                  readOnly={patientData?.mammography ? true : false}
                />
                
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
        doctorsList={users}
        onSave={() => fetchPatientData()}
      />
    </Container>
  );
};

export default PatientProfile;
