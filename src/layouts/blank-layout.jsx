import React from "react";

// react-router
import { Outlet } from "react-router-dom";
import SettingOffCanvas from "../components/setting/SettingOffCanvas";
import { Loading } from "../components/loading";

const BlankLayout = () => {
  return (
    <>
      <div className="content-bg">
        {/* {loading ? <Loading /> : <Outlet />} */}
        <Outlet />
        <SettingOffCanvas />
      </div>
    </>
  );
};

export default BlankLayout;
