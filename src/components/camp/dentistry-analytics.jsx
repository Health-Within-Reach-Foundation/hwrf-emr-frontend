import React, { useMemo } from "react";
import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import { Pie, Doughnut } from "react-chartjs-2";
import Card from "../Card";
import { useAuth } from "../../utilities/AuthProvider";

const DentistryAnalytics = ({ dentistryAnalytics }) => {
  const { permissions } = useAuth();
  const colors = [
    "#FF5733",
    "#33FF57",
    "#3357FF",
    "#FF33A1",
    "#33FFF6",
    "#F633FF",
    "#FF9633",
    "#F6FF33",
    "#33F6FF",
    // You can add more colors as needed.
  ];

  const doctorWiseData = dentistryAnalytics?.doctorWiseData;

  const doctorWiseEarnings = Object.keys(doctorWiseData)?.map((doctor) => ({
    doctor,
    patientsTreated: doctorWiseData[doctor]?.patientsTtreated,
    totalEarnings: doctorWiseData[doctor]?.totalEarnings,
    onlineEarnings: doctorWiseData[doctor]?.onlineEarnings,
    offlineEarnings: doctorWiseData[doctor]?.offlineEarnings,
    treatmentStatuses: doctorWiseData[doctor]?.treatmentStatuses,
  }));

  const doctorWiseEarningsData = useMemo(() => {
    return {
      labels: doctorWiseEarnings?.map((data) => data?.doctor),
      datasets: [
        {
          data: doctorWiseEarnings?.map(
            (data) => data?.onlineEarnings + data?.offlineEarnings
          ),
          backgroundColor: colors.slice(0, doctorWiseEarnings?.length),
        },
      ],
    };
  }, [doctorWiseEarnings]);

  return (
    <>
      <Container>
        <Row className="mt-4">
          <Col xs={12} lg={6}>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">Dentistry Analytics</h4>
                </div>
              </Card.Header>
              <Card.Body className="d-flex flex-column justify-content-between">
                <div className="">
                  <h5 className="card-title">
                    Total Dentistry patient:{" "}
                    {dentistryAnalytics?.totalDentistryPatients}
                  </h5>
                  <div className={`details`}>
                    <span className="title text-dark">{"Total Attended"}</span>
                    <div
                      className={`percentage float-end text-${
                        dentistryAnalytics?.totalAttended /
                        dentistryAnalytics?.totalDentistryPatients
                      }`}
                    >
                      {dentistryAnalytics?.totalAttended}{" "}
                      <small>
                        out of {dentistryAnalytics?.totalDentistryPatients}
                      </small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (dentistryAnalytics?.totalAttended /
                            dentistryAnalytics?.totalDentistryPatients) *
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
                        dentistryAnalytics?.missed /
                        dentistryAnalytics?.totalDentistryPatients
                      }`}
                    >
                      {dentistryAnalytics?.missed}{" "}
                      <small>
                        out of {dentistryAnalytics?.totalDentistryPatients}
                      </small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (dentistryAnalytics?.missed /
                            dentistryAnalytics?.totalDentistryPatients) *
                          100
                        } // Convert to percentage
                        variant={"info"}
                        style={{ height: "6px" }}
                        className={`shadow-none progress `}
                      />
                    </div>
                  </div>
                  <div className={`details`}>
                    <span className="title text-dark">{"OPD"}</span>
                    <div
                      className={`percentage float-end text-${
                        dentistryAnalytics?.opdPatients /
                        dentistryAnalytics?.totalDentistryPatients
                      }`}
                    >
                      {dentistryAnalytics?.opdPatients}{" "}
                      <small>
                        out of {dentistryAnalytics?.totalDentistryPatients}
                      </small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (dentistryAnalytics?.opdPatients /
                            dentistryAnalytics?.totalDentistryPatients) *
                          100
                        } // Convert to percentage
                        variant={"info"}
                        style={{ height: "6px" }}
                        className={`shadow-none progress `}
                      />
                    </div>
                  </div>
                  <div className={`details`}>
                    <span className="title text-dark">
                      {"Total Treatments"}
                    </span>
                    <div
                      className={`percentage float-end text-${
                        dentistryAnalytics?.totalTreatments /
                        dentistryAnalytics?.totalDentistryPatients
                      }`}
                    >
                      {dentistryAnalytics?.totalTreatments}{" "}
                      <small>
                        out of {dentistryAnalytics?.totalDentistryPatients}
                      </small>
                    </div>
                    <div className="progress-bar-linear d-inline-block w-100">
                      <ProgressBar
                        now={
                          (dentistryAnalytics?.totalTreatments /
                            dentistryAnalytics?.totalDentistryPatients) *
                          100
                        } // Convert to percentage
                        variant={"info"}
                        style={{ height: "6px" }}
                        className={`shadow-none progress `}
                      />
                    </div>
                  </div>
                </div>
                <hr /> <hr />
                {permissions
                  ?.map((permission) => permission?.action)
                  ?.includes("camps:finance") && (
                  <div className="">
                    <h5 className="card-title">
                      Total Earnings: {dentistryAnalytics?.totalEarnings}
                    </h5>
                    {/* Pricing  */}
                    <div className={`details`}>
                      <span className="title text-dark">{"Online"}</span>
                      <div
                        className={`percentage float-end text-${
                          dentistryAnalytics?.onlineEarnings /
                          dentistryAnalytics?.totalEarnings
                        }`}
                      >
                        {dentistryAnalytics?.onlineEarnings}{" "}
                        <small>
                          out of {dentistryAnalytics?.totalEarnings}
                        </small>
                      </div>
                      <div className="progress-bar-linear d-inline-block w-100">
                        <ProgressBar
                          now={
                            (dentistryAnalytics?.onlineEarnings /
                              dentistryAnalytics?.totalEarnings) *
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
                          dentistryAnalytics?.offlineEarnings /
                          dentistryAnalytics?.totalEarnings
                        }`}
                      >
                        {dentistryAnalytics?.offlineEarnings}{" "}
                        <small>
                          out of {dentistryAnalytics?.totalEarnings}
                        </small>
                      </div>
                      <div className="progress-bar-linear d-inline-block w-100">
                        <ProgressBar
                          now={
                            (dentistryAnalytics?.offlineEarnings /
                              dentistryAnalytics?.totalEarnings) *
                            100
                          } // Convert to percentage
                          variant={"success"}
                          style={{ height: "6px" }}
                          className={`shadow-none progress `}
                        />
                      </div>
                    </div>
                    <div className={`details`}>
                      <span className="title text-dark">
                        {"Crown Treatment Earning"}
                      </span>
                      <div
                        className={`percentage float-end text-${
                          dentistryAnalytics?.crownEarnings /
                          dentistryAnalytics?.totalEarnings
                        }`}
                      >
                        {dentistryAnalytics?.crownEarnings}{" "}
                        <small>
                          out of {dentistryAnalytics?.totalEarnings}
                        </small>
                      </div>
                      <div className="progress-bar-linear d-inline-block w-100">
                        <ProgressBar
                          now={
                            (dentistryAnalytics?.crownEarnings /
                              dentistryAnalytics?.totalEarnings) *
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
              </Card.Body>
            </Card>
          </Col>
          {permissions
            ?.map((permission) => permission?.action)
            ?.includes("camps:finance") && (
            <Col xs={12} lg={6}>
              <Card className="">
                <Card.Header className="d-flex justify-content-between ">
                  <Card.Header.Title>
                    <h4 className="card-title">Doctor wise earning</h4>
                  </Card.Header.Title>
                </Card.Header>
                <Card.Body className="d-flex align-items-center justify-content-center pt-0">
                  <div
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "400px",
                      overflow: "hidden",
                    }}
                  >
                    <Doughnut data={doctorWiseEarningsData} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
};

export default DentistryAnalytics;
