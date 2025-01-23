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
} from "antd";
// import { Form } from "react-bootstrap";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import TeethSelector from "../adult-teeth-selector/teeth-selector";
import ChildTeethSelector from "../child-teeth-selector/child-teeth-selector";
import {
  RiDeleteBin2Fill,
  RiSave2Fill,
  RiSaveFill,
  RiUpload2Fill,
} from "@remixicon/react";
import DiagnosisTreatmentSettingForm from "./diagnosis-treatment-setting-form";
import { Accordion, Card } from "react-bootstrap";
import dayjs from "dayjs";
import DateCell from "../date-cell";

const PatientDiagnosisForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave,
  patientData,
}) => {
  console.log("in the diagnosis drawer --> ", diagnosisData);
  const [loading, setLoading] = useState(false);
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
  });

  const [treatments, setTreatments] = useState({
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    newTreatmentSetting: [],
  });

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
        },
      ],
    }));
  };

  const handleTreatmentSettingChange = (index, key, value) => {
    setTreatments((prev) => {
      const updatedSettings = [...prev.newTreatmentSetting];

      // Handle different types of value updates based on the key
      const updatedValue =
        key === "settingPaidAmount" ? Number(value) || 0 : value;

      // Store the previous value for `settingPaidAmount` to calculate deltas
      const previousSettingPaidAmount =
        key === "settingPaidAmount"
          ? Number(updatedSettings[index][key]) || 0
          : 0;

      // Update the specific field in the treatment setting
      updatedSettings[index][key] = updatedValue;

      // Initialize updated amounts from the previous state
      let updatedPaidAmount = prev.paidAmount;
      let updatedRemainingAmount = prev.remainingAmount;

      // If `settingPaidAmount` is updated, adjust `paidAmount` and `remainingAmount`
      if (key === "settingPaidAmount") {
        updatedPaidAmount =
          prev.paidAmount - previousSettingPaidAmount + updatedValue;
        updatedRemainingAmount = Math.max(
          0,
          prev.totalAmount - updatedPaidAmount
        );
      }

      // Return the updated state with the new values
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
        patientId,
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
        // dentalQuadrant: [],
        xrayStatus: false,
        xray: [],
        notes: "",
        // currentStatus: [],
        dentalQuadrantType: "adult",
        selectedTeeth: [], // Initialize selectedTeeth in new form
      });
    }
  }, [isEdit, diagnosisData]);

  useEffect(() => {
    setFormState((prev) => ({
      ...prev,
      selectedTeeth: [],
    }));
  }, [formState.dentalQuadrantType]);

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

      console.log("form state -->", formState);
      // Make API call to save diagnosis
      let response;
      if (isEdit) {
        formData.delete("selectedTeeth");
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
        onSave(); // Callback after successful save
      } else {
        toast.error(response?.message || "Failed to save diagnosis.");
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleSubmitNewTreatment = async (index) => {
    try {
      setLoading(true);
      const { totalAmount, paidAmount, remainingAmount } = treatments;

      console.log(treatments.newTreatmentSetting[index]);
      const response = await patientServices.addTreatmentByDiagnosis({
        ...treatments.newTreatmentSetting[index],
        totalAmount,
        paidAmount,
        remainingAmount,
        diagnosisId: diagnosisData.id,
      });

      if (response.success) {
        toast.success("Treatment setting added!");
        onSave(); // Callback after successful save
        // setTreatments([]);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("error while creating new treatment -->", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handleUpdateTreatment = async () => {
    try {
      const treatmentBody = {
        totalAmount: treatments.totalAmount,
        paidAmount: treatments.paidAmount,
        remainingAmount: treatments.remainingAmount,
      };

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
    }
  };

  return (
    <Drawer
      title={isEdit ? "Edit Diagnosis" : "Add Diagnosis"}
      placement="right"
      onClose={onClose}
      open={drawerVisible}
      width={700}
      maskClosable={false}
    >
      <Card className="bg-light">
        <Card.Header>
          <h4>Diagnosis Details</h4>
        </Card.Header>
        <Card.Body>
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item label="Complaints">
              <Select
                mode="multiple"
                value={formState.complaints}
                onChange={(value) => handleInputChange("complaints", value)}
                options={[
                  { value: "Tooth Ache", label: "Tooth Ache" },
                  { value: "Tooth Missing", label: "Tooth Missing" },
                  { value: "Bad Breath", label: "Bad Breath" },
                  { value: "Caries", label: "Caries" },
                  { value: "NA", label: "NA" },
                  { value: "Calculus", label: "Calculus" },
                ]}
                className="w-100"
              />
            </Form.Item>
            <Form.Item label="Treatment">
              <Select
                mode="multiple"
                value={formState.treatmentsSuggested}
                onChange={(value) =>
                  handleInputChange("treatmentsSuggested", value)
                }
                options={[
                  { value: "Scaling-Regular", label: "Scaling-Regular" },
                  { value: "Scaling-Complex", label: "Scaling-Complex" },
                  { value: "RC-Simple", label: "RC-Simple" },
                  { value: "RC-Complex", label: "RC-Complex" },
                  { value: "Filling-Regular", label: "Filling-Regular" },
                  { value: "Filling-Deep", label: "Filling-Deep" },
                  { value: "Extraction-Simple", label: "Extraction-Simple" },
                  { value: "Extraction-Complex", label: "Extraction-Complex" },
                  { value: "Crown-Metal", label: "Crown-Metal" },
                  { value: "Crown-PFM", label: "Crown-PFM" },
                  { value: "Crown-Zirconia", label: "Crown-Zirconia" },
                  { value: "Floride", label: "Floride" },
                  {
                    value: "Pit Fissure Sealant",
                    label: "Pit Fissure Sealant",
                  },
                  { value: "Pulpectomy", label: "Pulpectomy" },
                  { value: "OPD Done", label: "OPD Done" },
                  { value: "OPD", label: "OPD" },
                  { value: "Crown Cutting", label: "Crown Cutting" },
                ]}
                className="w-100"
              />
            </Form.Item>
            <Form.Item>
              <Checkbox
                checked={formState.dentalQuadrantType === "all"}
                onChange={() => handleInputChange("dentalQuadrantType", "all")}
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
            {formState.dentalQuadrantType === "adult" && (
              <Form.Item>
                <TeethSelector
                  isEdit={isEdit}
                  selectedTeeth={formState.selectedTeeth}
                  onChange={(updatedTeeth) =>
                    handleInputChange("selectedTeeth", updatedTeeth)
                  }
                />
              </Form.Item>
            )}
            {formState.dentalQuadrantType === "child" && (
              <Form.Item>
                <ChildTeethSelector
                  isEdit={isEdit}
                  selectedTeeth={formState.selectedTeeth}
                  onChange={(updatedTeeth) =>
                    handleInputChange("selectedTeeth", updatedTeeth)
                  }
                />
              </Form.Item>
            )}

            <Form.Item>
              <Checkbox
                checked={formState.xrayStatus}
                onChange={(e) =>
                  handleInputChange("xrayStatus", e.target.checked)
                }
              >
                X-ray Status
              </Checkbox>
            </Form.Item>
            {formState.xrayStatus && (
              <Form.Item label="Upload X-ray Files">
                <Upload
                  multiple
                  beforeUpload={(file) => {
                    setFormState((prev) => ({
                      ...prev,
                      xray: [...prev.xray, file],
                    }));
                    return false;
                  }}
                  fileList={formState.xray}
                  onRemove={(file) => {
                    setFormState((prev) => ({
                      ...prev,
                      xray: prev.xray.filter((item) => item.uid !== file.uid),
                    }));
                  }}
                >
                  <Button icon={<RiUpload2Fill />}>Upload</Button>
                </Upload>
              </Form.Item>
            )}
            <Form.Item label="Notes">
              <Input.TextArea
                value={formState.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
              />
            </Form.Item>

            <Button
              className="mt-3 w-100"
              onClick={handleSubmit}
              type="primary"
              loading={loading}
            >
              {isEdit ? "Update Diagnosis" : "Submit Diagnosis"}
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="bg-light">
        <Card.Header>
          <h4>Treatment Details</h4>
        </Card.Header>
        <Card.Body>
          <Form
            layout="vertical"
            onFinish={() => handleSubmitNewTreatment(index)}
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
                  defaultValue={diagnosisData?.treatment?.remainingAmount || 0}
                  readOnly
                />
              </Form.Item>

              <div className="d-flex align-items-center justify-content-center">
                <Button size="medium" type="" onClick={handleUpdateTreatment}>
                  <RiSaveFill />
                </Button>
              </div>
            </div>
            <div className="d-flex justify-content-end">
              {diagnosisData?.id && (
                <Button
                  onClick={addNewTreatmentSetting}
                  type="dashed"
                  className="mb-3"
                >
                  Add Treatment Setting
                </Button>
              )}
            </div>

            <div>
              {treatments.newTreatmentSetting.map((setting, index) => (
                <div key={index}>
                  <div className="d-flex justify-content-end">
                    <Button
                      onClick={() => deleteTreatmentSetting(index)}
                      size="small"
                    >
                      <RiDeleteBin2Fill size={15} />
                    </Button>
                  </div>
                  <Form.Item label="Treatment Date">
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
                  <Form.Item label="Treatment Status">
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
                        { value: "Done", label: "Done" },
                        {
                          value: "RC Open 1st Completed",
                          label: "RC Open 1st Completed",
                        },
                        {
                          value: "RC 2nd - Completed",
                          label: "RC 2nd - Completed",
                        },
                        {
                          value: "RC 3rd - Completed",
                          label: "RC 3rd - Completed",
                        },
                        {
                          value: "Impression Taken",
                          label: "Impression Taken",
                        },
                        {
                          value: "Crown Trail Done",
                          label: "Crown Trail Done",
                        },
                        {
                          value: "Final Cementation",
                          label: "Final Cementation",
                        },
                        { value: "NA", label: "NA" },
                        { value: "OPD Done", label: "OPD Done" },
                      ]}
                      className="w-100"
                    />
                  </Form.Item>
                  <Form.Item label="Notes">
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
                  <Form.Item label="Setting Paid Amount">
                    <Input
                      type="number"
                      value={setting?.settingPaidAmount}
                      onChange={(e) =>
                        handleTreatmentSettingChange(
                          index,
                          "settingPaidAmount",
                          e.target.value
                        )
                      }
                    />
                  </Form.Item>
                  <Button
                    onClick={() => handleSubmitNewTreatment(index)}
                    type="primary"
                    className="mb-3 w-100"
                    loading={false} // Assuming loading is being managed elsewhere
                  >
                    Submit Treatment
                  </Button>
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
                            <DateCell date={treatment.treatmentDate} />
                          </Accordion.Header>
                          <Accordion.Body>
                            <DiagnosisTreatmentSettingForm
                              diagnosisData={diagnosisData}
                              drawerVisible={true}
                              isEdit={true}
                              onClose={onClose}
                              onSave={onSave}
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
    </Drawer>
  );
};

export default PatientDiagnosisForm;
