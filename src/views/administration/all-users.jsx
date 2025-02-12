import React, { Fragment, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import Card from "../../components/Card";
import { Link } from "react-router-dom";

// Images

import CustomTable from "../../components/custom-table";
import { Loading } from "../../components/loading";
import clinicSerivces from "../../api/clinic-services";
import UserDrawer from "../../components/administration/user-drawer";
import clinicServices from "../../api/clinic-services";
import rolePermissionService from "../../api/role-permission-service";
import { Dropdown } from "antd";
import { RiDeleteBin4Line, RiSettings4Fill } from "@remixicon/react";
import userServices from "../../api/user-services";
import toast from "react-hot-toast";
import AntdTable from "../../components/antd-table";

const AllUsers = () => {
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [allRoles, setAllRoles] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);

  const columns = [
    // { title: "ID", data: "id" },
    { title: "Name", data: "name", key: "name" },
    { title: "Email", data: "email", key: "email" },
    { title: "Phone Number", data: "phoneNumber", key: "phoneNumber" },
    { title: "Specialist", data: "specialist" },
    {
      title: "Roles",
      data: "roles",
      key: "roles",
      render: (data, row) => {
        return <div>{data?.map((role) => role.roleName).join(", ")}</div>;
      },
    }, // For roles, we will format in the table
    {
      title: "Department",
      data: "department",
      key: "department",
      render: (data, row) => {
        return <div>{data?.map((dept) => dept.departmentName).join(", ")}</div>;
      },
    },
    { title: "Register Date", data: "createdAt", key: "createdAt" },
    {
      data: null,
      title: "Action",
      render: (data, row) => {
        const menu = {
          items: [
            {
              key: "1",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <RiSettings4Fill />
                  <span>Manage</span>
                </div>
              ),
              onClick: () => handleEditClick(row),
            },
            {
              key: "2",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <RiDeleteBin4Line />
                  <span>Delete</span>
                </div>
              ),
              onClick: () => handleDeleteUserById(row?.id),
            },
          ],
        };

        return (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button type="primary" size="sm">
              Action
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  // help me creating new columns for antd table

  const usersColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sortable: true,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sortable: true,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sortable: false,
    },
    {
      title: "Specialist",
      dataIndex: "specialist",
      key: "specialist",
      sortable: true,
      width: 120,
      render: (text, record) => (
        <span>{record?.specialties?.map((specialist) => specialist.name).join(", ")}</span>
      ),
    },
    {
      title: "Roles",
      dataIndex: "roles",
      key: "roles",
      render: (text, record) => (
        <span>{text?.map((role) => role.roleName).join(", ")}</span>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      key: "department",
      sortable: true,
      render: (text, record) => (
        <span>{text?.map((dept) => dept.departmentName).join(", ")}</span>
      ),
    },
    {
      title: "Action",
      dataIndex: null,
      key: "action",
      render: (text, record) => {
        const isAdmin = record?.roles.map((role) => role.roleName).includes("admin");
        const menu = {
          items: [
            {
              key: "1",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <RiSettings4Fill />
                  <span>Manage</span>
                </div>
              ),
              onClick: () => handleEditClick(record),
            },
            {
              key: "2",
              label: (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <RiDeleteBin4Line />
                  <span>Delete</span>
                </div>
              ),
              onClick: isAdmin ? null : () => handleDeleteUserById(record?.id),
              disabled: isAdmin,
            },
          ],
        };

        return (
          <Dropdown menu={menu} trigger={["click"]}>
            <Button type="primary" size="sm">
              Action
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  const filters = [
    { key: "createdAt", label: "Register Date" },
    { key: "specialist", label: "Specialist" },
    { key: "gender", label: "Gender" },
  ];

  const getSpecialtyDepartmentsByClinic = async () => {
    try {
      setLoading(true);
      const response = await clinicServices.getSpecialtyDepartmentsByClinic();
      setAllDepartments(
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

  // Fetch roles
  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await rolePermissionService.getRoles();
      setAllRoles(
        response.data.map((role) => ({
          value: role.id,
          label: role.roleName,
        }))
      );
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUsersbyClinic = async () => {
    setLoading(true);
    setUserLoading(true);
    try {
      const response = await clinicSerivces.getUsersByClinic();
      console.log("response", response);
      const formattedUsers = response.data.map((user) => ({
        key: user.id,
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        specialist: user.specialist,
        department: user.specialties,
        // roles: user.roles.map((role) => role.roleName).join(", "), // Combine role names
        roles: user.roles, // Combine role names
        specialties: user.specialties,
        createdAt: new Date(user.createdAt).toLocaleDateString(), // Format date
      }));
      console.log("formattedUsers", formattedUsers);
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
      setUserLoading(false);
    }
  };

  const handleDeleteUserById = async (userId) => {
    try {
      setLoading(true);
      const response = await userServices.deleteUser(userId);

      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      console.error("Error : ", error);
    } finally {
      setLoading(false);
      getUsersbyClinic();
    }
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setOpenDrawer(true);
  };
  useEffect(() => {
    getUsersbyClinic();
    getSpecialtyDepartmentsByClinic();
    getRoles();
  }, []);

  if (loading || userLoading) {
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
          <AntdTable
            columns={usersColumns}
            data={users}
            pageSizeOptions={[50, 100, 150, 200]}
            defaultPageSize={50}
          />
        </div>

        {openDrawer && (
          <UserDrawer
            open={openDrawer}
            onClose={() => setOpenDrawer(false)}
            onSave={() => {
              getUsersbyClinic();
            }}
            userData={selectedUser}
            allRoles={allRoles}
            allDepartments={allDepartments}
          />
        )}
      </Row>
    </>
  );
};

export default AllUsers;
