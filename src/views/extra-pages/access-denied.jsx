import React from "react";
import { Container } from 'react-bootstrap';
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <>
      <Container className="p-0">
        <div className="d-flex vh-100 justify-content-center">
          <div className="text-center align-self-center">
            <div className="error position-relative">
              <h1 className="text-warning" style={{ fontSize: '185px', fontWeight: 'bold' }}>403</h1>
              <h2 className="mb-0">Oops! Access Denied.</h2>
              <p className="fs-5">You do not have permission to view this page.</p>
              <Link className="btn btn-warning-subtle mt-3" to="/">
                <div className="d-flex align-items-center"><i className="ri-home-4-line me-2"></i>
                  <p className="mb-0">Back to Home</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default AccessDenied;
