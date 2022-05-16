import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";

const BackHome = () => {
  const navigate = useNavigate();
  return (
    <div
      className="back-dashboard"
      onClick={() => {
        navigate("/");
      }}
    >
      <ArrowLeftOutlined />
    </div>
  );
};
export default BackHome;
