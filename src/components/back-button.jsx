import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { RiArrowLeftLine } from "@remixicon/react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      size="middle"
    //   variant=""
      onClick={() => navigate(-1)}
      className="bg-primary-subtle flex w-20 items-center gap-2"
    >
      <RiArrowLeftLine size={15}/>
      Back
    </Button>
  );
};

export default BackButton;
