// import React, { useState, useCallback } from "react";
// import { Table, Form, Select, Input, Button, Tooltip } from "antd";
// import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import debounce from "lodash/debounce";
// import {
//   medicineDoseOptions,
//   medicineFrequencyOptions,
//   medicineWhenOptions,
// } from "../../utilities/constants";

// const { TextArea } = Input;

// const EditableMedicineTable = ({ form, formField }) => {
//   console.log("Inside medicine table", formField);
//   const watchedMedicineList = Form.useWatch("medicine", form) || [];
//   const [medicineList, setMedicineList] = useState(watchedMedicineList);
//   const [drugOptions, setDrugOptions] = useState([]);
//   const [fetching, setFetching] = useState(false);

//   /** Function to Add a New Row */
//   const handleAddRow = () => {
//     const newRow = {
//       key: Date.now(),
//       medicine: "",
//       dose: "",
//       when: "",
//       frequency: "",
//       duration: "",
//       notes: "",
//     };
//     const updatedList = [...medicineList, newRow];
//     setMedicineList(updatedList);
//     form.setFieldsValue({ medicine: updatedList });
//   };

//   /** Function to Remove a Row */
//   const handleRemoveRow = (key) => {
//     const updatedList = medicineList.filter((item) => item.key !== key);
//     setMedicineList(updatedList);
//     form.setFieldsValue({ medicine: updatedList });
//   };

//   /** Fetch Medicine List from API */
//   const fetchDrugs = async (search) => {
//     if (!search) {
//       setDrugOptions([]);
//       return;
//     }
//     setFetching(true);
//     try {
//       const response = await axios.get(
//         `https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=${search}`
//       );
//       console.log("Response --> ", response);
//       const options =
//         response.data.approximateGroup?.candidate
//           ?.filter((drug) => drug.name) // Filter out objects without name property
//           .reduce((acc, drug) => {
//             if (!acc.some((item) => item.value === drug.name)) {
//               acc.push({ value: drug.name, label: drug.name });
//             }
//             return acc;
//           }, []) || [];
//       console.log("Options --> ", options);
//       setDrugOptions(options);
//     } catch (error) {
//       console.error("Error fetching drug data:", error);
//       setDrugOptions([]); // Reset options on error
//     } finally {
//       setFetching(false);
//     }
//   };

//   /** Debounce API Call to Reduce Requests */
//   const debounceFetcher = useCallback(debounce(fetchDrugs, 300), []);

//   /** Table Columns Definition */
//   const columns = [
//     {
//       title: "Medicine/Drug Type",
//       dataIndex: "medicineType",
//       width: 200,
//       render: (_, record, index) => (
//         <Form.Item
//           name={["medicine", index, "medicineType"]}
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Select
//             showSearch
//             placeholder="Select Medicine Type"
//             allowClear
//             options={
//               formField.find((field) => field.fieldName === "medicineType")
//                 ?.options
//             }
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Medicine/Drug",
//       dataIndex: "medicine",
//       width: 350,
//       render: (_, record, index) => (
//         <Form.Item
//           name={["medicine", index, "medicine"]}
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Select
//             showSearch
//             placeholder="Select Medicine"
//             allowClear
//             loading={fetching}
//             notFoundContent={fetching ? "Loading..." : "No results"}
//             onSearch={debounceFetcher}
//             filterOption={false}
//             options={drugOptions}
//             optionRender={(drug) => (
//               <Tooltip title={drug?.label} color="blue-inverse">
//                 <p title="">{drug?.label}</p>
//               </Tooltip>
//             )}
//           >
//             {/* {drugOptions.map((drug, index) => (
//               <Select.Option key={`${drug.label}-${index}`} value={drug.value}>
//                 <Tooltip title={drug.label} color="blue-inverse">
//                   <p>{drug.label}</p>
//                 </Tooltip>
//               </Select.Option>
//             ))} */}
//           </Select>
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Dose",
//       dataIndex: "dose",
//       width: 200,
//       render: (_, record, index) => (
//         <Form.Item
//           name={["medicine", index, "dose"]}
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Select
//             showSearch
//             placeholder="Select Dose"
//             options={medicineDoseOptions}
//             optionRender={(dose) => (
//               <Tooltip title={dose?.label} color="blue-inverse">
//                 <p title="">{dose?.label}</p>
//               </Tooltip>
//             )}
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "When",
//       dataIndex: "when",
//       width: 250,
//       render: (_, record, index) => (
//         <Form.Item
//           name={["medicine", index, "when"]}
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Select
//             showSearch
//             placeholder="Select Timing"
//             options={medicineWhenOptions}
//             optionRender={(when) => (
//               <Tooltip title={when?.label} color="blue-inverse">
//                 <p title="">{when?.label}</p>
//               </Tooltip>
//             )}
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Frequency",
//       dataIndex: "frequency",
//       width: 250,
//       render: (_, record, index) => (
//         <Form.Item
//           name={["medicine", index, "frequency"]}
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Select
//             showSearch
//             placeholder="Select Frequency"
//             options={medicineFrequencyOptions}
//             optionRender={(frequency) => (
//               <Tooltip title={frequency?.label} color="blue-inverse">
//                 <p title="">{frequency?.label}</p>
//               </Tooltip>
//             )}
//           />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Duration",
//       dataIndex: "duration",
//       width: 180,
//       render: (_, record, index) => (
//         <Form.Item
//           name={["medicine", index, "duration"]}
//           rules={[{ required: true, message: "Required" }]}
//         >
//           <Select showSearch placeholder="Select Duration">
//             <Select.Option value="5 Days">5 Days</Select.Option>
//             <Select.Option value="10 Days">10 Days</Select.Option>
//           </Select>
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Notes/Instructions",
//       dataIndex: "notes",
//       width: 250,
//       render: (_, record, index) => (
//         <Form.Item name={["medicine", index, "notes"]}>
//           <TextArea rows={1} placeholder="Add notes" />
//         </Form.Item>
//       ),
//     },
//     {
//       title: "Action",
//       dataIndex: "action",
//       width: 120,
//       render: (_, record) => (
//         <Form.Item>
//           <Button
//             danger
//             onClick={() => handleRemoveRow(record.key)}
//             icon={<DeleteOutlined />}
//           />
//         </Form.Item>
//       ),
//     },
//   ];

