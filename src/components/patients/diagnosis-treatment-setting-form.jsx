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
  Radio,
  DatePicker,
} from "antd";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import { Card } from "react-bootstrap";
import { transformText } from "../../utilities/utility-function";
import { RiUpload2Fill } from "@remixicon/react";
import dayjs from "dayjs";

const DiagnosisTreatmentSettingForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave = () => {},
  patientData,
  selectedTreatments,
  doctorsList,
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
    treatingDoctor: {},
    nextDate: dayjs(),
    paymentMode: "offline",
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
        treatingDoctor: {},
        nextDate: dayjs(),
        paymentMode: "",
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
        treatingDoctor,
        onlineAmount,
        offlineAmount,
        paymentMode,
        nextDate,
      } = formState;

      let formData = new FormData();
      formData.append("patientId", diagnosisData.patientId);
      formData.append("settingNotes", notes);
      formData.append("settingTreatmentDate", treatmentDate);
      formData.append("treatmentStatus", JSON.stringify(treatmentStatus));
      formData.append("treatmentSettingId", selectedTreatments.id);
      formData.append("xrayStatus", xrayStatus);
      formData.append("treatingDoctor", JSON.stringify(treatingDoctor));
      formData.append("settingPaidAmount", settingPaidAmount);
      formData.append("onlineAmount", onlineAmount);
      formData.append("offlineAmount", offlineAmount);
      formData.append("paymentMode", paymentMode);
      formData.append("nextDate", JSON.stringify(nextDate));

      if (xray) {
        xray.forEach((file) => {
          formData.append("xrayFiles", file);
        });
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

  console.log("is edit form state --.", formState);
  return (
    <Form layout="vertical">
      <Form.Item label="Treatment Status">
        <Select
          mode="multiple"
          value={formState.treatmentStatus}
          onChange={(value) => handleInputChange2("treatmentStatus", value)}
          options={[
            { label: "OPD done", value: "OPD done" },
            {
              label: "RCO done anterior",
              value: "RCO done anterior",
            },
            {
              label: "BMP done anterior",
              value: "BMP done anterior",
            },
            {
              label: "Obturation done anterior",
              value: "Obturation done anterior",
            },
            {
              label: "Single Sitting RCT - Anterior",
              value: "Single Sitting RCT - Anterior",
            },
            {
              label: "Single Sitting RCT - Post",
              value: "Single Sitting RCT - Post",
            },
            {
              label: "RCO - Posterior",
              value: "RCO - Posterior",
            },
            {
              label: "BMP - Posterior",
              value: "BMP - Posterior",
            },
            {
              label: "Obturation + POR Posterior",
              value: "Obturation + POR Posterior",
            },
            { label: "RCO done", value: "RCO done" },
            { label: "BMP done", value: "BMP done" },
            { label: "Obturation + POR", value: "Obturation + POR" },
            { label: "Crown cutting", value: "Crown cutting" },
            { label: "Crown cementation", value: "Crown cementation" },
            { label: "FPD", value: "FPD" },
            { label: "Bridge cementation", value: "Bridge cementation" },
            { label: "Crown removal", value: "Crown removal" },
            { label: "Bridge try-in", value: "Bridge try-in" },
            { label: "GIC done", value: "GIC done" },
            { label: "Composite done", value: "Composite done" },
            {
              label: "Occlusal adjustment done",
              value: "Occlusal adjustment done",
            },
            { label: "Irrigation done", value: "Irrigation done" },
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
            { label: "Bond filling done", value: "Bond filling done" },
            { label: "Frenectomy", value: "Frenectomy" },
            { label: "Operculectomy done", value: "Operculectomy done" },
            { label: "Cusp guiding done", value: "Cusp guiding done" },
            { label: "Finishing + Polishing", value: "Finishing + Polishing" },
            {
              label: "Scaling + Polishing (Prophylaxis)",
              value: "Scaling + Polishing (Prophylaxis)",
            },
            { label: "Post n Core done", value: "Post n Core done" },
            {
              label: "Composite buildup done",
              value: "Composite buildup done",
            },
            { label: "POR done", value: "POR done" },
            { label: "Fluoride application", value: "Fluoride application" },
            { label: "Fluoride varnish", value: "Fluoride varnish" },
            { label: "Pit & fissure sealant", value: "Pit & fissure sealant" },
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

            {selectedTreatments?.xray &&
              selectedTreatments?.xray?.map((file) => (
                <div className="d-flex flex-col gap-2">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      type="link"
                      style={{
                        padding: 0,
                        fontSize: "14px",
                        textDecoration: "underline",
                        color: "#1890ff",
                      }}
                      href={`/files?key=${file?.key}`}
                      onClick={() => {}}
                    >
                      {file?.fileName || "file"}
                    </Button>
                  </div>
                </div>
              ))}
          </Form.Item>
        )}
      </div>

      <Form.Item label="Payment mode">
        <Radio.Group
          value={formState?.paymentMode}
          onChange={(e) => {
            console.log("e target", e.target)
            handleInputChange2("paymentMode", e.target.value)}}
        >
          <Radio value="online">Online</Radio>
          <Radio value="offline">Offline</Radio>
          <Radio value="both">Both</Radio>
        </Radio.Group>
      </Form.Item>

      {formState.paymentMode == "online" ||
      formState.paymentMode == "offline" ? (
        <Form.Item label="Setting Paid Amount">
          <Input
            type="number"
            value={
              formState.paymentMode == "online"
                ? formState.onlineAmount
                : formState.offlineAmount
            }
            onChange={(e) => {
              const key =
                formState.paymentMode === "online"
                  ? "onlineAmount"
                  : "offlineAmount";
              handleInputChange(key, e.target.value);
            }}
          />
        </Form.Item>
      ) : (
        <div className="d-flex gap-3">
          <Form.Item label="Online paid">
            <Input
              type="number"
              value={formState?.onlineAmount || ""}
              onChange={(e) =>
                handleInputChange("onlineAmount", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Offline paid">
            <Input
              type="number"
              value={formState?.offlineAmount || ""}
              onChange={(e) =>
                handleInputChange("offlineAmount", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Total paid">
            <Input
              type="number"
              value={formState.onlineAmount + formState.offlineAmount}
              readOnly
              onChange={(e) =>
                handleInputChange("offlineAmount", e.target.value)
              }
            />
          </Form.Item>
        </div>
      )}

      <Form.Item label="Treating Doctor" className="w-100">
        <Select
          value={formState.treatingDoctor}
          onChange={(value, option) =>
            handleInputChange("treatingDoctor", option)
          }
          options={doctorsList}
          className="w-100"
        />
      </Form.Item>

      <Form.Item label="Add Notes">
        <Input.TextArea
          value={formState.notes}
          onChange={(e) => handleInputChange2("notes", e.target.value)}
        />
      </Form.Item>
      <Form.Item label="Next follow-up Date" className="w-100">
        <DatePicker
          value={formState?.nextDate ? dayjs(formState.nextDate) : null}
          onChange={(value) => handleInputChange2("nextDate", value)}
          className="w-100"
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
