import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Radio,
  Button,
  DatePicker,
  InputNumber,
  Checkbox,
  Upload,
  Badge,
} from "antd";
import { Row, Col } from "react-bootstrap";
import PlaygroundApp from "../Lexical-editor/App";
import { screeningImagedefault } from "./screeningImage";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { RiDownload2Line, RiUpload2Fill } from "@remixicon/react";
// import ImageEditor from "./image-editor";

const MammoMedicalHistory = ({ patient, onSave, readOnly, patientId }) => {
  const [editMode, setEditMode] = useState(!readOnly);
  // const [screeningImage, setScreeningImage] = useState(
  //   patient?.screeningImage
  //     ? patient?.screeningImage
  //     : JSON.stringify(screeningImagedefault())
  // );
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [formState, setFormState] = useState(() => {
    const defaultPatient = {
      menstrualAge: null,
      lastMenstrualDate: null,
      cycleType: "",
      obstetricHistory: [],
      numberOfPregnancies: null,
      numberOfDeliveries: null,
      numberOfLivingChildren: null,
      menopause: "",
      familyHistory: "",
      familyHistoryDetails: "",
      firstDegreeRelatives: "",
      previousCancer: "",
      previousDiagnosis: "",
      previousBiopsy: "",
      previousTreatment: "",
      previousTreatmentDetails: [],
      pain: "",
      painDetails: "",
      implants: "",
      screeningImage: [],
      smoking: "",
      smokingDetails: { packsPerDay: null, yearsSmoked: null },
      alcohol: "",
      alcoholDetails: { mlPerDay: null, yearsConsumed: null },
      misheriTobacco: "",
      misheriTobaccoDetails: { timesPerDay: null, yearsUsed: null },
      imagingStudies: { location: "", type: "", date: null },
      lump: "",
      lumpDetails: "",
      discharge: "",
      dischargeDetails: "",
      skinChanges: "",
      skinChangesDetails: "",
      nippleRetraction: "",
      nippleRetractionDetails: "",
      additionalInfo: "",
    };

    // If patient is null, return the defaultPatient object
    if (!patient) return defaultPatient;
    console.log("*", patient);
    return {
      menstrualAge: patient.menstrualAge || defaultPatient.menstrualAge,
      lastMenstrualDate:
        patient.lastMenstrualDate || defaultPatient.lastMenstrualDate,
      cycleType: patient.cycleType || defaultPatient.cycleType,
      obstetricHistory: patient.obstetricHistory
        ? Object.entries(patient.obstetricHistory)
            .filter(([_, value]) => value) // Extract selected values (true keys)
            .map(([key]) => key.toUpperCase()) // Convert keys to uppercase (G, P, L)
        : defaultPatient.obstetricHistory,
      numberOfPregnancies:
        patient.numberOfPregnancies || defaultPatient.numberOfPregnancies,
      numberOfDeliveries:
        patient.numberOfDeliveries || defaultPatient.numberOfDeliveries,
      numberOfLivingChildren:
        patient.numberOfLivingChildren || defaultPatient.numberOfLivingChildren,
      menopause: patient.menopause || defaultPatient.menopause,
      familyHistory: patient.familyHistory || defaultPatient.familyHistory,
      familyHistoryDetails:
        patient.familyHistoryDetails || defaultPatient.familyHistoryDetails,
      firstDegreeRelatives:
        patient.firstDegreeRelatives || defaultPatient.firstDegreeRelatives,
      previousCancer: patient.previousCancer || defaultPatient.previousCancer,
      previousDiagnosis:
        patient.previousDiagnosis || defaultPatient.previousDiagnosis,
      previousBiopsy: patient.previousBiopsy || defaultPatient.previousBiopsy,
      previousTreatment:
        patient.previousTreatment || defaultPatient.previousTreatment,
      previousTreatmentDetails:
        patient.previousTreatmentDetails ||
        defaultPatient.previousTreatmentDetails,
      implants: patient.implants || defaultPatient.implants,
      screeningImage: patient.screeningImage || defaultPatient.screeningImage,
      smoking: patient.smoking || defaultPatient.smoking,
      smokingDetails: patient.smokingDetails || defaultPatient.smokingDetails,
      alcohol: patient.alcohol || defaultPatient.alcohol,
      alcoholDetails: patient.alcoholDetails || defaultPatient.alcoholDetails,
      misheriTobacco: patient.misheriTobacco || defaultPatient.misheriTobacco,
      misheriTobaccoDetails:
        patient.misheriTobaccoDetails || defaultPatient.misheriTobaccoDetails,
      imagingStudies: patient.imagingStudies || defaultPatient.imagingStudies,
      lump: patient.lump || defaultPatient.lump,
      lumpDetails: patient.lumpDetails || defaultPatient.lumpDetails,
      discharge: patient.discharge || defaultPatient.discharge,
      dischargeDetails:
        patient.dischargeDetails || defaultPatient.dischargeDetails,
      skinChanges: patient.skinChanges || defaultPatient.skinChanges,
      skinChangesDetails:
        patient.skinChangesDetails || defaultPatient.skinChangesDetails,
      nippleRetraction:
        patient.nippleRetraction || defaultPatient.nippleRetraction,
      nippleRetractionDetails:
        patient.nippleRetractionDetails ||
        defaultPatient.nippleRetractionDetails,
      additionalInfo: patient.additionalInfo || defaultPatient.additionalInfo,
      pain: patient.pain || defaultPatient.pain,
      painDetails: patient.painDetails || defaultPatient.painDetails,
    };
  });

  const handleFormChange = (changedValues) => {
    console.log("chnaged values -->", changedValues);
    setFormState((prevState) => ({
      ...prevState,
      ...changedValues,
    }));
  };

  // const handleSubmit = async () => {
  //   const obstetricHistory = formState.obstetricHistory.reduce(
  //     (acc, key) => {
  //       acc[key.toLowerCase()] = true; // Set selected keys to true
  //       return acc;
  //     },
  //     { g: false, p: false, l: false } // Default values for all keys
  //   );

  //   const finalFormState = { ...formState, obstetricHistory };
  //   console.log("Form Data Submitted:", finalFormState);
  //   // Handle the form data, e.g., save to database
  //   try {
  //     setLoading(true);
  //     const response = await patientServices.createMammographyDetails(
  //       patientId,
  //       finalFormState
  //     );
  //     if (response.success) {
  //       toast.success(response.message);
  //       await onSave();
  //     }
  //   } catch (error) {
  //     console.log("error: ", error);
  //     toast.error("Error while adding mammography details!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    // Transform obstetricHistory into the required format
    const obstetricHistory = formState.obstetricHistory.reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = true; // Set selected keys to true
        return acc;
      },
      { g: false, p: false, l: false } // Default values for all keys
    );

    // Create a FormData object
    const formData = new FormData();

    // Add all form state fields except screeningImage to FormData
    const { screeningImage, ...otherFormState } = formState;

    // Append each field in the form state to the FormData object
    Object.entries({ ...otherFormState, obstetricHistory }).forEach(
      ([key, value]) => {
        if (
          (typeof value === "object" || Array.isArray(value)) &&
          key !== "lastMenstrualDate"
        ) {
          formData.append(key, JSON.stringify(value)); // Convert objects to JSON strings
        } else {
          formData.append(key, value); // Append other fields directly
        }
      }
    );

    // Add the screeningImage file if it exists
    if (screeningImage && screeningImage.length > 0) {
      formData.append("screeningFile", screeningImage[0]); // Only append the first file
    }

    console.log("Form Data Submitted:", formState);

    // Send the FormData to the server
    try {
      setLoading(true);
      const response = await patientServices.createMammographyDetails(
        patientId,
        formData
      );
      if (response.success) {
        toast.success(response.message);
        await onSave();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Internal server error!");
    } finally {
      setLoading(false);
    }
  };

  // const handleUpdate = async () => {
  //   const obstetricHistory = formState.obstetricHistory.reduce(
  //     (acc, key) => {
  //       acc[key.toLowerCase()] = true; // Set selected keys to true
  //       return acc;
  //     },
  //     { g: false, p: false, l: false } // Default values for all keys
  //   );

  //   const finalFormState = { ...formState, obstetricHistory };
  //   console.log("Form Data Submitted:", finalFormState);
  //   // Handle the form data, e.g., save to database
  //   try {
  //     setLoading(true);
  //     const response = await patientServices.updateMammographyDetails(
  //       patientId,
  //       finalFormState
  //     );
  //     if (response.success) {
  //       toast.success(response.message);
  //       await onSave();
  //     }
  //   } catch (error) {
  //     console.log("error: ", error);
  //     toast.error("Error while updating mammography details!");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  // const handleReportGenerate=async()={  }

  const handleReportGenerate = async () => {
    console.log("hey");
  };

  const handleUpdate = async () => {
    // Transform obstetricHistory into the required format
    const obstetricHistory = formState.obstetricHistory.reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = true; // Set selected keys to true
        return acc;
      },
      { g: false, p: false, l: false } // Default values for all keys
    );

    // Create a FormData object
    const formData = new FormData();

    // Add all form state fields except screeningImage to FormData
    const { screeningImage, ...otherFormState } = formState;

    // Append each field in the form state to the FormData object
    console.log("Form Data Submitted:", formState);
    Object.entries({ ...otherFormState, obstetricHistory }).forEach(
      ([key, value]) => {
        if (key === "screeningImage") {
          formData.append("screeningFile", value[0]); // Only append the first file
        }
        if (
          (typeof value === "object" || Array.isArray(value)) &&
          key !== "lastMenstrualDate"
        ) {
          formData.append(key, JSON.stringify(value)); // Convert objects to JSON strings
        } else {
          formData.append(key, value); // Append other fields directly
        }
      }
    );

    // Add the screeningImage file if it exists
    // if (screeningImage && screeningImage.length > 0) {
    // }

    // Send the FormData to the server
    try {
      setLoading(true);
      const response = await patientServices.updateMammographyDetails(
        patientId,
        formData
      );
      if (response.success) {
        toast.success(response.message);
        await onSave();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    form.setFieldsValue(formState);
  }, [formState]);

  console.log("form state in isEdit --> ", formState);
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h1>Mammography Medical History</h1>
        <div className="d-flex gap-2  ">
          <Button
            type="link"
            href={`/patient/patient-profile/${patient?.patientId}/mammographyreport/${patient?.id}`}
            size="large"
            className={`${
              !editMode && readOnly ? "" : "d-none"
            } p-2 bg-primary text-white rounded-0 `}
            // onClick={handleReportGenerate}
            // loading={loading}
          >
            <RiDownload2Line />
            Generate report
          </Button>

          {/* Update button */}
          <Button
            className={` bg-primary rounded-0 ${
              editMode && readOnly ? "" : "d-none"
            }`}
            type="primary"
            size="large"
            onClick={handleUpdate}
            loading={loading}
          >
            Update
          </Button>

          {/* Edit/Cancel button */}
          {readOnly && (
            <Button
              type="primary"
              size="large"
              onClick={() => setEditMode((prevMode) => !prevMode)}
              className="bg-primary bg-primary rounded-0"
            >
              {editMode ? "Cancel" : "Edit"}
            </Button>
          )}
        </div>
      </div>

      {editMode ? (
        <Form
          form={form}
          layout="horizontal"
          onValuesChange={handleFormChange}
          onFinish={handleSubmit}
          initialValues={formState}
        >
          {/* Personal Details */}
          <h3 className="mb-3">Clinical History</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Age at First Menstrual Period"
                name="menstrualAge"
                rules={[
                  {
                    type: "number",
                    min: 10,
                    max: 70,
                    message: "Enter a valid age between 10-70!",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Enter Age"
                  defaultValue={formState.menstrualAge}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Last Menstrual Period Date"
                rules={[
                  {
                    required: true,
                    message: "Last menstrual date is required!",
                  },
                ]}
                name={"lastMenstrualDate"}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  defaultValue={
                    formState.lastMenstrualDate
                      ? dayjs(formState.lastMenstrualDate)
                      : null
                  }
                  // write onchnage function to handle the formState lastMenstrualDate
                  // onChange={() => {
                  //   handleFormChange
                  // }}

                  disabledDate={(current) =>
                    current &&
                    current.isAfter(
                      new Date().toLocaleDateString("en-CA"),
                      "day"
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Cycle Type"
                name="cycleType"
                rules={[
                  { required: true, message: "Please select a cycle type!" },
                ]}
              >
                <Radio.Group defaultValue={formState.cycleType}>
                  <Radio value="Regular">Regular</Radio>
                  <Radio value="Irregular">Irregular</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              {/* add star mark or asterisk to below fields thats shows form item is mandatory

              */}

              <Form.Item
                label="Obstetric History"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one option!",
                  },
                ]}
                required
              >
                <Checkbox.Group
                  defaultValue={formState?.obstetricHistory}
                  onChange={(value) =>
                    handleFormChange({ obstetricHistory: value })
                  }
                >
                  <Checkbox value="G">G</Checkbox>
                  <Checkbox value="P">P</Checkbox>
                  <Checkbox value="L">L</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            {formState?.obstetricHistory?.includes("G") && (
              <Col xs={24} sm={12} xl={4}>
                <Form.Item
                  label="Number of Pregnancies"
                  name="numberOfPregnancies"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the number of pregnancies!",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be at least 0!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter number"
                    style={{ width: "100%" }}
                    defaultValue={formState?.numberOfPregnancies}
                  />
                </Form.Item>
              </Col>
            )}
            {formState?.obstetricHistory?.includes("P") && (
              <Col xs={24} sm={12} xl={4}>
                <Form.Item
                  label="Number of Deliveries"
                  name="numberOfDeliveries"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the number of deliveries!",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be at least 0!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter number"
                    style={{ width: "100%" }}
                    defaultValue={formState.numberOfDeliveries}
                  />
                </Form.Item>
              </Col>
            )}
            {formState?.obstetricHistory?.includes("L") && (
              <Col xs={24} sm={12} xl={4}>
                <Form.Item
                  label="Number of Living Children"
                  name="numberOfLivingChildren"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the number of living children!",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be at least 0!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter number"
                    style={{ width: "100%" }}
                    defaultValue={formState.numberOfLivingChildren}
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Menopause"
                name="menopause"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Menopause!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.menopause}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Family History of Breast Cancer"
                name="familyHistory"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select an option for family history of breast cancer!",
                  },
                ]}
              >
                <Radio.Group
                  defaultValue={formState.familyHistory}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      familyHistory: e.target.value,
                    })
                  }
                >
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            {formState.familyHistory === "Yes" && (
              <>
                {/* <Form.Item label="If Yes, Please Describe">
                    <Input.TextArea
                      value={formState.familyHistoryDetails}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          familyHistoryDetails: e.target.value,
                        })
                      }
                    />
                  </Form.Item> */}

                {/* Show this question only when "Yes" is selected */}
                <Col xs={36} sm={12} xl={12}>
                  <Form.Item
                    label="First degree relatives with breast cancer before age 50:"
                    name="firstDegreeRelatives"
                    rules={[
                      {
                        required: true,
                        message:
                          "Please select an option for family history of breast cancer!",
                      },
                    ]}
                  >
                    <Radio.Group
                      defaultValue={formState.firstDegreeRelatives}
                      onChange={(e) =>
                        setFormState({
                          ...formState,
                          firstDegreeRelatives: e.target.value,
                        })
                      }
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </>
            )}

            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Smoking History"
                name="smoking"
                rules={[
                  { required: true, message: "Please select Smoking History!" },
                ]}
              >
                <Radio.Group defaultValue={formState.smoking}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>

              {formState.smoking === "Yes" && (
                <div>
                  <Form.Item label="If Yes, Please fill" required>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Packs/Day"
                          name={["smokingDetails", "packsPerDay"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter Packs/Day!",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Must be at least 1 pack/day!",
                            },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="packs/day"
                            style={{ width: "100%" }}
                            // write the on change function to update the form state key named smokingDetails, here smokingDetails is an object with keys packsPerDay and yearsSmoked, but while using the handleFomChane function make sure that other states should not be disturbed or made undefined as this function is accepting only one para but you gave two so code neat
                            onChange={(value) => {
                              handleFormChange({
                                smokingDetails: {
                                  ...formState.smokingDetails,
                                  packsPerDay: value,
                                },
                              });
                            }}
                            defaultValue={formState.smokingDetails.packsPerDay}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} className="mt-2">
                        <Form.Item
                          label="No. of Years Smoked"
                          name={["smokingDetails", "yearsSmoked"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter Years Smoked!",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Must be at least 1 year!",
                            },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="years"
                            style={{ width: "100%" }}
                            defaultValue={formState.smokingDetails.yearsSmoked}
                            // onChange={(value) =>
                            //   handleFormChange(
                            //     { smokingDetails: { yearsSmoked: value } },
                            //     {
                            //       ...formState,
                            //       smokingDetails: {
                            //         ...formState.smokingDetails,
                            //         yearsSmoked: value,
                            //       },
                            //     }
                            //   )
                            // }
                            // write onChange function to update the form state key named smokingDetails, here smokingDetails is an object with keys packsPerDay and yearsSmoked, but while using the handleFomChane function make sure that other states should not be disturbed or made undefined as this function is accepting only one para but you gave two so code neat
                            onChange={(value) => {
                              handleFormChange({
                                smokingDetails: {
                                  ...formState.smokingDetails,
                                  yearsSmoked: value,
                                },
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </div>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Alcohol History"
                name="alcohol"
                rules={[
                  { required: true, message: "Please select Alcohol History!" },
                ]}
              >
                <Radio.Group
                  defaultValue={formState.alcohol}
                  onChange={(e) =>
                    setFormState({ ...formState, alcohol: e.target.value })
                  }
                >
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>

              {formState.alcohol === "Yes" && (
                <div>
                  <Form.Item label="If Yes, Please fill" required>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="ML/Day"
                          name={["alcoholDetails", "mlPerDay"]}
                          rules={[
                            { required: true, message: "Please enter ML/Day!" },
                            {
                              type: "number",
                              min: 1,
                              message: "Must be at least 1 ML/day!",
                            },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="ML/day"
                            style={{ width: "100%" }}
                            defaultValue={formState?.alcoholDetails?.mlPerDay}
                            // write the on change function to update the form state key named alcoholDetails, here alcoholDetails is an object with keys mlPerDay and yearsConsumed, but while using the handleFomChane function make sure that other states should not be disturbed or made undefined as this function is accepting only one para but you gave two so code neat
                            onChange={(value) => {
                              handleFormChange({
                                alcoholDetails: {
                                  ...formState.alcoholDetails,
                                  mlPerDay: value,
                                },
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} className="mt-2">
                        <Form.Item
                          label="No. of Years Consumed"
                          name={["alcoholDetails", "yearsConsumed"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter Years Consumed!",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Must be at least 1 year!",
                            },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="years"
                            style={{ width: "100%" }}
                            defaultValue={
                              formState?.alcoholDetails?.yearsConsumed
                            }
                            // onChange={(value) =>
                            //   handleFormChange(
                            //     { alcoholDetails: { yearsConsumed: value } },
                            //     {
                            //       ...formState,
                            //       alcoholDetails: {
                            //         ...formState.alcoholDetails,
                            //         yearsConsumed: value,
                            //       },
                            //     }
                            //   )
                            // }
                            // write onChange function to update the form state key named alcoholDetails, here alcoholDetails is an object with keys mlPerDay and yearsConsumed, but while using the handleFomChane function make sure that other states should not be disturbed or made undefined as this function is accepting only one para but you gave two so code neat
                            onChange={(value) => {
                              handleFormChange({
                                alcoholDetails: {
                                  ...formState.alcoholDetails,
                                  yearsConsumed: value,
                                },
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </div>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Misheri/Tobacco History"
                name="misheriTobacco"
                rules={[
                  {
                    required: true,
                    message: "Please select Misheri/Tobacco History!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.misheriTobacco}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>

              {formState.misheriTobacco === "Yes" && (
                <div>
                  <Form.Item label="If Yes, Please fill" required>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Times/Day"
                          name={["misheriTobaccoDetails", "timesPerDay"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter Times/Day!",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Must be at least 1 time/day!",
                            },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="times/day"
                            style={{ width: "100%" }}
                            defaultValue={
                              formState?.misheriTobaccoDetails?.timesPerDay
                            }
                            // onChange={(value) =>
                            //   handleFormChange(
                            //     {
                            //       misheriTobaccoDetails: { timesPerDay: value },
                            //     },
                            //     {
                            //       ...formState,
                            //       misheriTobaccoDetails: {
                            //         ...formState.misheriTobaccoDetails,
                            //         timesPerDay: value,
                            //       },
                            //     }
                            //   )
                            // }
                            // write onChange function to update the form state key named misheriTobaccoDetails, here misheriTobaccoDetails is an object with keys timesPerDay and yearsUsed, but while using the handleFomChane function make sure that other states should not be disturbed or made undefined as this function is accepting only one para but you gave two so code neat
                            onChange={(value) => {
                              handleFormChange({
                                misheriTobaccoDetails: {
                                  ...formState.misheriTobaccoDetails,
                                  timesPerDay: value,
                                },
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} className="mt-2">
                        <Form.Item
                          label="No. of Years Used"
                          name={["misheriTobaccoDetails", "yearsUsed"]}
                          rules={[
                            {
                              required: true,
                              message: "Please enter Years Used!",
                            },
                            {
                              type: "number",
                              min: 1,
                              message: "Must be at least 1 year!",
                            },
                          ]}
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="years"
                            style={{ width: "100%" }}
                            defaultValue={
                              formState?.misheriTobaccoDetails?.yearsUsed
                            }
                            // onChange={(value) =>
                            //   handleFormChange(
                            //     { misheriTobaccoDetails: { yearsUsed: value } },
                            //     {
                            //       ...formState,
                            //       misheriTobaccoDetails: {
                            //         ...formState.misheriTobaccoDetails,
                            //         yearsUsed: value,
                            //       },
                            //     }
                            //   )
                            // }
                            // write onChange function to update the form state key named misheriTobaccoDetails, here misheriTobaccoDetails is an object with keys timesPerDay and yearsUsed, but while using the handleFomChane function make sure that other states should not be disturbed or made undefined as this function is accepting only one para but you gave two so code neat
                            onChange={(value) => {
                              handleFormChange({
                                misheriTobaccoDetails: {
                                  ...formState.misheriTobaccoDetails,
                                  yearsUsed: value,
                                },
                              });
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </div>
              )}
            </Col>

            <Col xs={48} sm={24} xl={12}>
              <h3 className="mb-3">Relevant clinical history</h3>
            </Col>

            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Previous Breast Cancer"
                name="previousCancer"
                rules={[
                  {
                    required: true,
                    message:
                      "Please select an option for Previous Breast Cancer!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.previousCancer}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.previousCancer === "Yes" && (
                <Form.Item
                  label="If Yes, Diagnoses"
                  name="previousDiagnosis"
                  rules={[
                    {
                      required: true,
                      message:
                        "Please provide details for Previous Breast Cancer!",
                    },
                  ]}
                >
                  <Input.TextArea
                    placeholder="Describe details"
                    rows={3}
                    defaultValue={formState.previousDiagnosis}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Previous Biopsy"
                name="previousBiopsy"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Previous Biopsy",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.previousBiopsy}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Previous Treatment"
                name="previousTreatment"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Previous Treatment",
                  },
                ]}
              >
                <Radio.Group
                  defaultValue={formState.previousTreatment}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      previousTreatment: e.target.value,
                    })
                  }
                >
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>

              {formState.previousTreatment === "Yes" && (
                <Form.Item
                  label="If Yes, Please Select"
                  // name="previousTreatmentDetails"
                  rules={[
                    {
                      required: true,
                      message: "Please select at least one treatment type!",
                    },
                  ]}
                  required
                >
                  <Checkbox.Group
                    defaultValue={formState.previousTreatmentDetails}
                    onChange={(value) =>
                      handleFormChange({ previousTreatmentDetails: value })
                    }
                  >
                    <Checkbox value="Surgery">Surgery</Checkbox>
                    <Checkbox value="Chemotherapy">Chemotherapy</Checkbox>
                    <Checkbox value="Radiation Therapy">
                      Radiation Therapy
                    </Checkbox>{" "}
                  </Checkbox.Group>
                </Form.Item>
              )}
            </Col>
          </Row>
          <Col xs={24} sm={12} xl={4}>
            <Form.Item label="Implants" name="implants">
              <Radio.Group defaultValue={formState.implants}>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Imaging Studies Location">
                <Input
                  placeholder="Enter Location"
                  value={formState.imagingStudies.location}
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      imagingStudies: {
                        ...prevState.imagingStudies,
                        location: e.target.value,
                      },
                    }))
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Imaging Studies Type">
                <Input
                  placeholder="Enter Type"
                  value={formState.imagingStudies.type}
                  onChange={(e) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      imagingStudies: {
                        ...prevState.imagingStudies,
                        type: e.target.value,
                      },
                    }))
                  }
                />{" "}
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Imaging Studies Date">
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formState.imagingStudies.date
                      ? dayjs(formState.imagingStudies.date)
                      : null
                  } // Use `dayjs` to handle date objects
                  onChange={(date, dateString) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      imagingStudies: {
                        ...prevState.imagingStudies,
                        date: date
                          ? date.toDate().toLocaleDateString("en-CA")
                          : null, // Save the date in string format or null
                      },
                    }))
                  }
                />{" "}
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} xl={7} md={7}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <RiDownload2Line />
                <Button
                  type="link"
                  style={{
                    padding: 0,
                    fontSize: "14px",
                    textDecoration: "underline",
                    color: "#1890ff",
                  }}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href =
                      "/assets/images/mammography-screening-template.jpg"; // Path to the image
                    link.download = "mammography-screening-template.jpg"; // File name for download
                    document.body.appendChild(link); // Append link to body
                    link.click(); // Programmatically click the link
                    document.body.removeChild(link); // Clean up by removing the link
                  }}
                >
                  Download Screening Template
                </Button>
              </div>
              <Form.Item
                label="Screening (Addition of supplemental imaging will be determined at the time of screening)"
                className="responsive-form-item"
              >
                <Upload
                  accept="image/*"
                  beforeUpload={(file) => {
                    setFormState((prev) => ({
                      ...prev,
                      screeningImage: [file], // Replace previous file with the new one
                    }));
                    return false;
                  }}
                  fileList={
                    Array.isArray(formState.screeningImage)
                      ? formState.screeningImage.map((file) => ({
                          ...file,
                          name: file.name || file.originFileObj?.name,
                          uid: file.uid || file.originFileObj?.uid,
                          status: "done",
                        }))
                      : []
                  }
                  onRemove={() => {
                    setFormState((prev) => ({
                      ...prev,
                      screeningImage: [],
                    }));
                  }}
                  className="ml-3"
                >
                  <Button icon={<RiUpload2Fill />} variant="outlined">
                    Upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* Screening Section */}
          {/* <Form.Item name="screeningImage" label="Screening">
          <ImageEditor />
        </Form.Item> */}

          <h3 className="mt-4 mb-3">Physical Examination</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                rules={[
                  {
                    required: true,
                    message: "Please select an option for pain!",
                  },
                ]}
                label="Pain"
                name="pain"
              >
                <Radio.Group defaultValue={formState.pain}>
                  <Radio value="No">No</Radio>
                  <Radio value="Right">Right</Radio>
                  <Radio value="Left">Left</Radio>
                  <Radio value="Both">Both side</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.pain !== "No" && formState.pain !== "" && (
                <Form.Item label="Pain Details" name="painDetails">
                  <Input.TextArea
                    placeholder="Enter pain details"
                    rows={3}
                    defaultValue={formState.painDetails}
                  />
                </Form.Item>
              )}
            </Col>

            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Lump"
                name="lump"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Lump!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.lump}>
                  <Radio value="No">No</Radio>
                  <Radio value="Right">Right</Radio>
                  <Radio value="Left">Left</Radio>
                  <Radio value="Both">Both</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.lump !== "No" && formState.lump !== "" && (
                <Form.Item label="Lump Details" name="lumpDetails">
                  <Input.TextArea
                    placeholder="Enter lump details"
                    rows={3}
                    defaultValue={formState.lumpDetails}
                  />
                </Form.Item>
              )}
            </Col>

            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Discharge"
                name="discharge"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Dischange!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.discharge}>
                  <Radio value="No">No</Radio>
                  <Radio value="Right">Right</Radio>
                  <Radio value="Left">Left</Radio>
                  <Radio value="Both">Both</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.discharge !== "No" && formState.discharge && (
                <Form.Item label="Discharge Details" name="dischargeDetails">
                  <Input.TextArea
                    placeholder="Enter discharge details"
                    rows={3}
                    defaultValue={formState.dischargeDetails}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item
                label="Skin Changes"
                name="skinChanges"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Skin Change!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.skinChanges}>
                  <Radio value="No">No</Radio>
                  <Radio value="Right">Right</Radio>
                  <Radio value="Left">Left</Radio>
                  <Radio value="Both">Both</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.skinChanges !== "No" &&
                formState.skinChanges !== "" && (
                  <Form.Item
                    label="Skin Changes Details"
                    name="skinChangesDetails"
                  >
                    <Input.TextArea
                      placeholder="Enter skin changes details"
                      defaultValue={formState.skinChangesDetails}
                      rows={3}
                    />
                  </Form.Item>
                )}
            </Col>
            <Col xs={30} sm={14} xl={6}>
              <Form.Item
                label="Nipple Retraction"
                name="nippleRetraction"
                rules={[
                  {
                    required: true,
                    message: "Please select an option for Nipple Retraction!",
                  },
                ]}
              >
                <Radio.Group defaultValue={formState.nippleRetraction}>
                  <Radio value="No">No</Radio>
                  <Radio value="Right">Right</Radio>
                  <Radio value="Left">Left</Radio>
                  <Radio value="Both">Both</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.nippleRetraction !== "No" &&
                formState.nippleRetraction !== "" && (
                  <Form.Item
                    label="Nipple Retraction Details"
                    name="nippleRetractionDetails"
                  >
                    <Input.TextArea
                      placeholder="Enter nipple retraction details"
                      defaultValue={formState.nippleRetractionDetails}
                      rows={3}
                    />
                  </Form.Item>
                )}
            </Col>
          </Row>
          {/* Additional Information */}
          <h3 className="mt-4 mb-3">Additional Information</h3>
          <Form.Item label="Additional Info" name="additionalInfo">
            <Input.TextArea
              placeholder="Enter any additional information"
              defaultValue={formState.additionalInfo}
              rows={3}
            />
          </Form.Item>

          {/* Submit Button */}
          <div className="d-flex justify-content-end">
            <Button
              type="primary"
              variant="primary"
              className={
                readOnly
                  ? "d-none w-auto rounded-0 bg-primary"
                  : "w-auto rounded-0 bg-primary"
              }
              htmlType="submit"
              block
              loading={loading}
              // style={{ width: "auto" }}
            >
              Submit
            </Button>
          </div>
        </Form>
      ) : (
        <Form layout="horizontal">
          <h3 className="mb-3">Clinical History</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Age at First Menstrual Period">
                <Input value={formState.menstrualAge} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Last Menstrual Period Date">
                <Input
                  value={formState.lastMenstrualDate}
                  readOnly
                  disabledDate={(current) =>
                    current &&
                    current.isAfter(
                      new Date().toLocaleDateString("en-CA"),
                      "day"
                    )
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Cycle Type">
                <Input value={formState.cycleType} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Obstetric History">
                <Checkbox.Group value={formState.obstetricHistory} disabled>
                  <Checkbox value="G">G</Checkbox>
                  <Checkbox value="P">P</Checkbox>
                  <Checkbox value="L">L</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            {formState?.obstetricHistory?.includes("G") && (
              <Col xs={24} sm={12} xl={4}>
                <Form.Item
                  label="Number of Pregnancies"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the number of pregnancies!",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be at least 0!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter number"
                    style={{ width: "100%" }}
                    readOnly
                    value={formState.numberOfPregnancies}
                  />
                </Form.Item>
              </Col>
            )}
            {formState?.obstetricHistory?.includes("P") && (
              <Col xs={24} sm={12} xl={4}>
                <Form.Item
                  label="Number of Deliveries"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the number of deliveries!",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be at least 0!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter number"
                    style={{ width: "100%" }}
                    readOnly
                    value={formState.numberOfDeliveries}
                  />
                </Form.Item>
              </Col>
            )}
            {formState.obstetricHistory.includes("L") && (
              <Col xs={24} sm={12} xl={4}>
                <Form.Item
                  label="Number of Living Children"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the number of living children!",
                    },
                    {
                      type: "number",
                      min: 0,
                      message: "Must be at least 0!",
                    },
                  ]}
                >
                  <InputNumber
                    placeholder="Enter number"
                    style={{ width: "100%" }}
                    readOnly
                    value={formState.numberOfLivingChildren}
                  />
                </Form.Item>
              </Col>
            )}
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Menopause">
                <Input value={formState.menopause} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Family History of Breast Cancer">
                <Input value={formState.familyHistory} readOnly />
              </Form.Item>
              {formState.familyHistory === "Yes" && (
                <Form.Item label="first degree relatives with breast cancer">
                  <Input value={formState.firstDegreeRelatives} readOnly />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Smoking History">
                <Input value={formState.smoking} readOnly />
              </Form.Item>
              {formState.smoking === "Yes" && (
                <>
                  <Form.Item label="Packs/Day">
                    <Input
                      value={formState.smokingDetails.packsPerDay}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="Years Smoked">
                    <Input
                      value={formState.smokingDetails.yearsSmoked}
                      readOnly
                    />
                  </Form.Item>
                </>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Alcohol History">
                <Input value={formState.alcohol} readOnly />
              </Form.Item>
              {formState.alcohol === "Yes" && (
                <div>
                  <Form.Item label="ML/Day">
                    <Input
                      value={formState.alcoholDetails?.mlPerDay}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="No. of Years Consumed">
                    <Input
                      value={formState.alcoholDetails?.yearsConsumed}
                      readOnly
                    />
                  </Form.Item>
                </div>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Misheri History">
                <Input value={formState.misheriTobacco} readOnly />
              </Form.Item>
              {formState.misheriTobacco === "Yes" && (
                <div>
                  <Form.Item label="Times/Day">
                    <Input
                      value={formState.misheriTobaccoDetails?.timesPerDay}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="No. of Years Used">
                    <Input
                      value={formState.misheriTobaccoDetails?.yearsUsed}
                      readOnly
                    />
                  </Form.Item>
                </div>
              )}
            </Col>
          </Row>
          <h3 className="mb-3">Relevant clinical history</h3>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Previous Breast Cancer">
                <Input value={formState.previousCancer} readOnly />
              </Form.Item>
              {formState.previousCancer === "Yes" && (
                <Form.Item label="Diagnoses">
                  <Input value={formState.previousDiagnosis} readOnly />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Previous Biopsy">
                <Input value={formState.previousBiopsy} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Previous Treatment">
                <Input value={formState.previousTreatment} readOnly />
              </Form.Item>
              {formState.previousTreatment === "Yes" && (
                <Checkbox.Group
                  options={["Surgery", "Chemotherapy", "Radiation Therapy"]}
                  defaultValue={formState.previousTreatmentDetails}
                  onChange={(checkedValues) =>
                    setFormState({
                      ...formState,
                      previousTreatmentDetails: checkedValues,
                    })
                  }
                  readOnly
                  disabled={readOnly}
                />
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Implants">
                <Input value={formState.implants} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Imaging Studies Location">
                <Input value={formState.imagingStudies?.location} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Imaging Studies Type">
                <Input value={formState.imagingStudies?.type} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Imaging Studies Date">
                <Input
                  value={
                    formState.imagingStudies?.date
                      ? dayjs(formState.imagingStudies.date).format(
                          "YYYY-MM-DD"
                        )
                      : ""
                  }
                  readOnly
                />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={7}>
              <Form.Item
                label="Screening (Addition of supplemental imaging will be determined at the time of screening): "
                className="responsive-form-item"
              >
                {Object.keys(patient?.screeningImage).length > 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <Button
                      type="link"
                      href={`/files?key=${patient.screeningImage.key}`}
                      style={{
                        padding: 0,
                        fontSize: "14px",
                        textDecoration: "underline",
                        color: "#1890ff",
                      }}
                      onClick={() => {}}
                    >
                      {patient.screeningImage.fileName || "file"}
                    </Button>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: "14px",
                      color: "#6c757d", // Bootstrap muted text color
                    }}
                  >
                    No file uploaded.
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          {/* Diagnostic Section */}
          <h3 className="mt-4 mb-3">Physical Examination</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Pain">
                <Input value={formState.pain} readOnly />
              </Form.Item>
              {formState.pain !== "No" && formState.pain && (
                <Form.Item label="Pain details">
                  <Input.TextArea value={formState.painDetails} readOnly />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Lump">
                <Input value={formState.lump} readOnly />
              </Form.Item>
              {formState.lump !== "No" && formState.lump && (
                <Form.Item label="Lump Details">
                  <Input.TextArea value={formState.lumpDetails} readOnly />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Discharge">
                <Input value={formState.discharge} readOnly />
              </Form.Item>
              {formState.discharge !== "No" && formState.discharge && (
                <Form.Item label="Discharge Details">
                  <Input.TextArea value={formState.dischargeDetails} readOnly />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Skin Changes">
                <Input value={formState.skinChanges} readOnly />
              </Form.Item>
              {formState.skinChanges === "Yes" && (
                <Form.Item label="Skin Changes Details">
                  <Input.TextArea
                    value={formState.skinChangesDetails}
                    readOnly
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} xl={4}>
              <Form.Item label="Nipple Retraction">
                <Input value={formState.nippleRetraction} readOnly />
              </Form.Item>
              {formState.nippleRetraction === "Yes" && (
                <Form.Item label="Nipple Retraction Details">
                  <Input.TextArea
                    value={formState.nippleRetractionDetails}
                    readOnly
                  />
                </Form.Item>
              )}
            </Col>
          </Row>

          {/* Additional Information */}
          <h3 className="mt-4 mb-3">Additional Information</h3>
          <Form.Item label="Additional Info">
            <Input.TextArea value={formState.additionalInfo} readOnly />
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default MammoMedicalHistory;
