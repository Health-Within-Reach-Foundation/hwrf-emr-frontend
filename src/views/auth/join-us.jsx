// import React, { useState, useEffect } from "react";
// import {
//   Carousel,
//   Form,
//   Container,
//   Row,
//   Col,
//   Button,
//   Spinner,
// } from "react-bootstrap";
// import { Link } from "react-router-dom";
// import { Select } from "antd"; // Import Select from antd
// import JoinUsCarousel from "../../components/join-us-carousel";
// import clinicServices from "../../api/clinic-services";
// import superadminServices from "../../api/superadmin-services";
// import toast from "react-hot-toast";
// import ConfirmEmail from "./confirm-mail";

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
// const [formData, setFormData] = useState(initialStateFormData);
// const [errors, setErrors] = useState({});
// const [step, setStep] = useState(1);
// const [loading, setLoading] = useState(false);
// const [specialtyOptions, setSpecialtyOptions] = useState([]);
// const [successCompnent, setSuccessCompnent] = useState(false);

// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// const handleNext = () => {
//   const requiredFieldsByStep = {
//     1: ["adminName", "specialties", "adminEmail", "adminPhoneNumber"],
//     2: ["clinicName"],
//     // 3: ["password", "confirmPassword"],
//   };

//   const fieldsToCheck = requiredFieldsByStep[step];
//   const newErrors = {};

//   fieldsToCheck.forEach((field) => {
//     if (
//       !formData[field] ||
//       (Array.isArray(formData[field]) && formData[field].length === 0)
//     ) {
//       newErrors[field] = "This field is required.";
//     }
//   });

//   if (
//     step === 1 &&
//     formData.adminEmail &&
//     !emailRegex.test(formData.adminEmail)
//   ) {
//     newErrors.adminEmail = "Please enter a valid email address.";
//   }

//   // if (step === 3 && formData.password !== formData.confirmPassword) {
//   //   newErrors.confirmPassword = "Passwords do not match.";
//   // }

//   if (Object.keys(newErrors).length > 0) {
//     setErrors(newErrors);
//   } else {
//     setErrors({});
//     setStep((prevStep) => Math.min(prevStep + 1, 3));
//   }
// };

// const handlePrevious = () => {
//   setStep((prevStep) => Math.max(prevStep - 1, 1));
// };

// const handleChange = (e) => {
//   const { name, value } = e.target;
//   setFormData((prevData) => ({
//     ...prevData,
//     [name]: value,
//   }));
// };

// const handleSpecialtyChange = (value) => {
//   setFormData((prevData) => ({
//     ...prevData,
//     specialties: value,
//   }));
// };

// const handleSubmit = async (e) => {
//   setLoading(true);
//   e.preventDefault();
//   // delete formData["confirmPassword"];
//   console.log("formData of join us -->", formData);
//   try {
//     const response = await clinicServices.onBoardClinic(formData);
//     setFormData(initialStateFormData);
//     console.log(response, "after onboarding clinic");
//     if (response.success) {
//       toast.success(response.message);
//       setSuccessCompnent(true);
//     }
//   } catch (error) {
//     console.error("Error submitting form:", error);
//     toast.error("Failed to onboard clinic");
//   } finally {
//     setLoading(false);
//   }
// };

//   const getFieldError = (field) => errors[field];

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
//       }finally{
//         setLoading(false);
//       }
//     };

//     fetchSpecialties();
//   }, []);

