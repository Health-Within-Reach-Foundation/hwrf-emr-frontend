// import React, { useEffect, useState } from "react";
// import { Drawer, Input, TreeSelect, Select, Button } from "antd";
// import { Form } from "react-bootstrap";
// import patientServices from "../api/patient-services";
// import toast from "react-hot-toast";

// const PatientDiagnosisForm = ({
//   isEdit,
//   drawerVisible,
//   onClose,
//   diagnosisData,
//   onSave,
//   patientData,
// }) => {
//   const [loading, setLoading] = useState(false);
//   console.log("diagnosis data -->", diagnosisData);
//   const dentalQuadrantOptions = [
//     {
//       title: "Upper Left",
//       value: "upperLeft",
//       children: Array.from({ length: 8 }, (_, i) => ({
//         title: `Tooth ${i + 1}`,
//         value: `upperLeft-tooth${i + 1}`,
//       })),
//     },
//     {
//       title: "Upper Right",
//       value: "upperRight",
//       children: Array.from({ length: 8 }, (_, i) => ({
//         title: `Tooth ${i + 1}`,
//         value: `upperRight-tooth${i + 1}`,
//       })),
//     },
//     {
//       title: "Lower Left",
//       value: "lowerLeft",
//       children: Array.from({ length: 8 }, (_, i) => ({
//         title: `Tooth ${i + 1}`,
//         value: `lowerLeft-tooth${i + 1}`,
//       })),
//     },
//     {
//       title: "Lower Right",
//       value: "lowerRight",
//       children: Array.from({ length: 8 }, (_, i) => ({
//         title: `Tooth ${i + 1}`,
//         value: `lowerRight-tooth${i + 1}`,
//       })),
//     },
//   ];

//   const [formState, setFormState] = useState({
//     complaints: [],
//     treatment: [],
//     dentalQuadrant: [],
//     xrayStatus: false,
//     xray: [],
//     notes: "",
//     currentStatus: [],
//   });

//   useEffect(() => {
//     if (isEdit && diagnosisData) {
//       const {
//         createdAt,
//         updatedAt,
//         appointmentId,
//         treatments,
//         patientId,
//         id,
//         ...filteredData
//       } = diagnosisData;
//       setFormState({ ...filteredData, xray: [] });
//     } else {
//       setFormState({
//         complaints: [],
//         treatment: [],
//         dentalQuadrant: [],
//         xrayStatus: false,
//         xray: [],
//         notes: "",
//       });
//     }
//   }, [isEdit, diagnosisData]);
//   const handleInputChange = (key, value) => {
//     setFormState((prev) => ({ ...prev, [key]: value }));
//   };
//   const handleSubmit = async () => {
//     try {
//       setLoading(true);

//       // Prepare FormData object
//       const formData = new FormData();

//       // Add form fields to FormData
//       Object.entries(formState).forEach(([key, value]) => {
//         if (key === "xray" && Array.isArray(value)) {
//           // Append files for xray
//           value.forEach((file) => {
//             formData.append("xrayFiles", file); // Key matches backend route
//           });
//         } else {
//           formData.append(key, value);
//         }
//       });

//       // Make API call to save diagnosis
//       let response;
//       if (isEdit) {
//         response = await patientServices.updatePatientDiagnosis(
//           diagnosisData.id,
//           formData
//         );
//       } else {
//         response = await patientServices.addPatientDiagnosis(formData);
//       }

//       // Handle response
//       if (response?.success) {
//         toast.success(response.message || "Diagnosis saved successfully!");
//       } else {
//         toast.error(
//           response?.message ||
//             "Failed to save diagnosis. Please try again later."
//         );
//       }
//     } catch (error) {
//       console.error("Error saving diagnosis:", error);
//       toast.error("An unexpected error occurred. Please try again.");
//     } finally {
//       setLoading(false);
//       onClose();
//     }
//   };

