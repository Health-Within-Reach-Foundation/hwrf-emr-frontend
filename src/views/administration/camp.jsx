import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Badge,
} from "react-bootstrap";
import campManagementService from "../../api/camp-management-service";
import CustomTable from "../../components/custom-table";
import DateCell from "../../components/date-cell";
import { Loading } from "../../components/loading";

const CampDetails = () => {
  const { campId } = useParams();
  const [campData, setCampData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCampDetails = async () => {
    try {
      const response = await campManagementService.getCampById(campId);
      console.log(response);
      setCampData(response.data);
    } catch (error) {
      console.error("Error fetching camp details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampDetails();
  }, [campId]);

  if (loading) {
    return <Loading />;
  }

  if (!campData) {
    return <p className="text-center mt-5">No camp data found.</p>;
  }

  const {
    name,
    status,
    location,
    city,
    startDate,
    endDate,
    vans,
    clinic,
    users,
    patients,
    specialties,
  } = campData;

  const staffAttendingColumns = [
    {
      title: "Name",
      data: "name",
    },
    {
      title: "Email",
      data: "email",
    },
  ];

  const patientColumns = [
    {
      data: "regNo",
      title: "Reg. No",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      data: "name",
      title: "Name",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      data: "sex",
      title: "Sex",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
  ];

  return (
    <Container className="mt-5">
      {/* Camp Overview Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h3>{name}</h3>
              <Badge bg={status === "active" ? "success" : "secondary"}>
                {status}
              </Badge>
            </Card.Header>
            <Card.Body>
              <p>
                <strong>Location:</strong> {location}
              </p>
              <p>
                <strong>City:</strong> {city}
              </p>
              <p>
                <strong>Start Date:</strong>
                {new Date(startDate).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(endDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Vans:</strong> {vans?.join(", ") || "N/A"}
              </p>

              <p>
                <strong>Clinic Services:</strong>{" "}
                {specialties
                  ?.map((service) => service.departmentName)
                  .join(", ")}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Staff Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Staff</h4>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={staffAttendingColumns}
                data={users} // Use filtered data
                enableSearch
                enableFilters={false}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patients Section */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h4>Patients attended</h4>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={patientColumns}
                data={patients} // Use filtered data
                enableSearch
                enableFilters={false}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CampDetails;
