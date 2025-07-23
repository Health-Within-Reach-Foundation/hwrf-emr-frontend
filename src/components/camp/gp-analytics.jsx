import React from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import Card from "../Card";
import { useAuth } from "../../utilities/AuthProvider";

const GPAnalytics = ({ gpAnalytics }) => {
  const { permissions } = useAuth();
  console.log("GPAnalytics components", gpAnalytics);
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">GP Analytics</h4>
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="">
                  <h5 className="card-title">
                    Total GP patient: {gpAnalytics?.totalGPPatients}
                  </h5>
                  <div className={`details`}>
                    <span className="title text-dark">{"Total Attended"}</span>
                    <div
                      className={`percentage float-end text-${
                        gpAnalytics?.totalAttended /
                        gpAnalytics?.totalGPPatients
                      }`}
                    >
                      {gpAnalytics?.totalAttended}{" "}
                      <small>out of {gpAnalytics?.totalGPPatients}</small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (gpAnalytics?.totalAttended /
                            gpAnalytics?.totalGPPatients) *
                          100
                        } // Convert to percentage
                        variant={"info"}
                        style={{ height: "6px" }}
                        className={`shadow-none progress `}
                      />
                    </div>
                  </div>
                  <div className={`details`}>
                    <span className="title text-dark">{"Missed"}</span>
                    <div
                      className={`percentage float-end text-${
                        gpAnalytics?.missed / gpAnalytics?.totalGPPatients
                      }`}
                    >
                      {gpAnalytics?.missed}{" "}
                      <small>out of {gpAnalytics?.totalGPPatients}</small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (gpAnalytics?.missed / gpAnalytics?.totalGPPatients) *
                          100
                        } // Convert to percentage
                        variant={"info"}
                        style={{ height: "6px" }}
                        className={`shadow-none progress `}
                      />
                    </div>
                  </div>
                  <hr /> <hr />
                  {permissions
                    ?.map((permission) => permission?.action)
                    ?.includes("camps:finance") && (
                    <div className="">
                      <h5 className="card-title">
                        Total Earnings: {gpAnalytics?.totalEarnings}
                      </h5>
                      {/* Pricing  */}
                      <div className={`details`}>
                        <span className="title text-dark">{"Online"}</span>
                        <div
                          className={`percentage float-end text-${
                            gpAnalytics?.onlineEarnings /
                            gpAnalytics?.totalEarnings
                          }`}
                        >
                          {gpAnalytics?.onlineEarnings}{" "}
                          <small>out of {gpAnalytics?.totalEarnings}</small>
                        </div>
                        <div className="progress-bar-linear d-inline-block w-100">
                          <ProgressBar
                            now={
                              (gpAnalytics?.onlineEarnings /
                                gpAnalytics?.totalEarnings) *
                              100
                            } // Convert to percentage
                            variant={"success"}
                            style={{ height: "6px" }}
                            className={`shadow-none progress `}
                          />
                        </div>
                      </div>

                      <div className={`details`}>
                        <span className="title text-dark">{"Cash"}</span>
                        <div
                          className={`percentage float-end text-${
                            gpAnalytics?.offlineEarnings /
                            gpAnalytics?.totalEarnings
                          }`}
                        >
                          {gpAnalytics?.offlineEarnings}{" "}
                          <small>out of {gpAnalytics?.totalEarnings}</small>
                        </div>
                        <div className="progress-bar-linear d-inline-block w-100">
                          <ProgressBar
                            now={
                              (gpAnalytics?.offlineEarnings /
                                gpAnalytics?.totalEarnings) *
                              100
                            } // Convert to percentage
                            variant={"success"}
                            style={{ height: "6px" }}
                            className={`shadow-none progress `}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default GPAnalytics;
