import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  DatePicker,
  Button,
  Divider,
} from "antd";
import dayjs from "dayjs";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";

const GPMedicalRecordForm = ({
  record,
  isEdit,
  onCancel = () => {},
  patientData,
  onSave = () => {},
}) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(!isEdit); // Initially editable for new records
  const [loading, setLoading] = useState(false);
  const [onlineAmount, setOnlineAmount] = useState(0);
  const [offlineAmount, setOfflineAmount] = useState(0);

  const complaintsOptions = [
    "Fever",
    "Cough",
    "Cold",
    "Loose motion",
    "Constipation",
    "Vomiting",
    "Abdominal pain",
    "Knee/Joint pain",
    "Headache",
    "Other complaints",
  ];

  const kcoOptions = [
    "Hypothyroidism",
    "Hyperthyroidism",
    "Asthama",
    "Epilepsy",
  ];

  const findingsOptions = [
    "Temperature",
    "BP",
    "Pulse rate",
    "Respiratory rate",
    "General examination",
    "Skin lesion",
  ];
  const systemicExaminationOptions = [
    "CNS",
    "Respiratory",
    "Cardio vascular",
    "Per abdominal examination",
  ];

  useEffect(() => {
    if (isEdit && record) {
      form.setFieldsValue({
        weight: record.weight,
        height: record.height,
        sugar: record.sugar,
        bp: record.bp,
        hb: record.hb,
        complaints: record.complaints,
        kco: record.kco,
        otherComplaints: record.otherComplaints,
        findings: record.findings,
        systemicExamination: record.systemicExamination,
        medicine: record.medicine,
        advice: record.advice,
        followUpDate: record.followUpDate ? dayjs(record.followUpDate) : null,
        treatment: record.treatment,
        onlineAmount: record.onlineAmount,
        offlineAmount: record.offlineAmount,
        findingsOptionsDetails: record.findingsOptionsDetails || {},
        systemicExaminationOptionsDetails:
          record.systemicExaminationOptionsDetails || {},
      });
      setOnlineAmount(record.onlineAmount || 0);
      setOfflineAmount(record.offlineAmount || 0);
      calculateBMI(record.weight, record.height);
    }
  }, [isEdit, record, form]);

  // Watch the form values dynamically (better than useState)
  const selectedComplaints = Form.useWatch("complaints", form) || [];
  const selectedFindings = Form.useWatch("findings", form) || [];
  const selectedSystemicExaminations =
    Form.useWatch("systemicExamination", form) || [];

  // Use derived state instead of useState
  const showOtherComplaints = selectedComplaints.includes("Other complaints");

  const calculateBMI = (weight, heightFeet) => {
    if (weight && heightFeet) {
      const heightParts = heightFeet.toString().split(".");
      const feet = parseInt(heightParts[0], 10);
      const inches = heightParts[1] ? parseInt(heightParts[1], 10) : 0;
      const height = feet * 0.3048 + inches * 0.0254; // Convert height to meters
      const bmi = (weight / (height * height)).toFixed(2);
      form.setFieldsValue({ bmi });
    }
  };

  const onFinish = async (values) => {
    try {
      setLoading(true);
      let response;
      if (isEdit) {
        const { bmi, ...otherValues } = values;
        response = await patientServices.updateGPRecord(record.id, otherValues);
        setIsEditing(false);
      } else {
        const { bmi, ...otherValues } = values;
        console.log("formData going to be send -->  ", otherValues);
        response = await patientServices.createGPRecord({
          ...otherValues,
          patientId: patientData.id,
        });
        form.resetFields();
      }
      if (!isEdit) {
        onCancel();
      }
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Internal server error.");
      console.error("Error saving GP record:", error);
    } finally {
      onSave();
      setLoading(false);
    }
  };

  const handleAmountChange = () => {
    const online = form.getFieldValue("onlineAmount") || 0;
    const offline = form.getFieldValue("offlineAmount") || 0;
    setOnlineAmount(online);
    setOfflineAmount(offline);
  };

  return (
    <div>
      <div className="d-flex justify-content-end gap-3">
        {isEdit && !isEditing && (
          <Button
            type="primary"
            onClick={() => setIsEditing(true)}
            style={{ marginBottom: "10px" }}
            className="rounded-0 bg-primary btn-primary"
          >
            Edit
          </Button>
        )}
        {isEdit && isEditing && (
          <>
            <Button
              type="primary"
              className="rounded-0 bg-primary btn-primary"
              loading={loading}
              onClick={() => onFinish(form.getFieldsValue())}
            >
              Update
            </Button>

            <Button
              variant="outlined"
              className="rounded-0 border-primary hover:btn-primary"
              style={{ marginLeft: "10px" }}
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              // label="Weight (kg)"
              label={<h6>Weight (kg)</h6>}
              name="weight"
            >
              <Input
                type="number"
                onChange={() =>
                  calculateBMI(
                    form.getFieldValue("weight"),
                    form.getFieldValue("height")
                  )
                }
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>Height (feet)</h6>} name="height">
              <Input
                type="number"
                step="0.01"
                // onChange={calculateBMI}
                onChange={() =>
                  calculateBMI(
                    form.getFieldValue("weight"),
                    form.getFieldValue("height")
                  )
                }
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>BMI </h6>} name="bmi">
              <Input readOnly />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>Sugar level</h6>} name="sugar">
              <Input type="number" disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>BP </h6>} name="bp">
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>HB </h6>} name="hb">
              <Input type="number" disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item label={<h6>Complaints</h6>} name="complaints">
              <Checkbox.Group disabled={!isEditing} className="mt-2">
                <Row>
                  {complaintsOptions.map((option) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={option}>
                      <Checkbox value={option}>{option}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
            {showOtherComplaints && (
              <Form.Item
                label={<h6>Other complaints</h6>}
                name="otherComplaints"
              >
                <Input.TextArea rows={3} disabled={!isEditing} />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item label={<h6>K/C/O ( Known Case Of )</h6>} name="kco">
              <Checkbox.Group disabled={!isEditing} className="mt-2">
                <Row>
                  {kcoOptions.map((option) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={option}>
                      <Checkbox value={option}>{option}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
        <Divider orientation="center" className="bg-secondary" />

        <h5>Brief History</h5>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item label={<h6>Findings</h6>} name="findings">
              <Checkbox.Group disabled={!isEditing} className="mt-2">
                <Row>
                  {findingsOptions.map((option) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={option}>
                      <Checkbox value={option}>{option}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          {selectedFindings?.includes("Temperature") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Temperature details</h6>}
                name={[`findingsOptionsDetails`, `temperatureDetails`]}
              >
                <Input
                  placeholder={`Describe temperature details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
          {selectedFindings?.includes("BP") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>BP details</h6>}
                name={[`findingsOptionsDetails`, `bpDetails`]}
              >
                <Input
                  placeholder={`Describe BP details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
          {selectedFindings?.includes("Pulse rate") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Pulse rate details</h6>}
                name={[`findingsOptionsDetails`, `pulseRateDetails`]}
              >
                <Input
                  placeholder={`Describe pulse rate details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 16]}>
          {selectedFindings?.includes("Respiratory rate") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Respiratory rate details</h6>}
                name={[`findingsOptionsDetails`, `respiratoryRateDetails`]}
              >
                <Input
                  placeholder={`Describe Respiratory rate details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
          {selectedFindings?.includes("General examination") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>General examination details</h6>}
                name={[`findingsOptionsDetails`, `generalExaminationDetails`]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={`Describe General examination details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
          {selectedFindings?.includes("Skin lesion") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Skin lesion details</h6>}
                name={[`findingsOptionsDetails`, `skinLesionDetails`]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={`Describe Skin lesion details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
        </Row>

        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Form.Item
              label={<h6>Systemic Examination</h6>}
              name="systemicExamination"
            >
              <Checkbox.Group disabled={!isEditing} className="mt-2">
                <Row>
                  {systemicExaminationOptions.map((option) => (
                    <Col xs={24} sm={12} md={8} lg={8} key={option}>
                      <Checkbox value={option}>{option}</Checkbox>
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 16]}>
          {selectedSystemicExaminations?.includes("CNS") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>CNS details</h6>}
                name={[`systemicExaminationOptionsDetails`, `cnsDetails`]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={`Describe CNS details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
          {selectedSystemicExaminations?.includes("Respiratory") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Respiratory details</h6>}
                name={[
                  `systemicExaminationOptionsDetails`,
                  `respiratoryDetails`,
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={`Describe respiratory details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
          {selectedSystemicExaminations?.includes("Cardio vascular") && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Cardio vascular details</h6>}
                name={[
                  `systemicExaminationOptionsDetails`,
                  `cardioVascularDetails`,
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={`Describe cardio vascular details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Row gutter={[16, 16]}>
          {selectedSystemicExaminations?.includes(
            "Per abdominal examination"
          ) && (
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                label={<h6>Per abdominal examination details</h6>}
                name={[
                  `systemicExaminationOptionsDetails`,
                  `perAbdominalExaminationDetails`,
                ]}
              >
                <Input.TextArea
                  rows={3}
                  placeholder={`Describe per abdominal examination details`}
                  disabled={!isEditing}
                />
              </Form.Item>
            </Col>
          )}
        </Row>
        <hr />

        <Divider orientation="center" className="bg-secondary" />
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Form.Item label={<h6>Treatment</h6>} name="treatment">
              <Input.TextArea rows={3} disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={12}>
            <Form.Item label={<h6>Advice</h6>} name="advice">
              <Input.TextArea rows={3} disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label={<h6>Medicine</h6>} name="medicine">
          <Input.TextArea rows={3} disabled={!isEditing} />
        </Form.Item>

        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>Follow up date</h6>} name="followUpDate">
              <DatePicker disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>Online paid amount</h6>} name="onlineAmount">
              <Input
                type="number"
                disabled={!isEditing}
                onChange={handleAmountChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item
              label={<h6>Offline paid amount</h6>}
              name="offlineAmount"
            >
              <Input
                type="number"
                disabled={!isEditing}
                onChange={handleAmountChange}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Form.Item label={<h6>Total</h6>}>
              <Input
                type="number"
                disabled
                readOnly
                value={Number(onlineAmount) + Number(offlineAmount)}
              />
            </Form.Item>
          </Col>
        </Row>
        {isEditing && !isEdit && (
          <Form.Item className="d-flex justify-content-end">
            <Button
              type="primary"
              htmlType="submit"
              className="rounded-0 bg-primary btn-primary"
              loading={loading}
            >
              Submit
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default GPMedicalRecordForm;
