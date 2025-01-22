import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import CustomTable from "../../components/custom-table";
import { Loading } from "../../components/loading";
import campManagementService from "../../api/camp-management-service";
import clinicServices from "../../api/clinic-services";
import CampModalForm from "../../components/administration/camp-form";
import DateCell from "../../components/date-cell";
import { RiAddLine, } from "@remixicon/react";

const CampManagement = () => {
  const [camps, setCamps] = useState([]);
  const [usersOptions, setUsersOptions] = useState([]);
  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    campName: "",
    status: "",
    city: "",
    dateRange: [null, null],
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedCamp, setSelectedCamp] = useState(null);

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
  ];

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const response = await campManagementService.getCamps(); // Replace with actual API call
      console.log("camps: ", response.camps);
      setCamps(response.camps || []);
      setFilteredCamps(response.camps || []);
    } catch (error) {
      console.error("Error fetching camps:", error);
    } finally {
      setLoading(false);
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
      setLoading(true);
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
      setLoading(false);
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

  if (loading) {
    return <Loading />;
  }

  const columns = [
    {
      data: "name",
      title: "Camp Name",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          {data}
        </Button>
      ),
    },
    {
      data: "status",
      title: "Status",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          {data}
        </Button>
      ),
    },
    {
      data: "location",
      title: "Location",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          {data}
        </Button>
      ),
    },
    {
      data: "city",
      title: "City",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          {data}
        </Button>
      ),
    },
    {
      data: "vans",
      title: "Vans",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          {data?.join(", ") || ""}
        </Button>
      ),
    },
    {
      data: "startDate",
      title: "Start Date",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          <DateCell date={data} dateFormat="D MMM, YYYY" />
        </Button>
      ),
      // render: (data) => new Date(data).toLocaleDateString(),
    },
    {
      data: "endDate",
      title: "End Date",
      render: (data, row) => (
        <Button
          variant="link"
          size="sm"
          href={`/camps/${row.id}`} // Dynamic campId used in the URL
        >
          <DateCell date={data} dateFormat="D MMM, YYYY" />
        </Button>
      ),
    },
    {
      title: "Manage",
      data: null,
      render: (_, row) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEditCamp(row)}
        >
          Edit
        </Button>
      ),
    },
  ];

  const filterComponents = [
    {
      key: "campName",
      component: Select,
      props: {
        options: camps.map((camp) => ({ value: camp.name, label: camp.name })),
        onChange: (selected) =>
          setFilters((prev) => ({ ...prev, campName: selected?.value || "" })),
      },
    },
    {
      key: "status",
      component: Select,
      props: {
        options: statusOptions,
        onChange: (selected) =>
          setFilters((prev) => ({ ...prev, status: selected?.value || "" })),
      },
    },
    {
      key: "city",
      component: Select,
      props: {
        options: [...new Set(camps.map((camp) => camp.city))].map((city) => ({
          value: city,
          label: city,
        })),
        onChange: (selected) =>
          setFilters((prev) => ({ ...prev, city: selected?.value || "" })),
      },
    },
    // {
    //   key: "dateRange",
    //   component: ({ value, onChange }) => (
    //     <div>
    //       <DatePicker
    //         selected={value[0]}
    //         onChange={(dates) => onChange(dates)}
    //         startDate={value[0]}
    //         endDate={value[1]}
    //         selectsRange
    //         placeholderText="Select date range"
    //       />
    //     </div>
    //   ),
    //   props: {
    //     value: filters.dateRange,
    //     onChange: (dates) =>
    //       setFilters((prev) => ({ ...prev, dateRange: dates })),
    //   },
    // },
  ];

  const applyFilters = () => {
    let filteredData = camps;
    if (filters.campName) {
      filteredData = filteredData.filter(
        (camp) => camp.name === filters.campName
      );
    }
    if (filters.status) {
      filteredData = filteredData.filter(
        (camp) => camp.status === filters.status
      );
    }
    if (filters.city) {
      filteredData = filteredData.filter((camp) => camp.city === filters.city);
    }
    if (filters.dateRange[0] && filters.dateRange[1]) {
      const [start, end] = filters.dateRange;
      filteredData = filteredData.filter(
        (camp) =>
          new Date(camp.startDate) >= start && new Date(camp.endDate) <= end
      );
    }
    setFilteredCamps(filteredData);
  };

  const resetFilters = () => {
    setFilters({
      campName: "",
      status: "",
      city: "",
      dateRange: [null, null],
    });
    setFilteredCamps(camps);
  };

  if (loading) {
    return <Loading />;
  }
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

          <CustomTable
            columns={columns}
            data={filteredCamps}
            enableFilters={false}
            filtersConfig={filterComponents}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
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
