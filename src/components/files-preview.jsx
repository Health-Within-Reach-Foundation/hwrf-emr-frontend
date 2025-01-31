import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clinicServices from "../api/clinic-services";

const FilesPreview = () => {
  const location = useLocation();
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Extract query parameter "key"
  const queryParams = new URLSearchParams(location.search);
  const key = queryParams.get("key");

  const getFileByKey = async () => {
    if (!key) return;
    setLoading(true);

    try {
      const response = await clinicServices.getFilebyKey(key);

      // Extract content type
      const contentType = response.headers["content-type"] || "image/jpeg"; // Default to JPEG

      // Create Blob from response data
      const fileBlob = new Blob([response.data], { type: contentType });

      // Generate URL for Blob
      const fileUrl = URL.createObjectURL(fileBlob);
      setFileUrl(fileUrl);
    } catch (error) {
      setError("Failed to load the file.");
      console.error("Error fetching file:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFileByKey();
  }, [key]);

  return (
    <div className="container mt-4">
      <h4>File Preview</h4>
      {loading && <p>Loading file...</p>}
      {error && <p className="text-danger">{error}</p>}

      {fileUrl ? (
        <img src={fileUrl} alt="Preview" className="img-fluid mt-3" />
      ) : (
        <p>No file to display.</p>
      )}
    </div>
  );
};

export default FilesPreview;
