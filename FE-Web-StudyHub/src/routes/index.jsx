import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import AuthLayout from "../layouts/AuthLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/HomePage";
import VerifyCertificatePage from "../pages/certificate/VerifyCertificatePage";
import UserInfoPage from "../pages/user/UserInfoPage";
import LandingPage from "../pages/LandingPage";
import CourseDetail from "../pages/course/CourseDetail";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/verify-cert",
        element: <VerifyCertificatePage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/home",
            element: <HomePage />,
          },
          {
            path: "/user",
            element: <UserInfoPage />,
          },
          {
            path: "/course",
            element: <CourseDetail />,
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
