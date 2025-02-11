import React, { useEffect, useState } from "react";
import formFieldsService from "../api/form-fields.services";
import { Collapse, Input, Button, Checkbox, Card } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "../utilities/AuthProvider";
import TextArea from "antd/es/input/TextArea";
import toast from "react-hot-toast";
import { Loading } from "../components/loading";
import { transformText } from "../utilities/utility-function";
import Search from "antd/es/transfer/search";

const { Panel } = Collapse;

const ManageForms = () => {
  const [forms, setForms] = useState([]);
  const { userRoles } = useAuth();
  const [loading, setLoading] = useState(true);
  const [apiCallLoading, setApiCallLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState({});

  const fetchFormFields = async () => {
    try {
      setLoading(true);
      const response = await formFieldsService.getAllFormFields();
      console.log("Form fields:", response.data);
      setForms(response.data);
    } catch (error) {
      console.error("Failed to fetch form fields:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormFields();
  }, []);

  const handleOptionChange = (formIndex, fieldIndex, optionIndex, newLabel) => {
    const updatedForms = [...forms];
    const option =
      updatedForms[formIndex].formFieldData[fieldIndex].options[optionIndex];
    option.label = newLabel;
    option.value = newLabel;
    setForms(updatedForms);
  };

  const handleAddOption = (formIndex, fieldIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].formFieldData[fieldIndex].options.push({
      lock: false,
      label: "",
      value: "",
    });
    setForms(updatedForms);
  };

  const handleDeleteOption = (formIndex, fieldIndex, optionIndex) => {
    const updatedForms = [...forms];
    updatedForms[formIndex].formFieldData[fieldIndex].options.splice(
      optionIndex,
      1
    );
    setForms(updatedForms);
  };

  const handleSave = async (formIndex, fieldIndex) => {
    const formFieldId = forms[formIndex].id;
    const formFieldDetails = forms[formIndex].formFieldData;
    try {
      setApiCallLoading(true);
      console.log(
        "formFieldId and formFieldDetails",
        formFieldId,
        formFieldDetails
      );
      const response = await formFieldsService.updateFormField(formFieldId, {
        formFieldData: formFieldDetails,
      });
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      toast.error("Internal server error");
      console.error("Failed to update form field:", error.message);
    } finally {
      setApiCallLoading(false);
    }
  };

  const handleSearchChange = (formIndex, fieldIndex, value) => {
    const updatedSearchQueries = { ...searchQueries };
    if (!updatedSearchQueries[formIndex]) {
      updatedSearchQueries[formIndex] = {};
    }
    updatedSearchQueries[formIndex][fieldIndex] = value;
    setSearchQueries(updatedSearchQueries);
  };

  const getFilteredOptions = (formIndex, fieldIndex) => {
    const searchQuery =
      searchQueries[formIndex] && searchQueries[formIndex][fieldIndex]
        ? searchQueries[formIndex][fieldIndex]
        : "";
    return forms[formIndex].formFieldData[fieldIndex].options.filter((option) =>
      option.value.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Card title="Manage Forms">
      <div className="d-flex flex-column gap-3">
        {forms.map((form, formIndex) => (
          <Collapse key={form.id}>
            <Panel header={form.formName} key={form.id}>
              {form.formFieldData.map((field, fieldIndex) => (
                <div key={field.fieldName} style={{ marginBottom: 16 }}>
                  <div className="w-100 d-flex justify-content-between mb-3">
                    <h4 style={{ width: "60%" }}>
                      {transformText(field.fieldName)} Options
                    </h4>
                    <Search
                      placeholder="Search options"
                      value={
                        searchQueries[formIndex] &&
                        searchQueries[formIndex][fieldIndex]
                          ? searchQueries[formIndex][fieldIndex]
                          : ""
                      }
                      enterButton={"Search"}
                      onChange={(e) =>
                        handleSearchChange(
                          formIndex,
                          fieldIndex,
                          e.target.value
                        )
                      }
                      className="w-100"
                      style={{ width: "60%", marginBottom: 16 }}
                    />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 16,
                    }}
                  >
                    {getFilteredOptions(formIndex, fieldIndex).map(
                      (option, optionIndex) => (
                        <div
                          key={optionIndex}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            border: "1px solid #d9d9d9",
                            padding: 8,
                            borderRadius: 4,
                          }}
                        >
                          <TextArea
                            value={option.label}
                            onChange={(e) =>
                              handleOptionChange(
                                formIndex,
                                fieldIndex,
                                optionIndex,
                                e.target.value
                              )
                            }
                            rows={2}
                            disabled={
                              !userRoles.includes("superadmin") && option.lock
                            }
                            style={{ width: 200 }}
                            placeholder="Option Label"
                          />
                          {userRoles.includes("superadmin") && (
                            <Checkbox
                              checked={option.lock}
                              onChange={(e) => {
                                const updatedForms = [...forms];
                                updatedForms[formIndex].formFieldData[
                                  fieldIndex
                                ].options[optionIndex].lock = e.target.checked;
                                setForms(updatedForms);
                              }}
                            >
                              Lock
                            </Checkbox>
                          )}
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() =>
                              handleDeleteOption(
                                formIndex,
                                fieldIndex,
                                optionIndex
                              )
                            }
                            disabled={
                              !userRoles.includes("superadmin") && option.lock
                            }
                            danger
                            loading={apiCallLoading}
                          />
                        </div>
                      )
                    )}
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleAddOption(formIndex, fieldIndex)}
                      type="dashed"
                      className="border-primary text-primary btn-outline-primary rounded-0"
                      loading={apiCallLoading}
                    >
                      Add Option
                    </Button>
                    <Button
                      onClick={() => handleSave(formIndex, fieldIndex)}
                      type="primary"
                      className="bg-primary btn-primary rounded-0"
                      loading={apiCallLoading}
                      style={{ marginLeft: 8 }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              ))}
            </Panel>
          </Collapse>
        ))}
      </div>
    </Card>
  );
};

export default ManageForms;
