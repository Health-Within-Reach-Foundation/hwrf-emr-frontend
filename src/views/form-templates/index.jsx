import React, { useState } from "react";
import EditableForm from "./editableForm";
import FormRender from "./formRender";
import { Card, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
  };
  const navigateToPatientForm = (id) => {
    navigate(`/form-templates/${id}`, { state: { editable: false } });
  };

  const navigateToEditableForm = (id) => {
    navigate(`/form-templates/${id}`, { state: { editable: true } });
  };
  return (
    <>
      <Row gutter={[16, 16]} style={{ padding: "20px" }}>
        <Col span={8}>
          <Card
            title="Patient Form"
            bordered
            style={{ height: "200px", textAlign: "center", cursor: "pointer" }}
            onClick={() => navigateToPatientForm(77879)}
          >
            Patient Form Content
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Default Form"
            bordered
            style={{ height: "200px", textAlign: "center", cursor: "pointer" }}
            onClick={() => navigateToEditableForm(77880)}
          >
            Default Form Content
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title="Create New Form"
            bordered
            style={{ height: "200px", textAlign: "center", cursor: "pointer" }}
            onClick={() => navigate("/form-templates/new")}
          >
            Create New Form Content
          </Card>
        </Col>
      </Row>

      {/* {isEditing ? (
        <>
          <EditableForm />
          <Button type="primary" onClick={toggleEditMode} style={{ marginTop: "10px" }}>
            Save
          </Button>
        </>
      ) : (
        <>
          <FormRender />
          <Button type="primary" onClick={toggleEditMode} style={{ marginTop: "10px" }}>
            Edit
          </Button>
        </>
      )} */}
    </>
  );
};

export default Index;
