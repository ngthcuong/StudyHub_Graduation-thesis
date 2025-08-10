import { createBrowserRouter } from "react-router-dom";
import AuthCertificate from "../pages/AuthCertificate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthCertificate />,
  },
]);
