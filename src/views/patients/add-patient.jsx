import { PlusOutlined } from "@ant-design/icons";
import { RiSave3Line } from "@remixicon/react";
import { Alert, Button, Col, Divider, Form, Input, Row, Select, Space } from "antd";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import patientServices from "../../api/patient-services";

const { Option } = Select;

let index = 0;

const AddPatient = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [referralSources, setReferralSources] = useState([
    "Flyers",
    "Referred by a friend or relative",
    "WhatsApp message",
    "Passerby",
  ]);
  const [referralName, setReferralName] = useState("");
  const inputRef = useRef(null);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);

    const patientData = {
      name: `${values.fname} ${values.lname}`,
      mobile: values.mobile,
      age: values.age,
      sex: values.sex,
      address: `${values.add1}, ${values.city}`,
      referral_source: values.referral_source || null,
    };

    try {
      const response = await patientServices.addPatient(patientData);
      if (response.success) {
        toast.success("Patient added successfully.");
        setSuccessAlert(true);
        form.resetFields();
      } else {
        toast.error("Failed to add patient. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle adding new referral source
  const addReferralSource = (e) => {
    e.preventDefault();
    setReferralSources([...referralSources, referralName || `New source ${index++}`]);
    setReferralName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const onReferralNameChange = (event) => {
    setReferralName(event.target.value);
  };

  return (
    <Row>
      <Col span={24}>
        <div className="card">
          <div className="card-header d-flex justify-content-between">
            <h4 className="card-title">New Patient Information</h4>
          </div>
          <div className="card-body">
            <div className="new-user-info">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                // autoComplete="off"
              >
                <Row gutter={16}>
                  <Col md={12}>
                    <Form.Item
                      label="First Name"
                      name="fname"
                      rules={[
                        { required: true, message: "First name is required" },
                      ]}
                    >
                      <Input placeholder="First Name" disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Last Name"
                      name="lname"
                      rules={[
                        { required: true, message: "Last name is required" },
                      ]}
                    >
                      <Input placeholder="Last Name" disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Mobile Number"
                      name="mobile"
                      rules={[
                        {
                          required: true,
                          message: "Mobile number is required",
                        },
                        {
                          pattern: /^\d{10}$/,
                          message: "Must be a 10-digit number",
                        },
                      ]}
                    >
                      <Input placeholder="Mobile Number" disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Age"
                      name="age"
                      rules={[
                        { required: true, message: "Age is required" },
                        {
                          pattern: /^[1-9]\d*$/,
                          message: "Age must be a positive number",
                        },
                      ]}
                    >
                      <Input placeholder="Age" disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Sex"
                      name="sex"
                      rules={[{ required: true, message: "Sex is required" }]}
                    >
                      <Select placeholder="Select Sex" disabled={loading}>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Address"
                      name="add1"
                      rules={[
                        { required: true, message: "Address is required" },
                      ]}
                    >
                      <Input
                        placeholder="Street Address 1"
                        disabled={loading}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Town/City"
                      name="city"
                      rules={[{ required: true, message: "City is required" }]}
                    >
                      <Input placeholder="Town/City" disabled={loading} />
                    </Form.Item>
                  </Col>
                  <Col md={12}>
                    <Form.Item
                      label="Referral Source"
                      name="referral_source"
                      rules={[]}
                    >
                      <Select
                        placeholder="Select referral source"
                        disabled={loading}
                        popupRender={(menu) => (
                          <>
                            {menu}
                            <Divider style={{ margin: "8px 0" }} />
                            <Space style={{ padding: "0 8px 4px" }}>
                              <Input
                                placeholder="Add new source"
                                ref={inputRef}
                                value={referralName}
                                onChange={onReferralNameChange}
                                onKeyDown={(e) => e.stopPropagation()}
                              />
                              <Button
                                type="text"
                                icon={<PlusOutlined />}
                                onClick={addReferralSource}
                              >
                                Add
                              </Button>
                            </Space>
                          </>
                        )}
                        options={referralSources.map((source) => ({
                          label: source,
                          value: source,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <hr />
                <div className="d-flex justify-content-end gap-2">
                  {/* <Button type="default" disabled={loading} className="btn-outline-danger">
                    Cancel
                  </Button> */}
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    className="px-5"
                  >
                    Save
                    <RiSave3Line />
                  </Button>
                </div>
              </Form>
            </div>
            {successAlert && (
              <Alert
                className="mt-4"
                type="success"
                rootClassName="d-flex justify-content-start align-items-center text-center gap-2"
                showIcon
                message={
                  <div className="d-flex justify-content-start align-items-center text-center gap-2">
                    <p>
                      Patient added!{" "}
                      <Link to={"/queues"} className="text">
                        Add into queue?
                      </Link>
                    </p>
                  </div>
                }
              ></Alert>
            )}
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AddPatient;
