import { CircularProgress } from "@mui/material";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

const TestLayout = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <Outlet />
    </Suspense>
  );
};

export default TestLayout;
