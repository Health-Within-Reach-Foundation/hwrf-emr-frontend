import React, { useState } from "react";
import {
  Carousel,
  Form,
  Container,
  Row,
  Col,
  Button,
  Spinner,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import JoinUsCarousel from "../../components/join-us-carousel";
import clinicSerivces from "../../api/clinic-serivces";
import toast from "react-hot-toast";
const initialStateFormData = {
  adminName: "",
  specialties: [],
  adminEmail: "",
  adminPhoneNumber: "",
  clinicName: "",
  phoneNumber: null,
  contactEmail: null,
  password: "",
  confirmPassword: "",
};
const JoinUs = () => {
  const [formData, setFormData] = useState(initialStateFormData);

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNext = () => {
    const requiredFieldsByStep = {
      1: ["adminName", "specialties", "adminEmail", "adminPhoneNumber"],
      2: ["clinicName"],
      3: ["password", "confirmPassword"],
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

    if (step === 3 && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecialityChange = (e) => {
    const options = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prevData) => ({
      ...prevData,
      specialties: options,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    delete formData["confirmPassword"];
    console.log("Form Data Submitted:", formData);
    await clinicSerivces.onBoardClinic(formData);
    // toast.success(responseData.message);
    setLoading(false);
    // setFormData(initialStateFormData);
    // alert("Sign-up successful!");
  };

  const getFieldError = (field) => errors[field];

  return (
    <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
      <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
        <Row>
          <JoinUsCarousel />
          <Col md={6} className="position-relative z-2">
            <div className="sign-in-form d-flex flex-column custom-auth-fit-height">
              <h1 className="mb-0">Join Us By Enrolling Your Clinic!</h1>
              <Form className="mt-4" onSubmit={handleSubmit}>
                {step === 1 && (
                  <>
                    <Form.Group controlId="formFullName">
                      <Form.Label>
                        Your Full Name {"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="adminName"
                        value={formData.adminName}
                        onChange={handleChange}
                        isInvalid={!!getFieldError("adminName")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("adminName")}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formSpeciality">
                      <Form.Label>
                        Speciality
                        {"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Select
                        multiple
                        name="speciality"
                        value={formData.specialties}
                        onChange={handleSpecialityChange}
                        isInvalid={!!getFieldError("specialties")}
                        required
                      >
                        <option value="0faae5c1-d75f-4a03-a458-0db59bccf760">
                          General Physician
                        </option>
                        <option value="3e6b6890-6c81-46c7-a69e-723ecd58b946">
                          Dentist
                        </option>
                        <option value="12d8b31e-364f-417f-93e2-58bf9acef138">
                          Pediatrician
                        </option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("specialties")}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                      <Form.Label>
                        Email{"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Control
                        type="email"
                        name="adminEmail"
                        value={formData.adminEmail}
                        onChange={handleChange}
                        isInvalid={!!getFieldError("adminEmail")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("adminEmail")}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formPhoneNumber">
                      <Form.Label>
                        Phone Number{"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="adminPhoneNumber"
                        value={formData.adminPhoneNumber}
                        onChange={handleChange}
                        isInvalid={!!getFieldError("adminPhoneNumber")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("adminPhoneNumber")}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
                {step === 2 && (
                  <>
                    <Form.Group controlId="formClinicName">
                      <Form.Label>
                        Clinic Name{"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="clinicName"
                        value={formData.clinicName}
                        onChange={handleChange}
                        isInvalid={!!getFieldError("clinicName")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("clinicName")}
                      </Form.Control.Feedback>
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
                {step === 3 && (
                  <>
                    <Form.Group controlId="formPassword">
                      <Form.Label>
                        Password{"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!getFieldError("password")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("password")}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword">
                      <Form.Label>
                        Confirm Password{"  "}
                        <span className="text-danger">* </span>
                      </Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!getFieldError("confirmPassword")}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {getFieldError("confirmPassword")}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </>
                )}
                <div className="d-flex justify-content-between mt-2">
                  {step > 1 && (
                    <Button
                      type="button"
                      className="btn btn-primary-subtle"
                      onClick={handlePrevious}
                    >
                      Previous
                    </Button>
                  )}
                  {!loading ? (
                    <Button
                      type={step === 3 ? "submit" : "button"}
                      className="btn btn-primary-subtle"
                      onClick={handleNext}
                    >
                      {step === 3 ? "Submit" : "Next"}
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className="btn btn-primary-subtle"
                    >
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Loading...</span>
                    </Button>
                  )}
                </div>
              </Form>

              <span className="dark-color d-inline-block line-height-2 mt-4">
                Already Have An Account?{" "}
                <Link to="/auth/sign-in" className="text-decoration-underline">
                  Sign In
                </Link>
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default JoinUs;
