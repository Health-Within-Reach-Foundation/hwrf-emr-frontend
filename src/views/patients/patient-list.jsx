import { RiFileExcel2Line } from '@remixicon/react';
import { Button, Dropdown, Space, Input } from 'antd';
import 'flatpickr/dist/themes/material_blue.css';
import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import patientServices from '../../api/patient-services';
import Antdtable from '../../components/antd-table';
import Card from '../../components/Card';
import { Loading } from '../../components/loading';
import { useAuth } from '../../utilities/AuthProvider';

const PatientList = () => {
  const [patientList, setPatientList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({ name: '', address: '', service: '' });
  const [filterVisible, setFilterVisible] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    limit: 50,
    offset: 0,
    total: 0,
    totalPages: 0,
    hasMore: false,
  });

  const { userRoles } = useAuth();

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
      title: 'Register No',
      dataIndex: 'regNo',
      key: 'regNo',
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
        return <Link to={`/patient/patient-profile/${record?.id}`}>{`HWRF/${financialYear}/${text}`}</Link>;
      },
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sortable: true,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sortable: true,
      width: 80,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Gender',
      dataIndex: 'sex',
      key: 'sex',
      sortable: true,
      width: 120,
      filters: [
        { text: 'Male', value: 'male' },
        { text: 'Female', value: 'female' },
      ],
      onFilter: (value, record) => record.sex === value,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Mobile',
      dataIndex: 'mobile',
      key: 'mobile',
      sortable: true,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sortable: false,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Service Taken',
      dataIndex: 'serviceTaken',
      key: 'serviceTaken',
      width: 150,
      sortable: true,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text?.join(', ') || '-'}</Link>,
    },
    {
      title: 'Cash Paid',
      dataIndex: 'onlinePaid',
      key: 'onlinePaid',
      width: 120,
      sortable: true,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text ? `₹ ${text}` : '₹ 0'}</Link>,
    },
    {
      title: 'Online Paid Amount',
      dataIndex: 'offlinePaid',
      key: 'offlinePaid',
      width: 150,
      sortable: true,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text ? `₹ ${text}` : '₹ 0'}</Link>,
    },
    {
      title: 'Total Paid Amount',
      dataIndex: 'total',
      key: 'total',
      width: 150,
      sortable: true,
      render: (text, record) => <Link to={`/patient/patient-profile/${record.id}`}>{text ? `₹ ${text}` : '₹ 0'}</Link>,
    },
  ];

  // ✅ Always reads current filters from state
  const getPatients = async (limit = 50, offset = 0) => {
    try {
      setLoading(true);

      const safeLimit = Number(limit) || 50;
      const safeOffset = Number(offset) || 0;

      const payload = {
        limit: safeLimit,
        offset: safeOffset,
        name: filters?.name || '',
        address: filters?.address || '',
        service: filters?.service || '',
      };

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
      console.error('Error fetching patients:', error);
      setPatientList([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaginationChange = (offset, limit) => getPatients(limit, offset);

  // ✅ Export All — sends filtered patients to email
  const exportAllToEmail = async () => {
    setExportLoading(true);
    try {
      const response = await patientServices.getPatientForExport({
        name: filters?.name || '',
        address: filters?.address || '',
        service: filters?.service || '',
      });
      response?.success
        ? toast.success(response.message || 'Patient export report is being sent to your email. Please check your inbox.')
        : toast.error('Export failed');
    } catch (error) {
      console.error('Export error:', error);
      toast.error(`Export failed: ${error.message}`);
    } finally {
      setExportLoading(false);
    }
  };

  useEffect(() => {
    getPatients(50, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && patientList.length === 0) {
    return <Loading />;
  }

  // Filter dropdown content
  const filterContent = (
    <div
      style={{
        padding: 16,
        width: 280,
        background: '#fff',
        border: '1px solid #d9d9d9',
        borderRadius: 6,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
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
    <Row>
      <Col sm={12}>
        <Card>
          <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
            <Card.Header.Title>
              <h4 className="card-title">Patients List</h4>
            </Card.Header.Title>

            {userRoles.includes('admin') && (
              <Space>
                {/* Button 1: Filter */}
                <Dropdown
                  overlay={filterContent}
                  trigger={['click']}
                  open={filterVisible}
                  onOpenChange={(flag) => setFilterVisible(flag)}
                  placement="bottomLeft"
                >
                  <Button type="primary">Filter</Button>
                </Dropdown>

                {/* Button 2: Export All (sends filtered patients to email) */}
                <Button type="primary" onClick={exportAllToEmail} loading={exportLoading}>
                  <RiFileExcel2Line className="me-2" /> Export All
                </Button>
              </Space>
            )}
          </Card.Header>
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
        />
      </Col>
    </Row>
  );
};

export default PatientList;
