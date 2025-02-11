// import React, { useState } from "react";
// import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
// import dayjs from "dayjs"; // Import dayjs
// import campManagementService from "../../api/camp-management-service";
// import toast from "react-hot-toast";

// const { Option } = Select;

// const CampModalForm = ({
//   show,
//   onClose,
//   users,
//   specialties,
//   onSave,
//   editCampData,
// }) => {
//   const [form] = Form.useForm();
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const values = await form.validateFields();

//       const formData = {
//         ...values,
//         startDate: values.startDate.format("YYYY-MM-DD"), // Format to YYYY-MM-DD
//         endDate: values.endDate.format("YYYY-MM-DD"), // Format to YYYY-MM-DD
//       };
//       let response;
//       if (editCampData) {
      
//         response = await campManagementService.updateCampById(
//           editCampData.id,
//           formData
//         );
//       } else {
//         response = await campManagementService.createCamp(formData);
//       }
//       if (response?.success) {
//         toast.success(response.message);
//       } else {
//         toast.error(response?.error);
//       }
//       onClose();
//       setLoading(false);
//     } catch (error) {
//       console.error("Validation failed:", error);
//     } finally {
//       onSave();
//       setLoading(false);
//     }
//   };

//   console.log("edit camp data -->", editCampData);
//   return (
//     <Modal
//       title={editCampData !== null ? "Edit Camp" : "Create a New Camp"}
//       open={show}
//       onCancel={onClose}
//       footer={null}
//     >
//       <Form
//         form={form}
//         layout="vertical"
//         initialValues={{
//           // name: "",
//           // location: "",
//           // city: "",
//           // vans: [],
//           // specialties: [],
//           // users: [],
//           // startDate: dayjs(), // Default today's date
//           // endDate: dayjs(), // Default today's date

//           name: editCampData?.name || "",
//           location: editCampData?.location || "",
//           city: editCampData?.city || "",
//           vans: editCampData?.vans || [],
//           specialties:
//             editCampData?.specialties.map((service) => service.id) || [],
//           users: editCampData?.users.map((user) => user.id) || [],
//           startDate: editCampData?.startDate
//             ? dayjs(editCampData.startDate)
//             : dayjs(),
//           endDate: editCampData?.endDate
//             ? dayjs(editCampData.endDate)
//             : dayjs(),
//         }}
//       >
//         {/* Start Date */}
//         <Form.Item
//           label="Start Date"
//           name="startDate"
//           rules={[{ required: true, message: "Please select the start date!" }]}
//         >
//           <DatePicker
//             className="w-100"
//             format="YYYY-MM-DD"
//             defaultValue={dayjs()} // Use dayjs for defaultValue
//           />
//         </Form.Item>

//         {/* End Date */}
//         <Form.Item
//           label="End Date"
//           name="endDate"
//           className="w-100"
//           rules={[{ required: true, message: "Please select the end date!" }]}
//         >
//           <DatePicker
//             className="w-100"
//             format="YYYY-MM-DD"
//             defaultValue={dayjs()} // Use dayjs for defaultValue
//           />
//         </Form.Item>

//         {/* Other Fields */}
//         <Form.Item
//           label="Camp Name"
//           name="name"
//           rules={[{ required: true, message: "Please enter the camp name!" }]}
//         >
//           <Input placeholder="Enter camp name" />
//         </Form.Item>

//         <Form.Item
//           label="Location"
//           name="location"
//           rules={[{ required: true, message: "Please enter the location!" }]}
//         >
//           <Input placeholder="Enter location" />
//         </Form.Item>

//         <Form.Item
//           label="Camp City"
//           name="city"
//           rules={[{ required: true, message: "Please enter the city!" }]}
//         >
//           <Input placeholder="Enter city" />
//         </Form.Item>

//         <Form.Item
//           label="Vans"
//           name="vans"
//           rules={[
//             { required: true, message: "Please select at least one van!" },
//           ]}
//         >
//           <Select
//             mode="multiple"
//             placeholder="Select Van"
//             allowClear
//             options={[
//               { value: "Van 1", label: "Van 1" },
//               { value: "Van 2", label: "Van 2" },
//               { value: "Van 3", label: "Van 3" },
//             ]}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Services"
//           name="specialties"
//           rules={[
//             { required: true, message: "Please select at least one service!" },
//           ]}
//         >
//           <Select
//             mode="multiple"
//             placeholder="Select services"
//             allowClear
//             options={specialties}
//           />
//         </Form.Item>

//         <Form.Item
//           label="Staff Attending"
//           name="users"
//           rules={[
//             {
//               required: true,
//               message: "Please select at least one staff member!",
//             },
//           ]}
//         >
//           <Select
//             mode="multiple"
//             placeholder="Select staff"
//             allowClear
//             options={users}
//           />
//         </Form.Item>