//   return (
//     <>
//       <div className="d-flex justify-content-end mb-3">
//         <Button
//           onClick={handleAddRow}
//           icon={<PlusOutlined />}
//           type="primary"
//           className="bg-primary btn-primary w-auto rounded-0"
//           style={{ marginTop: 10 }}
//         >
//           Add Prescription
//         </Button>
//       </div>
//       <div className="antd-table-container">
//         <Table
//           dataSource={medicineList}
//           columns={columns}
//           rowKey="key"
//           pagination={false}
//           size="small"
//           scroll={{ x: 1200 }}
//         />
//       </div>
//     </>
//   );
// };

// export default EditableMedicineTable;

import React, { useState, useRef, useEffect } from "react";
import {
  Table,
  Form,
  Select,
  Input,
  Button,
  Tooltip,
  Divider,
  Space,
} from "antd";
import { PlusOutlined, DeleteOutlined, SaveOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import formFieldsServices from "../../api/form-fields.services";

const { TextArea } = Input;

const EditableMedicineTable = ({ form, formField, disabled = false }) => {
  /** Fetch options for each column from formField */
  const getOptions = (fieldName) => {
    return (
      formField.find((field) => field.fieldName === fieldName)?.options || []
    );
  };
  console.log("Inside medicine table", form.getFieldsValue());

  const watchedMedicineList = Form.useWatch("medicine", form) || [];
  console.log("watchedMedicineList", watchedMedicineList);
  const [medicineList, setMedicineList] = useState(watchedMedicineList || []);
  const [medicineOptions, setMedicineOptions] = useState(
    getOptions("medicine") || []
  );
  const [newMedicines, setNewMedicines] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  /** Function to Add a New Row */
  const handleAddRow = () => {
    const newRow = {
      key: Date.now(),
      medicineType: "",
      medicine: "",
      dose: "",
      when: "",
      frequency: "",
      duration: "",
      notes: "",
    };
    const updatedList = [...medicineList, newRow];
    setMedicineList(updatedList);
    form.setFieldsValue({ medicine: updatedList });
  };

  /** Function to Remove a Row */
  const handleRemoveRow = (key) => {
    const updatedList = medicineList.filter((item) => item.key !== key);
    setMedicineList(updatedList);
    form.setFieldsValue({ medicine: updatedList });
  };

  /** Add Medicine to Local Options */
  const addMedicineLocally = () => {
    if (!name.trim()) return;
    const newMedicine = { label: name, value: name };
    setMedicineOptions((prev) => [...prev, newMedicine]);
    setNewMedicines((prev) => [...prev, newMedicine]);
    setName("");
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  /** Save New Medicines (Batch) */
  const saveMedicines = async () => {
    if (newMedicines.length === 0) {
      toast.error("No new medicines to save.");
      return;
    }
    setLoading(true);
    try {
      const medicineFormField = formField.find(
        (field) => field.fieldName === "medicine"
      );
      console.log("new medicines", newMedicines);
      const updateBody = {
        formId: medicineFormField.id,
        fieldName: medicineFormField.fieldName,
        options: [...medicineFormField.options, ...newMedicines], // Save all updated options
      };
      console.log("updated medicine options", updateBody);
      const response = await formFieldsServices.updateFormFieldsOptions(
        updateBody
      );
      if (response.success) {
        setTimeout(() => {
          setNewMedicines([]);
          toast.success("New medicines saved!");
          setLoading(false);
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save complaints!");
    } finally {
      setLoading(false);
    }
  };

  /** Table Columns Definition */
  const columns = [
    {
      title: "Medicine/Drug Type",
      dataIndex: "medicineType",
      width: 200,
      render: (_, record, index) => (
        <Form.Item
          name={["medicine", index, "medicineType"]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select Medicine Type"
            allowClear
            options={getOptions("medicineType")}
          />
        </Form.Item>
      ),
    },
    {
      title: "Medicine/Drug",
      dataIndex: "medicine",
      width: 600,
      render: (_, record, index) => (
        <Form.Item
          name={["medicine", index, "medicine"]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select Medicine"
            allowClear
            options={medicineOptions}
            // options={[...getOptions("medicine"), ...newMedicines]}
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: "8px 0" }} />
                <Space style={{ padding: "0 8px 4px", display: "flex" }}>
                  <Input
                    placeholder="Add new medicine"
                    ref={inputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <Button type="primary" onClick={addMedicineLocally}>
                    <PlusOutlined />
                  </Button>
                </Space>
                {newMedicines.length > 0 && (
                  <div style={{ padding: "8px 8px 4px", textAlign: "right" }}>
                    <Tooltip
                      title="Save newly added medicines"
                      color="blue-inverse"
                    >
                      <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        loading={loading}
                        onClick={saveMedicines}
                      >
                        Save Medicines
                      </Button>
                    </Tooltip>
                  </div>
                )}
              </>
            )}
          />
        </Form.Item>
      ),
    },
    {
      title: "Dose",
      dataIndex: "dose",
      width: 350,
      render: (_, record, index) => (
        <Form.Item
          name={["medicine", index, "dose"]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select Dose"
            options={getOptions("medicineDose")}
          />
        </Form.Item>
      ),
    },
    {
      title: "When",
      dataIndex: "when",
      width: 400,
      render: (_, record, index) => (
        <Form.Item
          name={["medicine", index, "when"]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select Timing"
            options={getOptions("medicineWhen")}
          />
        </Form.Item>
      ),
    },
    {
      title: "Frequency",
      dataIndex: "frequency",
      width: 400,
      render: (_, record, index) => (
        <Form.Item
          name={["medicine", index, "frequency"]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select Frequency"
            options={getOptions("medicineFrequency")}
          />
        </Form.Item>
      ),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      width: 300,
      render: (_, record, index) => (
        <Form.Item
          name={["medicine", index, "duration"]}
          rules={[{ required: true, message: "Required" }]}
        >
          <Select
            showSearch
            disabled={disabled}
            placeholder="Select Duration"
            options={getOptions("medicineDuration")}
          />
        </Form.Item>
      ),
    },
    {
      title: "Notes/Instructions",
      dataIndex: "notes",
      width: 700,
      render: (_, record, index) => (
        <Form.Item name={["medicine", index, "notes"]}>
          <TextArea rows={1} placeholder="Add notes" disabled={disabled} />
        </Form.Item>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 120,
      render: (_, record) => (
        <Form.Item>
          <Button
            danger
            onClick={() => handleRemoveRow(record.key)}
            icon={<DeleteOutlined />}
            disabled={disabled}
          />
        </Form.Item>
      ),
    },
  ];
  useEffect(() => {
    if (watchedMedicineList.length > 0) {
      setMedicineList(watchedMedicineList);
    }
  }, [watchedMedicineList]);
  return (
    <>
      <div className="d-flex justify-content-end mb-3">
        <Button
          className="btn-primary bg-primary rounded-0"
          onClick={handleAddRow}
          icon={<PlusOutlined />}
          type="primary"
          disabled={disabled}
        >
          Add Prescription
        </Button>
      </div>
      <div className="antd-table-container">
        <Table
          dataSource={medicineList}
          columns={columns}
          rowKey="key"
          pagination={false}
          size="small"
          scroll={{ x: 1800 }}
        />
      </div>
    </>
  );
};

export default EditableMedicineTable;
