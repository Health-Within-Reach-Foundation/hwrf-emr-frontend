import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import { Loading } from "../../components/loading";
import campManagementService from "../../api/camp-management-service";
import clinicServices from "../../api/clinic-services";
import CampModalForm from "../../components/administration/camp-form";
import DateCell from "../../components/date-cell";
import { RiAddLine } from "@remixicon/react";
import { Badge, Button } from "antd";
import AntdTable from "../../components/antd-table";
import { Link } from "react-router-dom";

const CampManagement = () => {
  const [camps, setCamps] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [campLoading, setCampLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);

  const fetchCamps = async () => {
    try {
      setCampLoading(true);
      setLoading(true);
      const response = await campManagementService.getCamps(); // Replace with actual API call
      console.log("camps: ", response.camps);
      setCamps(response.camps || []);
      setFilteredCamps(response.camps || []);
    } catch (error) {
      console.error("Error fetching camps:", error);
    } finally {
      setLoading(false);
      setCampLoading(false);
    }
  };

  const getUsersbyClinic = async () => {
    setLoading(true);
    try {
      const response = await clinicServices.getUsersByClinic();
      const formattedUsers = response.data.map((user) => ({
        value: user.id,
        label: user.name,
        phoneNumber: user.phoneNumber,
      }));
      setUsersOptions(formattedUsers);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setLoading2(true);
      const response = await clinicServices.getSpecialtyDepartmentsByClinic();
      setSpecialtiesOptions(
        response.data.map((department) => ({
          value: department.id,
          label: department.departmentName,
        }))
      );
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setLoading2(false);
    }
  };

  // Handle editing an existing role
  const handleEditCamp = (camp) => {
    setSelectedCamp(camp); // Set the current role for editing
    setShowModal(true);
  };

  useEffect(() => {
    fetchCamps();
    getUsersbyClinic();
    getSpecialtyDepartmentsByClinic();
  }, []);

  if (loading || campLoading || loading2) {
    return <Loading />;
  }

  const campColumns = [
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      fixed: "left",
      sortable: true,
      render: (text, record) => <Link to={`/camps/${record.id}`}>{text}</Link>,
    },
    {
      title: "Camp Name",
      dataIndex: "name",
      key: "name",
      sortable: true,
      render: (text, record) => <Link to={`/camps/${record.id}`}>{text}</Link>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sortable: true,
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (text, record) => (
        <Link to={`/camps/${record.id}`}>
          <Badge status={text === "active" ? "success" : "error"} text={text} />
        </Link>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      sortable: true,
      render: (text, record) => <Link to={`/camps/${record.id}`}>{text}</Link>,
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
      sortable: true,
      render: (text, record) => <Link to={`/camps/${record.id}`}>{text}</Link>,
    },
    {
      title: "Vans",
      dataIndex: "vans",
      key: "vans",
      sortable: true,
      render: (text, record) => (
        <Link to={`/camps/${record.id}`}>{text?.join(", ")}</Link>
      ),
    },
    // here manaeg is not link it is button so you can use button component from react-bootstrap
    {
      title: "Manage",
      dataIndex: null,
      key: "manage",
      render: (text, record) => (
        <Button
          type="primary"
          variant="outlined"
          className="bg-primary btn-primary rounded-0"
          size="sm"
          onClick={() => handleEditCamp(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center mb-3">
            <Col className="d-flex flex-row-reverse">
              <Button onClick={() => setShowModal(true)}>
                <RiAddLine />
                Add Camp
              </Button>
            </Col>
          </Row>

          {/* <CustomTable
            columns={columns}
            data={filteredCamps}
            enableFilters={false}
            filtersConfig={filterComponents}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
          /> */}
          <AntdTable
            columns={campColumns}
            data={filteredCamps}
            pageSizeOptions={[50, 100, 150, 200]}
            defaultPageSize={50}
          />
        </Col>
      </Row>

      {showModal && (
        <CampModalForm
          editCampData={selectedCamp}
          show={showModal}
          onClose={() => setShowModal(false)}
          users={usersOptions} // Pass user options here
          specialties={specialtiesOptions} // Pass specialty options here
          onSave={() => fetchCamps()}
        />
      )}
    </>
  );
};

export default CampManagement;
