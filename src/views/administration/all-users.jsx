import React, { Fragment, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import { Link } from "react-router-dom";

// Images

import CustomTable from "../../components/custom-table";
import { Loading } from "../../components/loading";
import clinicSerivces from "../../api/clinic-serivces";

const AllUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  //   const columns = [
  //     { title: "ID", data: "id" },
  //     { title: "Name", data: "name" },
  //     { title: "Gender", data: "gender" },
  //     { title: "Register Date", data: "registerDate" },
  //   ];

  const columns = [
    // { title: "ID", data: "id" },
    { title: "Name", data: "name" },
    { title: "Email", data: "email" },
    { title: "Phone Number", data: "phoneNumber" },
    { title: "Specialist", data: "specialist" },
    { title: "Roles", data: "roles" }, // For roles, we will format in the table
    { title: "Register Date", data: "createdAt" },
  ];

  //   const data = [
  //     { id: 1, name: "John Doe", gender: "Male", registerDate: "2023-12-01" },
  //     { id: 2, name: "Jane Doe", gender: "Female", registerDate: "2023-11-15" },
  //   ];

  const filters = [
    { key: "createdAt", label: "Register Date" },
    { key: "specialist", label: "Specialist" },
    { key: "gender", label: "Gender" },
  ];

  const getUsersbyClinic = async () => {
    const clinicId = "123"; // Replace with dynamic clinicId if applicable
    setLoading(true);
    try {
      const response = await clinicSerivces.getUsersByClinic();
      const formattedUsers = response.data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        specialist: user.specialist,
        roles: user.roles.map((role) => role.roleName).join(", "), // Combine role names
        createdAt: new Date(user.createdAt).toLocaleDateString(), // Format date
      }));
      setUsers(formattedUsers);
    } catch (error) {
      toast.error("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersbyClinic();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header className="card-header-custom d-flex justify-content-between p-4 mb-0 border-bottom-0">
              <Card.Header.Title>
                <h4 className="card-title">Clinic Users</h4>
              </Card.Header.Title>
            </Card.Header>
          </Card>
        </Col>

        <div>
          <CustomTable
            columns={columns}
            data={users}
            enableSearch
            enableFilters
            filtersConfig={filters}
          />
        </div>
      </Row>
    </>
  );
};

export default AllUsers;
