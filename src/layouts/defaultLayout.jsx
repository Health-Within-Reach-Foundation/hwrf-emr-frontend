import React from "react";

// react-router
import { Outlet } from "react-router-dom";

// Import selectors & action from setting store
import * as SettingSelector from "../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Partials
import Header from "../components/partials/headerStyle/header";
import Footer from "../components/partials/footerStyle/footer";
import Sidebar from "../components/partials/sidebar/sidebar";
import SettingOffCanvas from "../components/setting/SettingOffCanvas";

import { Alert, Card } from "react-bootstrap";
import { useAuth } from "../utilities/AuthProvider";
import { Col, Row } from "antd";
import "./camp-details-header.scss";

const DefaultLayout = () => {
  const pageLayout = useSelector(SettingSelector.page_layout);
  const { user, userRoles, currentCampDetails } = useAuth();

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <main className="main-content content-page ">
          {/* Show warning if currentCampId is not available */}
          {!userRoles.includes("superadmin") && !user?.currentCampId ? (
            <Alert variant="warning">
              Please select a camp to access features and use the application
              properly.
            </Alert>
          ) : currentCampDetails ? (
            <Card className="shadow-sm border-light mt-2 mx-5">
              <Card.Header className="bg-primary ">
                <h5 className="m-0 text-white">Current Camp Details</h5>
              </Card.Header>
              <Card.Body>
                {/* Camp Details Block */}
                <div className="camp-details-container">
                  <div className="camp-summary">
                    <h6>{currentCampDetails.name}</h6>
                    <p>{currentCampDetails.location}</p>
                  </div>
                  <div className="camp-full-details">
                    <Row>
                      <Col md={6} className="mb-3">
                        <h6>Camp ID:</h6>
                        <p>{currentCampDetails.id}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <h6>Status:</h6>
                        <p
                          className={`text-${
                            currentCampDetails.status === "active"
                              ? "success"
                              : "danger"
                          }`}
                        >
                          {currentCampDetails.status}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <h6>City:</h6>
                        <p>{currentCampDetails.city}</p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <h6>Start Date:</h6>
                        <p>
                          {new Date(
                            currentCampDetails.startDate
                          ).toLocaleDateString()}
                        </p>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6} className="mb-3">
                        <h6>End Date:</h6>
                        <p>
                          {new Date(
                            currentCampDetails.endDate
                          ).toLocaleDateString()}
                        </p>
                      </Col>
                      <Col md={6} className="mb-3">
                        <h6>Vans Assigned:</h6>
                        <ul>
                          {currentCampDetails?.vans?.map((van, index) => (
                            <li key={index}>{van}</li>
                          ))}
                        </ul>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : null}
          <div className="position-relative">
            {/* --Nav Start-- */}
            <Header />
            {/* --Nav End-- */}
          </div>
          <div className={` ${pageLayout} content-inner pb-0`} id="page_layout">
            {/* {loading ? <Loading /> : <Outlet />}
             */}
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
      <SettingOffCanvas />
    </>
  );
};

export default DefaultLayout;
