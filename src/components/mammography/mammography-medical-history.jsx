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

const MammoMedicalHistory = ({ patient }) => {
  const [screeningImage, setScreeningImage] = useState(
    patient.screeningImage || JSON.stringify(screeningImagedefault())
  );

  const [formState, setFormState] = useState({
    menstrualAge: patient.menstrualAge || null,
    lastMenstrualDate: patient.lastMenstrualDate || null,
    cycleType: patient.cycleType || "",
    obstetricHistory: patient.obstetricHistory
      ? Object.entries(patient.obstetricHistory)
          .filter(([_, value]) => value) // Extract selected values (true keys)
          .map(([key]) => key.toUpperCase()) // Convert keys to uppercase (G, P, L)
      : [], // Default to empty array if no data,
    menopause: patient.menopause || "",
    familyHistory: patient.familyHistory || "",
    familyHistoryDetails: patient.familyHistoryDetails || "",
    clinicalDiagnosis: patient.clinicalDiagnosis || "",
    diagnosisDetails: patient.diagnosisDetails || "",
    firstDegreeRelatives: patient.firstDegreeRelatives || "",
    previousCancer: patient.previousCancer || "",
    previousBiopsy: patient.previousBiopsy || "",
    previousSurgery: patient.previousSurgery || "",
    implants: patient.implants || "",
    screeningImage,
    smoking: patient.smoking || "",
    smokingDetails: patient.smokingDetails || {
      packsPerDay: null,
      yearsSmoked: null,
    },
    imagingStudies: patient.imagingStudies || {
      location: "",
      type: "",
      date: null,
    },
    lump: patient.lump || "",
    discharge: patient.discharge || "",
    dischargeDetails: patient.dischargeDetails || "",
    skinChanges: patient.skinChanges || "",
    skinChangesDetails: patient.skinChangesDetails || "",
    nippleRetraction: patient.nippleRetraction || "",
    nippleRetractionDetails: patient.nippleRetractionDetails || "",
    additionalInfo: patient.additionalInfo || "",
  });

  const handleFormChange = (changedValues) => {
    setFormState((prevState) => ({
      ...prevState,
      ...changedValues,
    }));
  };

  const handleSubmit = () => {
    const obstetricHistory = formState.obstetricHistory.reduce(
      (acc, key) => {
        acc[key.toLowerCase()] = true; // Set selected keys to true
        return acc;
      },
      { g: false, p: false, l: false } // Default values for all keys
    );

    const finalFormState = { ...formState, obstetricHistory };
    console.log("Form Data Submitted:", finalFormState);
    // Handle the form data, e.g., save to database
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Mammography Medical History</h2>
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
              <InputNumber placeholder="Enter Age" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Last Menstrual Period Date"
              name="lastMenstrualDate"
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Cycle Type" name="cycleType">
              <Radio.Group>
                <Radio value="Regular">Regular</Radio>
                <Radio value="Irregular">Irregular</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Obstetric History" name="obstetricHistory">
              <Checkbox.Group>
                <Checkbox value="G">G</Checkbox>
                <Checkbox value="P">P</Checkbox>
                <Checkbox value="L">L</Checkbox>
              </Checkbox.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Menopause" name="menopause">
              <Radio.Group>
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
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
            {formState.familyHistory === "Yes" && (
              <Form.Item
                label="If Yes, Please Describe"
                name="familyHistoryDetails"
              >
                <Input.TextArea placeholder="Describe details" rows={3} />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Relevant clinical/history/Presumptive diagnosis"
              name="relevantDiagnosis"
            >
              <Radio.Group>
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
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="First degree relatives with breast cancer before age 50:"
              name="firstDegreeRelatives"
            >
              <Radio.Group>
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
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Smoking History" name="smoking">
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
            {formState.smoking === "Yes" && (
              <>
                <Form.Item label="If Yes, Please Describe">
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12}>
                      <Form.Item label="Packs/Day" style={{ marginBottom: 0 }}>
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
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Previous Surgery" name="previousSurgery">
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Implants" name="implants">
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label="Imaging Studies Location"
              name="imagingStudies.location"
            >
              <Input placeholder="Enter Location" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Imaging Studies Type" name="imagingStudies.type">
              <Input placeholder="Enter Type" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Imaging Studies Date" name="imagingStudies.date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Screening Section */}
        <h3 className="mt-4 mb-3">Screening</h3>
        <PlaygroundApp
          setEditorContent={setScreeningImage}
          editable={true}
          defaultEditorContent={screeningImage}
          setHtmlToDownload={() => {}}
        />

        {/* Diagnostic Section */}
        <h3 className="mt-4 mb-3">Diagnostic</h3>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Pain" name="pain">
              <Radio.Group>
                <Radio value="No">No</Radio>
                <Radio value="Yes">Yes</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Lump" name="lump">
              <Radio.Group>
                <Radio value="No">No</Radio>
                <Radio value="Right">Right</Radio>
                <Radio value="Left">Left</Radio>
                <Radio value="Both">Both</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Discharge" name="discharge">
              <Radio.Group>
                <Radio value="No">No</Radio>
                <Radio value="Right">Right</Radio>
                <Radio value="left">Left</Radio>
                <Radio value="both">Both</Radio>
              </Radio.Group>
            </Form.Item>
            {formState.discharge !== "No" && formState.discharge && (
              <Form.Item label="Discharge Details" name="dischargeDetails">
                <Input.TextArea
                  placeholder="Enter discharge details"
                  rows={3}
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Skin Changes" name="skinChanges">
              <Radio.Group>
                <Radio value="Yes">Yes</Radio>
                <Radio value="No">No</Radio>
              </Radio.Group>
            </Form.Item>
            {formState.skinChanges === "Yes" && (
              <Form.Item label="Skin Changes Details" name="skinChangesDetails">
                <Input.TextArea
                  placeholder="Enter skin changes details"
                  rows={3}
                />
              </Form.Item>
            )}
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label="Nipple Retraction" name="nippleRetraction">
              <Radio.Group>
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
            rows={3}
          />
        </Form.Item>

        {/* Submit Button */}
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form>
    </div>
  );
};

export default MammoMedicalHistory;
