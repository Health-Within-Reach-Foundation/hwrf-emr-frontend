import React from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import Card from "../Card";
import { useAuth } from "../../utilities/AuthProvider";

const MammographyAnalytics = ({ mammoAnalytics }) => {
  const { permissions } = useAuth();
  console.log("MammographyAnalytics components", mammoAnalytics);
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Mammography Analytics</h4>
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="">
                  <h5 className="card-title">
                    Total Mammography patient:{" "}
                    {mammoAnalytics?.totalMammographyPatients}
                  </h5>
                  <div className={`details`}>
                    <span className="title text-dark">{"Total Attended"}</span>
                    <div
                      className={`percentage float-end text-${
                        mammoAnalytics?.totalAttended /
                        mammoAnalytics?.totalMammographyPatients
                      }`}
                    >
                      {mammoAnalytics?.totalAttended}{" "}
                      <small>
                        out of {mammoAnalytics?.totalMammographyPatients}
                      </small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (mammoAnalytics?.totalAttended /
                            mammoAnalytics?.totalMammographyPatients) *
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
                        mammoAnalytics?.missed /
                        mammoAnalytics?.totalMammographyPatients
                      }`}
                    >
                      {mammoAnalytics?.missed}{" "}
                      <small>
                        out of {mammoAnalytics?.totalMammographyPatients}
                      </small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (mammoAnalytics?.missed /
                            mammoAnalytics?.totalMammographyPatients) *
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
                        Total Earnings: {mammoAnalytics?.totalEarnings}
                      </h5>
                      {/* Pricing  */}
                      <div className={`details`}>
                        <span className="title text-dark">{"Online"}</span>
                        <div
                          className={`percentage float-end text-${
                            mammoAnalytics?.onlineEarnings /
                            mammoAnalytics?.totalEarnings
                          }`}
                        >
                          {mammoAnalytics?.onlineEarnings}{" "}
                          <small>out of {mammoAnalytics?.totalEarnings}</small>
                        </div>
                        <div className="progress-bar-linear d-inline-block w-100">
                          <ProgressBar
                            now={
                              (mammoAnalytics?.onlineEarnings /
                                mammoAnalytics?.totalEarnings) *
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
                            mammoAnalytics?.offlineEarnings /
                            mammoAnalytics?.totalEarnings
                          }`}
                        >
                          {mammoAnalytics?.offlineEarnings}{" "}
                          <small>out of {mammoAnalytics?.totalEarnings}</small>
                        </div>
                        <div className="progress-bar-linear d-inline-block w-100">
                          <ProgressBar
                            now={
                              (mammoAnalytics?.offlineEarnings /
                                mammoAnalytics?.totalEarnings) *
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

export default MammographyAnalytics;