//   return (
//     <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
//       <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
//         <Row>
//           {!successCompnent ? (
//             <>
//           <JoinUsCarousel />
//             <Col md={6} className="position-relative z-2">
//               <div className="sign-in-form d-flex flex-column ">
//                 <h1 className="mb-0">Join Us By Enrolling Your Clinic!</h1>
//                 <Form className="mt-4" onSubmit={handleSubmit}>
//                   {step === 1 && (
//                     <>
//                       <Form.Group controlId="formFullName" className="py-2">
//                         <Form.Label>
//                           Your Full Name <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="adminName"
//                           value={formData.adminName}
//                           onChange={handleChange}
//                           isInvalid={!!getFieldError("adminName")}
//                           required
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {getFieldError("adminName")}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group controlId="formSpecialty" className="py-2">
//                         <Form.Label>
//                           Specialty Services{" "}
//                           <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Select
//                           mode="multiple"
//                           options={specialtyOptions}
//                           value={formData.specialties}
//                           onChange={handleSpecialtyChange}
//                           placeholder="Select specialties"
//                           style={{ width: "100%" }}
//                         />
//                         {getFieldError("specialties") && (
//                           <div className="text-danger">
//                             {getFieldError("specialties")}
//                           </div>
//                         )}
//                       </Form.Group>
//                       <Form.Group controlId="formEmail" className="py-2">
//                         <Form.Label>
//                           Email <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="adminEmail"
//                           value={formData.adminEmail}
//                           onChange={handleChange}
//                           isInvalid={!!getFieldError("adminEmail")}
//                           required
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {getFieldError("adminEmail")}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group controlId="formPhoneNumber" className="py-2">
//                         <Form.Label>
//                           Phone Number <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="adminPhoneNumber"
//                           value={formData.adminPhoneNumber}
//                           onChange={handleChange}
//                           isInvalid={!!getFieldError("adminPhoneNumber")}
//                           required
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {getFieldError("adminPhoneNumber")}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                     </>
//                   )}
//                   {step === 2 && (
//                     <>
//                       <Form.Group controlId="formClinicName">
//                         <Form.Label>
//                           Clinic Name <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="clinicName"
//                           value={formData.clinicName}
//                           onChange={handleChange}
//                           isInvalid={!!getFieldError("clinicName")}
//                           required
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {getFieldError("clinicName")}
//                         </Form.Control.Feedback>
//                       </Form.Group>

//                       <Form.Group controlId="formClinicContactNumber">
//                         <Form.Label>Clinic Contact Number</Form.Label>
//                         <Form.Control
//                           type="text"
//                           name="phoneNumber"
//                           value={formData.phoneNumber}
// onChange={handleChange}
//                         />
//                       </Form.Group>
//                       <Form.Group controlId="formClinicContactEmail">
//                         <Form.Label>Clinic Contact Email</Form.Label>
//                         <Form.Control
//                           type="email"
//                           name="contactEmail"
//                           value={formData.contactEmail}
//                           onChange={handleChange}
//                         />
//                       </Form.Group>
//                     </>
//                   )}
//                   {/* {step === 3 && (
//                     <>
//                       <Form.Group controlId="formPassword">
//                         <Form.Label>
//                           Password <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Form.Control
//                           type="password"
//                           name="password"
//                           value={formData.password}
//                           onChange={handleChange}
//                           isInvalid={!!getFieldError("password")}
//                           required
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {getFieldError("password")}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                       <Form.Group controlId="formConfirmPassword">
//                         <Form.Label>
//                           Confirm Password{" "}
//                           <span className="text-danger">*</span>
//                         </Form.Label>
//                         <Form.Control
//                           type="password"
//                           name="confirmPassword"
//                           value={formData.confirmPassword}
//                           onChange={handleChange}
//                           isInvalid={!!getFieldError("confirmPassword")}
//                           required
//                         />
//                         <Form.Control.Feedback type="invalid">
//                           {getFieldError("confirmPassword")}
//                         </Form.Control.Feedback>
//                       </Form.Group>
//                     </>
//                   )} */}
//                   <div className="d-flex justify-content-between mt-2">
//                     {step > 1 && (
//                       <Button
//                         type="button"
//                         className="btn btn-primary-subtle"
//                         onClick={handlePrevious}
//                       >
//                         Previous
//                       </Button>
//                     )}
//                     {!loading ? (
//                       <Button
//                         type={step === 3 ? "submit" : "button"}
//                         className="btn btn-primary-subtle"
//                         onClick={handleNext}
//                       >
//                         {step === 2 ? "Submit" : "Next"}
//                       </Button>
//                     ) : (
//                       <Button
//                         variant="primary"
//                         className="btn btn-primary-subtle"
//                       >
//                         <Spinner
//                           as="span"
//                           animation="border"
//                           size="sm"
//                           role="status"
//                           aria-hidden="true"
//                         />
//                         <span className="visually-hidden">Loading...</span>
//                       </Button>
//                     )}
//                   </div>
//                 </Form>

//                 <span className="dark-color d-inline-block line-height-2 mt-4">
//                   Already Have An Account?{" "}
//                   <Link
//                     to="/auth/sign-in"
//                     className="text-decoration-underline"
//                   >
//                     Sign In
//                   </Link>
//                 </span>
//               </div>
//             </Col>
//             </>
//           ) : (
//             <ConfirmEmail
//               message={
//                 "Your onboarding request has been received successfully. Our team will review your request, and you will receive an email once your account has been activated"
//               }
//             />
//           )
//         }
//         </Row>
//       </Container>
//     </section>
//   );
// };

// export default JoinUs;

