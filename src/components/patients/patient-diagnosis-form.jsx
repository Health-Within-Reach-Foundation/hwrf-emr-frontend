import React, { useEffect, useState } from "react";
import {
  Drawer,
  Input,
  TreeSelect,
  Select,
  Button,
  Form,
  Upload,
  Checkbox,
  DatePicker,
  Dropdown,
  Badge,
  Radio,
} from "antd";
// import { Form } from "react-bootstrap";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import TeethSelector from "../adult-teeth-selector/teeth-selector";
import ChildTeethSelector from "../child-teeth-selector/child-teeth-selector";
import {
  RiAddLine,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiSave2Fill,
  RiSaveFill,
  RiUpload2Fill,
} from "@remixicon/react";
import DiagnosisTreatmentSettingForm from "./diagnosis-treatment-setting-form";
import { Accordion, Card } from "react-bootstrap";
import dayjs from "dayjs";
import DateCell from "../date-cell";
import { transformText } from "../../utilities/utility-function";

const PatientDiagnosisForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave,
  patientData,
  doctorsList,
}) => {
  console.log("in the diagnosis drawer --> ", diagnosisData);
  const [loading, setLoading] = useState(false);
  const [treatmentLoading, setTreatmentLoading] = useState(false);
  const [formState, setFormState] = useState({
    complaints: [],
    treatmentsSuggested: [],
    // dentalQuadrant: [],
    xrayStatus: false,
    xray: [],
    notes: "",
    currentStatus: [],
    dentalQuadrantType: "adult",
    selectedTeeth: [],
    adultSelectedTeeth: [],
    childSelectedTeeth: [],
    estimatedCost: 0,
  });

  const [treatments, setTreatments] = useState({
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    newTreatmentSetting: [
      {
        treatmentDate: dayjs(),
        treatmentStatus: [],
        notes: "",
        settingPaidAmount: 0,
        xrayStatus: false,
        xray: [], // Array to store uploaded files
        treatingDoctor: {},
        paymentMode: "offline",
        nextDate: null,
        onlineAmount: 0,
        offlineAmount: 0,
      },
    ],
  });

  const menu = {
    items: [
      {
        key: "1",
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>
              <Badge size="default" dot status="processing" text="Started" />
            </span>
          </div>
        ),
        onClick: () => {
          handleUpdateTreatment({ status: "started" });
        },
      },
      {
        key: "2",
        label: (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span>
              <Badge size="default" dot status="warning" text="Completed" />
            </span>
          </div>
        ),
        onClick: () => {
          handleUpdateTreatment({ status: "completed" });
        },
      },
    ],
  };

  const handleInputChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleTreatmentChange = (key, value) => {
    const updatedValue = Number(value) || 0;
    const updatedTreatments = {
      ...treatments,
      [key]: updatedValue,
      remainingAmount:
        key === "totalAmount" || key === "paidAmount"
          ? (key === "paidAmount" ? treatments.totalAmount : updatedValue) -
            (key === "paidAmount" ? updatedValue : treatments.paidAmount)
          : treatments.remainingAmount,
    };

    // Ensure remainingAmount is never negative
    if (updatedTreatments.remainingAmount < 0) {
      updatedTreatments.remainingAmount = 0;
    }
    setTreatments(updatedTreatments);
  };

  const addNewTreatmentSetting = () => {
    setTreatments((prev) => ({
      ...prev,
      newTreatmentSetting: [
        ...prev.newTreatmentSetting,
        {
          treatmentStatus: [],
          notes: "",
          treatmentDate: dayjs(),
          settingPaidAmount: 0,
          xrayStatus: false,
          xray: [],
          treatingDoctor: {},
          paymentMode: "offline",
          nextDate: null,
          onlineAmount: 0,
          offlineAmount: 0,
        },
      ],
    }));
  };

  const handleTreatmentSettingChange = (index, key, value) => {
    setTreatments((prev) => {
      const updatedSettings = [...prev.newTreatmentSetting];

      // Update the specific field
      updatedSettings[index][key] = value;

      // Adjust amounts for settingPaidAmount if applicable
      let updatedPaidAmount = prev.paidAmount;
      let updatedRemainingAmount = prev.remainingAmount;

      if (key === "settingPaidAmount") {
        const previousPaidAmount =
          updatedSettings[index]?.settingPaidAmount || 0;
        updatedPaidAmount =
          prev.paidAmount - previousPaidAmount + (Number(value) || 0);
        updatedRemainingAmount = Math.max(
          0,
          prev.totalAmount - updatedPaidAmount
        );
      }
      if (key === "onlineAmount") {
        updatedSettings[index]?.onlineAmount || 0;
      }
      if (key === "offlineAmount") {
        updatedSettings[index]?.offlineAmount || 0;
      }

      return {
        ...prev,
        paidAmount: updatedPaidAmount,
        remainingAmount: updatedRemainingAmount,
        newTreatmentSetting: updatedSettings,
      };
    });
  };

  const deleteTreatmentSetting = (index) => {
    setTreatments((prev) => ({
      ...prev,
      newTreatmentSetting: prev.newTreatmentSetting.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // const handleTreatmentChange = (index, key, value) => {
  //   console.log(value);
  //   setTreatments((prev) => {
  //     const updatedTreatments = [...prev];
  //     const treatment = updatedTreatments[index];
  //     // Parse amounts as numbers and auto-calculate remainingAmount
  //     if (key === "totalAmount" || key === "paidAmount") {
  //       const updatedValue = Number(value) || 0;
  //       treatment[key] = updatedValue;
  //       treatment.remainingAmount =
  //         Number(treatment.totalAmount || 0) -
  //         Number(treatment.paidAmount || 0);
  //     } else {
  //       treatment[key] = value;
  //     }

  //     // Ensure remainingAmount is never negative
  //     if (treatment.remainingAmount < 0) {
  //       treatment.remainingAmount = 0;
  //     }

  //     updatedTreatments[index] = treatment;
  //     return updatedTreatments;
  //   });
  // };

  useEffect(() => {
    if (isEdit && diagnosisData) {
      const {
        createdAt,
        updatedAt,
        appointmentId,
        treatmentSuggested,
        dentalQuadrant,
        treatments, // this is model treatement data
        // patientId,
        id,
        additionalDetails,
        selectedTeeth,
        treatment,
        ...filteredData
      } = diagnosisData;
      setFormState({
        ...filteredData,
        xray: [],
        selectedTeeth: selectedTeeth === null ? [] : [selectedTeeth],
        childSelectedTeeth:
          diagnosisData?.dentalQuadrantType === "child" &&
          selectedTeeth !== null
            ? [selectedTeeth]
            : [],
        adultSelectedTeeth:
          diagnosisData?.dentalQuadrantType === "adult" &&
          selectedTeeth !== null
            ? [selectedTeeth]
            : [],
        dentalQuadrantType: diagnosisData?.dentalQuadrantType || "all",
      });
      setTreatments({
        totalAmount: diagnosisData?.treatment?.totalAmount || 0,
        paidAmount: diagnosisData?.treatment?.paidAmount || 0,
        remainingAmount:
          (diagnosisData?.treatment?.totalAmount || 0) -
          (diagnosisData?.treatment?.paidAmount || 0),
        newTreatmentSetting: [],
      });
    } else {
      setFormState({
        complaints: [],
        treatmentsSuggested: [],
        childSelectedTeeth: [],
        adultSelectedTeeth: [],

        // dentalQuadrant: [],
        xrayStatus: false,
        xray: [],
        notes: "",
        estimatedCost: 0,
        // currentStatus: [],
        dentalQuadrantType: "adult",
        selectedTeeth: [], // Initialize selectedTeeth in newform
      });
    }
  }, [isEdit, diagnosisData]);

  // useEffect(() => {
  //   setFormState((prev) => ({
  //     ...prev,
  //     selectedTeeth: [],
  //   }));
  // }, [formState.dentalQuadrantType]);

  // const handleInputChange = (key, value) => {
  //   setFormState((prev) => ({ ...prev, [key]: value }));
  // };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare FormData object
      const formData = new FormData();

      // Add form fields to FormData
      Object.entries(formState).forEach(([key, value]) => {
        if (key === "xray" && Array.isArray(value)) {
          // Append files for xray
          value.forEach((file) => {
            formData.append("xrayFiles", file);
          });
        } else if (Array.isArray(value)) {
          // Append arrays as JSON
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      console.log("form state ************* -->", formState.selectedTeeth);
      // Make API call to save diagnosis
      let response;
      if (isEdit) {
        // formData.delete("selectedTeeth");
        formData.delete("adultSelectedTeeth");
        formData.delete("childSelectedTeeth");
        response = await patientServices.updatePatientDiagnosis(
          diagnosisData.id,
          formData
        );
      } else {
        formData.append("patientId", patientData.id);
        response = await patientServices.addPatientDiagnosis(formData);
      }

      if (response?.success) {
        toast.success(response.message || "Diagnosis saved successfully!");
      } else {
        toast.error(response?.message || "Failed to save diagnosis.");
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      onSave(); // Callback after successful save
      // onClose();
    }
  };

  const handleSubmitNewTreatment = async (index) => {
    try {
      setTreatmentLoading(true);

      const { totalAmount, paidAmount, remainingAmount } = treatments;
      const currentTreatment = treatments.newTreatmentSetting[index];

      // Prepare FormData
      const formData = new FormData();

      // Append treatment details to FormData
      Object.entries(currentTreatment).forEach(([key, value]) => {
        if (key === "xray" && Array.isArray(value)) {
          // Append each file in the xray array
          value.forEach((file) => {
            formData.append("xrayFiles", file);
          });
        } else if (Array.isArray(value) || typeof value === "object") {
          // Append arrays as JSON
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Append additional fields
      formData.append("totalAmount", totalAmount);
      formData.append("paidAmount", paidAmount);
      formData.append("remainingAmount", remainingAmount);
      formData.append("diagnosisId", diagnosisData.id);
      formData.append("patientId", diagnosisData.patientId);

      console.log("Form data for creating new treatment --> ", treatments);
      // Make API call
      const response = await patientServices.addTreatmentByDiagnosis(formData);

      if (response.success) {
        toast.success("Treatment setting added!");
        // Optionally reset treatments or perform other actions here
      }
    } catch (error) {
      console.error("Error while creating new treatment -->", error);
      toast.error("Failed to create new treatment.");
    } finally {
      setTreatmentLoading(false);
      onSave(); // Callback after successful save
    }
  };

  const handleUpdateTreatment = async (treatmentBody) => {
    try {
      // const treatmentBody = {
      //   totalAmount: treatments.totalAmount,
      //   paidAmount: treatments.paidAmount,
      //   remainingAmount: treatments.remainingAmount,
      // };
      setTreatmentLoading(true);
      const treatmentId = diagnosisData.treatment.id;
      const response = await patientServices.updateTreatmentById(
        treatmentId,
        treatmentBody
      );

      if (response.success) {
        toast.success("Updated!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      onSave();
      setTreatmentLoading(false);
    }
  };

  const handleDeleteDiagnosis = async () => {
    try {
      setLoading(true);
      const response = await patientServices.deleteDiagnosisById(
        diagnosisData.id
      );

      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error while deleting treatment: ", error);
    } finally {
      setLoading(false);
      onSave();
      onClose();
    }
  };

  return (
    <Drawer
      title={isEdit ? "Edit Diagnosis" : "Add Diagnosis"}
      placement="right"
      onClose={onClose}
      open={drawerVisible}
      width={1300}
      maskClosable={false}
    >
      <Card className="bg-light">
        <Card.Header>
          <h4>Diagnosis Details</h4>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-end gap-3">
            <Button
              onClick={handleSubmit}
              type="primary"
              className="bg-primary rounded-0"
              loading={loading}
            >
              {isEdit ? "Update Diagnosis" : "Submit Diagnosis"}
            </Button>
            {isEdit && (
              <Button
                onClick={handleDeleteDiagnosis}
                variant="outlined"
                className="btn-sm btn-primary rounded-0"
                loading={loading}
              >
                <RiDeleteBin2Line />
              </Button>
            )}
          </div>
          <Form layout="vertical" onFinish={handleSubmit}>
            <div className="w-100 d-flex justify-content-between gap-3">
              <Form.Item label="Complaints" className="w-100">
                <Select
                  mode="multiple"
                  value={formState.complaints}
                  onChange={(value) => handleInputChange("complaints", value)}
                  options={[
                    { label: "Bad breath", value: "Bad breath" },
                    { label: "Tooth ache", value: "Tooth ache" },
                    { label: "Missing tooth", value: "Missing tooth" },
                    { label: "Food lodgement", value: "Food lodgement" },
                    {
                      label: "Sensitivity to cold",
                      value: "Sensitivity to cold",
                    },
                    {
                      label: "Sensitivity to sweet",
                      value: "Sensitivity to sweet",
                    },
                    {
                      label: "Pain while chewing",
                      value: "Pain while chewing",
                    },
                    { label: "Fracture teeth", value: "Fracture teeth" },
                    { label: "Carios tooth", value: "Carios tooth" },
                    { label: "Stains", value: "Stains" },
                    { label: "Tartar deposits", value: "Tartar deposits" },
                    { label: "Bleeding gums", value: "Bleeding gums" },
                    { label: "Mobile Teeth", value: "Mobile Teeth" },
                    { label: "Swelling", value: "Swelling" },
                    {
                      label: "Brushing Sensation",
                      value: "Brushing Sensation",
                    },
                    { label: "Ulcers in mouth", value: "Ulcers in mouth" },
                    {
                      label: "Reduced mouth opening",
                      value: "Reduced mouth opening",
                    },
                    { label: "Malaligned teeth", value: "Malaligned teeth" },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Treatment" className="w-100">
                <Select
                  mode="multiple"
                  value={formState.treatmentsSuggested}
                  onChange={(value) =>
                    handleInputChange("treatmentsSuggested", value)
                  }
                  options={[
                    { label: "RCT - Simple", value: "RCT - Simple" },
                    { label: "GIC", value: "GIC" },
                    { label: "Composite", value: "Composite" },
                    { label: "RCT - Complex", value: "RCT - Complex" },
                    { label: "RCT - Third molar", value: "RCT - Third molar" },
                    { label: "GIC + dycal", value: "GIC + dycal" },
                    { label: "Composite + GIC", value: "Composite + GIC" },
                    {
                      label: "Composite + Ca(OH)₂",
                      value: "Composite + Ca(OH)₂",
                    },
                    {
                      label: "Composite + LC-Cal",
                      value: "Composite + LC-Cal",
                    },
                    { label: "RC-Cal placed", value: "RC-Cal placed" },
                    {
                      label: "Direct pulp capping OR DPC (dycal+temp)",
                      value: "Direct pulp capping OR DPC (dycal+temp)",
                    },
                    {
                      label: "IPC done IPC (dycal+GIC)",
                      value: "IPC done IPC (dycal+GIC)",
                    },
                    { label: "Extraction", value: "Extraction" },
                    { label: "Crown", value: "Crown" },
                    { label: "Bridge", value: "Bridge" },
                    { label: "Scaling", value: "Scaling" },
                    { label: "Polishing", value: "Polishing" },
                    { label: "Fluorid", value: "Fluorid" },
                    {
                      label: "Pit & fissure sealant",
                      value: "Pit & fissure sealant",
                    },
                    { label: "Pulpotomy", value: "Pulpotomy" },
                    { label: "Bleaching", value: "Bleaching" },
                  ]}
                  className="w-100"
                />
              </Form.Item>
            </div>

            <div className="w-100 d-flex flex-md-row flex-column justify-content-between gap-5">
              <div className="d-flex flex-column">
                <div className="w-100 d-flex">
                  <Form.Item>
                    <Checkbox
                      checked={formState.dentalQuadrantType === "all"}
                      onChange={() => {
                        setFormState((prev) => ({
                          ...prev,
                          selectedTeeth: [],
                          adultSelectedTeeth: [],
                          childSelectedTeeth: [],
                        }));
                        handleInputChange("dentalQuadrantType", "all");
                      }}
                    >
                      All
                    </Checkbox>
                    <Checkbox
                      checked={formState.dentalQuadrantType === "adult"}
                      onChange={() =>
                        handleInputChange("dentalQuadrantType", "adult")
                      }
                    >
                      Adult
                    </Checkbox>
                    <Checkbox
                      checked={formState.dentalQuadrantType === "child"}
                      onChange={() =>
                        handleInputChange("dentalQuadrantType", "child")
                      }
                    >
                      Child
                    </Checkbox>
                  </Form.Item>
                </div>
                <div>
                  {formState.dentalQuadrantType === "adult" && (
                    <Form.Item>
                      <TeethSelector
                        isEdit={isEdit}
                        selectedTeeth={formState.adultSelectedTeeth}
                        onChange={(updatedTeeth) => {
                          // handleInputChange("adultSelectedTeeth", updatedTeeth)
                          if (isEdit) {
                            handleInputChange("selectedTeeth", updatedTeeth);
                          } else {
                            handleInputChange(
                              "adultSelectedTeeth",
                              updatedTeeth
                            );
                          }
                        }}
                      />
                    </Form.Item>
                  )}
                  {formState.dentalQuadrantType === "child" && (
                    <Form.Item>
                      <ChildTeethSelector
                        isEdit={isEdit}
                        selectedTeeth={formState?.childSelectedTeeth}
                        onChange={(updatedTeeth) => {
                          if (isEdit) {
                            handleInputChange("selectedTeeth", updatedTeeth);
                          } else {
                            handleInputChange(
                              "childSelectedTeeth",
                              updatedTeeth
                            );
                          }
                        }}
                      />
                    </Form.Item>
                  )}
                </div>
              </div>

              <div className="w-100 d-flex flex-column">
                <Form.Item label="Notes">
                  <Input.TextArea
                    value={formState.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </Form.Item>

                <Form.Item label="Estimated Cost">
                  <Input
                    type="number"
                    defaultValue={diagnosisData?.estimatedCost || 0}
                    value={formState?.estimatedCost}
                    onChange={(e) =>
                      handleInputChange("estimatedCost", e.target.value)
                    }
                  />
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
      {diagnosisData?.id && (
        <Card className="bg-light">
          <Card.Header>
            <h4>Treatment Details</h4>
          </Card.Header>
          <Card.Body>
            <div className="d-flex justify-content-end">
              <Dropdown menu={menu} trigger={["click"]}>
                <Button
                  type="dashed"
                  className="rounded-0"
                  loading={treatmentLoading}
                >
                  Treatment Progress:{" "}
                  {diagnosisData?.treatment?.status === "started" ? (
                    <Badge
                      size="default"
                      dot
                      status="processing"
                      text="Started"
                    />
                  ) : diagnosisData?.treatment?.status === "completed" ? (
                    <Badge
                      size="default"
                      dot
                      status="warning"
                      text="Completed"
                    />
                  ) : (
                    <></>
                  )}
                </Button>
              </Dropdown>
            </div>
            <Form
              layout="vertical"
              // onFinish={() => handleSubmitNewTreatment(index)}
            >
              <div className="d-flex gap-2">
                <Form.Item label="Total Amount">
                  <Input
                    type="number"
                    defaultValue={diagnosisData?.treatment?.totalAmount || 0}
                    value={treatments.totalAmount}
                    onChange={(e) =>
                      handleTreatmentChange("totalAmount", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Total Paid Amount">
                  <Input
                    type="number"
                    readOnly
                    value={treatments.paidAmount}
                    defaultValue={diagnosisData?.treatment?.paidAmount || 0}
                    onChange={(e) =>
                      handleTreatmentChange("paidAmount", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item label="Remaining Amount">
                  <Input
                    type="number"
                    value={treatments.remainingAmount || 0}
                    defaultValue={
                      diagnosisData?.treatment?.remainingAmount || 0
                    }
                    readOnly
                  />
                </Form.Item>

                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    title="Save Amount"
                    size="medium"
                    loading={treatmentLoading}
                    onClick={() => {
                      const treatmentBody = {
                        totalAmount: treatments.totalAmount,
                        // paidAmount: treatments.paidAmount,
                        // remainingAmount: treatments.remainingAmount,
                      };
                      handleUpdateTreatment(treatmentBody);
                    }}
                  >
                    <RiSaveFill />
                  </Button>
                </div>
              </div>
              <div className="d-flex justify-content-end">
                <Button
                  onClick={addNewTreatmentSetting}
                  type="dashed"
                  className="mb-3 rounded-0 "
                >
                  <RiAddLine />
                  Add Treatment Setting
                </Button>
              </div>

              <div>
                {treatments.newTreatmentSetting.map((setting, index) => (
                  <div key={index}>
                    <div className="d-flex justify-content-end">
                      <Button
                        onClick={() => deleteTreatmentSetting(index)}
                        size="small"
                        className="rounded-0"
                      >
                        <RiDeleteBin2Fill size={15} />
                      </Button>
                    </div>
                    <div className="w-100 d-flex justify-content-between gap-3">
                      <Form.Item label="Treatment Date" className="w-100">
                        <DatePicker
                          value={setting.treatmentDate}
                          onChange={(value) => {
                            console.log("value -->", value);
                            handleTreatmentSettingChange(
                              index,
                              "treatmentDate",
                              value
                            );
                          }}
                          className="w-100"
                        />
                      </Form.Item>

                      <Form.Item label="Treatment Status" className="w-100">
                        <Select
                          mode="multiple"
                          value={setting.treatmentStatus}
                          onChange={(value) =>
                            handleTreatmentSettingChange(
                              index,
                              "treatmentStatus",
                              value
                            )
                          }
                          options={[
                            { label: "OPD done", value: "OPD done" },
                            {
                              label: "RCO done anterior (500/-)",
                              value: "RCO done anterior (500/-)",
                            },
                            {
                              label: "BMP done anterior (500/-)",
                              value: "BMP done anterior (500/-)",
                            },
                            {
                              label: "Obturation done anterior (500/-)",
                              value: "Obturation done anterior (500/-)",
                            },
                            {
                              label: "Single Sitting RCT - Anterior (2000/-)",
                              value: "Single Sitting RCT - Anterior (2000/-)",
                            },
                            {
                              label: "Single Sitting RCT - Post (2500/-)",
                              value: "Single Sitting RCT - Post (2500/-)",
                            },
                            {
                              label: "RCO - Posterior (600/-)",
                              value: "RCO - Posterior (600/-)",
                            },
                            {
                              label: "BMP - Posterior (600/-)",
                              value: "BMP - Posterior (600/-)",
                            },
                            {
                              label: "Obturation + POR Posterior (600/-)",
                              value: "Obturation + POR Posterior (600/-)",
                            },
                            { label: "RCO done", value: "RCO done" },
                            { label: "BMP done", value: "BMP done" },
                            {
                              label: "Obturation + POR",
                              value: "Obturation + POR",
                            },
                            { label: "Crown cutting", value: "Crown cutting" },
                            {
                              label: "Crown cementation",
                              value: "Crown cementation",
                            },
                            { label: "FPD", value: "FPD" },
                            {
                              label: "Bridge cementation",
                              value: "Bridge cementation",
                            },
                            { label: "Crown removal", value: "Crown removal" },
                            { label: "Bridge try-in", value: "Bridge try-in" },
                            { label: "GIC done", value: "GIC done" },
                            {
                              label: "Composite done",
                              value: "Composite done",
                            },
                            {
                              label: "Occlusal adjustment done",
                              value: "Occlusal adjustment done",
                            },
                            {
                              label: "Irrigation done",
                              value: "Irrigation done",
                            },
                            {
                              label: "Mobile extraction done",
                              value: "Mobile extraction done",
                            },
                            {
                              label: "Simple extraction done",
                              value: "Simple extraction done",
                            },
                            {
                              label: "Complex extraction done",
                              value: "Complex extraction done",
                            },
                            {
                              label: "Surgical extraction done",
                              value: "Surgical extraction done",
                            },
                            {
                              label: "Bond filling done",
                              value: "Bond filling done",
                            },
                            { label: "Frenectomy", value: "Frenectomy" },
                            {
                              label: "Operculectomy done",
                              value: "Operculectomy done",
                            },
                            {
                              label: "Cusp guiding done",
                              value: "Cusp guiding done",
                            },
                            {
                              label: "Finishing + Polishing",
                              value: "Finishing + Polishing",
                            },
                            {
                              label: "Scaling + Polishing (Prophylaxis)",
                              value: "Scaling + Polishing (Prophylaxis)",
                            },
                            {
                              label: "Post n Core done",
                              value: "Post n Core done",
                            },
                            {
                              label: "Composite buildup done",
                              value: "Composite buildup done",
                            },
                            { label: "POR done", value: "POR done" },
                            {
                              label: "Fluoride application",
                              value: "Fluoride application",
                            },
                            {
                              label: "Fluoride varnish",
                              value: "Fluoride varnish",
                            },
                            {
                              label: "Pit & fissure sealant",
                              value: "Pit & fissure sealant",
                            },
                            {
                              label: "Pulpotomy - 1st appointment",
                              value: "Pulpotomy - 1st appointment",
                            },
                            {
                              label: "Pulpotomy - 2nd appointment",
                              value: "Pulpotomy - 2nd appointment",
                            },
                            {
                              label: "Pulpotomy - 3rd appointment",
                              value: "Pulpotomy - 3rd appointment",
                            },
                          ]}
                          className="w-100"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-100 d-flex flex-column flex-sm-row justify-content-between gap-3">
                      <Form.Item className="w-100">
                        <Checkbox
                          checked={setting.xrayStatus}
                          onChange={(e) =>
                            handleTreatmentSettingChange(
                              index,
                              "xrayStatus",
                              e.target.checked
                            )
                          }
                        >
                          X-ray Status
                        </Checkbox>
                      </Form.Item>

                      {setting.xrayStatus && (
                        <Form.Item label="Upload X-ray Files" className="w-100">
                          <Upload
                            multiple
                            accept="image/*"
                            beforeUpload={(file) => {
                              handleTreatmentSettingChange(index, "xray", [
                                ...(setting.xray || []),
                                file,
                              ]);
                              return false; // Prevent auto-upload
                            }}
                            fileList={setting.xray || []}
                            onRemove={(file) => {
                              handleTreatmentSettingChange(
                                index,
                                "xray",
                                (setting.xray || []).filter(
                                  (item) => item.uid !== file.uid
                                )
                              );
                            }}
                          >
                            <Button icon={<RiUpload2Fill />} variant="outlined">
                              Upload
                            </Button>
                          </Upload>
                        </Form.Item>
                      )}
                    </div>
                    <div className="w-100 d-flex justify-content-between gap-3">
                      <div className="d-flex flex-column w-100">
                        <Form.Item label="Payment mode">
                          <Radio.Group
                            value={setting?.paymentMode}
                            onChange={(e) =>
                              handleTreatmentSettingChange(
                                index,
                                "paymentMode",
                                e.target.value
                              )
                            }
                          >
                            <Radio value="online">Online</Radio>
                            <Radio value="offline">Offline</Radio>
                            <Radio value="both">Both</Radio>
                          </Radio.Group>
                        </Form.Item>

                        {setting?.paymentMode == "online" ||
                        setting?.paymentMode == "offline" ? (
                          <Form.Item
                            label="Setting Paid Amount"
                            className="w-100"
                          >
                            <Input
                              type="number"
                              value={
                                setting?.paymentMode == "online"
                                  ? setting?.onlineAmount
                                  : setting.offlineAmount
                              }
                              onChange={(e) => {
                                const key =
                                  setting.paymentMode === "online"
                                    ? "onlineAmount"
                                    : "offlineAmount";
                                handleTreatmentSettingChange(
                                  index,
                                  key,
                                  e.target.value
                                );
                              }}
                            />
                          </Form.Item>
                        ) : setting.paymentMode === "both" ? (
                          <div className="d-flex flex-row gap-2">
                            <Form.Item
                              label="Online Paid Amount"
                              className="w-100"
                            >
                              <Input
                                type="number"
                                value={setting?.onlineAmount}
                                onChange={(e) =>
                                  handleTreatmentSettingChange(
                                    index,
                                    "onlineAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              label="Offline Paid Amount"
                              className="w-100"
                            >
                              <Input
                                type="number"
                                value={setting?.offlineAmount}
                                onChange={(e) =>
                                  handleTreatmentSettingChange(
                                    index,
                                    "offlineAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              label="Total Amount"
                              className="w-100"
                            >
                              <Input
                                type="number"
                                value={Number(setting?.offlineAmount) + Number(setting?.onlineAmount)}
                                readOnly
                                onChange={(e) =>
                                  handleTreatmentSettingChange(
                                    index,
                                    "offlineAmount",
                                    e.target.value
                                  )
                                }
                              />
                            </Form.Item>
                          </div>
                        ) : null}
                        <Form.Item label="Next follow up date" className="w-100">
                          <DatePicker
                            value={setting.nextDate}
                            onChange={(value) => {
                              console.log("value -->", value);
                              handleTreatmentSettingChange(
                                index,
                                "nextDate",
                                value
                              );
                            }}
                            className="w-100"
                          />
                        </Form.Item>
                      </div>

                      <div className="d-flex flex-column w-100">
                        <Form.Item label="Treating Doctor" className="w-100">
                          <Select
                            value={setting.treatingDoctor}
                            onChange={(value, option) =>
                              handleTreatmentSettingChange(
                                index,
                                "treatingDoctor",
                                option
                              )
                            }
                            options={doctorsList}
                            className="w-100"
                          />
                        </Form.Item>
                        <Form.Item label="Notes" className="w-100">
                          <Input.TextArea
                            value={setting.notes}
                            onChange={(e) =>
                              handleTreatmentSettingChange(
                                index,
                                "notes",
                                e.target.value
                              )
                            }
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button
                        onClick={() => handleSubmitNewTreatment(index)}
                        type="primary"
                        className="bg-primary"
                        loading={treatmentLoading} // Assuming loading is being managed elsewhere
                      >
                        Submit Treatment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {diagnosisData?.treatment ? (
                <div className="my-1">
                  <hr />
                  <p>Treatements Settings</p>
                  {diagnosisData?.treatment?.treatmentSettings?.map(
                    (treatment) => {
                      console.log(treatment);
                      return (
                        <Accordion className="my-1">
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>
                              <div className="d-flex flex-row gap-3">
                                <h6>
                                  {treatment.treatmentStatus.join(", ")} -{" "}
                                </h6>
                                <DateCell date={treatment.treatmentDate} /> -
                                <p>₹{treatment.settingPaidAmount}</p>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <DiagnosisTreatmentSettingForm
                                diagnosisData={diagnosisData}
                                drawerVisible={true}
                                isEdit={true}
                                onClose={onClose}
                                onSave={onSave}
                                doctorsList={doctorsList}
                                selectedTreatments={treatment}
                              />
                            </Accordion.Body>
                          </Accordion.Item>
                        </Accordion>
                      );
                    }
                  )}
                </div>
              ) : (
                treatments.length <= 0 && (
                  <div className="text-center text-danger">
                    <p>No Treatment Found</p>
                  </div>
                )
              )}
            </Form>
          </Card.Body>
        </Card>
      )}
    </Drawer>
  );
};

export default PatientDiagnosisForm;
