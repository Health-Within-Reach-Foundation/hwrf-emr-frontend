// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import {
//   Container,
//   Row,
//   Col,
//   Card,
//   Table,
//   Spinner,
//   Badge,
// } from "react-bootstrap";
// import campManagementService from "../../api/camp-management-service";
// import CustomTable from "../../components/custom-table";
// import DateCell from "../../components/date-cell";
// import { Loading } from "../../components/loading";

// const CampDetails = () => {
//   const { campId } = useParams();
//   const [campData, setCampData] = useState(null);
//   const [campLoading, setCampLoading] = useState(true);

//   const fetchCampDetails = async () => {
//     try {
//       const response = await campManagementService.getCampById(campId);
//       console.log(response);
//       setCampData(response.data);
//     } catch (error) {
//       console.error("Error fetching camp details:", error);
//     } finally {
//       setCampLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCampDetails();
//   }, [campId]);

//   if (campLoading) {
//     return <Loading />;
//   }

//   if (!campData) {
//     return <p className="text-center mt-5">No camp data found.</p>;
//   }

//   const {
//     name,
//     status,
//     location,
//     city,
//     startDate,
//     endDate,
//     vans,
//     clinic,
//     users,
//     patients,
//     specialties,
//   } = campData;

//   const staffAttendingColumns = [
//     {
//       title: "Name",
//       data: "name",
//     },
//     {
//       title: "Email",
//       data: "email",
//     },
//   ];

//   const patientColumns = [
//     {
//       data: "regNo",
//       title: "Reg. No",
//       render: (data, row) => {
//         return (
//           <a href={`/patient/patient-profile/${row.id}`} className="">
//             {data}
//           </a>
//         );
//       },
//     },
//     {
//       data: "name",
//       title: "Name",
//       render: (data, row) => {
//         return (
//           <a href={`/patient/patient-profile/${row.id}`} className="">
//             {data}
//           </a>
//         );
//       },
//     },
//     {
//       data: "sex",
//       title: "Sex",
//       render: (data, row) => {
//         return (
//           <a href={`/patient/patient-profile/${row.id}`} className="">
//             {data}
//           </a>
//         );
//       },
//     },
//   ];

//   return (
//     <Container className="mt-5">
//       {/* Camp Overview Section */}
//       <Row className="mb-4">
//         <Col>
//           <Card>
//             <Card.Header>
//               <h3>{name}</h3>
//               <Badge bg={status === "active" ? "success" : "secondary"}>
//                 {status}
//               </Badge>
//             </Card.Header>
//             <Card.Body>
//               <p>
//                 <strong>Location:</strong> {location}
//               </p>
//               <p>
//                 <strong>City:</strong> {city}
//               </p>
//               <p>
//                 <strong>Start Date:</strong>
//                 {new Date(startDate).toLocaleDateString()}
//               </p>
//               <p>
//                 <strong>End Date:</strong>{" "}
//                 {new Date(endDate).toLocaleDateString()}
//               </p>
//               <p>
//                 <strong>Vans:</strong> {vans?.join(", ") || "N/A"}
//               </p>

//               <p>
//                 <strong>Clinic Services:</strong>{" "}
//                 {specialties
//                   ?.map((service) => service.departmentName)
//                   .join(", ")}
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* Patients Section */}
//       <Row className="mb-4">
//         <Col>
//           <Card>
//             <Card.Header>
//               <h4>Patients attended</h4>
//             </Card.Header>
//             <Card.Body>
//               <CustomTable
//                 columns={patientColumns}
//                 data={patients} // Use filtered data
//                 enableSearch
//                 enableFilters={false}
//               />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       {/* Staff Section */}
//       <Row className="mb-4">
//         <Col>
//           <Card>
//             <Card.Header>
//               <h4>Staff</h4>
//             </Card.Header>
//             <Card.Body>
//               <CustomTable
//                 columns={staffAttendingColumns}
//                 data={users} // Use filtered data
//                 enableSearch
//                 enableFilters={false}
//               />
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default CampDetails;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Spinner,
  Badge,
  Button,
} from "react-bootstrap";
import { Form, Input, DatePicker, Select } from "antd";
import campManagementService from "../../api/camp-management-service";
import CustomTable from "../../components/custom-table";
import { Loading } from "../../components/loading";
import dayjs from "dayjs";
import clinicServices from "../../api/clinic-services";
import toast from "react-hot-toast";

