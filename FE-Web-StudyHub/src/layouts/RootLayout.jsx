import React, { Suspense } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import { useSelector } from "react-redux";

const RootLayout = () => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (user && location.pathname === "/") {
    if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/home/dashboard" replace />;
  }

  return (
    <div>
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;
