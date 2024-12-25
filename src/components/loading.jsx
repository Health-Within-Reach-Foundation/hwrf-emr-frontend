import React from "react";

export const Loading = () => {
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 h-10 w-10">
      <div className="spinner-border" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};
