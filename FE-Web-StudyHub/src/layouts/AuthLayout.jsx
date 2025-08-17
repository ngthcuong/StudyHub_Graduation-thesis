import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const AuthLayout = () => {
  return (
    <div>
      <div>
        <Suspense fallback={<CircularProgress />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthLayout;
