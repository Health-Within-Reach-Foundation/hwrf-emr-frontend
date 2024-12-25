import React, { useState } from "react";
import Card from "../../components/Card";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import adminService from "../../api/admin-services";
import { Loading } from "../../components/loading";
import toast from "react-hot-toast";

const AddUser = () => {
  const [formData, setFormData] = useState({
    role: "",
    specialist: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update form data
    setFormData({ ...formData, [id]: value });

    // Clear individual field error if it exists
    if (errors[id]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[id];
        return updatedErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validation rules
    if (!formData.role || formData.role === "Select")
      newErrors.role = "User Role is required.";

    if (!formData.specialist || formData.specialist === "Select")
      newErrors.specialist = "User Speciality is required.";

    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";

    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Mobile Number is required.";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Enter a valid 10-digit mobile number.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        // Step 1: Concatenate firstName and lastName to form 'name'
        const name = `${formData.firstName} ${formData.lastName}`;

        // Step 2: Exclude firstName and lastName from formData
        const { firstName, lastName, ...restFormData } = formData;

        // Step 3: Add the 'name' key to the formData
        const updatedFormData = { ...restFormData, name };

        const result = await adminService.inviteUser(updatedFormData);

        if (result.success) {
          setShowAlert(true); // Show success alert
          setFormData({
            role: "",
            specialist: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          });
          setErrors({}); // Clear any residual errors
          setLoading(false);
          toast.success("Invitation send to the user");
        } else {
          // Handle error using toast or alert
          setLoading(false);
          toast.error(result.error);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col lg={3}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <Card.Header.Title>
                <h4 className="card-title">Add User</h4>
              </Card.Header.Title>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="form-group cust-form-input">
                  <Form.Label className="mb-0">User Role:</Form.Label>
                  <Form.Control
                    as="select"
                    className="my-2"
                    id="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option>Select</option>
                    <option>doctor</option>
                    <option>receptionist</option>
                    <option>assistant</option>
                  </Form.Control>
                  {errors.role && (
                    <Form.Text className="text-danger">{errors.role}</Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="form-group cust-form-input">
                  <Form.Label className="mb-0">User Speciality:</Form.Label>
                  <Form.Control
                    as="select"
                    className="my-2"
                    id="specialist"
                    value={formData.specialist}
                    onChange={handleInputChange}
                  >
                    <option>Select</option>
                    <option>None</option>
                    <option>General Physician</option>
                    <option>Dentist</option>
                    <option>Cardiologist</option>
                    <option>Pediatrician</option>
                  </Form.Control>
                  {errors.specialist && (
                    <Form.Text className="text-danger">
                      {errors.specialist}
                    </Form.Text>
                  )}
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={9}>
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <Card.Header.Title>
                <h4 className="card-title">New User Information</h4>
              </Card.Header.Title>
            </Card.Header>
            <Card.Body>
              <div className="new-user-info">
                <Form onSubmit={handleSubmit}>
                  <Row className="cust-form-input">
                    <Col md={6} className="form-group">
                      <Form.Label htmlFor="firstName" className="mb-0">
                        First Name:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="my-2"
                        id="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                      {errors.firstName && (
                        <Form.Text className="text-danger">
                          {errors.firstName}
                        </Form.Text>
                      )}
                    </Col>
                    <Col md={6} className="form-group">
                      <Form.Label htmlFor="lastName" className="mb-0">
                        Last Name:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="my-2"
                        id="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                      {errors.lastName && (
                        <Form.Text className="text-danger">
                          {errors.lastName}
                        </Form.Text>
                      )}
                    </Col>
                    <Col md={6} className="form-group">
                      <Form.Label htmlFor="phoneNumber" className="mb-0">
                        Mobile Number:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        className="my-2"
                        id="phoneNumber"
                        placeholder="Mobile Number"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                      />
                      {errors.phoneNumber && (
                        <Form.Text className="text-danger">
                          {errors.phoneNumber}
                        </Form.Text>
                      )}
                    </Col>
                    <Col md={6} className="form-group">
                      <Form.Label htmlFor="email" className="mb-0">
                        Email:
                      </Form.Label>
                      <Form.Control
                        type="email"
                        className="my-2"
                        id="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                      {errors.email && (
                        <Form.Text className="text-danger">
                          {errors.email}
                        </Form.Text>
                      )}
                    </Col>
                  </Row>
                  <hr />
                  <div className="d-flex gap-2">
                    <Button type="submit" className="btn btn-primary-subtle">
                      Send Invitation
                    </Button>
                  </div>
                  {showAlert && (
                    <Alert
                      variant="success"
                      className="mt-3"
                      onClose={() => setShowAlert(false)}
                      dismissible
                    >
                      User invited successfully!
                    </Alert>
                  )}
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddUser;
