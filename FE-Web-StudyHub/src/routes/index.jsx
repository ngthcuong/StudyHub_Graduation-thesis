import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import AuthLayout from "../layouts/AuthLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomgePage from "../pages/HomgePage";
import VerifyCertificatePage from "../pages/certificate/VerifyCertificatePage";
import UserInfoPage from "../pages/user/UserInfoPage";

export const router = createBrowserRouter([
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
            element: <VerifyCertificatePage />,
          },
          {
            path: "/user",
            element: <UserInfoPage />,
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
