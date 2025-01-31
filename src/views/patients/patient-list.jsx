// import React, { Fragment, useEffect, useState } from "react";
// import { Col, Row } from "react-bootstrap";
// import Card from "../../components/Card";
// import CustomTable from "../../components/custom-table";

// import patientServices from "../../api/patient-services";
// import { Loading } from "../../components/loading";

// const PatientList = () => {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const columns = [
//     // { title: "ID", data: "id" },
//     { title: "Register No", data: "regNo" },
//     { title: "Name", data: "name" },
//     { title: "Age", data: "age" },
//     { title: "Gender", data: "sex" },
//     { title: "Mobile", data: "mobile" },
//     { title: "Address", data: "address" },
//     { title: "Register Date", data: "createdAt" },
//   ];

//   const filters = [
//     { key: "registerDate", label: "Register Date" },
//     { key: "gender", label: "Gender" },
//   ];

//   const getPatients = async () => {
//     try {
//       setLoading(true);
//       const response = await patientServices.getPatients();
//       setData(response.data);
//     } catch (error) {
//       
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getPatients();
//   }, []);

//   if (loading) {
//     return <Loading />;
//   }

//   return (
//     <>
//       <Row>
//         <Col sm={12}>
//           <Card>
//             <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
//               <Card.Header.Title>
//                 <h4 className="card-title">Patients List</h4>
//               </Card.Header.Title>
//             </Card.Header>
//           </Card>
//         </Col>

//         <div>
//           <CustomTable
//             columns={columns}
//             data={data}
//             enableSearch
//             enableFilters
//             filtersConfig={filters}
//           />
//         </div>
//       </Row>
//     </>
//   );
// };

// export default PatientList;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import CustomTable from "../../components/custom-table";
import patientServices from "../../api/patient-services";
import { Loading } from "../../components/loading";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import "flatpickr/dist/themes/material_blue.css";
import { data } from "jquery";
import DateCell from "../../components/date-cell";

const PatientList = () => {
  const [originalData, setOriginalData] = useState([]); // Original unfiltered data
  const [filteredData, setFilteredData] = useState([]); // Data after applying filters
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    gender: null, // Filter state for gender
    registerDate: null, // Filter state for register date
  });

  const navigate = useNavigate();

  // Table columns
  const columns = [
    {
      title: "Register No",
      data: "regNo",
      render: (data, row) => {
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {"HWRF-".concat(data)}
          </a>
        );
      },
    },
    {
      title: "Name",
      data: "name",
      render: (data, row) => {
        
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      title: "Age",
      data: "age",
      render: (data, row) => {
        
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      title: "Gender",
      data: "sex",
      render: (data, row) => {
        
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      title: "Mobile",
      data: "mobile",
      render: (data, row) => {
        
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    {
      title: "Address",
      data: "address",
      render: (data, row) => {
        
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            {data}
          </a>
        );
      },
    },
    // { title: "Register Date", data: "createdAt" },
    {
      title: "Register Date",
      data: "createdAt",
      render: (data, row) => {
        
        return (
          <a href={`/patient/patient-profile/${row.id}`} className="">
            <DateCell date={data} />
          </a>
        );
      },
    },
  ];

  // Filter configurations
  const filtersConfig = [
    {
      key: "gender",
      component: ({ value, onChange }) => (
        <div className="mb-3">
          <label className="form-label">Gender</label>
          <Select
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            value={value}
            onChange={onChange}
            isClearable
            placeholder="Select Gender"
          />
        </div>
      ),
      props: {
        value: filters.gender
          ? {
              value: filters.gender,
              label:
                filters.gender.charAt(0).toUpperCase() +
                filters.gender.slice(1),
            }
          : null,
        onChange: (selectedOption) =>
          setFilters((prev) => ({
            ...prev,
            gender: selectedOption ? selectedOption.value : null,
          })),
      },
    },
    {
      key: "registerDate",
      component: ({ value, onChange }) => (
        <div className="mb-3">
          <label className="form-label">Register Date</label>
          <Flatpickr
            className="form-control"
            value={value}
            onChange={(date) => onChange(date.length ? date[0] : null)}
            options={{
              dateFormat: "Y-m-d",
              enableTime: false,
            }}
          />
        </div>
      ),
      props: {
        value: filters.registerDate,
        onChange: (date) =>
          setFilters((prev) => ({
            ...prev,
            registerDate: date,
          })),
      },
    },
  ];

  // Fetch initial data
  const getPatients = async () => {
    try {
      setLoading(true);
      const response = await patientServices.getPatients();
      setOriginalData(response.data);
      setFilteredData(response.data);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filtered = [...originalData];

    // Gender filter
    if (filters.gender) {
      filtered = filtered.filter(
        (patient) => patient.sex.toLowerCase() === filters.gender.toLowerCase()
      );
    }

    // Register date filter
    if (filters.registerDate) {
      const selectedDate = filters.registerDate.toISOString().split("T")[0];
      filtered = filtered.filter((patient) =>
        patient.createdAt.startsWith(selectedDate)
      );
    }

    setFilteredData(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ gender: null, registerDate: null });
    setFilteredData(originalData);
  };

  // Initial data load
  useEffect(() => {
    getPatients();
  }, []);

  const handleRowClick = (rowData) => {
    navigate(`/patient/patient-profile/${rowData.id}`);
  };

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
        <CustomTable
          columns={columns}
          data={filteredData} // Use filtered data
          enableSearch
          enableFilters
          filtersConfig={filtersConfig} // Pass filters configuration
          // rowOnClick={handleRowClick} // Pass row click handler
          onApplyFilters={applyFilters} // Pass apply filters function
          onResetFilters={resetFilters} // Pass reset filters function
        />
      </Col>
    </Row>
  );
};

export default PatientList;
