import React, { useState } from "react";
import { Button, Collapse, Drawer } from "antd";
import GPMedicalRecordForm from "./gp-record-form";
import DateCell from "../date-cell";

const { Panel } = Collapse;

const GPMedicalRecord = ({ gpRecords, patientData, onSave = () => {} }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  console.log("patientData", patientData);
  return (
    <div>
      {/* Button to open drawer for adding new record */}
      <div className="d-flex justify-content-end my-3 ">
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
        width={750} // Adjust width as needed
        onClose={() => setShowDrawer(false)}
        open={showDrawer}
        // destroyOnClose
        maskClosable={false}
        bodyStyle={{ paddingBottom: 20, maxHeight: "80vh", overflowY: "auto" }}
      >
        <GPMedicalRecordForm
          record={null}
          isEdit={false}
          patientData={patientData}
          onCancel={() => setShowDrawer(false)}
          onSave={onSave}
        />
      </Drawer>

      {/* Existing Records in Collapse */}
      {gpRecords.length === 0 && (
        <h4 className="card-title text-center text-warning">
          No records found!
        </h4>
      )}
      <Collapse>
        {gpRecords.map((record) => (
          <Panel
            header={
              <div>
                <DateCell date={new Date(record?.createdAt)} />
                <p>{record?.findings?.join(", ")}</p>
              </div>
            }
            key={record.id}
          >
            <GPMedicalRecordForm
              record={record}
              isEdit={true}
              key={record.id}
              onSave={onSave}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default GPMedicalRecord;
