// import React, { useState } from "react";
// import EditableForm from "./editableForm";
// import FormRender from "./formRender";
// import { Card, Button, Row, Col } from "antd";
// import { useNavigate } from "react-router-dom";

// const Index = () => {
//   const navigate = useNavigate();
//   const [isEditing, setIsEditing] = useState(false);

//   const toggleEditMode = () => {
//     setIsEditing((prev) => !prev);
//   };
//   const navigateToPatientForm = (id) => {
//     navigate(`/form-templates/${id}`, { state: { editable: false } });
//   };

//   const navigateToEditableForm = (id) => {
//     navigate(`/form-templates/${id}`, { state: { editable: true } });
//   };
//   return (
//     <>
//       <Row gutter={[16, 16]} style={{ padding: "20px" }}>
//         <Col span={8}>
//           <Card
//             title="Patient Form"
//             bordered
//             style={{ height: "200px", textAlign: "center", cursor: "pointer" }}
//             onClick={() => navigateToPatientForm(77879)}
//           >
//             Patient Form Content
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card
//             title="Default Form"
//             bordered
//             style={{ height: "200px", textAlign: "center", cursor: "pointer" }}
//             onClick={() => navigateToEditableForm(77880)}
//           >
//             Default Form Content
//           </Card>
//         </Col>
//         <Col span={8}>
//           <Card
//             title="Create New Form"
//             bordered
//             style={{ height: "200px", textAlign: "center", cursor: "pointer" }}
//             onClick={() => navigate("/form-templates/new")}
//           >
//             Create New Form Content
//           </Card>
//         </Col>
//       </Row>

//       {/* {isEditing ? (
//         <>
//           <EditableForm />
//           <Button type="primary" onClick={toggleEditMode} style={{ marginTop: "10px" }}>
//             Save
//           </Button>
//         </>
//       ) : (
//         <>
//           <FormRender />
//           <Button type="primary" onClick={toggleEditMode} style={{ marginTop: "10px" }}>
//             Edit
//           </Button>
//         </>
//       )} */}
//     </>
//   );
// };

// export default Index;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Row, Col, Container } from "react-bootstrap";
import adminServices from "../../api/admin-services"; // Import your API service
import toast from "react-hot-toast";
import { Loading } from "../../components/loading";
import DateCell from "../../components/date-cell";

const FormTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await adminServices.getAllFormTemplates();
        setTemplates(response.data);
      } catch (error) {
        toast.error("Failed to load templates.");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleCardClick = (template) => {
    navigate(`/form-templates/${template.id}`, { state: { template } });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container className="my-4">
      <h1 className="text-center mb-4">Form Templates</h1>
      <Row className="g-4">
        {templates.map((template) => (
          <Col key={template.id} md={4} sm={6} xs={12}>
            <Card
              className="h-100 shadow-sm cursor-pointer"
              onClick={() => handleCardClick(template)}
            >
              <Card.Body>
                <Card.Title className="text-primary">
                  {template.name}
                </Card.Title>
                <div>
                  <strong>Created At:</strong>{" "}
                  <DateCell date={template.createdAt} showTime/>
                </div>
                <div>
                  <strong>Updated At:</strong>{" "}
                  <DateCell date={template.updatedAt} showTime/>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default FormTemplates;
