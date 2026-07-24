import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";
import SettingsPage from "../features/settings/pages/SettingsPage";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import WorkInProgressPage from "../features/repairs/work-in-progress/pages/WorkInProgressPage";
import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/dashboard/pages/LoginPage";
import NotFoundPage from "../features/dashboard/pages/NotFoundPage";

import CreateRepairPage from "../features/repairs/pages/CreateRepairPage";

import RepairHistoryPage from "../features/repairs/repair-history/pages/RepairHistoryPage";

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
          {
            path: "/repairs/:repairId",
            element: <CreateRepairPage />,
          },
          {
            path: "/repairs/history",
            element: <RepairHistoryPage />,
          },
          {
            path: "/repairs/work",
            element: <WorkInProgressPage />,
          },
          {
    path: "/settings",
    element: <SettingsPage />,
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