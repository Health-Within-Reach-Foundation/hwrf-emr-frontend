import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Tabs, Tab } from "react-bootstrap";
import { Select } from "antd"; // Import TreeSelect from antd
import { useParams } from "react-router-dom";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";
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
import AntdTable from "../../components/antd-table";
import GPMedicalRecord from "../../components/general-physician/gp-medical-record";
import formFieldsServices from "../../api/form-fields.services";

const PatientProfile = () => {
  const { id } = useParams();
  const [patientData, setPatientData] = useState(null);
  const [dentalCosting, setDentalCosting] = useState({
    totalAmount: 0,
    remainingAmount: 0,
    paidAmount: 0,
  });
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [patientLoading, setPatientLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [campLoading, setCampLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const { user, userRoles } = useAuth();
  const [users, setUsers] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);
  const [allDiagnoses, setAllDiagnoses] = useState([]);
  const [activeTab, setActiveTab] = useState("dentistry");
  const [options, setOptions] = useState({
    complaintsOptions: [],
    treatmentsSuggestedOptions: [],
    treatmentStatusOptions: [],
  });

  const newDenistryColumns = [
    {
      title: "Diagnosis date",
      dataIndex: "createdAt",
      key: "createdAt",
      sortable: true,
      render: (text) => (
        <DateCell date={new Date(text)} dateFormat="D MMM, YYYY" />
      ),
    },
    {
      title: "Tooth Number",
      dataIndex: "selectedTeeth",
      width: 140,
      key: "selectedTeeth",
      render: (text) => text,
    },
    {
      title: "Complaints",
      dataIndex: "complaints",
      key: "complaints",
      sortable: true,
      render: (text) => (
        <span title={text?.join(", ")}>{text?.join(", ")}</span>
      ),
    },
    {
      title: "Suggested Treatment",
      sortable: true,
      ellipsis: false,
      dataIndex: "treatmentsSuggested",
      width: 200,
      key: "treatmentsSuggested",
      render: (text) => (
        <span title={text?.join(", ")}>{text?.join(", ")}</span>
      ),
    },
    {
      title: "Treatment Progress",
      dataIndex: "treatmentStatus",
      width: 200,
      filters: [
        { text: "Not Started", value: "not started" },
        { text: "Started", value: "started" },
        { text: "Completed", value: "completed" },
      ],
      onFilter: (value, record) => record?.treatment?.status === value,
      key: "treatmentStatus",
      render: (text, record) => {
        return <span>{transformText(record?.treatment?.status)}</span>;
      },
    },
    {
      title: "View Diagnosis",
      dataIndex: null,
      key: "viewDiagnosis",
      // fixed: "right",
      render: (_, record) => (
        <Button
          size="sm"
          variant="primary"
          onClick={() => handleOpenDrawer(record, true)}
        >
          View/Edit
        </Button>
      ),
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
      console.log("patient profile data-->", data);
      setPatientData(data);
      if (data.diagnoses.length > 0) {
        data.diagnoses.map((diagnosis) => {
          diagnosis.key = diagnosis.id;
          return diagnosis;
        });

        setAllDiagnoses(data.diagnoses); // Save the original diagnoses data
        // Transform diagnoses to replicate rows for each treatmentSuggested
        // const replicatedDiagnoses = data.diagnoses.flatMap((diagnosis) =>
        //   diagnosis.treatmentsSuggested.map((treatment) => ({
        //     ...diagnosis,
        //     treatmentSuggested: treatment, // Include the specific treatment in each row
        //     treatmentStatus: diagnosis.treatment?.status,
        //   }))
        // );
        // setAllDiagnoses(replicatedDiagnoses); // Save the replicated data

        const totalAmount = data.diagnoses.reduce((acc, curr) => {
          if (curr.treatment.status !== "not started") {
            const amount = Number(curr.treatment.totalAmount);
            return isNaN(amount) ? acc : acc + amount;
          }
          return acc;
        }, 0);

        const remainingAmount = data.diagnoses.reduce((acc, curr) => {
          if (curr.treatment.status !== "not started") {
            const amount = Number(curr.treatment.remainingAmount);
            return isNaN(amount) ? acc : acc + amount;
          }
          return acc;
        }, 0);

        const paidAmount = data.diagnoses.reduce((acc, curr) => {
          if (curr.treatment.status !== "not started") {
            const amount = Number(curr.treatment.paidAmount);
            return isNaN(amount) ? acc : acc + amount;
          }
          return acc;
        }, 0);

        setDentalCosting({
          totalAmount,
          remainingAmount,
          paidAmount,
        });

        if (selectedDiagnosis !== null) {
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
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setPatientLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      setOptionsLoading(true);
      const response = await formFieldsServices.getAllFormFields();
      const complaintsOptions = response?.data?.find(
        (item) => item?.formName === "Dental Diagnosis Form"
      );
      const treatmentsSuggestedOptions = response?.data?.find(
        (item) => item?.formName === "Dental Diagnosis Form"
      );
      const treatmentStatusOptions = response?.data?.find(
        (item) => item?.formName === "Dental Treatment Form"
      );

      setOptions({
        complaintsOptions:
          complaintsOptions?.formFieldData?.find(
            (item) => item?.fieldName === "complaints"
          )?.options || [],
        treatmentsSuggestedOptions:
          treatmentsSuggestedOptions?.formFieldData?.find(
            (item) => item?.fieldName === "treatmentSuggested"
          )?.options || [],
        treatmentStatusOptions:
          treatmentStatusOptions?.formFieldData?.find(
            (item) => item?.fieldName === "treatmentStatusOptions"
          )?.options || [],
      });
    } catch (error) {
      console.error("Error fetching form fields:", error);
    } finally {
      setOptionsLoading(false);
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
      const filteredUsers = response.data.filter((eachUser) => {
        const isDoctor = eachUser?.roles?.some(
          (role) => role?.roleName === "doctor"
        );
        const isDentist = eachUser?.specialties?.some(
          (specialty) => specialty?.name === "Dentist"
        );
        return isDoctor && isDentist;
      });

      const formattedUsers = filteredUsers.map((user) => ({
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
    fetchOptions();
    if (userRoles.includes("admin")) {
      getSpecialtyDepartmentsByClinic();
    } else {
      fetchCampDetails();
    }
  }, []);

  const customRowClass = (record) => {
    if (record?.treatment?.status === "completed") {
      return "row-success";
    }
    if (record?.treatment?.status === "started") {
      return "row-info";
    }
    if (record?.treatment?.status === "not started") {
      return "row-warning";
    }
    return "";
  };

  if (patientLoading || usersLoading || campLoading || optionsLoading)
    return <Loading />;

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
            className="border-bottom mb-3"
            justify
            fill
            transition={true}
            onSelect={(key) => setActiveTab(key)}
            activeKey={activeTab}
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
                <Container className="mt-3">
                  <h5 className="mt-3">Diagnoses</h5>
                  <hr />
                  <h6>Total Amount: {dentalCosting?.totalAmount}</h6>
                  <h6>Paid Amount: {dentalCosting?.paidAmount}</h6>
                  <h6>Remaining Amount: {dentalCosting?.remainingAmount}</h6>
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
                  <div className="antd-table-container">
                    <AntdTable
                      columns={newDenistryColumns}
                      data={allDiagnoses}
                      pageSizeOptions={[50, 100, 150, 200]}
                      defaultPageSize={50}
                      rowClassName={customRowClass}
                    />
                  </div>
                </Container>
              </Tab>
            )}

            {/* GP Tab */}
            {departmentList
              .map((eachDepartment) => eachDepartment.label)
              .includes("GP") && (
              <Tab eventKey="gp" title="GP">
                <>
                  <GPMedicalRecord
                    gpRecords={patientData?.gpRecords}
                    patientData={patientData}
                    onSave={fetchPatientData}
                  />
                </>
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

      {drawerVisible && (
        <PatientDiagnosisForm
          key={selectedDiagnosis?.id}
          isEdit={isEdit}
          drawerVisible={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          diagnosisData={selectedDiagnosis}
          patientData={patientData}
          doctorsList={users}
          onSave={() => fetchPatientData()}
          options={options}
        />
      )}
    </Container>
  );
};

export default PatientProfile;
