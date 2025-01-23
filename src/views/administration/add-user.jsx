import React, { useState, useEffect } from "react";
import Card from "../../components/Card";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import adminService from "../../api/admin-services";
import { Loading } from "../../components/loading";
import toast from "react-hot-toast";
import clinicServices from "../../api/clinic-services";
import { Select } from "antd";
import rolePermissionService from "../../api/role-permission-service";

const AddUser = () => {
  const [formData, setFormData] = useState({
    roles: [],
    specialities: [],
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Fetch roles
  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await rolePermissionService.getRoles();
      setRoles(
        response.data.map((role) => ({
          value: role.id,
          label: role.roleName,
        }))
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch specialities
  const getSpecialities = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getSpecialtyDepartmentsByClinic();
      setSpecialities(
        response.data.map((speciality) => ({
          value: speciality.id,
          label: speciality.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching specialities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    getSpecialities();
  }, []);

  const handleSelectChange = (field) => (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.roles.length)
      newErrors.roles = "At least one role is required.";
    // if (!formData.specialities.length)
    //   newErrors.specialities = "At least one speciality is required.";
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required.";
    if (!formData.lastName.trim())
      newErrors.lastName = "Last Name is required.";
    if (!formData.phoneNumber.trim() || !/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "A valid 10-digit mobile number is required.";
    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      newErrors.email = "A valid email address is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      try {
        const name = `${formData.firstName} ${formData.lastName}`;
        const { firstName, lastName, ...restFormData } = formData;
        const updatedFormData = { ...restFormData, name };

        const result = await adminService.inviteUser(updatedFormData);
        if (result.success) {
          setShowAlert(true);
          setFormData({
            roles: [],
            specialities: [],
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          });
          setErrors({});
          toast.success("Invitation sent to the user.");
        } else {
          toast.error(result.error);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("An unexpected error occurred.");
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
                  <Select
                    mode="multiple"
                    placeholder="Select Role"
                    value={formData.roles}
                    options={roles}
                    onChange={handleSelectChange("roles")}
                    allowClear
                    className="w-100 my-2"
                    // showSearch
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                  />
                  {errors.roles && (
                    <Form.Text className="text-danger">
                      {errors.roles}
                    </Form.Text>
                  )}
                </Form.Group>
                <Form.Group className="form-group cust-form-input">
                  <Form.Label className="mb-0">User Speciality:</Form.Label>
                  <Select
                    mode="multiple"
                    placeholder="Select Speciality"
                    value={formData.specialities}
                    options={specialities}
                    onChange={handleSelectChange("specialities")}
                    allowClear
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    className="w-100 my-2"
                  />
                  {/* {errors.specialities && (
                    <Form.Text className="text-danger">
                      {errors.specialities}
                    </Form.Text>
                  )} */}
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
              <Form onSubmit={handleSubmit}>
                <Row className="cust-form-input">
                  <Col md={6}>
                    <Form.Label>First Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                    />
                    {errors.firstName && (
                      <Form.Text className="text-danger">
                        {errors.firstName}
                      </Form.Text>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label>Last Name:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                    />
                    {errors.lastName && (
                      <Form.Text className="text-danger">
                        {errors.lastName}
                      </Form.Text>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label>Mobile Number:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Mobile Number"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumber: e.target.value,
                        }))
                      }
                    />
                    {errors.phoneNumber && (
                      <Form.Text className="text-danger">
                        {errors.phoneNumber}
                      </Form.Text>
                    )}
                  </Col>
                  <Col md={6}>
                    <Form.Label>Email:</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                    />
                    {errors.email && (
                      <Form.Text className="text-danger">
                        {errors.email}
                      </Form.Text>
                    )}
                  </Col>
                </Row>
                <Button type="submit" className="mt-3">
                  Send Invitation
                </Button>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddUser;
