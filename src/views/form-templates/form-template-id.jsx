import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DynamicFields from "./editableForm";
import adminServices from "../../api/admin-services";
import { Loading } from "../../components/loading";

const FormTemplateById = () => {
  const { formTemplateId } = useParams(); // Extract formId from route params
  const [loading, setLoading] = useState(false);
  const fetchFormTemplateById = async () => {
    setLoading(true);
    try {
      const response = await adminServices.getFormTemplateById(formTemplateId);
      console.groupCollapsed("form templated fetched",response.data);
    } catch (error) {
      console.error("Error while fetching form template --> ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormTemplateById();
  }, [formTemplateId]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <DynamicFields />
    </div>
  );
};

export default FormTemplateById;
