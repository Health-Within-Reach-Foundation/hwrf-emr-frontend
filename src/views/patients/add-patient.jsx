// import React, { useState } from "react";
// import Card from "../../components/Card";
// import { Alert, Button, Col, Form, Row } from "react-bootstrap";
// import toast from "react-hot-toast";
// import patientServices from "../../api/patient-services";
// import { Link } from "react-router-dom";

// const AddPatient = () => {
//   const [formData, setFormData] = useState({
//     fname: "",
//     lname: "",
//     mobile: "",
//     age: "",
//     sex: "",
//     city: "",
//     add1: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false); // Loading state
//   const [sucessAlert, setSucessAlert] = useState(false); // Loading state

//   // Handle input change
//   const handleInputChange = (e) => {
//     const { id, value } = e.target;
//     setFormData({ ...formData, [id]: value });
//   };

//   // Validate form
//   const validateForm = () => {
//     const newErrors = {};

//     if (!formData.fname.trim()) newErrors.fname = "First name is required.";
//     if (!formData.lname.trim()) newErrors.lname = "Last name is required.";
//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required.";
//     } else if (!/^\d{10}$/.test(formData.mobile)) {
//       newErrors.mobile = "Mobile number must be 10 digits.";
//     }
//     if (!formData.age.trim()) {
//       newErrors.age = "Age is required.";
//     } else if (!/^\d+$/.test(formData.age) || parseInt(formData.age, 10) <= 0) {
//       newErrors.age = "Age must be a positive number.";
//     }
//     if (!formData.sex.trim()) newErrors.sex = "Sex is required.";
//     if (!formData.city.trim()) newErrors.city = "City is required.";
//     if (!formData.add1.trim()) newErrors.add1 = "Address is required.";

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (validateForm()) {
//       setLoading(true); // Set loading to true
//       const patientData = {
//         name: `${formData.fname} ${formData.lname}`,
//         mobile: formData.mobile,
//         age: formData.age,
//         sex: formData.sex,
//         address: `${formData.add1}, ${formData.city}`,
//       };

//       try {
//         const response = await patientServices.addPatient(patientData);
//         if (response.success) {
//           toast.success("Patient added successfully.");
//           setSucessAlert(true);
//           setFormData({
//             fname: "",
//             lname: "",
//             mobile: "",
//             age: "",
//             sex: "",
//             city: "",
//             add1: "",
//           });
//         } else {
//           toast.error("Failed to add patient. Please try again.");
//         }
//       } catch (error) {
//         toast.error("An error occurred. Please try again later.");
//       } finally {
//         setLoading(false); // Set loading back to false
//       }
//     }
//   };

//   return (
//     <Row>
//       <Card>
//         <Card.Header className="d-flex justify-content-between">
//           <Card.Header.Title>
//             <h4 className="card-title">New Patient Information</h4>
//           </Card.Header.Title>
//         </Card.Header>
//         <Card.Body>
//           <div className="new-user-info">
//             <Form onSubmit={handleSubmit}>
//               <Row className="cust-form-input">
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="fname" className="mb-0">
//                     First Name:
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     className={`my-2 ${errors.fname ? "is-invalid" : ""}`}
//                     id="fname"
//                     placeholder="First Name"
//                     value={formData.fname}
//                     onChange={handleInputChange}
//                     disabled={loading} // Disable field when loading
//                   />
//                   {errors.fname && (
//                     <div className="invalid-feedback">{errors.fname}</div>
//                   )}
//                 </Col>
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="lname" className="mb-0">
//                     Last Name:
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     className={`my-2 ${errors.lname ? "is-invalid" : ""}`}
//                     id="lname"
//                     placeholder="Last Name"
//                     value={formData.lname}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   />
//                   {errors.lname && (
//                     <div className="invalid-feedback">{errors.lname}</div>
//                   )}
//                 </Col>
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="mobile" className="mb-0">
//                     Mobile Number:
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     className={`my-2 ${errors.mobile ? "is-invalid" : ""}`}
//                     id="mobile"
//                     placeholder="Mobile Number"
//                     value={formData.mobile}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   />
//                   {errors.mobile && (
//                     <div className="invalid-feedback">{errors.mobile}</div>
//                   )}
//                 </Col>
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="age" className="mb-0">
//                     Age:
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     className={`my-2 ${errors.age ? "is-invalid" : ""}`}
//                     id="age"
//                     placeholder="Age"
//                     value={formData.age}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   />
//                   {errors.age && (
//                     <div className="invalid-feedback">{errors.age}</div>
//                   )}
//                 </Col>
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="sex" className="mb-0">
//                     Sex:
//                   </Form.Label>
//                   <Form.Control
//                     as="select"
//                     className={`my-2 ${errors.sex ? "is-invalid" : ""}`}
//                     id="sex"
//                     value={formData.sex}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   >
//                     <option value="">Select Sex</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                     <option value="other">Other</option>
//                   </Form.Control>
//                   {errors.sex && (
//                     <div className="invalid-feedback">{errors.sex}</div>
//                   )}
//                 </Col>
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="add1" className="mb-0">
//                     Address:
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     className={`my-2 ${errors.add1 ? "is-invalid" : ""}`}
//                     id="add1"
//                     placeholder="Street Address 1"
//                     value={formData.add1}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   />
//                   {errors.add1 && (
//                     <div className="invalid-feedback">{errors.add1}</div>
//                   )}
//                 </Col>
//                 <Col md={6} className="form-group">
//                   <Form.Label htmlFor="city" className="mb-0">
//                     Town/City:
//                   </Form.Label>
//                   <Form.Control
//                     type="text"
//                     className={`my-2 ${errors.city ? "is-invalid" : ""}`}
//                     id="city"
//                     placeholder="Town/City"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     disabled={loading}
//                   />
//                   {errors.city && (
//                     <div className="invalid-feedback">{errors.city}</div>
//                   )}
//                 </Col>
//               </Row>
//               <hr />
//               <div className="d-flex gap-2">
//                 <Button
//                   variant="danger-subtle"
//                   type="button"
//                   disabled={loading} // Disable Cancel button when loading
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   variant="primary-subtle"
//                   type="submit"
//                   disabled={loading} // Disable Save button when loading
//                 >
//                   {loading ? (
//                     <span className="spinner-border spinner-border-sm"></span>
//                   ) : (
//                     "Save"
//                   )}
//                 </Button>
//               </div>
//             </Form>
//           </div>
//           {sucessAlert && (
//             <Alert className="mt-4" variant="success">
//               Patient added ! <Link to={"/queues"}>Add into queue ?</Link>
//             </Alert>
//           )}
//         </Card.Body>
//       </Card>
//     </Row>
//   );
// };

// export default AddPatient;

import React, { useState } from "react";
import { Form, Row, Col, Input, Select, Button, Alert } from "antd";
import toast from "react-hot-toast";
import patientServices from "../../api/patient-services";
import { Link } from "react-router-dom";
import { RiSave3Line, RiSaveFill } from "@remixicon/react";

const { Option } = Select;

const AddPatient = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);

    const patientData = {
      name: `${values.fname} ${values.lname}`,
      mobile: values.mobile,
      age: values.age,
      sex: values.sex,
      address: `${values.add1}, ${values.city}`,
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
