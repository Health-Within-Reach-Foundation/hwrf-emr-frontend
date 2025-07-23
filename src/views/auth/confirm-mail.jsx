import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

// Import Image
import logowhite from "/assets/images/logo-white.png";
import maillogo from "/assets/images/login/mail.png";
import { RiMailCheckFill } from "@remixicon/react";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const ConfirmEmail = ({ message = "" }) => {
  const navigate = useNavigate();

  return (
    <section
      className="d-flex align-items-center"
      style={{ minHeight: "100vh", backgroundColor: "#f5f7fa" }}
    >
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <div className="text-center mb-4">
              <Link to="/" className="sign-in-logo mb-4 d-block">
                <img
                  src={generatePath("/assets/images/hwrf-vertical.svg")}
                  className="img-fluid"
                  alt="Logo"
                />
              </Link>
            </div>
            <div className="bg-white p-4 rounded shadow text-center">
              <RiMailCheckFill size={50} className="text-primary" />
              <h1 className="mt-3 mb-3">Success!</h1>
              <p className="text-muted">{message}</p>
              <div className="mt-4">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ConfirmEmail;
