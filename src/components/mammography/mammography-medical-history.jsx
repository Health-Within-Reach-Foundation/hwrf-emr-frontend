import React, { useState } from "react";
import {
  Form,
  Input,
  Radio,
  Button,
  DatePicker,
  InputNumber,
  Checkbox,
} from "antd";
import { Row, Col } from "react-bootstrap";
import PlaygroundApp from "../Lexical-editor/App";
import { screeningImagedefault } from "./screeningImage";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { RiDownload2Line } from "@remixicon/react";
// import ImageEditor from "./image-editor";

const MammoMedicalHistory = ({ patient, onSave, readOnly, patientId }) => {
  const [editMode, setEditMode] = useState(!readOnly);
  const [screeningImage, setScreeningImage] = useState(
    patient?.screeningImage
      ? patient?.screeningImage
      : JSON.stringify(screeningImagedefault())
  );
  const [loading, setLoading] = useState(false);
  // const [formState, setFormState] = useState({
  //   menstrualAge: patient.menstrualAge || null,
  //   lastMenstrualDate: patient.lastMenstrualDate || null,
  //   cycleType: patient.cycleType || "",
  //   obstetricHistory: patient.obstetricHistory
  //     ? Object.entries(patient.obstetricHistory)
  //         .filter(([_, value]) => value) // Extract selected values (true keys)
  //         .map(([key]) => key.toUpperCase()) // Convert keys to uppercase (G, P, L)
  //     : [], // Default to empty array if no data,
  //   menopause: patient.menopause || "",
  //   familyHistory: patient.familyHistory || "",
  //   familyHistoryDetails: patient.familyHistoryDetails || "",

  //   firstDegreeRelatives: patient.firstDegreeRelatives || "",
  //   previousCancer: patient.previousCancer || "",
  //   previousBiopsy: patient.previousBiopsy || "",
  //   previousSurgery: patient.previousSurgery || "",
  //   implants: patient.implants || "",
  //   screeningImage,
  //   smoking: patient.smoking || "",
  //   smokingDetails: patient.smokingDetails || {
  //     packsPerDay: null,
  //     yearsSmoked: null,
  //   },
  //   imagingStudies: patient.imagingStudies || {
  //     location: "",
  //     type: "",
  //     date: null,
  //   },
  //   lump: patient.lump || "",
  //   discharge: patient.discharge || "",
  //   dischargeDetails: patient.dischargeDetails || "",
  //   skinChanges: patient.skinChanges || "",
  //   skinChangesDetails: patient.skinChangesDetails || "",
  //   nippleRetraction: patient.nippleRetraction || "",
  //   nippleRetractionDetails: patient.nippleRetractionDetails || "",
  //   additionalInfo: patient.additionalInfo || "",
  // });

  const [formState, setFormState] = useState(() => {
    const defaultPatient = {
      menstrualAge: null,
      lastMenstrualDate: null,
      cycleType: "",
      obstetricHistory: [],
      menopause: "",
      familyHistory: "",
      familyHistoryDetails: "",
      firstDegreeRelatives: "",
      previousCancer: "",
      previousBiopsy: "",
      previousSurgery: "",
      pain: "",
      implants: "",
      screeningImage: null,
      relevantDiagnosis: "",
      relevantDiagnosisDetails: "",
      smoking: "",
      smokingDetails: { packsPerDay: null, yearsSmoked: null },
      imagingStudies: { location: "", type: "", date: null },
      lump: "",
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
      menopause: patient.menopause || defaultPatient.menopause,
      familyHistory: patient.familyHistory || defaultPatient.familyHistory,
      familyHistoryDetails:
        patient.familyHistoryDetails || defaultPatient.familyHistoryDetails,

      firstDegreeRelatives:
        patient.firstDegreeRelatives || defaultPatient.firstDegreeRelatives,
      previousCancer: patient.previousCancer || defaultPatient.previousCancer,
      previousBiopsy: patient.previousBiopsy || defaultPatient.previousBiopsy,
      previousSurgery:
        patient.previousSurgery || defaultPatient.previousSurgery,
      implants: patient.implants || defaultPatient.implants,
      screeningImage: patient.screeningImage || defaultPatient.screeningImage,
      smoking: patient.smoking || defaultPatient.smoking,
      smokingDetails: patient.smokingDetails || defaultPatient.smokingDetails,
      imagingStudies: patient.imagingStudies || defaultPatient.imagingStudies,
      lump: patient.lump || defaultPatient.lump,
      discharge: patient.discharge || defaultPatient.discharge,
      dischargeDetails:
        patient.dischargeDetails || defaultPatient.dischargeDetails,
      relevantDiagnosis:
        patient.relevantDiagnosis || defaultPatient.relevantDiagnosis,
      relevantDiagnosisDetails:
        patient.relevantDiagnosisDetails ||
        defaultPatient.relevantDiagnosisDetails,
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
    };
  });

  const handleFormChange = (changedValues) => {
    setFormState((prevState) => ({
      ...prevState,
      ...changedValues,
    }));
  };

  const handleSubmit = async () => {
    const obstetricHistory = formState.obstetricHistory.reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = true; // Set selected keys to true
        return acc;
      },
      { g: false, p: false, l: false } // Default values for all keys
    );

    const finalFormState = { ...formState, obstetricHistory, screeningImage };
    console.log("Form Data Submitted:", finalFormState);
    // Handle the form data, e.g., save to database
    try {
      setLoading(true);
      const response = await patientServices.createMammographyDetails(
        patientId,
        finalFormState
      );
      if (response.success) {
        toast.success(response.message);
        await onSave();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while adding mammography details!");
    } finally {
      setLoading(false);
    }
  };
  const handleUpdate = async () => {
    const obstetricHistory = formState.obstetricHistory.reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = true; // Set selected keys to true
        return acc;
      },
      { g: false, p: false, l: false } // Default values for all keys
    );

    const finalFormState = { ...formState, obstetricHistory, screeningImage };
    console.log("Form Data Submitted:", finalFormState);
    // Handle the form data, e.g., save to database
    try {
      setLoading(true);
      const response = await patientServices.updateMammographyDetails(
        patientId,
        finalFormState
      );
      if (response.success) {
        toast.success(response.message);
        await onSave();
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error("Error while updating mammography details!");
    } finally {
      setLoading(false);
    }
  };
  // const handleReportGenerate=async()={  }
  const handleReportGenerate = async () => {
    console.log("hey");
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Mammography Medical History</h2>
        <div className="d-flex gap-2  ">
          <Link
          to={`mammographyreport/${patient?.id}`}
            // type="primary"
            className={`${!editMode && readOnly ? "" : "d-none"} p-2 bg-primary text-white rounded-2`}
            // onClick={handleReportGenerate}
            // loading={loading}
          >
            <RiDownload2Line/>Generate report
          </Link>

          {/* Update button */}
          <Button
            className={`${editMode && readOnly ? "" : "d-none"}`}
            type="primary"
            onClick={handleUpdate}
            loading={loading}
          >
            Update
          </Button>

          {/* Edit/Cancel button */}
          <Button
            type="primary"
            className={`${readOnly ? "" : "d-none"}`}
            onClick={() => setEditMode((prevMode) => !prevMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </Button>
        </div>
      </div>

      {editMode ? (
        <Form
          layout="vertical"
          onValuesChange={handleFormChange}
          onFinish={handleSubmit}
          initialValues={formState}
        >
          {/* Personal Details */}
          <h3 className="mb-3">Clinical History</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Age at First Menstrual Period"
                name="menstrualAge"
              >
                <InputNumber
                  placeholder="Enter Age"
                  defaultValue={formState.menstrualAge}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Last Menstrual Period Date">
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formState.lastMenstrualDate
                      ? dayjs(formState.lastMenstrualDate)
                      : null
                  }
                  onChange={(date) =>
                    setFormState((prevState) => ({
                      ...prevState,
                      lastMenstrualDate: date
                        ? date.toDate().toLocaleDateString("en-CA")
                        : null,
                    }))
                  }
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
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Cycle Type" name="cycleType">
                <Radio.Group defaultValue={formState.cycleType}>
                  <Radio value="Regular">Regular</Radio>
                  <Radio value="Irregular">Irregular</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Obstetric History" name="obstetricHistory">
                <Checkbox.Group value={formState.obstetricHistory}>
                  <Checkbox value="G">G</Checkbox>
                  <Checkbox value="P">P</Checkbox>
                  <Checkbox value="L">L</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Menopause" name="menopause">
                <Radio.Group defaultValue={formState.menopause}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Family History of Breast Cancer"
                name="familyHistory"
              >
                <Radio.Group defaultValue={formState.familyHistory}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.familyHistory === "Yes" && (
                <Form.Item
                  label="If Yes, Please Describe"
                  name="familyHistoryDetails"
                >
                  <Input.TextArea
                    placeholder="Describe details"
                    rows={3}
                    defaultValue={formState.familyHistoryDetails}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="Relevant clinical/history/Presumptive diagnosis"
                name="relevantDiagnosis"
              >
                <Radio.Group defaultValue={formState.relevantDiagnosis}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.relevantDiagnosis === "Yes" && (
                <Form.Item
                  label="If Yes, Please Describe"
                  name="relevantDiagnosisDetails"
                >
                  <Input.TextArea
                    placeholder="Describe Clinical history/Presumptive Diagnosis Details"
                    rows={3}
                    defaultValue={formState.relevantDiagnosisDetails}
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label="First degree relatives with breast cancer before age 50:"
                name="firstDegreeRelatives"
              >
                <Radio.Group defaultValue={formState.firstDegreeRelatives}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {/* {formState.firstDegreeRelatives === "Yes" && (
              <Form.Item
                label="If Yes, Please Describe"
                name="firstDegreeRelativesDetails"
              >
                <Input.TextArea
                  placeholder="Describe Clinical history/Presumptive Diagnosis Details"
                  rows={3}
                />
              </Form.Item>
            )} */}
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Previous Breast Cancer" name="previousCancer">
                <Radio.Group defaultValue={formState.previousCancer}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Smoking History" name="smoking">
                <Radio.Group defaultValue={formState.smoking}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.smoking === "Yes" && (
                <>
                  <Form.Item label="If Yes, Please Describe">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="Packs/Day"
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="packs/day"
                            value={formState.smokingDetails.packsPerDay}
                            onChange={(value) =>
                              setFormState((prevState) => ({
                                ...prevState,
                                smokingDetails: {
                                  ...prevState.smokingDetails,
                                  packsPerDay: value,
                                },
                              }))
                            }
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Form.Item
                          label="No. of Years Smoked"
                          style={{ marginBottom: 0 }}
                        >
                          <InputNumber
                            placeholder="years"
                            value={formState.smokingDetails.yearsSmoked}
                            onChange={(value) =>
                              setFormState((prevState) => ({
                                ...prevState,
                                smokingDetails: {
                                  ...prevState.smokingDetails,
                                  yearsSmoked: value,
                                },
                              }))
                            }
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              )}
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Previous Biopsy" name="previousBiopsy">
                <Radio.Group defaultValue={formState.previousBiopsy}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Previous Surgery" name="previousSurgery">
                <Radio.Group defaultValue={formState.previousSurgery}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Implants" name="implants">
                <Radio.Group defaultValue={formState.implants}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
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
            <Col xs={24} sm={12} md={8}>
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
            <Col xs={24} sm={12} md={8}>
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
          </Row>

          {/* Screening Section */}
          {/* <Form.Item name="screeningImage" label="Screening">
          <ImageEditor />
        </Form.Item> */}

          {/* Diagnostic Section */}
          <h3 className="mt-4 mb-3">Diagnostic</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Pain" name="pain">
                <Radio.Group defaultValue={formState.pain}>
                  <Radio value="No">No</Radio>
                  <Radio value="Yes">Yes</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Lump" name="lump">
                <Radio.Group defaultValue={formState.lump}>
                  <Radio value="No">No</Radio>
                  <Radio value="Right">Right</Radio>
                  <Radio value="Left">Left</Radio>
                  <Radio value="Both">Both</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Discharge" name="discharge">
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
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Skin Changes" name="skinChanges">
                <Radio.Group defaultValue={formState.skinChanges}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.skinChanges === "Yes" && (
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
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Nipple Retraction" name="nippleRetraction">
                <Radio.Group defaultValue={formState.nippleRetraction}>
                  <Radio value="Yes">Yes</Radio>
                  <Radio value="No">No</Radio>
                </Radio.Group>
              </Form.Item>
              {formState.nippleRetraction === "Yes" && (
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
          <Button
            type="primary"
            className={readOnly ? "d-none w-auto" : "w-auto"}
            htmlType="submit"
            block
            loading={loading}
            // style={{ width: "auto" }}
          >
            Submit
          </Button>
        </Form>
      ) : (
        <Form layout="vertical">
          {/* Personal Details */}
          <h3 className="mb-3">Clinical History</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Age at First Menstrual Period">
                <Input value={formState.menstrualAge} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Last Menstrual Period Date">
                <Input
                  value={
                    formState.lastMenstrualDate
                      ? dayjs(formState.lastMenstrualDate).format("YYYY-MM-DD")
                      : ""
                  }
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
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Cycle Type">
                <Input value={formState.cycleType} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Obstetric History">
                <Checkbox.Group value={formState.obstetricHistory} disabled>
                  <Checkbox value="G">G</Checkbox>
                  <Checkbox value="P">P</Checkbox>
                  <Checkbox value="L">L</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Menopause">
                <Input value={formState.menopause} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Family History of Breast Cancer">
                <Input value={formState.familyHistory} readOnly />
              </Form.Item>
              {formState.familyHistory === "Yes" && (
                <Form.Item label="If Yes, Please Describe">
                  <Input.TextArea
                    value={formState.familyHistoryDetails}
                    readOnly
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Relevant clinical/history/Presumptive diagnosis">
                <Input value={formState.relevantDiagnosis} readOnly />
              </Form.Item>
              {formState.relevantDiagnosis === "Yes" && (
                <Form.Item label="If Yes, Please Describe">
                  <Input.TextArea
                    value={formState.relevantDiagnosisDetails}
                    readOnly
                  />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="First degree relatives with breast cancer before age 50:">
                <Input value={formState.firstDegreeRelatives} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Previous Breast Cancer">
                <Input value={formState.previousCancer} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Smoking History">
                <Input value={formState.smoking} readOnly />
              </Form.Item>
              {formState.smoking === "Yes" && (
                <div>
                  <Form.Item label="Packs/Day">
                    <Input
                      value={formState.smokingDetails?.packsPerDay}
                      readOnly
                    />
                  </Form.Item>
                  <Form.Item label="No. of Years Smoked">
                    <Input
                      value={formState.smokingDetails?.yearsSmoked}
                      readOnly
                    />
                  </Form.Item>
                </div>
              )}
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Previous Biopsy">
                <Input value={formState.previousBiopsy} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Previous Surgery">
                <Input value={formState.previousSurgery} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Implants">
                <Input value={formState.implants} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Imaging Studies Location">
                <Input value={formState.imagingStudies?.location} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Imaging Studies Type">
                <Input value={formState.imagingStudies?.type} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
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
          </Row>

          {/* Diagnostic Section */}
          <h3 className="mt-4 mb-3">Diagnostic</h3>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Pain">
                <Input value={formState.pain} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Lump">
                <Input value={formState.lump} readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Discharge">
                <Input value={formState.discharge} readOnly />
              </Form.Item>
              {formState.discharge !== "No" && formState.discharge && (
                <Form.Item label="Discharge Details">
                  <Input.TextArea value={formState.dischargeDetails} readOnly />
                </Form.Item>
              )}
            </Col>
            <Col xs={24} sm={12} md={8}>
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
            <Col xs={24} sm={12} md={8}>
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
