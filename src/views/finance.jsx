import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Table,
  Card,
  Spinner,
  Badge,
} from "react-bootstrap";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { getCampsAnalytics } from "../api/camp-management-service";
import { useAuth } from "../utilities/AuthProvider";
import { checkPermission } from "../utilities/utility-function";
import AccessDenied from "./extra-pages/access-denied";
import toast from "react-hot-toast";
import AntdTable from "../components/antd-table";
import { Table as AntdInnerTable } from "antd"; // For summary/footer row
import DateCell from "../components/date-cell";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { RiFileExcel2Line } from "@remixicon/react";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = [
  "#007bff",
  "#28a745",
  "#ffc107",
  "#dc3545",
  "#6f42c1",
  "#17a2b8",
  "#fd7e14",
  "#20c997",
  "#6610f2",
  "#e83e8c",
  "#6c757d",
  "#343a40",
];

const DoctorCollection = () => {
  const today = new Date();
  const endDateDefault = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  const startDateDefault = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const [startDate, setStartDate] = useState(startDateDefault);
  const [endDate, setEndDate] = useState(endDateDefault);
  const [dentistryDoctors, setDentistryDoctors] = useState([]);
  const [gpDoctors, setGpDoctors] = useState([]);
  const [mammoDoctors, setMammoDoctors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [campTable, setCampTable] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("DoctorCollection component rendered", campTable);

  const { userRoles, permissions } = useAuth();

  if (
    !userRoles?.includes("admin") &&
    (userRoles?.includes("superadmin") ||
      !checkPermission(permissions, ["administration:finance"]))
  ) {
    // Show Access Denied page
    <AccessDenied />;
  }

  // console.log('summary.dentistryAnalytics.crownEarnings', summary?.dentistryAnalytics);

  const fetchData = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      const response = await getCampsAnalytics(startDate, endDate);
      console.log("Camps Analytics Response:", response);
      if (!response.success)
        throw new Error(response.message || "Unknown error");
      const data = response.data;

      const campTable = data.campsTable || [];
      setCampTable(campTable);
      if (campTable.length === 0) {
        toast.error("No camps found for the selected date range");
        setLoading(false);
        return;
      }

      // Dentistry doctor-wise
      const dentistryDoctorWise = data.dentistryAnalytics?.doctorWiseData || {};
      const formattedDentistry = Object.entries(dentistryDoctorWise).map(
        ([name, d]) => ({
          name: name === "undefined" ? "Unknown" : name,
          patientsTreated: d.patientsTreated ?? 0,
          onlineEarnings: d.onlineEarnings ?? 0,
          offlineEarnings: d.offlineEarnings ?? 0,
          crownEarnings: d.crownEarnings ?? 0,
          totalEarnings: (d.onlineEarnings ?? 0) + (d.offlineEarnings ?? 0),
          totalPatients: d.totalPatients ?? d.patientsTreated ?? 0,
        })
      );

      // GP doctor-wise (if available in future)
      const gpDoctorWise = data.gpAnalytics?.doctorWiseData || {};
      const formattedGp = Object.entries(gpDoctorWise).map(([name, d]) => ({
        name: name === "undefined" ? "Unknown" : name,
        patientsTreated: d.patientsTreated ?? 0,
        onlineEarnings: d.onlineEarnings ?? 0,
        offlineEarnings: d.offlineEarnings ?? 0,
        totalEarnings: (d.onlineEarnings ?? 0) + (d.offlineEarnings ?? 0),
      }));

      // Mammo doctor-wise (if available in future)
      const mammoDoctorWise = data.mammoAnalytics?.doctorWiseData || {};
      const formattedMammo = Object.entries(mammoDoctorWise).map(
        ([name, d]) => ({
          name: name === "undefined" ? "Unknown" : name,
          patientsTreated: d.patientsTreated ?? 0,
          onlineEarnings: d.onlineEarnings ?? 0,
          offlineEarnings: d.offlineEarnings ?? 0,
          totalEarnings: (d.onlineEarnings ?? 0) + (d.offlineEarnings ?? 0),
        })
      );

      setDentistryDoctors(formattedDentistry);
      setGpDoctors(formattedGp);
      setMammoDoctors(formattedMammo);
      setSummary(data);
    } catch (error) {
      toast.error(`Failed to fetch data: ${error?.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- CAMP TABLE COLUMNS ---
  const campTableColumns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sortable: true,
      render: (text) => (
        <span className="badge bg-light text-dark border px-2 py-1">
          <DateCell date={text} />
        </span>
      ),
      width: 120,
    },
    {
      title: "Camp Name",
      dataIndex: "campName",
      key: "campName",
      sortable: true,
      render: (text) => <span className="fw-semibold">{text}</span>,
      width: 200,
    },
    {
      title: <>Total Patients</>,
      dataIndex: "totalPatients",
      key: "totalPatients",
      sortable: true,
      render: (text) => <span className="badge bg-secondary">{text}</span>,
      width: 120,
    },
    {
      title: (
        <>
          Online <span className="text-success">(₹)</span>
        </>
      ),
      dataIndex: "onlineEarnings",
      key: "onlineEarnings",
      sortable: true,
      render: (text) => (
        <span className="text-success fw-semibold">
          ₹{Number(text).toLocaleString()}
        </span>
      ),
      width: 120,
    },
    {
      title: (
        <>
          Offline <span className="text-warning">(₹)</span>
        </>
      ),
      dataIndex: "offlineEarnings",
      key: "offlineEarnings",
      sortable: true,
      render: (text) => (
        <span className="text-warning fw-semibold">
          ₹{Number(text).toLocaleString()}
        </span>
      ),
      width: 120,
    },
    {
      title: (
        <>
          Crown <span className="text-info">(₹)</span>
        </>
      ),
      dataIndex: "crownEarnings",
      key: "crownEarnings",
      sortable: true,
      render: (text) => (
        <span className="text-info fw-semibold">
          ₹{Number(text).toLocaleString()}
        </span>
      ),
      width: 120,
    },
    {
      title: (
        <>
          Total <span className="text-dark">(₹)</span>
        </>
      ),
      dataIndex: "totalEarnings",
      key: "totalEarnings",
      sortable: true,
      render: (text) => (
        <span className="fw-bold text-dark">
          ₹{Number(text).toLocaleString()}
        </span>
      ),
      width: 140,
    },
  ];

  // --- CAMP TABLE DATA ---
  const campTableData =
    campTable && Array.isArray(campTable)
      ? [...campTable]
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map((row, idx) => ({ ...row, key: idx }))
      : [];

  // --- CAMP TABLE SUMMARY FOOTER ---
  const campTableSummary = () => {
    const totals = {
      totalPatients:
        campTable?.reduce((sum, r) => sum + (r.totalPatients || 0), 0) || 0,
      onlineEarnings:
        campTable?.reduce((sum, r) => sum + (r.onlineEarnings || 0), 0) || 0,
      offlineEarnings:
        campTable?.reduce((sum, r) => sum + (r.offlineEarnings || 0), 0) || 0,
      crownEarnings:
        campTable?.reduce((sum, r) => sum + (r.crownEarnings || 0), 0) || 0,
      totalEarnings:
        campTable?.reduce((sum, r) => sum + (r.totalEarnings || 0), 0) || 0,
    };
    return (
      <AntdInnerTable.Summary.Row>
        <AntdInnerTable.Summary.Cell index={0} colSpan={2} align="right">
          <strong>Total</strong>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={2}>
          <span className="badge bg-secondary">{totals.totalPatients}</span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={3}>
          <span className="text-success">
            ₹{totals.onlineEarnings.toLocaleString()}
          </span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={4}>
          <span className="text-warning">
            ₹{totals.offlineEarnings.toLocaleString()}
          </span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={5}>
          <span className="text-info">
            ₹{totals.crownEarnings.toLocaleString()}
          </span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={6}>
          <span className="fw-bold text-dark">
            ₹{totals.totalEarnings.toLocaleString()}
          </span>
        </AntdInnerTable.Summary.Cell>
      </AntdInnerTable.Summary.Row>
    );
  };

  const dentistryColumns = [
    {
      title: "Doctor",
      dataIndex: "name",
      key: "name",
      sortable: true,
      render: (text, record) => (
        <span className="fw-semibold">
          {text}
          {record.crownEarnings > 0 && (
            <Badge bg="info" className="ms-2">
              Crown
            </Badge>
          )}
        </span>
      ),
      width: 180,
    },
    {
      title: "Patients",
      dataIndex: "patientsTreated",
      key: "patientsTreated",
      sortable: true,
      width: 120,
    },
    {
      title: <>Online (₹)</>,
      dataIndex: "onlineEarnings",
      key: "onlineEarnings",
      sortable: true,
      render: (val) => (
        <span className="text-success">₹{Number(val).toLocaleString()}</span>
      ),
      width: 120,
    },
    {
      title: <>Offline (₹)</>,
      dataIndex: "offlineEarnings",
      key: "offlineEarnings",
      sortable: true,
      render: (val) => (
        <span className="text-warning">₹{Number(val).toLocaleString()}</span>
      ),
      width: 120,
    },
    {
      title: <>Crown (₹)</>,
      dataIndex: "crownEarnings",
      key: "crownEarnings",
      sortable: true,
      render: (val) => (
        <span className="text-info">₹{Number(val).toLocaleString()}</span>
      ),
      width: 120,
    },
    {
      title: <>Total (₹)</>,
      dataIndex: "totalEarnings",
      key: "totalEarnings",
      sortable: true,
      render: (val) => (
        <span className="fw-bold text-dark">
          ₹{Number(val).toLocaleString()}
        </span>
      ),
      width: 120,
    },
  ];

  const dentistryTableData = dentistryDoctors.map((doc, idx) => ({
    ...doc,
    key: idx,
  }));

  const dentistryTableSummary = () => {
    const totalPatients = dentistryDoctors.reduce(
      (sum, d) => sum + d.patientsTreated,
      0
    );
    const totalOnline = dentistryDoctors.reduce(
      (sum, d) => sum + d.onlineEarnings,
      0
    );
    const totalOffline = dentistryDoctors.reduce(
      (sum, d) => sum + d.offlineEarnings,
      0
    );
    const totalCrown = dentistryDoctors.reduce(
      (sum, d) => sum + (d.crownEarnings ?? 0),
      0
    );
    const totalEarnings = dentistryDoctors.reduce(
      (sum, d) => sum + d.totalEarnings,
      0
    );

    return (
      <AntdInnerTable.Summary.Row>
        <AntdInnerTable.Summary.Cell index={0}>
          <strong>Total</strong>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={1}>
          {totalPatients}
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={2}>
          <span className="text-success">₹{totalOnline.toLocaleString()}</span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={3}>
          <span className="text-warning">₹{totalOffline.toLocaleString()}</span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={4}>
          <span className="text-info">₹{totalCrown.toLocaleString()}</span>
        </AntdInnerTable.Summary.Cell>
        <AntdInnerTable.Summary.Cell index={5}>
          <span className="fw-bold text-dark">
            ₹{totalEarnings.toLocaleString()}
          </span>
        </AntdInnerTable.Summary.Cell>
      </AntdInnerTable.Summary.Row>
    );
  };

  function flattenToText(node) {
    if (typeof node === "string" || typeof node === "number") return node;
    if (Array.isArray(node)) return node.map(flattenToText).join("");
    if (node && node.props && node.props.children)
      return flattenToText(node.props.children);
    return "";
  }

  const getExportTableData = (data, columns) => {
    return data.map((row) => {
      const rowObj = {};
      columns.forEach((col) => {
        let value = row[col.dataIndex];
        if (col.dataIndex === "date") {
          // Use raw value or format here if needed
          // If your date is like "2025-08-14", this will be fine for Excel
          value = value;
        } else if (col.render) {
          const rendered = col.render(value, row);
          value = flattenToText(rendered);
        }
        // Remove ₹ and commas for money columns
        const header =
          typeof col.title === "string" ? col.title : flattenToText(col.title);
        if (
          typeof value === "string" &&
          ["Online", "Offline", "Crown", "Total"].some((label) =>
            header.toLowerCase().includes(label.toLowerCase())
          )
        ) {
          value = value.replace(/₹/g, "").replace(/,/g, "").trim();
        }
        rowObj[header] = value;
      });
      return rowObj;
    });
  };

  const exportCampTableToExcel = () => {
    // Use the displayed data and columns
    const exportData = getExportTableData(campTableData, campTableColumns);
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Camp Collection");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "camp_collection.xlsx");
  };

  // Chart data for dentistry
  const dentistryChartData = {
    labels: dentistryDoctors.map((d) => d.name),
    datasets: [
      {
        label: "Total Earnings",
        data: dentistryDoctors.map((d) => d.totalEarnings),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  // Chart data for GP
  const gpChartData = {
    labels: gpDoctors.map((d) => d.name),
    datasets: [
      {
        label: "Total Earnings",
        data: gpDoctors.map((d) => d.totalEarnings),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  // Chart data for Mammo
  const mammoChartData = {
    labels: mammoDoctors.map((d) => d.name),
    datasets: [
      {
        label: "Total Earnings",
        data: mammoDoctors.map((d) => d.totalEarnings),
        backgroundColor: COLORS,
        borderWidth: 1,
      },
    ],
  };

  // Helper for summary cards
  const SummaryCard = ({ title, value, color, icon }) => (
    <Card
      className="text-center shadow-sm border-0 mb-3"
      style={{ minHeight: 110 }}
    >
      <Card.Body>
        <div className="mb-2" style={{ fontSize: 22 }}>
          {icon}
        </div>
        <h6 className="mb-1 text-muted">{title}</h6>
        <h4 className={`mb-0 ${color}`}>{value}</h4>
      </Card.Body>
    </Card>
  );

  // Helper for section headers
  const SectionHeader = ({ children, color = "primary", icon }) => (
    <div className="d-flex align-items-center gap-2 mt-5 mb-3">
      {icon && <span style={{ fontSize: 22 }}>{icon}</span>}
      <h4 className={`mb-0 text-${color}`}>{children}</h4>
      <hr className="flex-grow-1 ms-3" />
    </div>
  );

  // const campTableColumns =

  return (
    <Container className="my-4">
      <Card className="shadow rounded-3 border-0 mb-4">
        <Card.Body>
          <h3 className="mb-4 text-center text-primary fw-bold">
            <i className="bi bi-bar-chart-fill me-2" />
            Camp Analytics
          </h3>
          <Form>
            <Row className="g-3 justify-content-center">
              <Col xs={12} sm={6} md={4} lg={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="sm"
                    max={endDate}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6} md={4} lg={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="sm"
                    max={endDateDefault}
                    min={startDate}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={4} lg={3} className="d-flex align-items-end">
                <Button
                  onClick={fetchData}
                  disabled={loading}
                  variant="primary"
                  className="w-100"
                  size="sm"
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-search me-2" />
                      Fetch Data
                    </>
                  )}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      {summary && (
        <Row className="mb-4 g-3">
          <Col md={3} xs={6}>
            <SummaryCard
              title="Total Camps"
              value={summary.totalCamps}
              color="text-primary"
              icon={<i className="bi bi-flag-fill" />}
            />
          </Col>
          <Col md={3} xs={6}>
            <SummaryCard
              title="Registered Patients"
              value={summary.totalRegisteredPatients}
              color="text-info"
              icon={<i className="bi bi-person-lines-fill" />}
            />
          </Col>
          <Col md={3} xs={6}>
            <SummaryCard
              title="Attended"
              value={summary.totalAttended}
              color="text-success"
              icon={<i className="bi bi-person-check-fill" />}
            />
          </Col>
          <Col md={3} xs={6}>
            <SummaryCard
              title="Total Earnings"
              value={`₹${summary.totalEarnings?.toLocaleString()}`}
              color="text-dark"
              icon={<i className="bi bi-currency-rupee" />}
            />
          </Col>
        </Row>
      )}

      {/* Camps Collection Table */}
      {campTable && campTable.length > 0 && (
        <Card className="mb-4 shadow-sm border-0">
          <Card.Header className="bg-primary text-white d-flex align-items-center">
            <i className="bi bi-calendar2-week-fill me-2" />
            <span className="fw-semibold">Camp-wise Collection</span>
          </Card.Header>
          <div className="antd-table-container">
            <div className="mt-3 ms-2 p-1">
              <Button
                size="sm"
                className="bg-primary"
                type="button"
                onClick={exportCampTableToExcel}
              >
                <RiFileExcel2Line className="h-3 w-4 me-2" />
                Export to Excel
              </Button>
            </div>

            <AntdTable
              columns={campTableColumns}
              data={campTableData}
              pageSizeOptions={[100, 150, 200, 250]}
              defaultPageSize={100}
              summary={campTableSummary}
            />
          </div>
        </Card>
      )}
      {loading && (
        <div className="d-flex justify-content-center align-items-center my-5">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      {/* Dentistry Analytics */}
      {summary && (
        <>
          <SectionHeader color="danger" icon={<i className="bi bi-activity" />}>
            Dentistry Analytics
          </SectionHeader>
          <Row className="mb-3 g-3">
            <Col md={2} xs={6}>
              <SummaryCard
                title="Patients"
                value={summary.dentistryAnalytics.totalPatients}
                color="text-secondary"
                icon={<i className="bi bi-people-fill" />}
              />
            </Col>
            <Col md={2} xs={6}>
              <SummaryCard
                title="Attended"
                value={summary.dentistryAnalytics.totalAttended}
                color="text-success"
                icon={<i className="bi bi-person-check-fill" />}
              />
            </Col>
            <Col md={2} xs={6}>
              <SummaryCard
                title="Online"
                value={`₹${summary.dentistryAnalytics.onlineEarnings?.toLocaleString()}`}
                color="text-success"
                icon={<i className="bi bi-globe" />}
              />
            </Col>
            <Col md={2} xs={6}>
              <SummaryCard
                title="Offline"
                value={`₹${summary.dentistryAnalytics.offlineEarnings?.toLocaleString()}`}
                color="text-warning"
                icon={<i className="bi bi-cash-stack" />}
              />
            </Col>
            <Col md={2} xs={6}>
              <SummaryCard
                title="Crown"
                value={`₹${summary.dentistryAnalytics.crownEarnings?.toLocaleString()}`}
                color="text-info"
                icon={<i className="bi bi-gem" />}
              />
            </Col>
            <Col md={2} xs={6}>
              <SummaryCard
                title="Total"
                value={`₹${summary.dentistryAnalytics.totalEarnings?.toLocaleString()}`}
                color="text-dark"
                icon={<i className="bi bi-wallet2" />}
              />
            </Col>
          </Row>
          
          {dentistryDoctors.length > 0 && (
            <div className="antd-table-container mt-2">
              <AntdTable
                columns={dentistryColumns}
                data={dentistryTableData}
                pageSizeOptions={[10, 20, 50, 100]}
                defaultPageSize={10}
                summary={dentistryTableSummary}
              />
            </div>
          )}
          {dentistryDoctors.length > 0 && (
            <Row className="mt-4 mb-4 justify-content-center">
              <Col md={6} className="d-flex flex-column align-items-center">
                <h5 className="mb-3 text-secondary">
                  <i className="bi bi-pie-chart-fill me-2" />
                  Earnings Breakdown
                </h5>
                <div style={{ maxWidth: 350, width: "100%" }}>
                  <Doughnut data={dentistryChartData} />
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
      {/* GP Analytics */}
      {summary && (
        <>
          <SectionHeader
            color="success"
            icon={<i className="bi bi-heart-pulse-fill" />}
          >
            GP Analytics
          </SectionHeader>
          <Row className="mb-3 g-3">
            <Col md={3} xs={6}>
              <SummaryCard
                title="Patients"
                value={summary.gpAnalytics.totalPatients}
                color="text-secondary"
                icon={<i className="bi bi-people-fill" />}
              />
            </Col>
            <Col md={3} xs={6}>
              <SummaryCard
                title="Attended"
                value={summary.gpAnalytics.totalAttended}
                color="text-success"
                icon={<i className="bi bi-person-check-fill" />}
              />
            </Col>
            <Col md={3} xs={6}>
              <SummaryCard
                title="Online"
                value={`₹${summary.gpAnalytics.onlineEarnings?.toLocaleString()}`}
                color="text-success"
                icon={<i className="bi bi-globe" />}
              />
            </Col>
            <Col md={3} xs={6}>
              <SummaryCard
                title="Offline"
                value={`₹${summary.gpAnalytics.offlineEarnings?.toLocaleString()}`}
                color="text-warning"
                icon={<i className="bi bi-cash-stack" />}
              />
            </Col>
          </Row>
          {gpDoctors.length > 0 && (
            <div className="table-responsive mt-2">
              <Table
                bordered
                hover
                size="sm"
                className="align-middle shadow-sm"
              >
                <thead className="table-success">
                  <tr>
                    <th>Doctor</th>
                    <th>Patients</th>
                    <th>Online (₹)</th>
                    <th>Offline (₹)</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {gpDoctors.map((doc, idx) => (
                    <tr key={idx}>
                      <td>{doc.name}</td>
                      <td>{doc.patientsTreated}</td>
                      <td className="text-success">
                        ₹{doc.onlineEarnings.toLocaleString()}
                      </td>
                      <td className="text-warning">
                        ₹{doc.offlineEarnings.toLocaleString()}
                      </td>
                      <td className="fw-bold text-dark">
                        ₹{doc.totalEarnings.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-secondary fw-bold">
                    <td>Total</td>
                    <td>
                      {gpDoctors.reduce((sum, d) => sum + d.patientsTreated, 0)}
                    </td>
                    <td className="text-success">
                      ₹
                      {gpDoctors
                        .reduce((sum, d) => sum + d.onlineEarnings, 0)
                        .toLocaleString()}
                    </td>
                    <td className="text-warning">
                      ₹
                      {gpDoctors
                        .reduce((sum, d) => sum + d.offlineEarnings, 0)
                        .toLocaleString()}
                    </td>
                    <td className="text-dark">
                      ₹
                      {gpDoctors
                        .reduce((sum, d) => sum + d.totalEarnings, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          {gpDoctors.length > 0 && (
            <Row className="mt-4 mb-4 justify-content-center">
              <Col md={6} className="d-flex flex-column align-items-center">
                <h5 className="mb-3 text-success">
                  <i className="bi bi-pie-chart-fill me-2" />
                  Earnings Breakdown
                </h5>
                <div style={{ maxWidth: 350, width: "100%" }}>
                  <Doughnut data={gpChartData} />
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
      {/* Mammo Analytics */}
      {summary && (
        <>
          <SectionHeader
            color="warning"
            icon={<i className="bi bi-gender-female" />}
          >
            Mammo Analytics
          </SectionHeader>
          <Row className="mb-3 g-3">
            <Col md={3} xs={6}>
              <SummaryCard
                title="Patients"
                value={summary.mammoAnalytics.totalPatients}
                color="text-secondary"
                icon={<i className="bi bi-people-fill" />}
              />
            </Col>
            <Col md={3} xs={6}>
              <SummaryCard
                title="Attended"
                value={summary.mammoAnalytics.totalAttended}
                color="text-success"
                icon={<i className="bi bi-person-check-fill" />}
              />
            </Col>
            <Col md={3} xs={6}>
              <SummaryCard
                title="Online"
                value={`₹${summary.mammoAnalytics.onlineEarnings?.toLocaleString()}`}
                color="text-success"
                icon={<i className="bi bi-globe" />}
              />
            </Col>
            <Col md={3} xs={6}>
              <SummaryCard
                title="Offline"
                value={`₹${summary.mammoAnalytics.offlineEarnings?.toLocaleString()}`}
                color="text-warning"
                icon={<i className="bi bi-cash-stack" />}
              />
            </Col>
          </Row>
          {mammoDoctors.length > 0 && (
            <div className="table-responsive mt-2">
              <Table
                bordered
                hover
                size="sm"
                className="align-middle shadow-sm"
              >
                <thead className="table-warning">
                  <tr>
                    <th>Doctor</th>
                    <th>Patients</th>
                    <th>Online (₹)</th>
                    <th>Offline (₹)</th>
                    <th>Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {mammoDoctors.map((doc, idx) => (
                    <tr key={idx}>
                      <td>{doc.name}</td>
                      <td>{doc.patientsTreated}</td>
                      <td className="text-success">
                        ₹{doc.onlineEarnings.toLocaleString()}
                      </td>
                      <td className="text-warning">
                        ₹{doc.offlineEarnings.toLocaleString()}
                      </td>
                      <td className="fw-bold text-dark">
                        ₹{doc.totalEarnings.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  <tr className="table-secondary fw-bold">
                    <td>Total</td>
                    <td>
                      {mammoDoctors.reduce(
                        (sum, d) => sum + d.patientsTreated,
                        0
                      )}
                    </td>
                    <td className="text-success">
                      ₹
                      {mammoDoctors
                        .reduce((sum, d) => sum + d.onlineEarnings, 0)
                        .toLocaleString()}
                    </td>
                    <td className="text-warning">
                      ₹
                      {mammoDoctors
                        .reduce((sum, d) => sum + d.offlineEarnings, 0)
                        .toLocaleString()}
                    </td>
                    <td className="text-dark">
                      ₹
                      {mammoDoctors
                        .reduce((sum, d) => sum + d.totalEarnings, 0)
                        .toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          )}
          {mammoDoctors.length > 0 && (
            <Row className="mt-4 mb-4 justify-content-center">
              <Col md={6} className="d-flex flex-column align-items-center">
                <h5 className="mb-3 text-warning">
                  <i className="bi bi-pie-chart-fill me-2" />
                  Earnings Breakdown
                </h5>
                <div style={{ maxWidth: 350, width: "100%" }}>
                  <Doughnut data={mammoChartData} />
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
      {/* No Data Message */}
      {!loading && !summary && (
        <Card className="mt-5 shadow-sm border-0">
          <Card.Body>
            <p className="text-center text-muted mb-0">
              <i className="bi bi-info-circle me-2" />
              No data available for the selected date range.
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default DoctorCollection;
