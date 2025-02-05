import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Carousel } from "react-bootstrap";
import { Loading } from "../../components/loading";
import ConfirmEmail from "./confirm-mail";
import authServices from "../../api/auth-services";
import logowhite from "/assets/images/logo-white.png";
import login1 from "/assets/images/login/1.png";
import login2 from "/assets/images/login/2.png";
import login3 from "/assets/images/login/3.png";
import { Link } from "react-router-dom";
import user1 from "/assets/images/user/1.jpg";
import Error500 from "../extra-pages/pages-error-500";
import toast from "react-hot-toast";
import Error404 from "../extra-pages/pages-error-404";
import { RiUser3Fill } from "@remixicon/react";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const ConfirmPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isTokenVerified, setIsTokenVerified] = useState(null);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  console.log(token);
  // Validate the JWT token and fetch user details
  useEffect(() => {
    const validateToken = async () => {
      setLoading(true);
      try {
        const response = await authServices.verifyToken(token);
        setIsTokenVerified(response.success);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Invalid or expired token. Please try again.");
        // navigate("/auth/login"); // Redirect to login on failure
      }
    };
    validateToken();
  }, [token, navigate]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm Password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      const response = await authServices.resetPassword(
        token,
        formData.password
      );

      if (response.success) {
        setLoading(false);
        toast.success(response.message);
        setSuccessMessage(response.message)
        setSuccess(true); // Show the SuccessComponent
      } else {
        setLoading(false);
        toast.error(response.message);
      }
    }
  };

  if (loading) return <Loading />; // Show loading spinner

  if (!isTokenVerified) return <Error404 />;

  if (success)
    return (
      <ConfirmEmail
        message={successMessage}
      />
    ); // Show success component

  return (
    <section
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8f9fa",
      }}
    >
      <Container
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          maxWidth: "500px",
        }}
      >
        <Row className="justify-content-center">
          <Col style={{}}>
            <div className="text-center">
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
              {/* <RiUser3Fill size={30} className="rounded-circle mb-3 text-center"/> */}
            </div>
            <div>
              <h4 className="text-center mb-1">
                Hi, {user?.name || "User"}!
              </h4>
              <p  className="text-center mb-1">
                Set your password to access your account.
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group
                  controlId="password"
                  style={{ marginBottom: "1rem" }}
                >
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  controlId="confirmPassword"
                  style={{ marginBottom: "1.5rem" }}
                >
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    isInvalid={!!errors.confirmPassword}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button
                  type="submit"
                  style={{
                    width: "100%",
                    backgroundColor: "#007bff",
                    borderColor: "#007bff",
                  }}
                  disabled={loading}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ConfirmPassword;
