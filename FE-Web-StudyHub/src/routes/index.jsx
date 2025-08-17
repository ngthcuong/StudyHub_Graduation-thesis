import { createBrowserRouter } from "react-router-dom";
import AuthCertificate from "../pages/AuthCertificate";
import Certificate from "../components/Certificate";
import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import AuthLayout from "../layouts/AuthLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomgePage from "../pages/HomgePage";

export const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <AuthCertificate />,
  // },
  // {
  //   path: "/certificate",
  //   element: <Certificate />,
  // },
  {
    element: <RootLayout />,
    children: [
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/",
            element: <HomgePage />,
          },
          {
            path: "/verify-cert",
            element: <Certificate />,
          },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/register",
            element: <RegisterPage />,
          },
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