import React, { useState, useEffect } from "react";
import { Form, Container, Row, Col, Button, Spinner } from "react-bootstrap";
import { Select } from "antd"; // Ant Design Select for specialties
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import superadminServices from "../../api/superadmin-services";
import { Loading } from "../../components/loading";
import clinicServices from "../../api/clinic-services";
const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};
const initialStateFormData = {
  adminName: "",
  specialties: [],
  adminEmail: "",
  adminPhoneNumber: "",
  clinicName: "",
  phoneNumber: null,
  contactEmail: null,
  // password: "",
  // confirmPassword: "",
};

const JoinUs = () => {
  const [formData, setFormData] = useState(initialStateFormData);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [specialtyOptions, setSpecialtyOptions] = useState([]);
  const [successCompnent, setSuccessCompnent] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNext = () => {
    const requiredFieldsByStep = {
      1: ["adminName", "specialties", "adminEmail", "adminPhoneNumber"],
      2: ["clinicName"],
      // 3: ["password", "confirmPassword"],
    };

    const fieldsToCheck = requiredFieldsByStep[step];
    const newErrors = {};

    fieldsToCheck.forEach((field) => {
      if (
        !formData[field] ||
        (Array.isArray(formData[field]) && formData[field].length === 0)
      ) {
        newErrors[field] = "This field is required.";
      }
    });

    if (
      step === 1 &&
      formData.adminEmail &&
      !emailRegex.test(formData.adminEmail)
    ) {
      newErrors.adminEmail = "Please enter a valid email address.";
    }

    // if (step === 3 && formData.password !== formData.confirmPassword) {
    //   newErrors.confirmPassword = "Passwords do not match.";
    // }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      setErrors({});
      setStep((prevStep) => Math.min(prevStep + 1, 3));
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };
  const handleSpecialtyChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      specialties: value,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // delete formData["confirmPassword"];
    console.log("formData of join us -->", formData);
    try {
      const response = await clinicServices.onBoardClinic(formData);
      setFormData(initialStateFormData);
      console.log(response, "after onboarding clinic");
      if (response.success) {
        toast.success(response.message);
        setSuccessCompnent(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to onboard clinic");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch specialties and set them as options for Select
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
        // toast.error("Failed to fetch specialties");
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialties();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <div
              className="text-center"
              style={{ marginBottom: "2rem", color: "#0d6efd" }}
            >
              <Link to="/">
                <img
                  src={generatePath("/assets/images/hwrf-vertical.svg")}
                  alt="Logo"
                  style={{
                    width: "150px",
                    marginBottom: "1rem",
                  }}
                />
              </Link>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                Welcome to Our Clinic Network
              </h2>
            </div>
            <Form
              onSubmit={handleSubmit}
              style={{
                background: "#ffffff",
                borderRadius: "8px",
                padding: "2rem",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <h3 className="mb-4" style={{ color: "#0d6efd" }}>
                Join Us
              </h3>
              {step === 1 && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="adminName"
                      value={formData.adminName}
                      // onChange={(e) =>
                      //   setFormData({
                      //     ...formData,
                      //     adminName: e.target.value,
                      //   })
                      // }
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Specialties</Form.Label>
                    <Select
                      mode="multiple"
                      placeholder="Select specialties"
                      value={formData.specialties}
                      options={specialtyOptions}
                      onChange={handleSpecialtyChange}
                      style={{ width: "100%" }}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="adminEmail"
                      value={formData.adminEmail}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Admin Phone Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="adminPhoneNumber"
                      value={formData.adminPhoneNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group controlId="formClinicName">
                    <Form.Label>
                      Clinic Name 
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="clinicName"
                      value={formData.clinicName}
                      onChange={handleChange}
                      // isInvalid={!!getFieldError("clinicName")}
                      required
                    />
                  </Form.Group>

                  <Form.Group controlId="formClinicContactNumber">
                    <Form.Label>Clinic Contact Number</Form.Label>
                    <Form.Control
                      type="text"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formClinicContactEmail">
                    <Form.Label>Clinic Contact Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </>
              )}
              <div
                className="d-flex justify-content-between mt-4"
                style={{ gap: "1rem" }}
              >
                {/* {step > 1 && (
                  <Button variant="secondary" onClick={handlePrevious}>
                    Previous
                  </Button>
                )} */}
                <Button variant="primary" onClick={handleSubmit} type="submit">
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>
              <span className="dark-color d-inline-block line-height-2 mt-4">
                Already Have An Account?{" "}
                <Link to="/auth/sign-in" className="text-decoration-underline">
                  Sign In
                </Link>
              </span>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default JoinUs;
