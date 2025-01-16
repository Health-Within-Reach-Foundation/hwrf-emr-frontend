import React, { useState } from "react";
import CustomTable from "../custom-table";
import { Button } from "react-bootstrap";
import DiagnosisTreatmentSettingForm from "./diagnosis-treatment-setting-form";

const SelectedDiagnosisTreatementDetaiils = ({ selectedDiagnosisRow = [], patientData, fetchPatientData }) => {
  const [selectedTreatments, setSelectedTreatments] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const handleOpenDrawer = (diagnosis, editMode) => {
    setIsEdit(editMode);
    setSelectedTreatments(editMode ? diagnosis : null);
    setDrawerVisible(true);
  };

  const treatmentColumns = [
    {
      title: "Treatment Date",
      data: "treatmentDate",
      render: (data) => new Date(data).toLocaleDateString(),
    },
    {
      title: "Complaints",
      data: "complaints",
    },
    {
      title: "Treatments",
      data: "treatments",
    },
    {
      title: "Dental Quadrant Type",
      data: "dentalQuadrantType",
    },
    {
      title: "Selected Teeth",
      data: "selectedTeeth",
    },
    {
      title: "Treatment Status",
      data: "treatmentStatus",
    },
    {
      title: "Actions",
      data: null,
      render: (_, record) => (
        <Button
          size="sm"
          variant="warning"
          onClick={() => handleOpenDrawer(record, true)}
        >
          View/Edit
        </Button>
      ),
    },
  ];
  return (
    <div className="my-9">
      <Button
        variant="primary"
        size="sm"
        className="my-3"
        onClick={() => handleOpenDrawer(null, false)}
      >
        Add treatment setting
      </Button>
      <CustomTable
        columns={treatmentColumns}
        data={selectedDiagnosisRow?.treatments}
        enableFilters={false}
      />

      <DiagnosisTreatmentSettingForm
        isEdit={isEdit}
        selectedTreatments={selectedTreatments}
        drawerVisible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        diagnosisData={selectedDiagnosisRow}
        patientData={patientData}
        onSave={() => fetchPatientData()}
      />
    </div>
  );
};

export default SelectedDiagnosisTreatementDetaiils;