//         <Form.Item>
//           <Button
//             type="primary"
//             onClick={handleSubmit}
//             style={{ marginRight: 8 }}
//             loading={loading}
//           >
//             {editCampData === null ? "Submit" : "Update"}
//           </Button>
//           <Button onClick={onClose} loading={loading}>
//             Cancel
//           </Button>
//         </Form.Item>
//       </Form>
//     </Modal>
//   );
// };

// export default CampModalForm;

import React, { useState } from "react";
import { Modal, Form, Input, Button, Select, DatePicker } from "antd";
import dayjs from "dayjs"; // Import dayjs
import campManagementService from "../../api/camp-management-service";
import toast from "react-hot-toast";

const { Option } = Select;

const CampModalForm = ({
  show,
  onClose,
  users,
  specialties,
  onSave,
  editCampData,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const formData = {
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
      };

      let response;
      if (editCampData) {
        response = await campManagementService.updateCampById(
          editCampData.id,
          formData
        );
      } else {
        response = await campManagementService.createCamp(formData);
      }

      if (response?.success) {
        toast.success(response.message);
      } else {
        toast.error(response?.error || "An error occurred");
      }

      onClose();
    } catch (error) {
      console.error("Validation failed:", error);
    } finally {
      onSave();
      setLoading(false);
    }
  };

  // Disable dates for endDate to prevent selection before startDate
  const disableEndDate = (current) => {
    const startDate = form.getFieldValue("startDate");
    return current && current.isBefore(startDate, "day");
  };

  return (
    <Modal
      title={editCampData ? "Edit Camp" : "Create a New Camp"}
      open={show}
      onCancel={onClose}
      footer={null}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="horizontal"
        initialValues={{
          name: editCampData?.name || "",
          location: editCampData?.location || "",
          city: editCampData?.city || "",
          vans: editCampData?.vans || [],
          specialties:
            editCampData?.specialties.map((service) => service.id) || [],
          users: editCampData?.users.map((user) => user.id) || [],
          startDate: editCampData?.startDate
            ? dayjs(editCampData.startDate)
            : dayjs(),
          endDate: editCampData?.endDate
            ? dayjs(editCampData.endDate)
            : dayjs(),
        }}
      >
        {/* Start Date */}
        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: "Please select the start date!" }]}
        >
          <DatePicker
            className="w-100"
            format="YYYY-MM-DD"
            defaultValue={dayjs()}
          />
        </Form.Item>

        {/* End Date */}
        <Form.Item
          label="End Date"
          name="endDate"
          rules={[
            { required: true, message: "Please select the end date!" },
            {
              validator: (_, value) => {
                const startDate = form.getFieldValue("startDate");
                if (value && value.isBefore(startDate, "day")) {
                  return Promise.reject(
                    new Error("End date cannot be earlier than start date!")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker
            className="w-100"
            format="YYYY-MM-DD"
            defaultValue={dayjs()}
            disabledDate={disableEndDate}
          />
        </Form.Item>

        {/* Other Fields */}
        <Form.Item
          label="Camp Name"
          name="name"
          rules={[{ required: true, message: "Please enter the camp name!" }]}
        >
          <Input placeholder="Enter camp name" />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please enter the location!" }]}
        >
          <Input placeholder="Enter location" />
        </Form.Item>

        <Form.Item
          label="Camp City"
          name="city"
          rules={[{ required: true, message: "Please enter the city!" }]}
        >
          <Input placeholder="Enter city" />
        </Form.Item>

        <Form.Item
          label="Vans"
          name="vans"
          rules={[
            { required: true, message: "Please select at least one van!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select Van"
            allowClear
            options={[
              { value: "BharatBenz", label: "BharatBenz" },
              { value: "Force", label: "Force" },
              { value: "TATA", label: "TATA" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Services"
          name="specialties"
          rules={[
            { required: true, message: "Please select at least one service!" },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select services"
            allowClear
            options={specialties}
          />
        </Form.Item>

        <Form.Item
          label="Staff Attending"
          name="users"
          rules={[
            {
              required: true,
              message: "Please select at least one staff member!",
            },
          ]}
        >
          <Select
            mode="multiple"
            placeholder="Select staff"
            allowClear
            options={users}
          />
        </Form.Item>

        <Form.Item className="d-flex justify-content-end">
          <Button
            type="primary"
            onClick={handleSubmit}
            style={{ marginRight: 8 }}
            loading={loading}
          >
            {editCampData ? "Update" : "Submit"}
          </Button>
          <Button onClick={onClose} loading={loading}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CampModalForm;
