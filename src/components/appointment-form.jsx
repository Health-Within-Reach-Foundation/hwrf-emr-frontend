import { RiBuildingLine, RiGroupLine } from "@remixicon/react";
import { Button, Checkbox, Col, Form, Modal, Row, Select, Spin } from "antd";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import appointmentServices from "../api/appointment-services";
import patientServices from "../api/patient-services";

const AppointmentForm = ({
  show,
  modalClose,
  departments,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [patientSearchLoading, setPatientSearchLoading] = useState(false);
  const [patientOptions, setPatientOptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Debounce utility function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch patients based on search term
  const handlePatientSearch = async (value) => {
    setSearchTerm(value);

    if (!value || value.trim().length < 1) {
      setPatientOptions([]);
      return;
    }

    try {
      setPatientSearchLoading(true);
      const response = await patientServices.searchPatients(value, 30, 0);

      if (response.success && response.data.length > 0) {
        const options = response.data.map((patient) => ({
          value: patient.id,
          label: (
            <div className="d-flex justify-content-between align-items-center p-2">
              <span className="fw-medium">{patient.name}</span>
              <span className="text-muted ms-2 fst-italic">
                {patient.mobileNumber}
              </span>
            </div>
          ),
          name: patient.name,
          mobile: patient.mobileNumber,
        }));
        setPatientOptions(options);
      } else {
        setPatientOptions([]);
      }
    } catch (error) {
      console.error("Error searching patients:", error);
      toast.error("Failed to search patients");
    } finally {
      setPatientSearchLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () => debounce(handlePatientSearch, 500),
    []
  );

  const handleDepartmentChange = (checkedValues) => {
    form.setFieldsValue({ departments: checkedValues });
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields(); // Validate form fields before proceeding

      const appointmentDate = new Date().toLocaleDateString("en-CA");

      const appointmentData = {
        patientId: values.patient, // Now directly using form state
        specialties: values.departments,
        appointmentDate,
        status: "in queue",
      };

      setIsLoading(true);
      console.log("Appointment Data:", appointmentData);

      const response = await appointmentServices.bookAppointment(
        appointmentData
      );

      if (response?.success) {
        toast.success(response.message);
        onSave();

        // Reset form and close modal
        form.resetFields();
        modalClose();
      } else {
        throw new Error(response?.message || "Failed to book appointment.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);

      // Handle validation error
      if (error?.errorFields) {
        // Extracting all validation messages
        const validationMessages = error.errorFields
          .map((field) => field.errors.join(", ")) // Join multiple errors if any
          .join("\n");
        toast.error(
          validationMessages || "Please correct the errors in the form."
        );
      } else {
        // Handle API or unexpected errors
        toast.error(error.message || "An unexpected error occurred!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      className="queue-modal"
      open={show} // Antd uses "open" instead of "show"
      onCancel={modalClose}
      centered
      footer={null}
      destroyOnClose
    >
      <h4>Add to Queue</h4>

      <Form form={form} layout="vertical">
        {/* Select Patient with Dynamic Search */}
        <Form.Item
          name="patient"
          layout="horizontal"
          label={<RiGroupLine />}
          rules={[{ required: true, message: "Please select a patient!" }]}
        >
          <Select
            placeholder="Search and select patient (type name or mobile)"
            options={patientOptions}
            onSearch={debouncedSearch}
            onChange={(value) => {
              form.setFieldsValue({ patient: value });
            }}
            className="w-100"
            showSearch
            filterOption={false}
            notFoundContent={
              patientSearchLoading ? (
                <Spin size="small" />
              ) : (
                <div className="text-muted text-center p-2">
                  {searchTerm
                    ? "No patients found"
                    : "Start typing to search patients"}
                </div>
              )
            }
            allowClear
            loading={patientSearchLoading}
          />
          <div className="mt-2">
            <Link to="/patient/add-patient" className="text-primary">
              Create a new patient
            </Link>
          </div>
        </Form.Item>

        {/* Select Department */}
        <Form.Item
          name="departments"
          layout="horizontal"
          label={<RiBuildingLine />}
          rules={[
            { required: true, message: "Please select at least one service!" },
          ]}
        >
          <Checkbox.Group
            options={departments}
            onChange={handleDepartmentChange}
          />
        </Form.Item>

        {/* Footer Actions */}
        <Row justify="end">
          <Col>
            <Button
              onClick={() => {
                form.resetFields();
                setPatientOptions([]);
                setSearchTerm("");
                modalClose();
              }}
              style={{ marginRight: 10 }}
            >
              Cancel
            </Button>
            <Button type="primary" onClick={handleSave} loading={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AppointmentForm;
