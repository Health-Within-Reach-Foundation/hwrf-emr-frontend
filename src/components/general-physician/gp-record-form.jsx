import React, { useState, useEffect } from "react";
import { Form, Input, Row, Col, Checkbox, DatePicker, Button } from "antd";
import dayjs from "dayjs";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";
import { set } from "lodash";

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
  const findingsOptions = [
    "Fever",
    "Cold",
    "Cough",
    "Loose Motion",
    "Headache",
    "Stomach Pain",
    "Nausea",
    "Viral Infection",
    "Other Symptoms",
  ];

  console.log("record", record);

  // Set form values when editing an existing record
  useEffect(() => {
    if (isEdit && record) {
      form.setFieldsValue({
        weight: record.weight,
        height: record.height,
        bmi:
          record.weight && record.height
            ? (
                record.weight /
                Math.pow(
                  parseInt(record.height) * 0.3048 +
                    (parseFloat(record.height) % 1) * 0.0254,
                  2
                )
              ).toFixed(2)
            : null,

        sugar: record.sugar,
        bp: record.bp,
        hb: record.hb,
        complaints: record.complaints,
        findings: record.findings,
        medicine: record.medicine,
        advice: record.advice,
        followUpDate: record.followUpDate ? dayjs(record.followUpDate) : null,
      });
    }
  }, [isEdit, record, form]);

  const calculateBMI = () => {
    const weight = form.getFieldValue("weight");
    const heightFeet = form.getFieldValue("height");
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
    console.log("Form values:", values);
    try {
      setLoading(true);
      // Save the record to the database
      let response;
      if (isEdit) {
        const { bmi, ...otherValues } = values;
        console.log("otherValues in update", otherValues);
        response = await patientServices.updateGPRecord(record.id, otherValues);
        setIsEditing(false);
        // Update the existing record
      } else {
        // Save the new record
        // refacttor the below line here I want to exlcude the bmi from the values
        const { bmi, ...otherValues } = values;
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
      toast.error("Intenal server error.");
      console.error("Error saving GP record:", error);
    } finally {
      onSave();
      setLoading(false);
    }
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
              //   htmlType="submit"
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
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Weight (kg)" name="weight">
              <Input
                type="number"
                onChange={calculateBMI}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Height (feet)" name="height">
              <Input
                type="number"
                step="0.01"
                onChange={calculateBMI}
                disabled={!isEditing}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="BMI" name="bmi">
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Sugar Level" name="sugar">
              <Input type="number" disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="BP" name="bp">
              <Input disabled={!isEditing} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="HB" name="hb">
              <Input type="number" disabled={!isEditing} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Complaints" name="complaints">
          <Input.TextArea rows={3} disabled={!isEditing} />
        </Form.Item>

        <Form.Item label="Findings" name="findings">
          <Checkbox.Group disabled={!isEditing}>
            <Row gutter={[16, 16]}>
              {findingsOptions.map((option) => (
                <Col xs={24} sm={12} md={8} lg={6} key={option}>
                  <Checkbox value={option}>{option}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="Medicine" name="medicine">
          <Input.TextArea rows={3} disabled={!isEditing} />
        </Form.Item>

        <Form.Item label="Advice" name="advice">
          <Input.TextArea rows={3} disabled={!isEditing} />
        </Form.Item>

        <Form.Item label="Follow-Up Date" name="followUpDate">
          <DatePicker disabled={!isEditing} />
        </Form.Item>

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
