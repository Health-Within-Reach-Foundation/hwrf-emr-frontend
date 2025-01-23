import React, { useEffect, useState } from "react";
import { Drawer, Input, TreeSelect, Select, Button } from "antd";
import { Card, Form } from "react-bootstrap";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import TeethSelector from "../adult-teeth-selector/teeth-selector";
import ChildTeethSelector from "../child-teeth-selector/child-teeth-selector";

const DiagnosisTreatmentSettingForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave = () => {},
  patientData,
  selectedTreatments,
}) => {

  console.log("selected treatement --> ", selectedTreatments, diagnosisData)
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    complaints: diagnosisData?.complaints,
    treatments: diagnosisData?.treatments,
    treatmentDate: new Date().toISOString().split("T")[0],
    notes: "",
    treatmentStatus: [],
    dentalQuadrantType: "adult",
    selectedTeeth: [],
    totalAmount: null,
    paidAmount: null,
    remainingAmount: null,
  });

  useEffect(() => {
    if (isEdit && selectedTreatments) {
      const {
        createdAt,
        updatedAt,
        treatments,
        id,
        patientId,
        additionalDetails,
        selectedTeeth,
        complaints,
        dentalQuadrant,
        xrayStatus,
        xray,
        treatmentid,
        settingPaidAmount,
        dentalQuadrantType,
        diagnosisId,
        ...filteredData
      } = selectedTreatments;

      setFormState({
        treatmentSettingId: id,
        settingPaidAmount,
        ...filteredData,
      });
    } else {
      setFormState({
        // complaints: diagnosisData?.complaints,
        // treatments: diagnosisData?.treatmentsSuggested,
        treatmentDate: new Date().toISOString().split("T")[0],
        notes: "",
        treatmentStatus: [],
        dentalQuadrantType: "adult",
        selectedTeeth: [],
        totalAmount: null,
        paidAmount: null,
        remainingAmount: null,
      });
    }
  }, [isEdit, diagnosisData]);

  //   useEffect(() => {
  //     setFormState((prev) => ({
  //       ...prev,
  //       selectedTeeth: [],
  //     }));
  //   }, [formState.dentalQuadrantType]);

  const handleInputChange = (key, value) => {
    // Ensure that the entered value is always non-negative
    const sanitizedValue = Math.max(0, parseFloat(value) || 0);

    setFormState((prev) => {
      const updatedState = { ...prev, [key]: sanitizedValue };

      // Calculate the remaining amount dynamically
      if (key === "totalAmount" || key === "paidAmount") {
        const totalAmount =
          key === "totalAmount" ? sanitizedValue : prev.totalAmount || 0;
        const paidAmount =
          key === "paidAmount" ? sanitizedValue : prev.paidAmount || 0;
        updatedState.remainingAmount = Math.max(0, totalAmount - paidAmount);
      }

      return updatedState;
    });
  };

  const handleInputChange2 = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const {
        notes,
        treatmentId,
        treatmentStatus, 
        treatmentDate,
        settingPaidAmount,
      } = formState;

      let formData = {
        settingNotes: notes,
        settingTreatmentDate:treatmentDate,
        treatmentStatus,
        treatmentSettingId: selectedTreatments.id,
        settingPaidAmount,
      };
      let response;
      if (isEdit) {

        console.log("*********************", formData)
        response = await patientServices.updateTreatmentById(
          selectedTreatments?.treatmentId,
          formData
        );

        console.log("for, state for updating treatement --> ", formState);
      } else {
        // formData.append("patientId", patientData.id);
        const {
          treatmentDate,
          treatmentStatus,
          notes,
          totalAmount,
          paidAmount,
          remainingAmount,
        } = formState;

        formData = {
          treatmentDate,
          treatmentStatus,
          notes,
          totalAmount,
          paidAmount,
          remainingAmount,
          diagnosisId: diagnosisData.id,
        };

        response = await patientServices.addTreatmentByDiagnosis(formData);
      }

      if (response?.success) {
        toast.success(response.message || "Treatment saved successfully!");
        onSave(); // Callback after successful save
      } else {
        toast.error(response?.message || "Failed to save Treatment.");
      }
    } catch (error) {
      console.error("Error saving diagnosis Treatment:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    // <Drawer
    //   title={isEdit ? "Edit Treatment" : "Add Treatment Setting"}
    //   placement="right"
    //   onClose={onClose}
    //   open={drawerVisible}
    //   width={600}
    // >
      <Form>
        {/* <Form.Group className="py-2">
          <Form.Label>Treatment Date</Form.Label>
          <Form.Control
            type="date"
            value={formState.treatmentDate}
            defaultValue={new Date().getDate()}
            onChange={(e) => handleInputChange("treatmentDate", e.target.value)}
          />
        </Form.Group>
        <Form.Group className="py-2">
          <Form.Label>Complaints</Form.Label>
          <Select
            mode="multiple"
            disabled
            value={diagnosisData.complaints}
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
        </Form.Group>
        <Form.Group className="py-2">
          <Form.Label>Treatment</Form.Label>
          <Select
            mode="multiple"
            value={diagnosisData.treatments}
            disabled
            onChange={(value) => handleInputChange("treatmentsSuggested", value)}
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
        </Form.Group>
        
        {diagnosisData.dentalQuadrantType === "adult" && (
          <Form.Group className="py-2">
            <TeethSelector
              isEdit={true}
              selectedTeeth={[diagnosisData.selectedTeeth] || []}
              onChange={(updatedTeeth) => {
                console.log(updatedTeeth);
                setFormState((prev) => ({
                  ...prev,
                  selectedTeeth: updatedTeeth,
                }));
              }}
            />
          </Form.Group>
        )}
        {diagnosisData.dentalQuadrantType === "child" && (
          <Form.Group className="py-2">
            <ChildTeethSelector
              isEdit={isEdit}
              selectedTeeth={formState.selectedTeeth || []}
              onChange={(updatedTeeth) => {
                console.log(updatedTeeth);
                setFormState((prev) => ({
                  ...prev,
                  selectedTeeth: updatedTeeth,
                }));
              }}
            />
          </Form.Group>
        )}

        <Form.Group className="py-2">
          <Form.Label>Diagnosis Notes </Form.Label>
          <Input.TextArea
            value={diagnosisData.notes}
            readOnly
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </Form.Group> */}
        {/* <hr className="dark"/> */}
          <Card>
            <Card.Header>Treatment Setting Form</Card.Header>
            <Card.Body>
              <Form.Group className="py-2">
                <Form.Label>Treatment Status</Form.Label>
                <Select
                  mode="multiple"
                  value={formState.treatmentStatus}
                  onChange={(value) =>
                    handleInputChange2("treatmentStatus", value)
                  }
                  options={[
                    { value: "Done", label: "Done" },
                    {
                      value: "RC Open 1st Completed",
                      label: "RC Open 1st Completed",
                    },
                    { value: "RC 2nd - Completed", label: "RC 2nd - Completed" },
                    { value: "RC 3rd - Completed", label: "RC 3rd - Completed" },
                    { value: "Impression Taken", label: "Impression Taken" },
                    { value: "Crown Trail Done", label: "Crown Trail Done" },
                    { value: "Final Cementation", label: "Final Cementation" },
                    { value: "NA", label: "NA" },
                    { value: "OPD Done", label: "OPD Done" },
                  ]}
                  className="w-100"
                />
              </Form.Group>

              <Form.Group className="py-2">
                <Form.Label>Paid Amount</Form.Label>
                <Form.Control
                  type="number"
                  value={formState.settingPaidAmount || ""}
                  onChange={(e) =>
                    handleInputChange("settingPaidAmount", e.target.value)
                  }
                />
              </Form.Group>
              <Form.Group className="py-2">
                <Form.Label>Add Notes </Form.Label>
                <Input.TextArea
                  value={formState.notes}
                  onChange={(e) => handleInputChange2("notes", e.target.value)}
                />
              </Form.Group>
{/* 
              <Form.Group className="py-2">
                <Form.Label>Total cost</Form.Label>
                <Form.Control
                  type="number"
                  value={formState.totalAmount || ""}
                  onChange={(e) =>
                    handleInputChange("totalAmount", e.target.value)
                  }
                />
              </Form.Group>

             

              <Form.Group className="py-2">
                <Form.Label>Remaining cost</Form.Label>
                <Form.Control
                  type="number"
                  value={formState.remainingAmount || ""}
                  readOnly
                />
              </Form.Group> */}

              <Button className="mt-3" onClick={handleSubmit} type="primary" loading={loading}>
                {isEdit ? "Update treatment" : "Add"}
              </Button>
            </Card.Body>
          </Card>
      </Form>
    // </Drawer>
  );
};

export default DiagnosisTreatmentSettingForm;
