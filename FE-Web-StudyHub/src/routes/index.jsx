import { createBrowserRouter, Navigate } from "react-router-dom";
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
import TestInformation from "../pages/test/TestInformation";
import TestMultipleChoice from "../pages/test/TestMultipleChoice";
import TestResult from "../pages/test/TestResult";
import TestLayout from "../layouts/TestLayout";

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
          {
            path: "/test/:id",
            element: <TestLayout />,
            children: [
              {
                index: true,
                element: <TestInformation />,
              },
              {
                path: "/attempt",
                element: <TestMultipleChoice />,
              },
              {
                path: "/result",
                element: <TestResult />,
              },
            ],
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
