import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import "flatpickr/dist/themes/material_blue.css";
import Antdtable from "../../components/antd-table";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "antd";
import { RiFileExcel2Line } from "@remixicon/react";
import { useAuth } from "../../utilities/AuthProvider";

const PatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userRoles, permissions } = useAuth();

  function getFormattedRegNo(patient) {
    if (!patient?.createdAt) return `HWRF/--/ ${patient.regNo}`;
    const createdAt = new Date(patient.createdAt);
    const year = createdAt.getFullYear() % 100;
    const month = createdAt.getMonth() + 1;
    let financialYear;
    if (month > 3) {
      financialYear = `${year}-${year + 1}`;
    } else {
      financialYear = `${year - 1}-${year}`;
    }
    return `HWRF/${financialYear}/${patient.regNo}`;
  }

  const patientColumns = [
    {
      title: "Register No",
      dataIndex: "regNo",
      key: "regNo",
      sortable: true,
      width: 180,
      render: (text, record) => {
        if (!record?.createdAt) return `HWRF/--/ ${text}`;
        const createdAt = new Date(record?.createdAt);
        const year = createdAt.getFullYear() % 100;
        const month = createdAt.getMonth() + 1;
        let financialYear;
        if (month > 3) {
          financialYear = `${year}-${year + 1}`;
        } else {
          financialYear = `${year - 1}-${year}`;
        }
        return (
          <Link to={`/patient/patient-profile/${record?.id}`}>
            {`HWRF/${financialYear}/${text}`}
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
      sortable: true,
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
      width: 150,
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text?.join(", ") || "-"}
        </Link>
      ),
    },
    {
      title: "Cash Paid",
      dataIndex: "onlinePaid",
      key: "onlinePaid",
      width: 120,
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text ? `₹ ${text}` : "₹ 0"}
        </Link>
      ),
    },
    {
      title: "Online Paid Amount",
      dataIndex: "offlinePaid",
      key: "offlinePaid",
      width: 150,
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text ? `₹ ${text}` : "₹ 0"}
        </Link>
      ),
    },
    {
      title: "Total Paid Amount",
      dataIndex: "total",
      key: "total",
      width: 150,
      sortable: true,
      render: (text, record) => (
        <Link to={`/patient/patient-profile/${record.id}`}>
          {text ? `₹ ${text}` : "₹ 0"}
        </Link>
      ),
    },
  ];

  // Helper: flatten data for export
  function getFlatData(data) {
    return data.map((item) => ({
      "Register No": getFormattedRegNo(item), // use formatted reg no!
      Name: item.name,
      Age: item.age,
      Gender: item.sex,
      Mobile: item.mobile,
      Address: item.address,
      "Service Taken": item.serviceTaken?.join(", ") || "-",
      "Cash Paid (In ₹)": item.onlinePaid || 0,
      "Online Paid Amount (In ₹)": item.offlinePaid || 0,
      "Total Paid Amount (In ₹)": item.total || 0,
    }));
  }

  // Export to Excel
  const exportToExcel = () => {
    const flatData = getFlatData(patientList);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "patients.xlsx");
  };

  // Export to CSV
  const exportToCSV = () => {
    const flatData = getFlatData(patientList);
    const worksheet = XLSX.utils.json_to_sheet(flatData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv" });
    saveAs(blob, "patients.csv");
  };

  // Fetch initial data
  const getPatients = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getPatients();
      response.data.forEach((patient) => {
        patient.key = patient.id;
      });
      setPatientList(response.data);
    } catch (error) {
      // Handle error if needed
    } finally {
      setLoading(false);
    }
  };

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
          {userRoles.includes("admin") && (
            <div style={{ margin: "16px 0 0 16px" }}>
              <Button
                className="bg-primary"
                type="primary"
                variant="primary"
                onClick={exportToExcel}
                style={{ width: "auto" }} // Keeps the button width to content size
              >
                <RiFileExcel2Line className="h-3 w-4 me-2" />
                Export to Excel
              </Button>
            </div>
          )}
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
