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
import { RiUpload2Fill } from "@remixicon/react";
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
  const [treatments, setTreatments] = useState([]);
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

  const handleAddNewTreatment = () => {
    setTreatments((prev) => [
      ...prev,
      { id: Date.now(), treatments: [], notes: "" },
    ]);
  };

  const handleTreatmentChange = (index, key, value) => {
    setTreatments((prev) => {
      const updatedTreatments = [...prev];
      const treatment = updatedTreatments[index];

      // Parse amounts as numbers and auto-calculate remainingAmount
      if (key === "totalAmount" || key === "paidAmount") {
        const updatedValue = Number(value) || 0;
        treatment[key] = updatedValue;
        treatment.remainingAmount =
          Number(treatment.totalAmount || 0) -
          Number(treatment.paidAmount || 0);
      } else {
        treatment[key] = value;
      }

      // Ensure remainingAmount is never negative
      if (treatment.remainingAmount < 0) {
        treatment.remainingAmount = 0;
      }

      updatedTreatments[index] = treatment;
      return updatedTreatments;
    });
  };

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
        ...filteredData
      } = diagnosisData;
      setFormState({
        ...filteredData,
        xray: [],
        selectedTeeth: selectedTeeth === null ? [] : [selectedTeeth],
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

  const handleInputChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

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
  const addNewTreatment = () => {
    setTreatments((prev) => [
      ...prev,
      {
        treatmentStatus: [],
        notes: "",
        totalAmount: 0, // Initialize as a number
        paidAmount: 0, // Initialize as a number
        remainingAmount: 0, // Initialize as a number
        treatmentDate: dayjs(),
      },
    ]);
  };

  const handleSubmitNewTreatment = async (index) => {
    try {
      setLoading(true);
      const response = await patientServices.addTreatmentByDiagnosis({
        ...treatments[index],
        diagnosisId: diagnosisData.id,
      });

      if (response.success) {
        toast.success("Treatment added!");
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

  useEffect(() => {}, [treatments.paidAmount, treatments.remainingAmount]);

  return (
    <Drawer
      title={isEdit ? "Edit Diagnosis" : "Add Diagnosis"}
      placement="right"
      onClose={onClose}
      open={drawerVisible}
      width={600}
    >
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
              { value: "Pit Fissure Sealant", label: "Pit Fissure Sealant" },
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
            onChange={() => handleInputChange("dentalQuadrantType", "adult")}
          >
            Adult
          </Checkbox>
          <Checkbox
            checked={formState.dentalQuadrantType === "child"}
            onChange={() => handleInputChange("dentalQuadrantType", "child")}
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
            onChange={(e) => handleInputChange("xrayStatus", e.target.checked)}
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
          className="mt-3"
          onClick={handleSubmit}
          type="primary"
          loading={loading}
        >
          {isEdit ? "Update Diagnosis" : "Submit Diagnosis"}
        </Button>

        <hr />

        {diagnosisData?.treatments?.length > 0 && (
          <div className="my-3">
            <hr />
            <p>Treatements Settings</p>
            {diagnosisData.treatments.map((treatment) => {
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
            })}
          </ div>
        )}
        {treatments.map((treatment, index) => (
          <Card key={index} className="mb-3">
            <Card.Header>
              <DateCell date={treatment.treatmentDate} />
            </Card.Header>
            <Card.Body>
              <Form.Item label="Treatment Date">
                <DatePicker
                  value={treatment.treatmentDate}
                  onChange={(value) =>
                    handleTreatmentChange(index, "treatmentDate", value)
                  }
                  className="w-100"
                />
              </Form.Item>
              <Form.Item label="Treatment Status">
                <Select
                  mode="multiple"
                  value={treatment.treatmentStatus}
                  onChange={(value) =>
                    handleTreatmentChange(index, "treatmentStatus", value)
                  }
                  options={[
                    { value: "Done", label: "Done" },
                    {
                      value: "RC Open 1st Completed",
                      label: "RC Open 1st Completed",
                    },
                    { value: "Final Cementation", label: "Final Cementation" },
                  ]}
                  className="w-100"
                />
              </Form.Item>
              <Form.Item label="Notes">
                <Input.TextArea
                  value={treatment.notes}
                  onChange={(e) =>
                    handleTreatmentChange(index, "notes", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Total Amount">
                <Input
                  type="number"
                  value={treatment.totalAmount}
                  onChange={(e) =>
                    handleTreatmentChange(index, "totalAmount", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Paid Amount">
                <Input
                  type="number"
                  value={treatment.paidAmount}
                  onChange={(e) =>
                    handleTreatmentChange(index, "paidAmount", e.target.value)
                  }
                />
              </Form.Item>
              <Form.Item label="Remaining Amount">
                <Input
                  type="number"
                  value={treatment.remainingAmount || 0}
                  readOnly
                  className="w-100"
                />
              </Form.Item>
              <Button
                onClick={() => handleSubmitNewTreatment(index)}
                type="primary"
                className="mb-3"
                loading={loading}
              >
                Submit Treatment
              </Button>
            </Card.Body>
          </Card>
        ))}

        {diagnosisData?.id && (
          <Button onClick={addNewTreatment} type="dashed" className="mb-3">
            Add New Treatment
          </Button>
        )}
      </Form>
    </Drawer>
  );
};

export default PatientDiagnosisForm;
