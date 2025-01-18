import React, { useState } from "react";
import { Container, Row, Col, Form, FormControl } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";
import toast from "react-hot-toast";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const responseData = await login(email, password);
      if (responseData.user && responseData.token) {
        toast.success("Logged in");
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Invalid credentials");
      toast.error(err.message);
    }
  };

  return (
    <section className="sign-in-page d-flex align-items-center min-vh-100">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <Link to="/" className="sign-in-logo mb-4 d-block">
              <img
                src={generatePath("/assets/images/hwrf-vertical.svg")}
                className="img-fluid"
                alt="Logo"
              />
            </Link>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={6} lg={5} className="p-4 border rounded bg-light">
            <h2 className="text-center mb-4">Sign In</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <FormControl
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <FormControl
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              {error && <div className="text-danger text-center mb-3">{error}</div>}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check type="checkbox" label="Remember Me" />
                <Link to="/auth/recover-password" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </div>
              <button type="submit" className="btn btn-primary w-100">Sign In</button>
            </Form>
            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <Link to="/auth/sign-up" className="text-decoration-none">
                Join us now!
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SignIn;
