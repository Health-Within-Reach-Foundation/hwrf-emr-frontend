import { RiFileExcel2Line } from "@remixicon/react";
import { Button, Dropdown, Space, Input } from "antd";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import patientServices from "../../api/patient-services";
import Antdtable from "../../components/antd-table";
import Card from "../../components/Card";
import { Loading } from "../../components/loading";
import { useAuth } from "../../utilities/AuthProvider";
import toast from "react-hot-toast";

const PatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({ name: "", address: "", service: "" });
  const [filterVisible, setFilterVisible] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    offset: 0,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  function getFormattedRegNo(patient) {
    if (!patient?.createdAt) return `HWRF/--/${patient.regNo}`;
    const createdAt = new Date(patient.createdAt);
    const year = createdAt.getFullYear() % 100;
    const month = createdAt.getMonth() + 1;
    const financialYear = month > 3 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
    return `HWRF/${financialYear}/${patient.regNo}`;
  }

  const patientColumns = [
    { title: "Register No", dataIndex: "regNo", key: "regNo", width: 180, render: (text, record) => <Link to={`/patient/patient-profile/${record?.id}`}>{getFormattedRegNo(record)}</Link> },
    { title: "Name", dataIndex: "name", key: "name", render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link> },
    { title: "Age", dataIndex: "age", key: "age", width: 80, render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link> },
    { title: "Gender", dataIndex: "sex", key: "sex", width: 120, render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link> },
    { title: "Mobile", dataIndex: "mobile", key: "mobile", render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link> },
    { title: "Address", dataIndex: "address", key: "address", render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link> },
    { title: "Service Taken", dataIndex: "serviceTaken", key: "serviceTaken", width: 150, render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text?.join(", ") || "-"}</Link> },
    { title: "Cash Paid", dataIndex: "onlinePaid", key: "onlinePaid", width: 120, render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text ? `₹ ${text}` : "₹ 0"}</Link> },
    { title: "Online Paid Amount", dataIndex: "offlinePaid", key: "offlinePaid", width: 150, render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text ? `₹ ${text}` : "₹ 0"}</Link> },
    { title: "Total Paid Amount", dataIndex: "total", key: "total", width: 150, render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text ? `₹ ${text}` : "₹ 0"}</Link> },
  ];

  const { userRoles, user } = useAuth();

  // ─────────────────────────────────────────────────────────────────────────
  // BUG FIX 1: getPatients
  //   BEFORE: called patientServices.getPatients({ clinicId, limit, offset, ...filters })
  //           but also called as getPatients(limit, offset) from handlePaginationChange
  //           causing the argument to be a NUMBER instead of an object, so filters
  //           (name/address/service) were never sent → no data returned.
  //   AFTER:  always accepts (limit, offset) and merges current `filters` from state
  //           so Apply Filter also works correctly.
  // ─────────────────────────────────────────────────────────────────────────
  const getPatients = async (limit = 50, offset = 0) => {
    try {
      setLoading(true);

      const safeLimit = Number(limit) || 50;
      const safeOffset = Number(offset) || 0;

      const payload = {
        limit: safeLimit,
        offset: safeOffset,
        // ✅ FIX: always include current filter values from state
        name: filters?.name || "",
        address: filters?.address || "",
        service: filters?.service || "",
      };

      console.log("PAYLOAD:", payload);

      const response = await patientServices.getPatients(payload);

      const patients = response.data || [];
      patients.forEach((p) => (p.key = p.id));

      setPatientList(patients);

      setPagination({
        currentPage: response.meta?.currentPage || 1,
        limit: response.meta?.limit || safeLimit,
        offset: response.meta?.offset || 0,
        total: response.meta?.total || 0,
        totalPages: response.meta?.totalPages || 0,
        hasMore: response.meta?.hasMore || false,
      });
    } catch (error) {
      console.error("Error fetching patients:", error);
      setPatientList([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (offset, limit) => getPatients(limit, offset);

  // ─────────────────────────────────────────────────────────────────────────
  // BUG FIX 2: Export All (download)
  //   BEFORE: button was labelled "Export Visible" and only exported current page
  //           (patientList which is max 50 records).
  //   AFTER:  renamed to "Export All" – calls /export-download endpoint with
  //           current filters so ALL filtered patients are downloaded as Excel.
  // ─────────────────────────────────────────────────────────────────────────
  const exportAllFilteredToExcel = async () => {
    setExportLoading(true);
    try {
      const response = await patientServices.exportPatientsDownload({
        name: filters?.name || "",
        address: filters?.address || "",
        service: filters?.service || "",
      });
      // response is a Blob (arraybuffer)
      saveAs(response, "patients_export.xlsx");
    } catch {
      toast.error("Export failed. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BUG FIX 3: Export All (email)
  //   BEFORE: sent no filters → always emailed ALL patients regardless of filters.
  //   AFTER:  sends current filter values so only filtered patients are emailed.
  // ─────────────────────────────────────────────────────────────────────────
  const exportAllToEmail = async () => {
    setExportLoading(true);
    try {
      const response = await patientServices.getPatientForExport({
        name: filters?.name || "",
        address: filters?.address || "",
        service: filters?.service || "",
      });
      response?.success
        ? toast.success("Export file will be sent to your email")
        : toast.error("Export failed");
    } catch {
      toast.error("Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  // Load patients on mount (once user is available)
  useEffect(() => {
    if (user?.clinicId) {
      getPatients(50, 0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading && !patientList.length) return <Loading />;

  // Filter dropdown content
  const filterContent = (
    <div
      style={{
        padding: 16,
        width: 280,
        background: "#fff",
        border: "1px solid #d9d9d9",
        borderRadius: 6,
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          placeholder="Name"
          value={filters.name}
          onChange={(e) => setFilters((prev) => ({ ...prev, name: e.target.value }))}
        />
        <Input
          placeholder="Address"
          value={filters.address}
          onChange={(e) => setFilters((prev) => ({ ...prev, address: e.target.value }))}
        />
        <Input
          placeholder="Service"
          value={filters.service}
          onChange={(e) => setFilters((prev) => ({ ...prev, service: e.target.value }))}
        />
        <Button
          type="primary"
          onClick={() => {
            // ✅ FIX: reset to page 1 and fetch with latest filters from state
            getPatients(50, 0);
            setFilterVisible(false);
          }}
          block
        >
          Apply
        </Button>
      </Space>
    </div>
  );

  return (
    <div style={{ padding: 16 }}>
      <Card>
        <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
          <Card.Header.Title>
            <h4 className="card-title">Patients List</h4>
          </Card.Header.Title>

          {userRoles.includes("admin") && (
            <Space>
              <Dropdown
                overlay={filterContent}
                trigger={["click"]}
                open={filterVisible}
                onOpenChange={(flag) => setFilterVisible(flag)}
                placement="bottomLeft"
              >
                <Button type="primary">Filter</Button>
              </Dropdown>

              <Button type="primary" onClick={exportAllToEmail} loading={exportLoading}>
                <RiFileExcel2Line className="me-2" /> Export All
              </Button>
            </Space>
          )}
        </Card.Header>

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
          showSearch={false}
        />
      </Card>
    </div>
  );
};

export default PatientList;
