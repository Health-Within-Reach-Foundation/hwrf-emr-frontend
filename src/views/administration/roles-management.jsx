import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import { Loading } from "../../components/loading";
import CustomTable from "../../components/custom-table";
import RoleModalForm from "../../components/administration/role-form";
import rolePermissionService from "../../api/role-permission-service";
import { RiAddLine } from "@remixicon/react";
import { transformText } from "../../utilities/utility-function";
import AntdTable from "../../components/antd-table";

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(null); // Holds the role being edited or null for creation

  // const columns = [
  //   {
  //     title: "Role Name",
  //     data: "roleName",
  //     render: (data) => transformText(data),
  //   },
  //   { title: "Role Description", data: "roleDescription" },
  //   {
  //     title: "Actions",
  //     data: null,
  //     render: (_, row) => (
  //       <Button
  //         variant="outline-primary"
  //         size="sm"
  //         onClick={() => handleEditRole(row)}
  //       >
  //         Edit
  //       </Button>
  //     ),
  //   },
  // ];

  const roleColumns = [
    {
      title: "Role Name",
      dataIndex: "roleName",
      key: "roleName",
      sortable:true,
      render: (text) => transformText(text),
    },
    {
      title: "Role Description",
      dataIndex: "roleDescription",
      sortable:true,
      key: "roleDescription",
    },
    {
      title: "Actions",
      dataIndex: null,
      key: "actions",
      render: (_, record) => (
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleEditRole(record)}
        >
          Edit
        </Button>
      ),
    },
  ];

  // Fetch all roles
  const getRoles = async () => {
    try {
      setLoading(true);
      const response = await rolePermissionService.getRoles();
      setRoles(response.data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all permissions
  const getAllPermissions = async () => {
    try {
      setLoading(true);
      const response = await rolePermissionService.getAllPermissions();
      setPermissions(response.data);
    } catch (error) {
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle creating a new role
  const handleCreateRole = () => {
    setCurrentRole(null); // Clear currentRole for new role creation
    setShowModal(true);
  };

  // Handle editing an existing role
  const handleEditRole = (role) => {
    setCurrentRole(role); // Set the current role for editing
    setShowModal(true);
  };

  useEffect(() => {
    getRoles();
    getAllPermissions();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="mt-4">
      <h2>Role Management</h2>
      <div className="d-flex flex-row-reverse justify-content-between align-items-center mb-4">
        <Button variant="primary" onClick={handleCreateRole}>
          <RiAddLine />
          Create Role
        </Button>
      </div>

      {/* Custom Table */}
      {/* <CustomTable data={roles} columns={columns} enableFilters={false} /> */}
      <AntdTable data={roles} columns={roleColumns} pageSizeOptions={[10,20,30]} defaultPageSize={10}/>

      {/* Create/Edit Role Modal */}
      <RoleModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        getRoles={getRoles}
        permissions={permissions}
        currentRole={currentRole} // Pass the current role or null
      />
    </Container>
  );
};

export default Roles;
