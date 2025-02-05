import React from "react";
import { RiMapPinLine, RiTimeLine, RiTruckLine } from "@remixicon/react";
import { useAuth } from "../../utilities/AuthProvider";
import { Accordion, Alert, Row, Col } from "react-bootstrap";
import { transformText } from "../../utilities/utility-function";
import { Link } from "react-router-dom";

const CampInfoItem = ({ icon: Icon, label, value }) => (
  <Col md={4} sm={12}>
    <div className="d-flex align-items-start gap-2">
      <Icon />
      <h6>{label}:</h6>
    </div>
    <p>{value}</p>
  </Col>
);

const CurrentCampDetailsHeader = () => {
  const { user, userRoles, currentCampDetails } = useAuth();

  // Handle case where the user has no camp selected or is not authorized
  if (!userRoles.includes("superadmin") && !user?.currentCampId) {
    return (
      <Alert variant="warning">
        Please select a camp to access features and use the application
        properly.
        <Link to={"/"}>Select a Camp?</Link>
      </Alert>
    );
  }

  // Handle case where current camp details are available
  if (!currentCampDetails) {
    return null;
  }

  const { name, location, status, startDate, endDate, vans } =
    currentCampDetails;

  return (
    <Accordion className=" mb-3" >
      <Accordion.Item eventKey="0">
        {/* Main Header with Important Information */}
        <Accordion.Header className="d-flex flex-row justify-content-start align-items-center gap-3">
          <div className="d-flex flex-row">
            <strong>Current Camp Details:</strong>
            <strong>{name}</strong>
          </div>
          <div className="d-flex align-items-center gap-1">
            | <RiMapPinLine size={20} /> {location} |
          </div>
          <div
            className={`text-${
              status === "active" ? "success" : "danger"
            } fw-bold`}
          >
            {transformText(status)}
          </div>
        </Accordion.Header>

        {/* Detailed Information in Accordion Body */}
        <Accordion.Body>
          <Row className="">
            <CampInfoItem
              icon={RiTimeLine}
              label="Start Date"
              value={new Date(startDate).toLocaleDateString()}
            />
            <CampInfoItem
              icon={RiTimeLine}
              label="End Date"
              value={new Date(endDate).toLocaleDateString()}
            />
            <Col md={4} sm={12}>
              <div className="d-flex align-items-start gap-2">
                <RiTruckLine />
                <h6>Vans Assigned:</h6>
              </div>
              <ul className="ps-3">
                {vans?.map((van, index) => (
                  <li key={index}>{van}</li>
                ))}
              </ul>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CurrentCampDetailsHeader;