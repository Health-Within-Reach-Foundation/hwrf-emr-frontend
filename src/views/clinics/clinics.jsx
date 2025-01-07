import React, { useEffect, useRef, useState } from "react";
import useDataTable from "../../components/hooks/useDatatable";
import Card from "../../components/Card";
import clinicServices from "../../api/clinic-services";
import { Loading } from "../../components/loading";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const Clinics = () => {
  const [pendingClinicsTableData, setPendingClinicsTableData] = useState([]);
  const [enrolledClinicsTableData, setEnrolledClinicsTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    { title: "Clinic Name", data: "clinicName" },
    { title: "Owner Name", data: "ownerName" },
    { title: "City", data: "city" },
    { title: "State", data: "state" },
    { title: "Admin Contact Number", data: "adminContactNumber" },
    { title: "Admin Contact Email", data: "adminContactEmail" },
    { title: "Specialties", data: "specialties" },
    { title: "Status", data: "status" },
    {
      title: "Enrolled On",
      data: "createdAt",
      render: (data) => new Date(data).toLocaleString(),
    },
    {
      title: "More",
      data: "id",
      render: (data) =>
        `<a href="/clinics/${data}" class="btn btn-primary btn-sm">View</a>`,
    },
  ];

  const pendingClinicsTableRef = useRef(null);

  useDataTable({
    tableRef: pendingClinicsTableRef,
    columns: columns,
    data: pendingClinicsTableData,
    // isFilterColumn: true,
  });

  const enrolledClinicsTableRef = useRef(null);

  useDataTable({
    tableRef: enrolledClinicsTableRef,
    columns: columns,
    data: enrolledClinicsTableData,
    // isFilterColumn: true,
  });

  const getPendingClinics = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getClinics("pending");
      setPendingClinicsTableData(response.data); // Use transformed data directly
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEnrolledClincs = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getClinics("active");
      setEnrolledClinicsTableData(response.data); // Use transformed data directly
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPendingClinics();
    getEnrolledClincs();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div id="page_layout" className="cust-datatable">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Header className="d-flex justify-content-between">
              <Card.Header.Title className="header-title">
                <h4 className="card-title">Pending Clinic Approvals</h4>
              </Card.Header.Title>
            </Card.Header>
            <Card.Body>
              <p></p>
              <div className="table-responsive custom-table-search">
                <table
                  ref={pendingClinicsTableRef}
                  className="table dataTable"
                  data-toggle="data-table"
                ></table>{" "}
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between">
              <Card.Header.Title className="header-title">
                <h4 className="card-title">Enrolled Clinics</h4>
              </Card.Header.Title>
            </Card.Header>
            <Card.Body>
              <p></p>
              <div className="table-responsive custom-table-search">
                <table
                  ref={enrolledClinicsTableRef}
                  className="table dataTable"
                  data-toggle="data-table"
                ></table>{" "}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Clinics;
