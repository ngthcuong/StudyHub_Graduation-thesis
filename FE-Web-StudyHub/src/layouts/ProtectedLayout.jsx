import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedLayout = () => {
  const user = useSelector((state) => state.auth.user);

  if (!user) {
    return <Navigate to={"/login"} replace />;
  }

  return (
    <div className="h-screen bg-[#F8F7FA]">
      {/* <Header /> */}
      <div>
        <Outlet />
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default ProtectedLayout;
