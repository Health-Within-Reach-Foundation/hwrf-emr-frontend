import React, { useEffect, useState } from "react";
import {
  Input,
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
import { RiUpload2Fill } from "@remixicon/react";
import dayjs from "dayjs";
import { treatmentStatusOptions } from "../../utilities/constants";

const DiagnosisTreatmentSettingForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave = () => {},
  patientData,
  selectedTreatment,
  doctorsList,
  formFields,
}) => {
  console.log("selected treatement --> ", selectedTreatment, diagnosisData);
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    treatmentDate: new Date().toISOString().split("T")[0],
    notes: "",
    treatmentStatus: [],
    remainingAmount: null,
    xrayStatus: false,
    crownStatus: false,
    xray: [], // Manage uploaded files here
    treatingDoctor: {},
    nextDate: null,
  });

  const [treatmentForm] = Form.useForm();

  useEffect(() => {
    if (isEdit && selectedTreatment) {
      const {
        createdAt,
        updatedAt,
        id,
        additionalDetails,
        xray,
        treatmentId,
        nextDate,
        campId,
        ...filteredData
      } = selectedTreatment;

      setFormState({
        treatmentSettingId: id,
        xray: [],
        nextDate: nextDate ? dayjs(nextDate) : null,
        ...filteredData,
      });
    } else {
      setFormState({
        notes: "",
        treatmentStatus: [],
        remainingAmount: null,
        xrayStatus: false,
        crownStatus: false,
        xray: [],
        treatingDoctor: {},
        nextDate: null,
      });
    }
  }, [isEdit, diagnosisData]);

  useEffect(() => {
    treatmentForm.setFieldsValue(formState);
  }, [formState]);

  const handleAmountChange = (key, value) => {
    const sanitizedValue = Math.max(0, parseFloat(value) || 0);

    setFormState((prev) => {
      const updatedState = { ...prev, [key]: sanitizedValue };

      const totalAmount = prev.totalAmount || 0;
      const onlineAmount =
        key === "onlineAmount" ? sanitizedValue : prev.onlineAmount || 0;
      const offlineAmount =
        key === "offlineAmount" ? sanitizedValue : prev.offlineAmount || 0;

      updatedState.remainingAmount = Math.max(
        0,
        totalAmount - (onlineAmount + offlineAmount)
      );

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
        treatmentStatus,
        treatmentDate,
        xrayStatus,
        crownStatus,
        xray,
        treatingDoctor,
        onlineAmount,
        offlineAmount,
        nextDate,
      } = formState;

      let formData = new FormData();

      // Object.entries(formState).forEach(([key, value]) => {
      //   if(key === "xray" && Array.isArray(value)) {
      //     value.forEach((file) => {
      //       formData.append("xrayFiles", file);
      //     });
      //   } else if (Array.isArray(value) || typeof value === "object") {
      //     formData.append(key, JSON.stringify(value));
      //   } else {
      //     formData.append(key, value);
      //   }
      // });

      formData.append("patientId", diagnosisData.patientId);
      formData.append("settingNotes", notes);
      formData.append("settingTreatmentDate", treatmentDate);
      formData.append("treatmentStatus", JSON.stringify(treatmentStatus));
      formData.append("treatmentSettingId", selectedTreatment.id);
      formData.append("xrayStatus", xrayStatus);
      formData.append("crownStatus", crownStatus);
      formData.append("treatingDoctor", JSON.stringify(treatingDoctor));
      formData.append("onlineAmount", onlineAmount);
      formData.append("offlineAmount", offlineAmount);
      formData.append("nextDate", JSON.stringify(nextDate));

      if (xray) {
        xray.forEach((file) => {
          formData.append("xrayFiles", file);
        });
      }

      let response;
      if (isEdit) {
        response = await patientServices.updateTreatmentById(
          selectedTreatment?.treatmentId,
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
        toast.success(response?.message || "Treatment saved successfully!");
        // onSave();
      } else {
        toast.error(response?.message || "Failed to save Treatment.");
      }
    } catch (error) {
      console.error("Error saving diagnosis Treatment:", error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
      onSave();
    }
  };

  console.log("is edit form state --.", formState);
  return (
    <Form
      layout="vertical"
      form={treatmentForm}
      initialValues={formState}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="Treatment Status"
        name={"treatmentStatus"}
        required
        rules={[{ required: true, message: "Please select treatment status" }]}
      >
        <Select
          mode="multiple"
          value={formState.treatmentStatus}
          onChange={(value) => handleInputChange2("treatmentStatus", value)}
          // options={treatmentStatusOptions}
          // options={options?.treatmentStatusOptions || []}
          options={
            formFields["Dental Treatment Form"]?.find(
              (field) => field?.fieldName === "treatmentStatusOptions"
            )?.options || []
          }
          className="w-100"
        />
      </Form.Item>

      <div className="w-100 d-flex justify-content-between gap-3">
        <Form.Item
          className="w-100"
          name={"crownStatus"}
          label="Crown Status"
          extra="Please check the box above if the treatment status is associated with a crown."
        >
          <Checkbox
            checked={formState.crownStatus}
            onChange={(e) =>
              handleInputChange2("crownStatus", e.target.checked)
            }
          ></Checkbox>
        </Form.Item>
        <Form.Item className="w-100" name={"xrayStatus"} label="X-ray Status">
          <Checkbox
            checked={formState.xrayStatus}
            onChange={(e) => handleInputChange2("xrayStatus", e.target.checked)}
          ></Checkbox>
        </Form.Item>

        {formState.xrayStatus && (
          <Form.Item label="Upload X-ray Files" className="w-100" name={"xray"}>
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

            {selectedTreatment?.xray &&
              selectedTreatment?.xray?.map((file) => (
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

      <div className="d-flex gap-3">
        <Form.Item
          label="Online paid"
          name={"onlineAmount"}
          required
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input
            type="number"
            value={formState?.onlineAmount || ""}
            onChange={(e) => handleAmountChange("onlineAmount", e.target.value)}
          />
        </Form.Item>
        <Form.Item
          label="Offline paid"
          name={"offlineAmount"}
          required
          rules={[{ required: true, message: "Please enter amount" }]}
        >
          <Input
            type="number"
            value={formState?.offlineAmount || ""}
            onChange={(e) =>
              handleAmountChange("offlineAmount", e.target.value)
            }
          />
        </Form.Item>
        <Form.Item label="Total paid">
          <Input
            type="number"
            value={
              Number(formState.onlineAmount) + Number(formState.offlineAmount)
            }
            readOnly
            disabled
            onChange={() => {}}
          />
        </Form.Item>
      </div>

      <Form.Item
        label="Treating Doctor"
        className="w-100"
        name={"treatingDoctor"}
        required
        rules={[{ required: true, message: "Please select treating doctor" }]}
      >
        <Select
          value={formState.treatingDoctor}
          onChange={(value, option) =>
            handleInputChange2("treatingDoctor", option)
          }
          options={doctorsList}
          className="w-100"
        />
      </Form.Item>

      <Form.Item label="Add Notes" name={"notes"}>
        <Input.TextArea
          value={formState.notes}
          onChange={(e) => handleInputChange2("notes", e.target.value)}
        />
      </Form.Item>
      <Form.Item
        label="Next follow-up Date"
        className="w-100"
        name={"nextDate"}
        required={false}
      >
        <DatePicker
          defaultValue={formState?.nextDate}
          // value={formState?.nextDate !== null ? dayjs(formState.nextDate) : null}
          onChange={(date, dateString) =>
            handleInputChange2("nextDate", dayjs(dateString))
          }
          className="w-100"
        />
      </Form.Item>

      <Form.Item className="d-flex justify-content-end">
        <Button
          className="rounded-0 bg-primary"
          onClick={() => {
            treatmentForm
              .validateFields()
              .then(() => {
                handleSubmit();
              })
              .catch((errorInfo) => {
                console.log("Validation failed", errorInfo);
              });
          }}
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
