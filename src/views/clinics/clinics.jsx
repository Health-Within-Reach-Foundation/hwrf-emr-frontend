import React, { useEffect, useRef, useState } from "react";
import useDataTable from "../../components/hooks/useDatatable";
import Card from "../../components/Card";
import clinicServices from "../../api/clinic-services";
import { Loading } from "../../components/loading";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AntdTable from "../../components/antd-table";
import { Badge } from "antd";

const Clinics = () => {
  const [pendingClinicsTableData, setPendingClinicsTableData] = useState([]);
  const [enrolledClinicsTableData, setEnrolledClinicsTableData] = useState([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [enrolledLoading, setEnrolledLoading] = useState(false);

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

  const newClinicColumns = [
    {
      title: "Clinic Name",
      dataIndex: "clinicName",
      key: "clinicName",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Admin Contact Number",
      dataIndex: "adminContactNumber",
      key: "adminContactNumber",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Admin Contact Email",
      dataIndex: "adminContactEmail",
      key: "adminContactEmail",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Specialties",
      dataIndex: "specialties",
      key: "specialties",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Enrolled On",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>
          {new Date(text).toLocaleString()}
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      fixed: "right",
      render: (text, record) => (
        <Link to={`/clinics/${record.id}`}>
          <Badge
            text={text}
            status={
              text === "active"
                ? "success"
                : text === "pending"
                ? "processing"
                : "default"
            }
          />
        </Link>
      ),
    },
  ];

  // const pendingClinicsTableRef = useRef(null);

  // useDataTable({
  //   tableRef: pendingClinicsTableRef,
  //   columns: columns,
  //   data: pendingClinicsTableData,
  //   // isFilterColumn: true,
  // });

  // const enrolledClinicsTableRef = useRef(null);

  // useDataTable({
  //   tableRef: enrolledClinicsTableRef,
  //   columns: columns,
  //   data: enrolledClinicsTableData,
  //   // isFilterColumn: true,
  // });

  const getPendingClinics = async () => {
    try {
      setPendingLoading(true);
      const response = await clinicServices.getClinics("pending");
      setPendingClinicsTableData(response.data); // Use transformed data directly
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setPendingLoading(false);
    }
  };

  const getEnrolledClincs = async () => {
    try {
      setEnrolledLoading(true);
      const response = await clinicServices.getClinics("active");
      setEnrolledClinicsTableData(response.data); // Use transformed data directly
    } catch (error) {
      console.error("Error fetching clinics:", error);
    } finally {
      setEnrolledLoading(false);
    }
  };

  useEffect(() => {
    getEnrolledClincs();
    getPendingClinics();
  }, []);

  if (pendingLoading || enrolledLoading) {
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
              <AntdTable
                columns={newClinicColumns}
                data={pendingClinicsTableData}
                pageSizeOptions={[50, 100, 150, 200]}
                defaultPageSize={50}
              />
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="d-flex justify-content-between">
              <Card.Header.Title className="header-title">
                <h4 className="card-title">Enrolled Clinics</h4>
              </Card.Header.Title>
            </Card.Header>
            <Card.Body>
              <AntdTable
                columns={newClinicColumns}
                data={enrolledClinicsTableData}
                pageSizeOptions={[50, 100, 150, 200]}
                defaultPageSize={50}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Clinics;
