import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  Button,
  Spinner,
  Container,
  Row,
  Col,
  Alert,
  Breadcrumb,
  Form,
} from "react-bootstrap";
import { Loading } from "../../components/loading";
import clinicSerivces from "../../api/clinic-services";
import toast from "react-hot-toast";
import { Select } from "antd";

const ClinicDetails = () => {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  console.log("clinic: ", clinic);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isApproved, setIsApproved] = useState(false); // State to manage approval status
  const [editedClinic, setEditedClinic] = useState({});
  console.log("editedClinic: ", editedClinic);

  const { Option } = Select;

  const fetchClinicDetails = async () => {
    setLoading(true);
    try {
      const response = await clinicSerivces.getClinicById(id);
      setClinic(response.data);
    } catch (err) {
      setError("Failed to load clinic details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicDetails();
  }, [id]);

  const handleEditClick = () => {
    setEditedClinic({ ...clinic }); // Copy current clinic details
    setIsEditing(true); // Enable edit mode
  };

  const handleInputChange = (field, value) => {
    console.log("field", field);
    console.log(value, "value");
    setEditedClinic((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      const response = await clinicSerivces.updateClinic(id, editedClinic);
      if (response.success) {
        setClinic(editedClinic); // Update clinic data
        toast.success("Clinic details updated successfully!");
        setIsEditing(false); // Exit edit mode
      }
    } catch (err) {
      toast.error("Failed to update clinic details. Please try again.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const handleApproveClinic = async () => {
    try {
      const response = await clinicSerivces.approveClinic(id);
      setIsApproved(true);
      toast.success("Clinic request has been approved successfully!");

      // Call fetchClinicDetails after 3.1 seconds
      setTimeout(() => {
        fetchClinicDetails();
      }, 3100);
    } catch (err) {
      console.error("Error approving clinic:", err);
      toast.error(
        "Unable to approve the clinic request due to a technical issue."
      );
      setError("Failed to approve the clinic. Please try again.");
    }
  };

  return (
    <Container className="mt-5">
      <Breadcrumb className="my-3">
        <Breadcrumb.Item href="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/clinics">Clinics</Breadcrumb.Item>
        <Breadcrumb.Item active>{clinic?.clinicName || "N/A"}</Breadcrumb.Item>
      </Breadcrumb>

      {clinic?.status === "pending" && !isApproved && (
        <div className=" d-flex text-center my-3 ">
          <Button
            variant="success"
            size="md"
            className="ms-auto"
            onClick={handleApproveClinic}
            disabled={loading}
          >
            Approve Clinic
          </Button>
        </div>
      )}
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            {isEditing ? (
              <Form.Control
                type="text"
                value={editedClinic.clinicName || ""}
                onChange={(e) =>
                  handleInputChange("clinicName", e.target.value)
                }
              />
            ) : (
              clinic?.clinicName || "N/A"
            )}
          </h4>
          {!isEditing && (
            <Button variant="light" onClick={handleEditClick}>
              Edit
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Admin Name:</h5>
              {isEditing ? (
                <Form.Control
                  type="text"
                  value={editedClinic.adminName || ""}
                  onChange={(e) =>
                    handleInputChange("adminName", e.target.value)
                  }
                />
              ) : (
                <p>{clinic?.adminName || "N/A"}</p>
              )}
            </Col>
            <Col sm={6}>
              <h5>Specialties:</h5>
              {isEditing ? (
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="Select specialties"
                  value={editedClinic?.specialties || []}
                  onChange={(value) => handleInputChange("specialties", value)}
                >
                  {/* Define available options */}
                  <Option value="Cardiology">Dentist</Option>
                  <Option value="Dermatology">Mammography</Option>
                  <Option value="Pediatrics">General Physician</Option>
                </Select>
              ) : (
                <p>{clinic?.specialties || "N/A"}</p>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Admin Contact Email:</h5>
              {isEditing ? (
                <Form.Control
                  type="email"
                  value={editedClinic.adminContactEmail || ""}
                  onChange={(e) =>
                    handleInputChange("adminContactEmail", e.target.value)
                  }
                />
              ) : (
                <p>{clinic?.adminContactEmail || "N/A"}</p>
              )}
            </Col>
            <Col sm={6}>
              <h5>Admin Contact Phone:</h5>
              {isEditing ? (
                <Form.Control
                  type="text"
                  value={editedClinic.adminContactNumber || ""}
                  onChange={(e) =>
                    handleInputChange("adminContactNumber", e.target.value)
                  }
                />
              ) : (
                <p>{clinic?.adminContactNumber || "N/A"}</p>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Clinic Contact Email:</h5>
              {isEditing ? (
                <Form.Control
                  type="email"
                  value={editedClinic.clinicContactEmail || ""}
                  onChange={(e) =>
                    handleInputChange("clinicContactEmail", e.target.value)
                  }
                />
              ) : (
                <p>{clinic?.clinicContactEmail || "N/A"}</p>
              )}
            </Col>
            <Col sm={6}>
              <h5>Clinic Contact Phone:</h5>
              {isEditing ? (
                <Form.Control
                  type="text"
                  value={editedClinic.clinicPhoneNumber || ""}
                  onChange={(e) =>
                    handleInputChange("clinicPhoneNumber", e.target.value)
                  }
                />
              ) : (
                <p>{clinic?.clinicPhoneNumber || "N/A"}</p>
              )}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Status:</h5>
              <p>
                <span
                  className={`badge ${
                    clinic?.status === "pending"
                      ? "bg-warning text-dark"
                      : clinic?.status === "active"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {clinic?.status?.toUpperCase() || "N/A"}
                </span>
              </p>
            </Col>
            <Col sm={6}>
              <h5>Request Received On:</h5>
              <p>{new Date(clinic?.createdAt).toLocaleString() || "N/A"}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Address:</h5>
              {isEditing ? (
                <Form.Control
                  type="text"
                  value={editedClinic.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              ) : (
                <p>
                  {clinic?.address}, {clinic?.city}, {clinic?.state}
                </p>
              )}
            </Col>
          </Row>
          {isEditing && (
            <div className="mt-3 text-end">
              <Button
                variant="success"
                className="me-2"
                onClick={handleSaveChanges}
              >
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
      {isApproved && (
        <Alert className="mt-4" variant="success">
          Clinic approved successfully!
        </Alert>
      )}
    </Container>
  );
};

export default ClinicDetails;
