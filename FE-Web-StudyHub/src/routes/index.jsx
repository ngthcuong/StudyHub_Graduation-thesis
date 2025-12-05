import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";
import ProtectedLayout from "../layouts/ProtectedLayout";
import AuthLayout from "../layouts/AuthLayout";
import RegisterPage from "../pages/auth/RegisterPage";
import LoginPage from "../pages/auth/LoginPage";
import VerifyCertificatePage from "../pages/certificate/VerifyCertificatePage";
import LandingPage from "../pages/LandingPage";
import CourseDetail from "../pages/course/CourseDetail";
import CoursePayment from "../pages/course/CoursePayment";
import TestInformation from "../pages/test/TestInformation";
import TestMultipleChoice from "../pages/test/TestMultipleChoice";
import TestResult from "../pages/test/TestResult";
import TestLayout from "../layouts/TestLayout";
import TestList from "../pages/home/TestList";
import CourseList from "../pages/home/CourseList";
import CourseLessson from "../components/CourseLessson";
import HomeLayout from "../layouts/HomeLayout";
import Dashboard from "../pages/home/Dashboard";
import Certificate from "../pages/home/Certificates";
import UserInfo from "../pages/home/UserInfo";

import TestResultDisplay from "../pages/test/TestResultDisplay";
import LessonContentViewer from "../pages/course/LessonContentViewer";
import TestResults from "../pages/home/TestResults";

import AdminLayout from "../layouts/AdminLayout";
import AdminDashboard from "../pages/admin/Dashboard";
import AdminCertificate from "../pages/admin/Certificate";
import AdminTest from "../pages/admin/Test";
import AdminReview from "../pages/admin/Review";
import AdminCourse from "../pages/admin/Course";
import AdminUser from "../pages/admin/User";

import TestMultipleChoiceCustom from "../pages/test/TestMultipleChoiceCustom";
import TestInformationCustom from "../pages/test/TestInformationCustom";

import FillInBlankTest from "../pages/test/FillInBlankTest";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

import PaymentSuccessPage from "../components/PaymentSuccessPage";
import PaymentFailedPage from "../components/PaymentFailedPage";
import CancelPaymentPage from "../components/CancelPaymentPage";
import Courses from "../pages/Courses";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "/courses",
        element: <Courses />,
      },
      {
        path: "/verify-certificate",
        element: <VerifyCertificatePage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "payment-success",
            element: <PaymentSuccessPage />,
          },
          {
            path: "payment-failed",
            element: <PaymentFailedPage />,
          },
          {
            path: "payment-cancel",
            element: <CancelPaymentPage />,
          },
          {
            path: "/home",
            element: <HomeLayout />,
            children: [
              {
                path: "dashboard",
                // index: true,
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
                path: "results",
                element: <TestResults />,
              },
              {
                path: "certificates",
                element: <Certificate />,
              },
              {
                path: "profile",
                element: <UserInfo />,
              },
            ],
          },
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                path: "dashboard",
                element: <AdminDashboard />,
              },
              {
                path: "certificate",
                element: <AdminCertificate />,
              },
              {
                path: "test",
                element: <AdminTest />,
              },
              {
                path: "review",
                element: <AdminReview />,
              },
              { path: "course", element: <AdminCourse /> },
              { path: "user", element: <AdminUser /> },
            ],
          },
          {
            path: "/course",
            element: <CourseList variant="market" />,
          },
          {
            path: "/course/payment",
            element: <CoursePayment />,
          },
          {
            path: "/course/:courseId",
            element: <CourseDetail />,
          },
          {
            path: "/course/:courseId/lesson/:lessonId",
            element: <CourseLessson />,
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
                path: "custom",
                element: <TestMultipleChoiceCustom />,
              },
              {
                path: "fill-in-blank",
                element: <FillInBlankTest />,
              },
              {
                path: "result",
                element: <TestResult />,
              },
              {
                path: "custom-info",
                element: <TestInformationCustom />,
              },
            ],
          },
          {
            path: "/attempt/:attemptId",
            element: <TestResultDisplay />,
          },
          {
            path: "/lesson/:lessonId",
            element: <LessonContentViewer />,
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
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },
    ],
  },
]);
