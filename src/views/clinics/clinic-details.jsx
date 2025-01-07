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
} from "react-bootstrap";
import { Loading } from "../../components/loading";
import clinicSerivces from "../../api/clinic-services";
import toast from "react-hot-toast";

const ClinicDetails = () => {
  const { id } = useParams(); // Get the dynamic ID from the route
  const [clinic, setClinic] = useState(null); // State to store clinic data
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage error
  const [isApproved, setIsApproved] = useState(false); // State to manage approval status

  const fetchClinicDetails = async () => {
    setLoading(true); // Set loading to false after the API call
    try {
      const response = await clinicSerivces.getClinicById(id);
      console.log(response, "clinic id");

      setClinic(response.data); // Update state with fetched data
    } catch (err) {
      setError("Failed to load clinic details.");
      console.error("Error fetching clinic details:", err);
    } finally {
      setLoading(false); // Set loading to false after the API call
    }
  };

  // Fetch clinic details by ID
  useEffect(() => {
    fetchClinicDetails();
  }, [id]);

  const handleApproveClinic = async () => {
    try {
      const response = await clinicSerivces.approveClinic(id);
      if (response.success) {
        setIsApproved(true);
        toast.success("Clinic request has been approved successfully!");
      } 

      // Call fetchClinicDetails after 4 seconds
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

  return (
    <Container className="mt-5">
      {/* Breadcrumb Navigation */}
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
      {/* Clinic Details Card */}
      <Card className="shadow-lg">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">{clinic?.clinicName || "N/A"}</h4>
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            {/* <Col sm={6}>
              <h5>Clinic Name:</h5>
              <p>{clinic?.clinicName || "N/A"}</p>
            </Col> */}
            <Col sm={6}>
              <h5>Admin Name:</h5>
              <p>{clinic?.adminName || "N/A"}</p>
            </Col>
            <Col sm={6}>
              <h5>Specialties:</h5>
              <p>{clinic?.specialties || "N/A"}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Admin Contact Email:</h5>
              <p>{clinic?.adminContactEmail || "N/A"}</p>
            </Col>
            <Col sm={6}>
              <h5>Admin Contact Phone:</h5>
              <p>{clinic?.adminContactNumber || "N/A"}</p>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <h5>Clinic Contact Email:</h5>
              <p>{clinic?.clinicContactEmail || "N/A"}</p>
            </Col>
            <Col sm={6}>
              <h5>Clinic Contact Phone:</h5>
              <p>{clinic?.clinicPhoneNumber || "N/A"}</p>
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
              <p>
                {clinic?.address}, {clinic?.city}, {clinic?.state}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Approve Button Section */}

      {isApproved && (
        <Alert className="mt-4" variant="success">
          Clinic approved successfully!
        </Alert>
      )}
    </Container>
  );
};

export default ClinicDetails;