const CampDetails = () => {
  const { campId } = useParams();
  const [campData, setCampData] = useState(null);
  const [campLoading, setCampLoading] = useState(true);
  const [serviceLoading, setServiceLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [specialtiesOptions, setSpecialtiesOptions] = useState([]);

  const fetchCampDetails = async () => {
    try {
      const response = await campManagementService.getCampById(campId);
      console.log(response);
      setCampData(response.data);
      // setEditData(response.data); // Initialize edit form with existing data
      setEditData({
        name: response.data.name || "",
        location: response.data.location || "",
        city: response.data.city || "",
        startDate: response.data.startDate || "",
        endDate: response.data.endDate || "",
        vans: response.data.vans || [], // Ensure it's an array
        specialties: response.data.specialties?.map((s) => s.id) || [], // Store only IDs
      });
    } catch (error) {
      console.error("Error fetching camp details:", error);
    } finally {
      setCampLoading(false);
    }
  };

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setServiceLoading(true);
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
      setServiceLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (value, field) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value, // Directly update the array
    }));
  };

  useEffect(() => {
    fetchCampDetails();
    getSpecialtyDepartmentsByClinic();
  }, [campId]);

  if (campLoading || serviceLoading) {
    return <Loading />;
  }

  if (!campData) {
    return <p className="text-center mt-5">No camp data found.</p>;
  }

  const {
    name,
    status,
    location,
    city,
    startDate,
    endDate,
    vans,
    specialties,
    patients,
    users,
  } = campData;

  // Handle Save Changes
  const handleSave = async () => {
    try {
      setCampLoading(true);
      console.log(editData);
      const response = await campManagementService.updateCampById(
        campId,
        editData
      );
      if (response.success) {
        toast.success(response.message);
      }
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating camp details:", error);
      toast.error(error.message);
    } finally {
      fetchCampDetails();
      setCampLoading(false);
    }
  };

  // Columns for Tables
  const staffColumns = [
    { title: "Name", data: "name" },
    { title: "Email", data: "email" },
  ];

  const patientColumns = [
    {
      data: "regNo",
      title: "Reg. No",
      render: (data, row) => (
        <a href={`/patient/patient-profile/${row.id}`}>{data}</a>
      ),
    },
    {
      data: "name",
      title: "Name",
      render: (data, row) => (
        <a href={`/patient/patient-profile/${row.id}`}>{data}</a>
      ),
    },
    {
      data: "sex",
      title: "Sex",
      render: (data, row) => (
        <a href={`/patient/patient-profile/${row.id}`}>{data}</a>
      ),
    },
  ];

  return (
    <Container className="mt-4">
      {/* Camp Details Card with Edit Option */}
      <Row className="mb-4 w-full">
        <Col xs={12} md={12} lg={12}>
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">{isEditing ? "Edit Camp Details" : name}</h4>
              <Badge bg={status === "active" ? "success" : "secondary"}>
                {status}
              </Badge>
            </Card.Header>
            <Card.Body>
              {isEditing ? (
                <Form layout="vertical">
                  <Form.Item label="Name">
                    <Input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                    />
                  </Form.Item>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Location">
                        <Input
                          type="text"
                          name="location"
                          value={editData.location}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="City">
                        <Input
                          type="text"
                          name="city"
                          value={editData.city}
                          onChange={handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Start Date">
                        <DatePicker
                          style={{ width: "100%" }}
                          name="startDate"
                          format="YYYY-MM-DD"
                          value={
                            editData.startDate
                              ? dayjs(editData.startDate)
                              : null
                          } // ✅ Convert string to dayjs
                          onChange={(date, dateString) =>
                            setEditData({ ...editData, startDate: dateString })
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="End Date">
                        <DatePicker
                          style={{ width: "100%" }}
                          format="YYYY-MM-DD"
                          name="endDate"
                          value={
                            editData.endDate ? dayjs(editData.endDate) : null
                          } // ✅ Convert string to dayjs
                          onChange={(date, dateString) =>
                            setEditData({ ...editData, endDate: dateString })
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Vans">
                        <Select
                          mode="multiple"
                          value={editData.vans}
                          placeholder="Select Van"
                          allowClear
                          onChange={(value) =>
                            handleMultiSelectChange(value, "vans")
                          }
                          options={[
                            { value: "BharatBenz", label: "BharatBenz" },
                            { value: "Force", label: "Force" },
                            { value: "TATA", label: "TATA" },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Clinic Services">
                        <Select
                          mode="multiple"
                          placeholder="Select services"
                          allowClear
                          value={editData.specialties} // ✅ Now contains only IDs
                          onChange={(value) =>
                            handleMultiSelectChange(value, "specialties")
                          }
                          options={specialtiesOptions} // Options from API
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="secondary"
                      onClick={() => setIsEditing(false)}
                      className="me-2"
                    >
                      Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>Location:</strong> {location}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>City:</strong> {city}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Start Date:</strong>{" "}
                        {new Date(startDate).toLocaleDateString()}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>End Date:</strong>{" "}
                        {new Date(endDate).toLocaleDateString()}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Vans:</strong> {vans?.join(", ") || "N/A"}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Clinic Services:</strong>{" "}
                        {specialties?.map((s) => s.departmentName).join(", ")}
                      </p>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-end mt-3">
                    <Button
                      variant="outline-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Details
                    </Button>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patients Section */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Patients Attended</h5>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={patientColumns}
                data={patients}
                enableSearch
                enableFilters={false}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Staff Section */}
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              <h5>Staff</h5>
            </Card.Header>
            <Card.Body>
              <CustomTable
                columns={staffColumns}
                data={users}
                enableSearch
                enableFilters={false}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CampDetails;
