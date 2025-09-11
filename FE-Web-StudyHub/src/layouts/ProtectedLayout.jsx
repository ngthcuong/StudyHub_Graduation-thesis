import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div className="h-screen bg-[#F8F7FA]">
      {/* <Header /> */}
      <div>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default ProtectedLayout;
