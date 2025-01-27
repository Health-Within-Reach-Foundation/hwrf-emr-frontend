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
} from "antd";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import { Card } from "react-bootstrap";
import { transformText } from "../../utilities/utility-function";
import { RiUpload2Fill } from "@remixicon/react";

const DiagnosisTreatmentSettingForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave = () => {},
  patientData,
  selectedTreatments,
}) => {
  console.log("selected treatement --> ", selectedTreatments, diagnosisData);
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
    xrayStatus: false,
    xray: [], // Manage uploaded files here
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
        xray: [],
        xrayStatus,
        ...filteredData,
      });
    } else {
      setFormState({
        treatmentDate: new Date().toISOString().split("T")[0],
        notes: "",
        treatmentStatus: [],
        dentalQuadrantType: "adult",
        selectedTeeth: [],
        totalAmount: null,
        paidAmount: null,
        remainingAmount: null,
        xrayStatus: false,
        xray: [],
      });
    }
  }, [isEdit, diagnosisData]);

  const handleInputChange = (key, value) => {
    const sanitizedValue = Math.max(0, parseFloat(value) || 0);

    setFormState((prev) => {
      const updatedState = { ...prev, [key]: sanitizedValue };

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
        xrayStatus,
        xray,
      } = formState;

      let formData = new FormData();
      formData.append("patientId", diagnosisData.patientId)
      formData.append("settingNotes", notes)
      formData.append("settingTreatmentDate", treatmentDate)
      formData.append("treatmentStatus", JSON.stringify(treatmentStatus))
      formData.append("treatmentSettingId", selectedTreatments.id)
      formData.append("xrayStatus", xrayStatus)
      if(xray){
        xray.forEach((file) => {
          formData.append("xrayFiles", file)
        })
      }

      // let formData = {
      //   settingNotes: notes,
      //   settingTreatmentDate: treatmentDate,
      //   treatmentStatus,
      //   treatmentSettingId: selectedTreatments.id,
      //   settingPaidAmount,
      //   xrayStatus,
      //   xray,
      //   patientId: diagnosisData.patientId,
      // };

      let response;
      if (isEdit) {
        console.log("*********************", formData);
        response = await patientServices.updateTreatmentById(
          selectedTreatments?.treatmentId,
          formData
        );

        console.log("form state for updating treatment --> ", formState);
      } else {
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
        // onSave();
      } else {
        toast.error(response?.message || "Failed to save Treatment.");
      }
    } catch (error) {
      console.error("Error saving diagnosis Treatment:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      onSave();
    }
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Treatment Status">
        <Select
          mode="multiple"
          value={formState.treatmentStatus}
          onChange={(value) => handleInputChange2("treatmentStatus", value)}
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
      </Form.Item>

      <div className="w-100 d-flex justify-content-between gap-3">
        <Form.Item className="w-100">
          <Checkbox
            checked={formState.xrayStatus}
            onChange={(e) => handleInputChange2("xrayStatus", e.target.checked)}
          >
            X-ray Status
          </Checkbox>
        </Form.Item>

        {formState.xrayStatus && (
          <Form.Item label="Upload X-ray Files" className="w-100">
            <Upload
              multiple
              beforeUpload={(file) => {
                handleInputChange2("xray", [...formState.xray, file]);
                return false; // Prevent auto-upload
              }}
              fileList={formState.xray}
              onRemove={(file) => {
                handleInputChange2(
                  "xray",
                  formState.xray.filter((item) => item.uid !== file.uid)
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

      <Form.Item label="Paid Amount">
        <Input
          type="number"
          value={formState.settingPaidAmount || ""}
          onChange={(e) =>
            handleInputChange("settingPaidAmount", e.target.value)
          }
        />
      </Form.Item>

      <Form.Item label="Add Notes">
        <Input.TextArea
          value={formState.notes}
          onChange={(e) => handleInputChange2("notes", e.target.value)}
        />
      </Form.Item>

      <Form.Item className="d-flex justify-content-end">
        <Button
          className="rounded-0 bg-primary"
          onClick={handleSubmit}
          type="primary"
          loading={loading}
        >
          {isEdit ? "Update treatment" : "Add"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DiagnosisTreatmentSettingForm;
