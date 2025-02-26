// import React, { useState, useEffect } from "react";
// import { Form, Container, Row, Col, Button, Spinner } from "react-bootstrap";
// import { Select } from "antd"; // Ant Design Select for specialties
// import { Link } from "react-router-dom";
// import toast from "react-hot-toast";
// import superadminServices from "../../api/superadmin-services";
// import { Loading } from "../../components/loading";
// import clinicServices from "../../api/clinic-services";
// const generatePath = (path) => {
//   return window.origin + import.meta.env.BASE_URL + path;
// };
// const initialStateFormData = {
//   adminName: "",
//   specialties: [],
//   adminEmail: "",
//   adminPhoneNumber: "",
//   clinicName: "",
//   phoneNumber: null,
//   contactEmail: null,
//   // password: "",
//   // confirmPassword: "",
// };

// const JoinUs = () => {
//   const [formData, setFormData] = useState(initialStateFormData);
//   const [errors, setErrors] = useState({});
//   const [step, setStep] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [specialtyOptions, setSpecialtyOptions] = useState([]);
//   const [successCompnent, setSuccessCompnent] = useState(false);

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//   const handleNext = () => {
//     const requiredFieldsByStep = {
//       1: ["adminName", "specialties", "adminEmail", "adminPhoneNumber"],
//       2: ["clinicName"],
//       // 3: ["password", "confirmPassword"],
//     };

//     const fieldsToCheck = requiredFieldsByStep[step];
//     const newErrors = {};

//     fieldsToCheck.forEach((field) => {
//       if (
//         !formData[field] ||
//         (Array.isArray(formData[field]) && formData[field].length === 0)
//       ) {
//         newErrors[field] = "This field is required.";
//       }
//     });

//     if (
//       step === 1 &&
//       formData.adminEmail &&
//       !emailRegex.test(formData.adminEmail)
//     ) {
//       newErrors.adminEmail = "Please enter a valid email address.";
//     }

//     // if (step === 3 && formData.password !== formData.confirmPassword) {
//     //   newErrors.confirmPassword = "Passwords do not match.";
//     // }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//     } else {
//       setErrors({});
//       setStep((prevStep) => Math.min(prevStep + 1, 3));
//     }
//   };

//   const handlePrevious = () => {
//     setStep((prevStep) => Math.max(prevStep - 1, 1));
//   };
//   const handleSpecialtyChange = (value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       specialties: value,
//     }));
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     setLoading(true);
//     e.preventDefault();
//     // delete formData["confirmPassword"];
//     console.log("formData of join us -->", formData);
//     try {
//       const response = await clinicServices.onBoardClinic(formData);
//       setFormData(initialStateFormData);
//       console.log(response, "after onboarding clinic");
//       if (response.success) {
//         toast.success(response.message);
//         setSuccessCompnent(true);
//       }
//     } catch (error) {
//       console.error("Error submitting form:", error);
//       toast.error("Failed to onboard clinic");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Fetch specialties and set them as options for Select
//     const fetchSpecialties = async () => {
//       try {
//         setLoading(true);
//         const response = await superadminServices.getAllSpecialties();
//         const options = response.data.map((item) => ({
//           label: item.departmentName,
//           value: item.id,
//         }));
//         setSpecialtyOptions(options);
//       } catch (error) {
//         console.error("Error fetching specialties:", error);
//         // toast.error("Failed to fetch specialties");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSpecialties();
//   }, []);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#f8f9fa",
//       }}
//     >
//       <Container>
//         <Row className="justify-content-center">
//           <Col xs={12} md={8} lg={6}>
//             <div
//               className="text-center"
//               style={{ marginBottom: "2rem", color: "#0d6efd" }}
//             >
//               <Link to="/">
//                 <img
//                   src={generatePath("/assets/images/hwrf-vertical.svg")}
//                   alt="Logo"
//                   style={{
//                     width: "150px",
//                     marginBottom: "1rem",
//                   }}
//                 />
//               </Link>
//               <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
//                 Welcome to Our Clinic Network
//               </h2>
//             </div>
//             <Form
//               onSubmit={handleSubmit}
//               style={{
//                 background: "#ffffff",
//                 borderRadius: "8px",
//                 padding: "2rem",
//                 boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//               }}
//             >
//               <h3 className="mb-4" style={{ color: "#0d6efd" }}>
//                 Join Us
//               </h3>
//               {step === 1 && (
//                 <>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Admin Name</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="adminName"
//                       value={formData.adminName}
//                       // onChange={(e) =>
//                       //   setFormData({
//                       //     ...formData,
//                       //     adminName: e.target.value,
//                       //   })
//                       // }
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Specialties</Form.Label>
//                     <Select
//                       mode="multiple"
//                       placeholder="Select specialties"
//                       value={formData.specialties}
//                       options={specialtyOptions}
//                       onChange={handleSpecialtyChange}
//                       style={{ width: "100%" }}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Admin Email</Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="adminEmail"
//                       value={formData.adminEmail}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                   <Form.Group className="mb-3">
//                     <Form.Label>Admin Phone Number</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="adminPhoneNumber"
//                       value={formData.adminPhoneNumber}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>

//                   <Form.Group controlId="formClinicName">
//                     <Form.Label>
//                       Clinic Name
//                     </Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="clinicName"
//                       value={formData.clinicName}
//                       onChange={handleChange}
//                       // isInvalid={!!getFieldError("clinicName")}
//                       required
//                     />
//                   </Form.Group>

//                   <Form.Group controlId="formClinicContactNumber">
//                     <Form.Label>Clinic Contact Number</Form.Label>
//                     <Form.Control
//                       type="text"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                   <Form.Group controlId="formClinicContactEmail">
//                     <Form.Label>Clinic Contact Email</Form.Label>
//                     <Form.Control
//                       type="email"
//                       name="contactEmail"
//                       value={formData.contactEmail}
//                       onChange={handleChange}
//                     />
//                   </Form.Group>
//                 </>
//               )}
//               <div
//                 className="d-flex justify-content-between mt-4"
//                 style={{ gap: "1rem" }}
//               >
//                 <Button variant="primary" onClick={handleSubmit} type="submit">
//                   {loading ? (
//                     <Spinner size="sm" animation="border" />
//                   ) : (
//                     "Submit"
//                   )}
//                 </Button>
//               </div>
//               <span className="dark-color d-inline-block line-height-2 mt-4">
//                 Already Have An Account?{" "}
//                 <Link to="/auth/sign-in" className="text-decoration-underline">
//                   Sign In
//                 </Link>
//               </span>
//             </Form>
//           </Col>
//         </Row>
//       </Container>
//     </div>
//   );
// };

// export default JoinUs;

import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select, Spin } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import superadminServices from "../../api/superadmin-services";
import clinicServices from "../../api/clinic-services";
import { Loading } from "../../components/loading";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const initialStateFormData = {
  adminName: "",
  specialties: [],
  adminEmail: "",
  adminPhoneNumber: "",
  clinicName: "",
  phoneNumber: "",
  contactEmail: "",
};

const JoinUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [successComponent, setSuccessComponent] = useState(false);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        setLoading(true);
        const response = await superadminServices.getAllSpecialties();
        const options = response.data.map((item) => ({
          label: item.departmentName,
          value: item.id,
        }));
        setSpecialtyOptions(options);
      } catch (error) {
        console.error("Error fetching specialties:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecialties();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    console.log("values of join us -->", values);
    try {
      // const response = await clinicServices.onBoardClinic(values);
      if (response.success) {
        toast.success(response.message);
        setSuccessComponent(true);
        form.resetFields();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to onboard clinic");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="d-flex align-items-center min-vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center mt-3">
            <Link to="/" className="sign-in-logo mb-4 d-block">
              <img
                src={generatePath("/assets/images/hwrf-vertical.svg")}
                className="img-fluid"
                alt="Logo"
              />
            </Link>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 p-4 border rounded bg-light shadow">
            <h2 className="text-center mb-4">Join Us</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={initialStateFormData}
              size="large"
            >
              <Form.Item
                label="Admin Name"
                name="adminName"
                rules={[
                  { required: true, message: "Please enter the admin name" },
                ]}
              >
                <Input placeholder="Enter admin name" />
              </Form.Item>

              <Form.Item
                label="Specialties"
                name="specialties"
                rules={[
                  {
                    required: true,
                    message: "Please select at least one specialty",
                  },
                ]}
              >
                <Select
                  mode="multiple"
                  options={specialtyOptions}
                  placeholder="Select specialties"
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                />
              </Form.Item>

              <Form.Item
                label="Admin Email"
                name="adminEmail"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Enter a valid email" },
                ]}
              >
                <Input placeholder="Enter admin email" />
              </Form.Item>

              <Form.Item
                label="Admin Phone Number"
                name="adminPhoneNumber"
                rules={[
                  { required: true, message: "Please enter the phone number" },
                ]}
              >
                <Input placeholder="Enter admin phone number" />
              </Form.Item>

              <Form.Item
                label="Clinic Name"
                name="clinicName"
                rules={[
                  { required: true, message: "Please enter the clinic name" },
                ]}
              >
                <Input placeholder="Enter clinic name" />
              </Form.Item>

              <Form.Item
                label="Clinic Contact Number"
                name="phoneNumber"
                // rules={[
                //   {
                //     required: true,
                //     message: "Please enter the clinic contact number",
                //   },
                // ]}
              >
                <Input placeholder="Enter clinic contact number" />
              </Form.Item>

              <Form.Item
                label="Clinic Contact Email"
                name="contactEmail"
                // rules={[
                //   { required: true, message: "Please enter the clinic email" },
                //   { type: "email", message: "Enter a valid email" },
                // ]}
              >
                <Input placeholder="Enter clinic contact email" />
              </Form.Item>

              <div className="d-flex justify-content-end gap-2">
                <Button
                  type="default"
                  onClick={() => form.resetFields()}
                  disabled={loading}
                  className="btn-secondary bg-secondary text-black border-0"
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={loading}
                  className="btn-primary bg-primary"
                >
                  Submit
                </Button>
              </div>

              <div className="text-center mt-3">
                <span>Already have an account? </span>
                <Link to="/auth/sign-in" className="text-decoration-none">
                  Sign In
                </Link>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
