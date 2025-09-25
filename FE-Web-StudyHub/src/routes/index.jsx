import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import AuthLayout from "../layouts/AuthLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import VerifyCertificatePage from "../pages/certificate/VerifyCertificatePage";
import UserInfoPage from "../pages/user/UserInfoPage";
import LandingPage from "../pages/LandingPage";
import CourseDetail from "../pages/course/CourseDetail";
import TestInformation from "../pages/test/TestInformation";
import TestMultipleChoice from "../pages/test/TestMultipleChoice";
import TestResult from "../pages/test/TestResult";
import TestLayout from "../layouts/TestLayout";
import TestList from "../pages/test/TestList";
import CourseList from "../pages/course/CourseList";
import CourseLessson from "../components/CourseLessson";
import HomeLayout from "../layouts/HomeLayout";
import Dashboard from "../pages/home/Dashboard";
import Achievements from "../pages/home/Achievements";
import Settings from "../pages/home/Settings";

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
            element: <HomeLayout />,
            children: [
              {
                path: "dashboard",
                index: true,
                element: <Dashboard />,
              },
              {
                path: "courses",
                element: <CourseList variant="owned" />,
              },
              {
                path: "exercises",
                element: <TestList />,
              },
              {
                path: "achievements",
                element: <Achievements />,
              },
              {
                path: "profile",
                element: <UserInfoPage />,
              },
              {
                path: "settings",
                element: <Settings />,
              },
            ],
          },
          {
            path: "/profile",
            element: <UserInfoPage />,
          },
          {
            path: "/course",
            element: <CourseList variant="market" />,
          },

          {
            path: "/course",
            children: [
              {
                path: ":id",
                element: <CourseDetail />,
              },
              {
                path: ":id/lesson/:id",
                element: <CourseLessson />,
              },
            ],
          },

          {
            path: "/test",
            element: <TestList />,
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
                path: "attempt",
                element: <TestMultipleChoice />,
              },
              {
                path: "result",
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
