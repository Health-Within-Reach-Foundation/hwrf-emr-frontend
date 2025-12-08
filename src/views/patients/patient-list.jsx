import { RiFileExcel2Line } from "@remixicon/react";
import { Button } from "antd";
import { saveAs } from "file-saver";
import "flatpickr/dist/themes/material_blue.css";
import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import patientServices from "../../api/patient-services";
import Antdtable from "../../components/antd-table";
import Card from "../../components/Card";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";

const PatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    offset: 0,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });
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
      "Register No": getFormattedRegNo(item),
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

  // Export to Excel - fetch ALL patients, not just current page
  const exportToExcel = async () => {
    try {
      setLoading(true);

      // Fetch ALL patients for export
      const response = await patientServices.getPatientForExport();

      if (!response.success || !response.data.length) {
        throw new Error("No patients found to export");
      }

      // Format the data for Excel
      const flatData = getFlatData(response.data);

      // Generate Excel file
      const worksheet = XLSX.utils.json_to_sheet(flatData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      const timestamp = new Date().toISOString().split("T")[0];
      saveAs(blob, `patients_export_${timestamp}.xlsx`);
    } catch (error) {
      console.error("Export error:", error);
      alert(`Export failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  const getPatients = async (limit = 50, offset = 0, search = "") => {
    try {
      setLoading(true);
      
      // Use search endpoint if search term is provided, otherwise use regular patients endpoint
      const response = search 
        ? await patientServices.searchPatients(search, limit, offset)
        : await patientServices.getPatients(limit, offset);

      // Ensure each patient has a key for React rendering
      response.data.forEach((patient) => {
        patient.key = patient.id;
      });

      setPatientList(response.data);

      // Update pagination metadata
      setPagination({
        currentPage: response.meta?.currentPage || 1,
        limit: response.meta?.limit || limit,
        offset: response.meta?.offset || offset,
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 0,
        hasMore: response.meta?.hasMore || false,
      });
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Keep the current page data if there's an error
    } finally {
      setLoading(false);
    }
  };

  // Handle pagination change from table
  const handlePaginationChange = (offset, limit) => {
    getPatients(limit, offset, searchText);
  };

  // Handle search input change
  const handleSearch = async (value) => {
    setSearchText(value);
    // Reset to first page when searching
    try {
      setLoading(true);
      const response = await patientServices.searchPatients(value, 50, 0);

      response.data.forEach((patient) => {
        patient.key = patient.id;
      });

      setPatientList(response.data);
      setPagination({
        currentPage: response.meta?.currentPage || 1,
        limit: response.meta?.limit || 50,
        offset: response.meta?.offset || 0,
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 0,
        hasMore: response.meta?.hasMore || false,
      });
    } catch (error) {
      console.error("Error searching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Fetch first page on component mount
    getPatients(50, 0);
  }, []);

  if (loading && patientList.length === 0) {
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
            <div
              style={{ margin: "16px 0 0 16px", display: "flex", gap: "10px" }}
            >
              <Button
                className="bg-primary"
                type="primary"
                variant="primary"
                onClick={exportToExcel}
                loading={loading}
                disabled={patientList.length === 0}
                style={{ width: "auto" }}
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
          totalRecords={pagination.total}
          currentPage={pagination.currentPage}
          onPaginationChange={handlePaginationChange}
          isServerSide={true}
          loading={loading}
          searchValue={searchText}
          onSearch={handleSearch}
        />
      </Col>
    </Row>
  );
};

export default PatientList;
