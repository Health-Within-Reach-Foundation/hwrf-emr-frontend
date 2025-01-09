import React, { useState } from "react";
import { Modal, Radio, Button } from "antd";
import campManagementService from "../api/camp-management-service";
import authServices from "../api/auth-services";
import { useAuth } from "../utilities/AuthProvider";

const CampSelectionModal = ({ open, camps, onClose, preCheckedCampId }) => {
  const [selectedCampId, setSelectedCampId] = useState(preCheckedCampId);
  const [loading, setLoading] = useState(false);
  const { initializeAuth } = useAuth();
    console.log(camps, preCheckedCampId);
  // Handle camp selection
  const handleSelect = async () => {
    const selectedCamp = camps.find((camp) => camp.id === selectedCampId);
    if (selectedCamp) {
      setLoading(true);
      const response = await campManagementService.selectCamp(selectedCamp.id);

      if (response.success) {
        await initializeAuth();
      }
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Select Your Camp"
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="select"
          type="primary"
          onClick={handleSelect}
          disabled={!selectedCampId}
          loading={loading}
        >
          Select
        </Button>,
      ]}
    >
      <Radio.Group
        value={selectedCampId}
        onChange={(e) => setSelectedCampId(e.target.value)}
        style={{ width: "100%" }}
      >
        {camps.map((camp) => (
          <div
            key={camp.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          >
            <Radio
              value ={camp.id}
            />
            <div style={{ marginLeft: "10px" }}>
              <h4 className="mb-0 text-black">{camp.name}</h4>
              <p>
                {camp.address}, {camp.city}, {camp.state}
              </p>
              <p>
                <strong>Dates:</strong> {camp.startDate} - {camp.endDate}
              </p>
            </div>
          </div>
        ))}
      </Radio.Group>
    </Modal>
  );
};

export default CampSelectionModal;
