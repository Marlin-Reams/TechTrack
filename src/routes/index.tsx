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

import PaystubPage from "../features/financial/paystubs/pages/PaystubPage";
import ReviewImportPage
    from "../features/document-import/pages/ReviewImportPage";
import CreateRepairPage from "../features/repairs/pages/CreateRepairPage";
import RepairHistoryPage from "../features/repairs/repair-history/pages/RepairHistoryPage";
import WorkInProgressPage from "../features/repairs/work-in-progress/pages/WorkInProgressPage";
import LaborLibraryPage from "../features/labor-library/pages/LaborLibraryPage";
import RepairListPage from "../features/repairs/repair-list/pages/RepairListPage";
import PayrollVerificationPage
    from "../features/payroll-verification/pages/PayrollVerificationPage";
import DocumentImportPage
    from "../features/document-import/pages/DocumentImportPage";
import ReportsPage from "../features/reports/pages/ReportsPage";
import PayrollReviewPage from "../features/payroll-verification/pages/PayrollReviewPage";
import FrhReportScanPage from "../features/payroll-verification/pages/FrhReportScanPage";
import RemindersPage from "../features/reminders/pages/RemindersPage";

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
                        path: "/repairs/scan",
                        element: <DocumentImportPage />,
                    },
                    {
    path: "/repairs/scan/review",
    element: <ReviewImportPage />,
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
                        path: "/payroll-verification/:repairId",
                        element: <PayrollVerificationPage />,
                    },
                    {
                        path: "/payroll-verification/frh-scan",
                        element: <FrhReportScanPage />,
                    },
                    {
                        path: "/payroll-verification",
                        element: <PayrollReviewPage />,
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
                        path: "/financial/paystubs",
                        element: <PaystubPage />,
                    },
                    {
                        path: "/settings",
                        element: <SettingsPage />,
                    },
                    {
                        path: "/labor-library",
                        element: <LaborLibraryPage />
                    },
                    {
                        path: "/reports",
                        element: <ReportsPage />
                    },
                    {
                        path: "/reminders",
                        element: <RemindersPage />
                    },
                    {
                        path: "/repairs",
                        element: <RepairListPage />
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
