import React, { useState } from "react";
import Card from "../../components/Card";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import patientServices from "../../api/patient-services";
import { Link } from "react-router-dom";

const AddPatient = () => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    mobile: "",
    age: "",
    sex: "",
    city: "",
    add1: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Loading state
  const [sucessAlert, setSucessAlert] = useState(false); // Loading state

  // Handle input change
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required.";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required.";
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits.";
    }
    if (!formData.age.trim()) {
      newErrors.age = "Age is required.";
    } else if (!/^\d+$/.test(formData.age) || parseInt(formData.age, 10) <= 0) {
      newErrors.age = "Age must be a positive number.";
    }
    if (!formData.sex.trim()) newErrors.sex = "Sex is required.";
    if (!formData.city.trim()) newErrors.city = "City is required.";
    if (!formData.add1.trim()) newErrors.add1 = "Address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true); // Set loading to true
      const patientData = {
        name: `${formData.fname} ${formData.lname}`,
        mobile: formData.mobile,
        age: formData.age,
        sex: formData.sex,
        address: `${formData.add1}, ${formData.city}`,
      };

      try {
        const response = await patientServices.addPatient(patientData);
        if (response.success) {
          toast.success("Patient added successfully.");
          setSucessAlert(true);
          setFormData({
            fname: "",
            lname: "",
            mobile: "",
            age: "",
            sex: "",
            city: "",
            add1: "",
          });
        } else {
          toast.error("Failed to add patient. Please try again.");
        }
      } catch (error) {
        toast.error("An error occurred. Please try again later.");
      } finally {
        setLoading(false); // Set loading back to false
      }
    }
  };

  return (
    <Row>
      <Card>
        <Card.Header className="d-flex justify-content-between">
          <Card.Header.Title>
            <h4 className="card-title">New Patient Information</h4>
          </Card.Header.Title>
        </Card.Header>
        <Card.Body>
          <div className="new-user-info">
            <Form onSubmit={handleSubmit}>
              <Row className="cust-form-input">
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="fname" className="mb-0">
                    First Name:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className={`my-2 ${errors.fname ? "is-invalid" : ""}`}
                    id="fname"
                    placeholder="First Name"
                    value={formData.fname}
                    onChange={handleInputChange}
                    disabled={loading} // Disable field when loading
                  />
                  {errors.fname && (
                    <div className="invalid-feedback">{errors.fname}</div>
                  )}
                </Col>
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="lname" className="mb-0">
                    Last Name:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className={`my-2 ${errors.lname ? "is-invalid" : ""}`}
                    id="lname"
                    placeholder="Last Name"
                    value={formData.lname}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.lname && (
                    <div className="invalid-feedback">{errors.lname}</div>
                  )}
                </Col>
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="mobile" className="mb-0">
                    Mobile Number:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className={`my-2 ${errors.mobile ? "is-invalid" : ""}`}
                    id="mobile"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.mobile && (
                    <div className="invalid-feedback">{errors.mobile}</div>
                  )}
                </Col>
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="age" className="mb-0">
                    Age:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className={`my-2 ${errors.age ? "is-invalid" : ""}`}
                    id="age"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.age && (
                    <div className="invalid-feedback">{errors.age}</div>
                  )}
                </Col>
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="sex" className="mb-0">
                    Sex:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className={`my-2 ${errors.sex ? "is-invalid" : ""}`}
                    id="sex"
                    value={formData.sex}
                    onChange={handleInputChange}
                    disabled={loading}
                  >
                    <option value="">Select Sex</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Control>
                  {errors.sex && (
                    <div className="invalid-feedback">{errors.sex}</div>
                  )}
                </Col>
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="city" className="mb-0">
                    Town/City:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className={`my-2 ${errors.city ? "is-invalid" : ""}`}
                    id="city"
                    placeholder="Town/City"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.city && (
                    <div className="invalid-feedback">{errors.city}</div>
                  )}
                </Col>
                <Col md={6} className="form-group">
                  <Form.Label htmlFor="add1" className="mb-0">
                    Address:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className={`my-2 ${errors.add1 ? "is-invalid" : ""}`}
                    id="add1"
                    placeholder="Street Address 1"
                    value={formData.add1}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                  {errors.add1 && (
                    <div className="invalid-feedback">{errors.add1}</div>
                  )}
                </Col>
              </Row>
              <hr />
              <div className="d-flex gap-2">
                <Button
                  variant="danger-subtle"
                  type="button"
                  disabled={loading} // Disable Cancel button when loading
                >
                  Cancel
                </Button>
                <Button
                  variant="primary-subtle"
                  type="submit"
                  disabled={loading} // Disable Save button when loading
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </Form>
          </div>
          {sucessAlert && (
            <Alert className="mt-4" variant="success">
              Patient added ! <Link to={"/queues"}>Add into queue ?</Link>
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Row>
  );
};

export default AddPatient;
