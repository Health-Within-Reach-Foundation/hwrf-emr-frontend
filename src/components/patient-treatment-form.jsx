import React, { useEffect, useState } from "react";
import { Drawer, Input, TreeSelect, Select } from "antd";
import { Button, Form } from "react-bootstrap";

const PatientTreatmentForm = ({
  isEdit,
  drawerVisible,
  onClose,
  treatmentData,
  onSave,
}) => {
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
    notes: "",
    treatmentStatus: [],
    billing: { totalCost: 0, paid: 0, remaining: 0 },
  });

  useEffect(() => {
    if (isEdit && treatmentData) {
      setFormState(treatmentData);
    } else {
      setFormState({
        complaints: [],
        treatment: [],
        dentalQuadrant: [],
        xrayStatus: false,
        file: null,
        notes: "",
        treatmentStatus: [],
        billing: { totalCost: 0, paid: 0, remaining: 0 },
      });
    }
  }, [isEdit, treatmentData]);

  const handleInputChange = (key, value) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleBillingChange = (key, value) => {
    setFormState((prev) => ({
      ...prev,
      billing: { ...prev.billing, [key]: value },
    }));
  };

  const handleSubmit = () => {
    onSave(formState);
  };

  return (
    <Drawer
      title={"Update treatment"}
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
              { value: "Caries", label: "Caries" },
              { value: "NA", label: "NA" },
              { value: "Calculus", label: "Calculus" },
            ]}
            className="w-100"
          />
        </Form.Group>
        <Form.Group className="py-2">
          <Form.Label>Treatment</Form.Label>
          <Select
            mode="multiple"
            value={formState.treatment}
            onChange={(value) => handleInputChange("complaints", value)}
            options={[
              { value: "Scaling-Regular", label: "Scaling-Regular" },
              { value: "Scaling-Complex", label: "Scaling-Complex" },
              { value: "RC-Simple", label: "RC-Simple" },
              { value: "RC-Complex", label: "RC-Complex" },
              { value: "Filling-Regular", label: "Filling-Regular" },
              { value: "Filling-Deep", label: "Filling-Deep" },
              { value: "Extraction-Simple", label: "Extraction-Simple" },
              { value: "Extraction-Complex", label: "Extraction-Complex" },
              { value: "Crown-Metal", label: "Crown-Metal" },
              { value: "Crown-PFM", label: "Crown-PFM" },
              { value: "Crown-Zirconia", label: "Crown-Zirconia" },
              { value: "Floride", label: "Floride" },
              { value: "Pit Fissure Sealant", label: "Pit Fissure Sealant" },
              { value: "Pulpectomy", label: "Pulpectomy" },
              { value: "OPD Done", label: "OPD Done" },
              { value: "OPD", label: "OPD" },
              { value: "Crown Cutting", label: "Crown Cutting" },
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
            placeholder="Please select"
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
            <Form.Label>File</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  file: e.target.files[0],
                }))
              }
            />
          </Form.Group>
        )}

        <Form.Group className="py-2">
          <Form.Label>Treatment Status</Form.Label>
          <Select
            mode="multiple"
            value={formState?.treatmentStatus}
            onChange={(value) =>
              setFormState((prev) => ({ ...prev, treatmentStatus: value }))
            }
            placeholder="Select Status"
            style={{ width: "100%" }}
            options={[
              { value: "completed", label: "Completed" },
              { value: "pending", label: "Pending" },
              { value: "cancelled", label: "Cancelled" },
            ]}
          />
        </Form.Group>

        <Form.Group className="py-2">
          <Form.Label>Notes</Form.Label>
          <Input.TextArea
            value={formState.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Total Cost</Form.Label>
          <Form.Control
            type="number"
            value={formState?.totalAmount}
            onChange={(e) =>
              setRecordForm((prev) => ({
                ...prev,
                totalAmount: e.target.value,
              }))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Paid</Form.Label>
          <Form.Control
            type="number"
            value={formState?.paidAmount}
            onChange={(e) =>
              setRecordForm((prev) => ({
                ...prev,
                paidAmount: e.target.value
              }))
            }
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Remaining</Form.Label>
          <Form.Control
            type="number"
            value={formState?.remainingAmount}
            onChange={(e) =>
              setRecordForm((prev) => ({
                ...prev,
                remainingAmount:  e.target.value 
              }))
            }
          />
        </Form.Group>
        <Button className="mt-3" onClick={handleSubmit}>
          {isEdit ? "Update" : "Add"}
        </Button>
      </Form>
    </Drawer>
  );
};

export default PatientTreatmentForm;
