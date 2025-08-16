import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { CircularProgress } from "@mui/material";

const RootLayout = () => {
  return (
    <div>
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default RootLayout;
