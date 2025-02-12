import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import "flatpickr/dist/themes/material_blue.css";
import DateCell from "../../components/date-cell";
import Antdtable from "../../components/antd-table";

const PatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: null, // Filter state for gender
    registerDate: null, // Filter state for register date
  });

  const patientColumns = [
    {
      title: "Register No",
      dataIndex: "regNo",
      key: "regNo",
      sortable: true,
      width: 180,
      render: (text, record) => {
        if (!record?.createdAt) return `HWRF/--/ ${text}`; // Handle cases where createdAt is missing

        const createdAt = new Date(record?.createdAt);
        const year = createdAt?.getFullYear() % 100; // Get last two digits of year
        const month = createdAt?.getMonth() + 1; // Months are zero-based in JS

        let financialYear;
        if (month > 3) {
          financialYear = `${year}-${year + 1}`;
        } else {
          financialYear = `${year - 1}-${year}`;
        }

        return (
          <Link to={`/patient/patient-profile/${record?.id}`}>
            {`HWRF/${financialYear}/${text}`}{" "}
          </Link>
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      sortable: true,
      width: 80,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Gender",
      dataIndex: "sex",
      key: "sex",
      sortable: true,
      width: 120,
      filters: [
        { text: "Male", value: "male" },
        { text: "Female", value: "female" },
      ],
      onFilter: (value, record) => record.sex === value,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Mobile",
      dataIndex: "mobile",
      key: "mobile",
      sortable: false,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      sortable: false,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: "Service Taken",
      dataIndex: "serviceTaken",
      key: "serviceTaken",
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text?.join(", ")}
        </Link>
      ),
    },
  ];

  // Fetch initial data
  const getPatients = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getPatients();
      console.log(response.data);
      response.data.map((patient) => {
        patient.key = patient.id;
        return patient;
      });
      setPatientList(response.data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    getPatients();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
            <Card.Header.Title>
              <h4 className="card-title">Patients List</h4>
            </Card.Header.Title>
          </Card.Header>
        </Card>
      </Col>

      <Col sm={12}>
        <Antdtable
          columns={patientColumns}
          data={patientList}
          pageSizeOptions={[50, 100, 150, 200]}
          defaultPageSize={50}
        />
      </Col>
    </Row>
  );
};

export default PatientList;
