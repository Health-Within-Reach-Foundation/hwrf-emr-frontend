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
        message={"Your account has been created! You can login now "}
      />
    ); // Show success component

  return (
    <section className="sign-in-page d-md-flex align-items-center custom-auth-height">
      <Container className="sign-in-page-bg mt-5 mb-md-5 mb-0 p-0">
        <Row>
          {/* <Col md={6} className="text-center z-2">
            <div className="sign-in-detail text-white">
              <h4 className="mt-3 mb-0">Hi, {user?.name || "User"}!</h4>
              <p>Set your password to access your account.</p>
            </div>
          </Col> */}
          <Col md={6} className="text-center z-2">
            <div className="sign-in-detail text-white">
              <Link to="/" className="sign-in-logo mb-2">
                <img src={logowhite} className="img-fluid" />
              </Link>
              <Carousel
                id="carouselExampleCaptions"
                interval={2000}
                controls={false}
              >
                <Carousel.Item>
                  <img src={login1} className="d-block w-100" alt="Slide 1" />
                  <div className="carousel-caption-container">
                    <h4 className="mb-1 mt-1 text-white">Manage your orders</h4>
                    <p className="pb-5">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={login2} className="d-block w-100" alt="Slide 2" />
                  <div className="carousel-caption-container">
                    <h4 className="mb-1 mt-1 text-white">Manage your orders</h4>
                    <p className="pb-5">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                </Carousel.Item>
                <Carousel.Item>
                  <img src={login3} className="d-block w-100" alt="Slide 3" />
                  <div className="carousel-caption-container">
                    <h4 className="mb-1 mt-1 text-white">Manage your orders</h4>
                    <p className="pb-5">
                      It is a long established fact that a reader will be
                      distracted by the readable content.
                    </p>
                  </div>
                </Carousel.Item>
              </Carousel>{" "}
            </div>
          </Col>
          <Col md={6} className="position-relative z-2">
            <div className="sign-in-form d-flex flex-column justify-content-center">
              <img
                src={user1}
                alt="user-image"
                width="25%"
                className="rounded-circle"
              />
              <h4 className="mt-3 mb-0">Hi, {user?.name || "User"}!</h4>
              <p>Set your password to access your account.</p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="form-group mb-3" controlId="password">
                  <Form.Label className="mb-2">Password</Form.Label>
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
                  className="form-group mb-3"
                  controlId="confirmPassword"
                >
                  <Form.Label className="mb-2">Confirm Password</Form.Label>
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
                  className="btn btn-primary-subtle float-end mt-3"
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
