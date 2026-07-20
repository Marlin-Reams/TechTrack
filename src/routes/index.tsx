import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import NotFoundPage from "../pages/NotFoundPage";

import CreateRepairPage from "../features/repairs/pages/CreateRepairPage";

const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <DashboardPage />,
          },
          {
            path: "/repairs/new",
            element: <CreateRepairPage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;