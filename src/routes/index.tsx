import { createBrowserRouter } from "react-router-dom";

import AppLayout from "../layouts/AppLayout";
import PublicLayout from "../layouts/PublicLayout";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import DashboardPage from "../features/dashboard/pages/DashboardPage";
import LoginPage from "../features/dashboard/pages/LoginPage";
import NotFoundPage from "../features/dashboard/pages/NotFoundPage";

import SettingsPage from "../features/settings/pages/SettingsPage";

import FinancialPage from "../features/financial/pages/FinancialPage";

import CreateRepairPage from "../features/repairs/pages/CreateRepairPage";
import RepairHistoryPage from "../features/repairs/repair-history/pages/RepairHistoryPage";
import WorkInProgressPage from "../features/repairs/work-in-progress/pages/WorkInProgressPage";

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
                        path: "/financial",
                        element: <FinancialPage />,
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