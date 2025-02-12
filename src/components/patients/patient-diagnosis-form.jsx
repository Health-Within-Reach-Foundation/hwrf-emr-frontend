// TODO:  Warning: [antd: Form.Item] A `Form.Item` with a `name` prop must have a single child element. For information on how to render more complex form items, see
import React, { useEffect, useState } from "react";
import {
  Drawer,
  Input,
  Select,
  Button,
  Form,
  Upload,
  Checkbox,
  DatePicker,
  Dropdown,
  Badge,
} from "antd";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import TeethSelector from "../adult-teeth-selector/teeth-selector";
import ChildTeethSelector from "../child-teeth-selector/child-teeth-selector";
import {
  RiAddLine,
  RiDeleteBin2Fill,
  RiDeleteBin2Line,
  RiSaveFill,
  RiUpload2Fill,
} from "@remixicon/react";
import DiagnosisTreatmentSettingForm from "./diagnosis-treatment-setting-form";
import { Accordion, Card } from "react-bootstrap";
import dayjs from "dayjs";
import DateCell from "../date-cell";
import {
  complaintsOptions,
  treatmentsOptions,
  treatmentStatusOptions,
} from "../../utilities/constants";

const PatientDiagnosisForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave,
  patientData,
  doctorsList,
  options,
}) => {
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
        xrayStatus: false,
        crownStatus: false,
        xray: [], // Array to store uploaded files
        treatingDoctor: {},
        nextDate: null,
        onlineAmount: 0,
        offlineAmount: 0,
      },
    ],
  });

  const [diagnosisForm] = Form.useForm();
  const [treatmentForm] = Form.useForm();

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
          xrayStatus: false,
          crownStatus: false,
          xray: [],
          treatingDoctor: {},
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

      let updatedPaidAmount = Number(diagnosisData.treatment.paidAmount) || 0;
      let updatedRemainingAmount = Number(prev.totalAmount);

      // Calculate the total paid amount from all settings
      updatedSettings.forEach((setting) => {
        updatedPaidAmount +=
          Number(setting.onlineAmount || 0) +
          Number(setting.offlineAmount || 0);
      });

      // Ensure remainingAmount is never negative
      updatedRemainingAmount = Math.max(
        0,
        Number(prev.totalAmount) - updatedPaidAmount
      );

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
        campId,
        treatmentStatus,
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

  useEffect(() => {
    diagnosisForm.setFieldsValue(formState);
  }, [formState]);

  useEffect(() => {
    treatmentForm.setFieldsValue(treatments);
  }, [treatments]);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare FormData object
      const formData = new FormData();

      console.log(
        "form state before making or updating diagnosis -->",
        formState
      );
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
      toast.error("Internal server error!");
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
              onClick={() => {
                diagnosisForm
                  .validateFields()
                  .then(() => {
                    handleSubmit();
                  })
                  .catch((errorInfo) => {
                    console.error("Validation Failed:", errorInfo);
                  });
              }}
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
                disabled={loading}
              >
                <RiDeleteBin2Line />
              </Button>
            )}
          </div>
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={formState}
            form={diagnosisForm}
          >
            <div className="w-100 d-flex justify-content-between gap-3">
              <Form.Item
                label="Complaints"
                className="w-100"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one complaint",
                  },
                ]}
                name={"complaints"}
                required
              >
                <Select
                  mode="multiple"
                  value={formState.complaints}
                  onChange={(value) => handleInputChange("complaints", value)}
                  options={options?.complaintsOptions}
                />
              </Form.Item>
              <Form.Item
                label="Treatment"
                className="w-100"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one treatment",
                  },
                ]}
                name={"treatmentsSuggested"}
                required
              >
                <Select
                  mode="multiple"
                  value={formState.treatmentsSuggested}
                  onChange={(value) =>
                    handleInputChange("treatmentsSuggested", value)
                  }
                  // options={treatmentsOptions}
                  options={options?.treatmentsSuggestedOptions}
                  className="w-100"
                />
              </Form.Item>
            </div>

            <div className="w-100 d-flex flex-md-row flex-column justify-content-between gap-5">
              <div className="d-flex flex-column">
                <div className="w-100 d-flex">
                  <Form.Item
                    label="Qudrant type for teeth selection"
                    required
                    name={"dentalQuadrantType"}
                    rules={[
                      {
                        required: true,
                        message: "Please select the dental quadrant type",
                      },
                    ]}
                  >
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
                    <Form.Item
                      label="Select Teeth"
                      required
                      name={isEdit ? "selectedTeeth" : "adultSelectedTeeth"}
                      rules={[
                        { required: true, message: "Please select the teeth" },
                      ]}
                    >
                      <TeethSelector
                        isEdit={isEdit}
                        selectedTeeth={formState.adultSelectedTeeth}
                        onChange={(updatedTeeth) => {
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
                    <Form.Item
                      label="Select Teeth"
                      required
                      name={isEdit ? "selectedTeeth" : "childSelectedTeeth"}
                      rules={[
                        { required: true, message: "Please select the teeth" },
                      ]}
                    >
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
                <Form.Item
                  className="w-100"
                  label="X-ray Status"
                  name={"xrayStatus"}
                >
                  <Checkbox
                    checked={formState.xrayStatus}
                    onChange={(e) =>
                      handleInputChange("xrayStatus", e.target.checked)
                    }
                  >
                    X-ray Status
                  </Checkbox>
                </Form.Item>
                {diagnosisData?.xray &&
                  diagnosisData?.xray?.map((file) => (
                    <div className="d-flex flex-col gap-2" key={file?.key}>
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
                {formState.xrayStatus && (
                  <Form.Item
                    label="Upload X-ray Files"
                    className="w-100"
                    name={"xray"}
                  >
                    <Upload
                      multiple
                      accept="image/*"
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
                          xray: prev.xray.filter(
                            (item) => item.uid !== file.uid
                          ),
                        }));
                      }}
                    >
                      <Button icon={<RiUpload2Fill />} variant="outlined">
                        Upload
                      </Button>
                    </Upload>
                  </Form.Item>
                )}
                <Form.Item label="Notes">
                  <Input.TextArea
                    value={formState.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                  />
                </Form.Item>

                <Form.Item
                  label="Estimated Cost"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the estimated cost",
                    },
                  ]}
                  name={"estimatedCost"}
                  required
                >
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
              onFinish={handleSubmit}
              initialValues={treatments}
              form={treatmentForm}
            >
              <div className="d-flex gap-2">
                <Form.Item
                  label="Total Amount"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the total amount",
                    },
                  ]}
                  name={"totalAmount"}
                  required
                >
                  <Input
                    type="number"
                    defaultValue={diagnosisData?.treatment?.totalAmount || 0}
                    value={treatments.totalAmount}
                    onChange={(e) =>
                      handleTreatmentChange("totalAmount", e.target.value)
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="Total Paid Amount"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the total paid amount",
                    },
                  ]}
                  name={"paidAmount"}
                  required
                >
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
                <Form.Item
                  label="Remaining Amount"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the remaining amount",
                    },
                  ]}
                  name={"remainingAmount"}
                  required
                >
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
                        remainingAmount: treatments.remainingAmount,
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
                      <Form.Item
                        label="Treatment Date"
                        className="w-100"
                        rules={[
                          {
                            required: true,
                            message: "Please select the treatment date",
                          },
                        ]}
                        // name={`treatmentDate_${index}`}
                        name={["newTreatmentSetting", index, "treatmentDate"]}
                        required
                      >
                        <DatePicker
                          value={setting.treatmentDate}
                          onChange={(value) => {
                            handleTreatmentSettingChange(
                              index,
                              "treatmentDate",
                              value
                            );
                          }}
                          className="w-100"
                        />
                      </Form.Item>

                      <Form.Item
                        label="Treatment Status"
                        className="w-100"
                        rules={[
                          {
                            required: true,
                            message: "Please select the treatment status",
                          },
                        ]}
                        name={["newTreatmentSetting", index, "treatmentStatus"]}
                        required
                      >
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
                          // options={treatmentStatusOptions}
                          options={options?.treatmentStatusOptions}
                          className="w-100"
                        />
                      </Form.Item>
                    </div>
                    <div className="w-100 d-flex flex-column flex-sm-row justify-content-between gap-3">
                      <Form.Item
                        className="w-100"
                        name={["newTreatmentSetting", index, "crownStatus"]}
                        label="Crown Status"
                        // extra="Please check the box above if the treatment status is associated with a crown."
                        extra={
                          <p className="text-warning">
                            Please check the box above if the treatment status
                            is associated with a crown.
                          </p>
                        }
                      >
                        <Checkbox
                          checked={setting.crownStatus}
                          onChange={(e) =>
                            handleTreatmentSettingChange(
                              index,
                              "crownStatus",
                              e.target.checked
                            )
                          }
                        ></Checkbox>
                      </Form.Item>

                      <Form.Item
                        className="w-100"
                        name={["newTreatmentSetting", index, "xrayStatus"]}
                        label="X-ray Status"
                      >
                        <Checkbox
                          checked={setting.xrayStatus}
                          onChange={(e) =>
                            handleTreatmentSettingChange(
                              index,
                              "xrayStatus",
                              e.target.checked
                            )
                          }
                        ></Checkbox>
                      </Form.Item>

                      {setting.xrayStatus && (
                        <Form.Item
                          label="Upload X-ray Files"
                          className="w-100"
                          rules={[
                            {
                              required: true,
                              message: "Please upload the X-ray files",
                            },
                          ]}
                          name={["newTreatmentSetting", index, "xray"]}
                          required
                        >
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
                        <div className="d-flex flex-row gap-2">
                          <Form.Item
                            label="Online Paid Amount"
                            className="w-100"
                            rules={[
                              {
                                required: true,
                                message: "Please enter the online paid amount",
                              },
                            ]}
                            name={[
                              "newTreatmentSetting",
                              index,
                              "onlineAmount",
                            ]}
                            required
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
                            rules={[
                              {
                                required: true,
                                message: "Please enter the offline paid amount",
                              },
                            ]}
                            name={[
                              "newTreatmentSetting",
                              index,
                              "offlineAmount",
                            ]}
                            required
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
                            rules={[
                              {
                                required: true,
                                message: "Please enter the total amount",
                              },
                            ]}
                          >
                            <Input
                              type="number"
                              value={
                                Number(setting?.offlineAmount) +
                                Number(setting?.onlineAmount)
                              }
                              readOnly
                              onChange={() => {}}
                            />
                          </Form.Item>
                        </div>

                        <Form.Item
                          label="Next follow up date"
                          className="w-100"
                          name={["newTreatmentSetting", index, "nextDate"]}
                        >
                          <DatePicker
                            value={setting.nextDate}
                            onChange={(value) => {
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
                        <Form.Item
                          label="Treating Doctor"
                          className="w-100"
                          rules={[
                            {
                              required: true,
                              message: "Please select the treating doctor",
                            },
                          ]}
                          name={`treatingDoctor_${index}`}
                          required
                        >
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
                        onClick={() => {
                          treatmentForm
                            .validateFields()
                            .then(() => {
                              handleSubmitNewTreatment(index);
                            })
                            .catch((errorInfo) => {
                              console.error("Validation Failed:", errorInfo);
                            });
                        }}
                        type="primary"
                        className="bg-primary rounded-0"
                        loading={treatmentLoading} // Assuming loading is being managed elsewhere
                      >
                        Submit Treatment
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Form>
            {diagnosisData?.treatment ? (
              <div className="my-1">
                <hr />
                <p>Treatments Settings</p>
                {diagnosisData?.treatment?.treatmentSettings?.map(
                  (treatment) => {
                    return (
                      <Accordion className="my-1" key={treatment.id}>
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>
                            <div className="d-flex flex-row gap-3">
                              <h6>{treatment.treatmentStatus.join(", ")} - </h6>
                              <DateCell date={treatment.treatmentDate} /> -
                              <p>
                                ₹
                                {Number(treatment.offlineAmount) +
                                  Number(treatment.onlineAmount)}
                              </p>
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
                              selectedTreatment={treatment}
                              options={options}
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
          </Card.Body>
        </Card>
      )}
    </Drawer>
  );
};

export default PatientDiagnosisForm;