//   return (
//     <Drawer
//       title={isEdit ? "Edit Diagnosis" : "Add Diagnosis"}
//       placement="right"
//       onClose={onClose}
//       open={drawerVisible}
//       width={600}
//     >
//       <Form>
//         <Form.Group className="py-2">
//           <Form.Label>Complaints</Form.Label>
//           <Select
//             mode="multiple"
//             value={formState.complaints}
//             onChange={(value) => handleInputChange("complaints", value)}
//             options={[
//               { value: "Tooth Ache", label: "Tooth Ache" },
//               { value: "Tooth Missing", label: "Tooth Missing" },
//               { value: "Bad Breath", label: "Bad Breath" },
//             ]}
//             className="w-100"
//           />
//         </Form.Group>
//         <Form.Group className="py-2">
//           <Form.Label>Treatment</Form.Label>
//           <Select
//             mode="multiple"
//             value={formState.treatment}
//             onChange={(value) => handleInputChange("treatment", value)}
//             options={[
//               { value: "Scaling Regular", label: "Scaling Regular" },
//               { value: "Scaling Complex", label: "Scaling Complex" },
//               { value: "RC Simple", label: "RC Simple" },
//             ]}
//             className="w-100"
//           />
//         </Form.Group>
//         <Form.Group className="py-2">
//           <Form.Label>Dental Quadrant</Form.Label>
//           <TreeSelect
//             treeData={dentalQuadrantOptions}
//             value={formState?.dentalQuadrant}
//             onChange={(value) =>
//               setFormState((prev) => ({ ...prev, dentalQuadrant: value }))
//             }
//             treeCheckable={true}
//             showCheckedStrategy={TreeSelect.SHOW_PARENT}
//             placeholder="Please select"
//             style={{ width: "100%" }}
//           />
//         </Form.Group>
//         <Form.Group className="py-2">
//           <Form.Check
//             type="checkbox"
//             label="X-ray Status"
//             checked={formState?.xrayStatus}
//             onChange={(e) =>
//               setFormState((prev) => ({
//                 ...prev,
//                 xrayStatus: e.target.checked,
//               }))
//             }
//           />
//         </Form.Group>
//         {formState.xrayStatus && (
//           <Form.Group className="py-2">
//             <Form.Label>File</Form.Label>
//             <Form.Control
//               type="file"
//               multiple
//               onChange={(e) =>
//                 setFormState((prev) => ({
//                   ...prev,
//                   xray: Array.from(e.target.files), // Store all selected files
//                 }))
//               }
//             />
//           </Form.Group>
//         )}

//         <Form.Group className="py-2">
//           <Form.Label>Current Status</Form.Label>
//           <Select
//             mode="multiple"
//             value={formState?.currentStatus}
//             onChange={(value) =>
//               setFormState((prev) => ({ ...prev, currentStatus: value }))
//             }
//             placeholder="Select Status"
//             style={{ width: "100%" }}
//             options={[
//               { value: "Completed", label: "Completed" },
//               { value: "Pending", label: "Pending" },
//               { value: "Cancelled", label: "Cancelled" },
//             ]}
//           />
//         </Form.Group>

//         <Form.Group className="py-2">
//           <Form.Label>Notes</Form.Label>
//           <Input.TextArea
//             value={formState.notes}
//             onChange={(e) => handleInputChange("notes", e.target.value)}
//           />
//         </Form.Group>
//         <Button className="mt-3" onClick={handleSubmit} loading={loading}>
//           {isEdit ? "Update" : "Add"}
//         </Button>
//       </Form>
//     </Drawer>
//   );
// };

// export default PatientDiagnosisForm;

import React, { useEffect, useState } from "react";
import { Drawer, Input, TreeSelect, Select, Button } from "antd";
import { Form } from "react-bootstrap";
import patientServices from "../api/patient-services";
import toast from "react-hot-toast";

