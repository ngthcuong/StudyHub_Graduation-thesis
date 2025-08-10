import { createBrowserRouter } from "react-router-dom";
import AuthCertificate from "../pages/AuthCertificate";
import Certificate from "../components/Certificate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthCertificate />,
  },
  {
    path: "/certificate",
    element: <Certificate />,
  },
]);
