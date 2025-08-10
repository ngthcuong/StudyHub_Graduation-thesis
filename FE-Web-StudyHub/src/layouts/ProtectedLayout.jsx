import React from "react";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div className="h-screen bg-[#F8F7FA]">
      <Header />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