const PatientDiagnosisForm = ({
  isEdit,
  drawerVisible,
  onClose,
  diagnosisData,
  onSave,
  patientData,
}) => {
  const [loading, setLoading] = useState(false);
  // console.log(patientData)
  const dentalQuadrantOptions = [
    {
      title: "Upper Left",
      value: "upperLeft",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `upperLeft-tooth${i + 1}`,
      })),
    },
    {
      title: "Upper Right",
      value: "upperRight",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `upperRight-tooth${i + 1}`,
      })),
    },
    {
      title: "Lower Left",
      value: "lowerLeft",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `lowerLeft-tooth${i + 1}`,
      })),
    },
    {
      title: "Lower Right",
      value: "lowerRight",
      children: Array.from({ length: 8 }, (_, i) => ({
        title: `Tooth ${i + 1}`,
        value: `lowerRight-tooth${i + 1}`,
      })),
    },
  ];

  const [formState, setFormState] = useState({
    complaints: [],
    treatment: [],
    dentalQuadrant: [],
    xrayStatus: false,
    xray: [],
    notes: "",
    currentStatus: [],
  });

  useEffect(() => {
    if (isEdit && diagnosisData) {
      const {
        createdAt,
        updatedAt,
        appointmentId,
        treatments,
        patientId,
        id,
        additionalDetails,
        ...filteredData
      } = diagnosisData;
      setFormState({ ...filteredData, xray: [] });
    } else {
      setFormState({
        complaints: [],
        treatment: [],
        dentalQuadrant: [],
        xrayStatus: false,
        xray: [],
        notes: "",
        currentStatus: [],
      });
    }
  }, [isEdit, diagnosisData]);

  const handleInputChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Prepare FormData object
      const formData = new FormData();

      // Add form fields to FormData
      Object.entries(formState).forEach(([key, value]) => {
        if (key === "xray" && Array.isArray(value)) {
          // Append files for xray
          value.forEach((file) => {
            formData.append("xrayFiles", file);
          });
        } else if (Array.isArray(value)) {
          // Append arrays as JSON
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Make API call to save diagnosis
      let response;
      if (isEdit) {
        response = await patientServices.updatePatientDiagnosis(
          diagnosisData.id,
          formData
        );
      } else {
        formData.append("patientId", patientData.id);
        response = await patientServices.addPatientDiagnosis(formData);
      }

      if (response?.success) {
        toast.success(response.message || "Diagnosis saved successfully!");
        onSave(); // Callback after successful save
      } else {
        toast.error(response?.message || "Failed to save diagnosis.");
      }
    } catch (error) {
      console.error("Error saving diagnosis:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Drawer
      title={isEdit ? "Edit Diagnosis" : "Add Diagnosis"}
      placement="right"
      onClose={onClose}
      open={drawerVisible}
      width={600}
    >
      <Form>
        <Form.Group className="py-2">
          <Form.Label>Complaints</Form.Label>
          <Select
            mode="multiple"
            value={formState.complaints}
            onChange={(value) => handleInputChange("complaints", value)}
            options={[
              { value: "Tooth Ache", label: "Tooth Ache" },
              { value: "Tooth Missing", label: "Tooth Missing" },
              { value: "Bad Breath", label: "Bad Breath" },
            ]}
            className="w-100"
          />
        </Form.Group>
        <Form.Group className="py-2">
          <Form.Label>Treatment</Form.Label>
          <Select
            mode="multiple"
            value={formState.treatment}
            onChange={(value) => handleInputChange("treatment", value)}
            options={[
              { value: "Scaling Regular", label: "Scaling Regular" },
              { value: "Scaling Complex", label: "Scaling Complex" },
              { value: "RC Simple", label: "RC Simple" },
            ]}
            className="w-100"
          />
        </Form.Group>
        <Form.Group className="py-2">
          <Form.Label>Dental Quadrant</Form.Label>
          <TreeSelect
            treeData={dentalQuadrantOptions}
            value={formState?.dentalQuadrant}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, dentalQuadrant: value }))
            }
            treeCheckable={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder="Select teeth"
            style={{ width: "100%" }}
          />
        </Form.Group>
        <Form.Group className="py-2">
          <Form.Check
            type="checkbox"
            label="X-ray Status"
            checked={formState?.xrayStatus}
            onChange={(e) =>
              setFormState((prev) => ({
                ...prev,
                xrayStatus: e.target.checked,
              }))
            }
          />
        </Form.Group>
        {formState.xrayStatus && (
          <Form.Group className="py-2">
            <Form.Label>Upload X-ray Files</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  xray: Array.from(e.target.files),
                }))
              }
            />
          </Form.Group>
        )}
        <Form.Group className="py-2">
          <Form.Label>Notes</Form.Label>
          <Input.TextArea
            value={formState.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </Form.Group>
        <Button className="mt-3" onClick={handleSubmit} loading={loading}>
          {isEdit ? "Update" : "Add"}
        </Button>
      </Form>
    </Drawer>
  );
};

export default PatientDiagnosisForm;
