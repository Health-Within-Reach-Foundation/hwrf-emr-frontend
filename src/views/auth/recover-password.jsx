import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Spinner } from "react-bootstrap";

// Import Image
import logowhite from "/assets/images/logo-white.png";
import toast from "react-hot-toast";
import authServices from "../../api/auth-services";
import ConfirmEmail from "./confirm-mail";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const RecoverPassword = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted

    try {
      // Call the forgotPassword API from authService
      const response = await authServices.forgotPassword(email);
      console.log(response);

      // Display success toast
      if (response.success) {
        toast.success("Password reset email sent successfully!");
        setMessage(response.message); // Assuming `message` is included in the API response
        setIsSuccess(true);
      }
      // Set success state and message
    } catch (error) {
      // Handle API error
      toast.error(
        error?.response?.data?.message || "Failed to send reset password email."
      );
    } finally {
      setLoading(false); // Set loading to false after the API call is complete
    }
  };
  // If successful, display the ConfirmEmail component
  if (isSuccess) {
    return <ConfirmEmail message={message} />;
  }

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
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-center mb-4">Reset Password</h2>
              <p className="text-center mb-4 text-muted">
                Enter your email address, and we'll send you an email with
                instructions to reset your password.
              </p>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="exampleInputEmail1">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/")} // Navigate back to home or previous page
                    disabled={loading} // Disable button while loading
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Sending...
                      </>
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <span>Go to Sign-In </span>
                  <Link to="/auth/sign-in" className="text-decoration-none">
                    Sign in
                  </Link>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RecoverPassword;
