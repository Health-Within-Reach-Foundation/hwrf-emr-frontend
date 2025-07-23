import React, { useState } from "react";
import { Button, Collapse, Drawer, Timeline } from "antd";
import GPMedicalRecordForm from "./gp-record-form";
import DateCell from "../date-cell";
import jsPDF from "jspdf";
import { DeleteOutlined, DownloadOutlined } from "@ant-design/icons";
import "jspdf-autotable";
import {
  calculateBMI,
  formatRegisterNumberOfPatient,
} from "../../utilities/utility-function";
import DeletePopover from "../delete-trigger-button";
import patientServices from "../../api/patient-services";
import toast from "react-hot-toast";

const generatePath = (path) => {
  return window.origin + import.meta.env.BASE_URL + path;
};

const GPMedicalRecord = ({
  gpRecords,
  patientData,
  onSave = () => {},
  formFields = [],
}) => {
  const [allGPRecords, setAllGPRecords] = useState(gpRecords || []);
  const [showDrawer, setShowDrawer] = useState(false);
  console.log("patientData and options ", patientData, formFields);

  const handlePrint = (record) => {
    const kcoOptions =
      formFields.find((field) => field.fieldName === "kco")?.options || [];
    const findingsOptions =
      formFields.find((field) => field.fieldName === "findings")?.options || [];
    const systemicExaminationOptions =
      formFields.find((field) => field.fieldName === "systemicExamination")
        ?.options || [];

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    doc.setFont("times", "normal"); // Use Unicode-compatible font
    const margin = 15;
    let cursorY = margin;

    // Function to add a new page with a border
    const addNewPage = () => {
      doc.addPage();
      doc.setLineWidth(0.5);
      doc.rect(10, 10, 190, 277);
      cursorY = margin;
    };

    // Draw border for the first page
    doc.setLineWidth(0.5);
    doc.rect(10, 10, 190, 277);

    // Header
    const img = new Image();
    img.src = "/assets/images/reports/header.png";
    doc.addImage(img, "PNG", margin, cursorY, 180, 40);
    cursorY += 50;

    doc.setFontSize(18);
    doc.text("General Practitioner Medical Report", 105, cursorY, {
      align: "center",
    });
    cursorY += 10;
    doc.setLineWidth(0.5);
    doc.line(margin, cursorY, 193, cursorY);
    cursorY += 10;

    // Basic Info Section
    doc.setFontSize(12);
    doc.text("• Basic Info", margin, cursorY);
    cursorY += 5;
    const userDetails = [
      ["Reg No:", formatRegisterNumberOfPatient(patientData)],
      ["Name:", patientData?.name],
      ["Age:", patientData?.age],
      ["Sex:", patientData?.sex],
      ["Mobile:", patientData?.mobile],
      ["Date:", new Date(record.createdAt).toLocaleDateString()],
    ];
    doc.autoTable({
      startY: cursorY,
      body: userDetails,
      styles: { fontSize: 10, cellPadding: 2, theme: "plain" },
    });
    cursorY = doc.lastAutoTable.finalY + 10;

    // Basic Parameters Section
    doc.setFontSize(12);
    doc.text("• Basic Parameters", margin, cursorY);
    cursorY += 5;
    const patientParameters = [
      [
        "Weight:",
        record.weight,
        "Height:",
        record.height,
        "BMI:",
        calculateBMI(record.weight, record.height),
      ],
      ["Sugar:", record.sugar, "BP:", record.bp, "HB:", record.hb],
    ];
    doc.autoTable({
      startY: cursorY,
      body: patientParameters,
      styles: { fontSize: 10, cellPadding: 2, theme: "plain" },
    });
    cursorY = doc.lastAutoTable.finalY + 10;

    // Complaints Section
    doc.text("• Complaints", margin, cursorY);
    cursorY += 5;
    doc.text(record.complaints.join(", ") || "None", margin, cursorY);
    cursorY += 10;

    // KCO Section with Unicode Checkmarks
    doc.text("• Known Case Of (KCO)", margin, cursorY);
    cursorY += 5;
    kcoOptions.forEach((item, index) => {
      doc.rect(margin, cursorY + index * 5, 3, 3);
      if (record.kco?.includes(item.value))
        doc.text("✔", margin + 1, cursorY + index * 5 + 2.5);
      doc.text(item.label, margin + 5, cursorY + index * 5 + 3);
    });
    cursorY += kcoOptions.length * 5 + 10;

    doc.text("• Brief History", margin, cursorY);
    cursorY += 5;
    // Findings Section
    doc.text("• Findings", margin + 5, cursorY);
    cursorY += 5;
    findingsOptions.forEach((item, index) => {
      doc.rect(margin + 5, cursorY + index * 5, 3, 3);
      if (record.findings?.includes(item.value))
        doc.text("✔", margin + 6, cursorY + 1 + index * 5 + 2.5);
      doc.text(item.label, margin + 10, cursorY + index * 5 + 3);
    });
    cursorY += findingsOptions.length * 5 + 10;

    if (cursorY + 20 > 277) addNewPage();

    // Systemic Examination Section
    doc.text("• Systemic Examination", margin + 5, cursorY);
    cursorY += 5;
    systemicExaminationOptions.forEach((item, index) => {
      doc.rect(margin + 5, cursorY + index * 5, 3, 3);
      if (record.systemicExamination?.includes(item.value))
        doc.text("✔", margin + 6, cursorY + 1 + index * 5 + 2.5);
      doc.text(item.label, margin + 10, cursorY + index * 5 + 3);
    });
    cursorY += systemicExaminationOptions.length * 5 + 10;

    // Treatment Section
    doc.text("• Treatment", margin, cursorY);
    cursorY += 5;
    doc.text(record.treatment || "N/A", margin, cursorY);
    cursorY += 10;

    doc.text("• Advice", margin, cursorY);
    cursorY += 5;
    doc.text(record.advice || "N/A", margin, cursorY);
    cursorY += 10;

    // Prescribed Medicines Table
    doc.text("• Prescribed Medicines", margin, cursorY);
    cursorY += 5;
    doc.autoTable({
      startY: cursorY,
      head: [
        ["Type", "Medicine", "Dose", "When", "Duration", "Frequency", "Notes"],
      ],
      body: record.medicine.map((med) => [
        med.medicineType,
        med.medicine,
        med.dose,
        med.when,
        med.duration,
        med.frequency,
        med.notes,
      ]),
      styles: { fontSize: 10 },
    });
    cursorY = doc.lastAutoTable.finalY + 10;

    // Follow-Up & Costing with Rupee Symbol
    const costDetails = [
      {
        label: "• Follow-Up Date:",
        value: new Date(record.followUpDate).toLocaleDateString(),
      },
      { label: "• Online Amount:", value: `${record.onlineAmount}` },
      { label: "• Offline Amount:", value: `${record.offlineAmount}` },
    ];
    costDetails.forEach(({ label, value }) => {
      doc.text(label, margin, cursorY);
      doc.text(value, margin + 40, cursorY);
      cursorY += 5;
    });

    // Footer
    if (cursorY + 20 > 277) addNewPage();
    doc.setFontSize(10);
    doc.text(
      "This is a system-generated report and does not require a signature.",
      105,
      290,
      { align: "center" }
    );

    // Save PDF
    doc.save(`GP_Report_${patientData.name}_${record.createdAt}.pdf`);
  };

  const handleDelete = async (recordId) => {
    try {
      const response = await patientServices.deleteGPRecord(recordId);
      ``;
      if (response) {
        const updatedRecords = gpRecords.filter(
          (record) => record.id !== recordId
        );
        setAllGPRecords(updatedRecords);
      }
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  return (
    <div>
      {/* Button to open drawer for adding new record */}
      <div className="d-flex justify-content-end my-3">
        <Button
          type="primary"
          onClick={() => setShowDrawer(true)}
          style={{ marginBottom: "10px" }}
          className="rounded-0 bg-primary btn-primary"
        >
          Add New Record
        </Button>
      </div>

      {/* Drawer for adding a new record */}
      <Drawer
        title="Add New GP Record"
        placement="right"
        width={1000} // Adjust width as needed
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        maskClosable={false}
        styles={{
          body: {
            paddingBottom: 20,
            maxHeight: "80vh",
            overflowY: "auto",
            scrollbarWidth: "thin",
          },
        }}
      >
        <GPMedicalRecordForm
          record={null}
          isEdit={false}
          patientData={patientData}
          onCancel={() => setShowDrawer(false)}
          onSave={onSave}
          formFields={formFields}
        />
      </Drawer>

      {/* Existing Records in Timeline */}
      {gpRecords.length === 0 && (
        <h4 className="card-title text-center text-warning">
          No records found!
        </h4>
      )}

      {/* Updated Timeline Component */}
      <Timeline
        mode="left"
        items={allGPRecords.map((record, index) => ({
          key: record.id,
          color: index === 0 ? "green" : "blue",
          children: (
            <Collapse
              className={`${
                index === 0 ? "bg-success-subtle" : "bg-secondary-subtle"
              } h-auto`}
              items={[
                {
                  key: record.id,
                  label: (
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <DateCell date={new Date(record?.createdAt)} />
                        <p>
                          {record?.complaints?.join(", ")},{" "}
                          {record?.otherComplaints}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <Button
                          onClick={() => handlePrint(record)}
                          title="Print"
                          icon={<DownloadOutlined />}
                          variant="outlined"
                          shape="circle"
                          size="middle"
                        ></Button>
                        {/* Add Button with trigger to delete the record */}
                        <DeletePopover
                          title={"Delete Record?"}
                          description={
                            "Are you sure you want to delete this record?"
                          }
                          onDelete={() => {
                            // Add your delete logic here
                            console.log("Record deleted:", record.id);
                            handleDelete(record.id);
                          }}
                          isDeleteAction={true}
                          // children={"Hello"}
                        />
                      </div>
                    </div>
                  ),
                  children: (
                    <GPMedicalRecordForm
                      record={record}
                      isEdit={true}
                      onSave={onSave}
                      formFields={formFields}
                    />
                  ),
                },
              ]}
            />
          ),
        }))}
      />
    </div>
  );
};

export default GPMedicalRecord;
