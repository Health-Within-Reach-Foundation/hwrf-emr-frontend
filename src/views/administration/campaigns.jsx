import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import Select from "react-select";
import { Loading } from "../../components/loading";
import campManagementService from "../../api/camp-management-service";
import clinicServices from "../../api/clinic-services";
import CampModalForm from "../../components/administration/camp-form";
import DateCell from "../../components/date-cell";
import { RiAddLine } from "@remixicon/react";
import { Badge, Button, Tooltip, Tabs } from "antd";
import AntdTable from "../../components/antd-table";
import { Link } from "react-router-dom";
import { useAuth } from "../../utilities/AuthProvider";

const { TabPane } = Tabs;

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

  const { userRoles } = useAuth();

  const fetchCamps = async () => {
    try {
      setCampLoading(true);
      setLoading(true);
      const response = await campManagementService.getCamps(); // Replace with actual API call
      console.log("camps: ", response.camps);
      response.camps.map((camp) => {
        camp.key = camp.id;
        return camp;
      });
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

  // const getCampsAnalytics = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await campManagementService.getCampsAnalytics();
  //     console.log("Camps Analytics: ", response);
  //   } catch (error) {
  //     console.error("Error fetching camps analytics:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Handle editing an existing role
  const handleEditCamp = (camp) => {
    setSelectedCamp(camp); // Set the current role for editing
    setShowModal(true);
  };

  useEffect(() => {
    fetchCamps();
    getUsersbyClinic();
    getSpecialtyDepartmentsByClinic();
    // getCampsAnalytics();
  }, []);

  if (loading || campLoading || loading2) {
    return <Loading />;
  }

  // const handleVerticalTabChange = (key) => {
  //   if (key === "allCamps") {
  //     setFilteredCamps(camps);
  //   } else if (key === "currentMonthCamps") {
  //     const currentMonth = new Date().getMonth();
  //     console.log("currentMonth: ", currentMonth);
  //     const filtered = camps.filter(
  //       (camp) => new Date(camp.startDate).getMonth() === currentMonth
  //     );
  //     setFilteredCamps(filtered);
  //   }
  // };

  // const handleHorizontalTabChange = (key) => {
  //   if (key === "campsOverview") {
  //     // Implement logic for Camps Overview
  //   } else if (key === "revenueAnalysis") {
  //     // Implement logic for Revenue Analysis
  //   }
  // };

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
      filters: [
        { text: "BharatBenz", value: "BharatBenz" },
        { text: "Force", value: "Force" },
        { text: "TATA", value: "TATA" },
      ],
      onFilter: (value, record) => record.vans.includes(value),
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
      render: (text, record) => {
        const showWarning =
          new Date(record.startDate) < new Date() - 7 * 24 * 60 * 60 * 1000 &&
          !userRoles.includes("admin");

        return (
          <Tooltip
            zIndex={1000}
            title={
              showWarning
                ? "Permission denied, You can only edit camps that are created today or within 7 days, To edit contact admin "
                : "Edit Camp"
            }
            placement="top"
            color="#0a58b8"
          >
            <Button
              type="primary"
              variant="outlined"
              className="bg-primary"
              size="sm"
              onClick={() => handleEditCamp(record)}
              disabled={
                new Date(record.startDate) <
                  new Date() - 7 * 24 * 60 * 60 * 1000 &&
                !userRoles.includes("admin")
              }
            >
              Edit
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      <Row>
        <Col>
          <Row className="align-items-center mb-3">
            <Col className="d-flex flex-row-reverse">
              <Button
                className="bg-primary"
                type="primary"
                onClick={() => {
                  setSelectedCamp(null);
                  setShowModal(true);
                }}
              >
                <RiAddLine />
                Create Camp
              </Button>
            </Col>
          </Row>
          {/* <Tabs
            defaultActiveKey="allCamps"
            tabPosition="left"
            onChange={handleVerticalTabChange}
          >
            <TabPane tab="All Camps" key="allCamps">
              <Tabs
                defaultActiveKey="campsOverview"
                onChange={handleHorizontalTabChange}
              >
                <TabPane tab="Camps Overview" key="campsOverview">
                  <AntdTable
                    columns={campColumns}
                    data={filteredCamps}
                    pageSizeOptions={[50, 100, 150, 200]}
                    defaultPageSize={50}
                  />
                </TabPane>
                <TabPane tab="Revenue Analysis" key="revenueAnalysis">
                </TabPane>
              </Tabs>
            </TabPane>
            <TabPane tab="Current Month Camps" key="currentMonthCamps">
              <Tabs
                defaultActiveKey="campsOverview"
                onChange={handleHorizontalTabChange}
              >
                <TabPane tab="Camps Overview" key="campsOverview">
                  <AntdTable
                    columns={campColumns}
                    data={filteredCamps}
                    pageSizeOptions={[50, 100, 150, 200]}
                    defaultPageSize={50}
                  />
                </TabPane>
                <TabPane tab="Revenue Analysis" key="revenueAnalysis">
                  <div>Camp Revenue will come here</div>
                </TabPane>
              </Tabs>
            </TabPane>
          </Tabs> */}
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
