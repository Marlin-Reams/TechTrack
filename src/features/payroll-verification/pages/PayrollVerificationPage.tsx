import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./PayrollVerificationPage.css";

import PayrollVerificationHistory
    from "../components/PayrollVerificationHistory";

import PayrollVerificationActions
    from "../components/PayrollVerificationActions";

import PayrollVerificationForm
    from "../components/PayrollVerificationForm";

import PayrollIssueForm
    from "../components/PayrollIssueForm";

import PayrollResolutionForm
    from "../components/PayrollResolutionForm";

import RepairSummarySection
    from "../components/RepairSummarySection";

import {
    getRepair,
} from "../../repairs/repository/repairRepository";

import {
    verifyPayroll,
    updatePayrollVerification,
    reportPayrollIssue,
    resolvePayrollIssue,
} from "../services/payrollVerificationService";

import type { RepairRecord }
    from "../../repairs/repair-entry/types/RepairRecord";

type PayrollVerificationPageMode =
    | "actions"
    | "editVerification"
    | "createIssue"
    | "editIssue"
    | "resolveIssue"
    | "viewResolution";

export default function PayrollVerificationPage() {

    const { repairId } = useParams();

    const navigate = useNavigate();

    const [repairRecord, setRepairRecord] =
        useState<RepairRecord | null>(null);

    const [pageMode, setPageMode] =
        useState<PayrollVerificationPageMode>("actions");

    useEffect(() => {

        if (!repairId) {
            return;
        }

        const id = repairId;

        async function loadRepair() {

            const repair = await getRepair(id);

            const normalizedRepair: RepairRecord = {
                ...repair,

                status: repair.status ?? "active",

                payrollVerification:
                    repair.payrollVerification ?? {
                        status: "pending",
                    },
            };

            setRepairRecord(normalizedRepair);

        }

        loadRepair();

    }, [repairId]);

    async function handleVerify() {

        if (!repairId || !repairRecord) {
            return;
        }

        await verifyPayroll(
            repairId,
            repairRecord
        );

        navigate("/");

    }

    async function handleSaveVerification(
        paidHours: number,
        notes: string
    ) {

        if (!repairId || !repairRecord) {
            return;
        }

        await updatePayrollVerification(
            repairId,
            repairRecord,
            paidHours,
            notes
        );

        setRepairRecord({

            ...repairRecord,

            payrollVerification: {

                ...repairRecord.payrollVerification,

                status: "verified",

                paidHours,

                issueNotes: notes,

            },

        });

        setPageMode("actions");

    }

    async function handleSaveIssue(
        issueType: string,
        notes: string
    ) {

        if (!repairId || !repairRecord) {
            return;
        }

        await reportPayrollIssue(
            repairId,
            repairRecord,
            issueType,
            notes
        );

        setRepairRecord({

            ...repairRecord,

            payrollVerification: {

                ...repairRecord.payrollVerification,

                status: "issue",

                issueType,

                issueNotes: notes,

            },

        });

        setPageMode("actions");

    }

    async function handleSaveResolution(
        resolutionNotes: string
    ) {

        if (!repairId || !repairRecord) {
            return;
        }

        await resolvePayrollIssue(
            repairId,
            repairRecord,
            resolutionNotes
        );

        setRepairRecord({

            ...repairRecord,

            payrollVerification: {

                ...repairRecord.payrollVerification,

                status: "resolved",

                resolutionNotes,

                resolvedDate: new Date().toISOString(),

            },

        });

        setPageMode("actions");

    }

    if (!repairRecord) {

        return (

            <main>

                <h2>
                    Loading Payroll Verification...
                </h2>

            </main>

        );

    }

    

    return (

        <main className="payroll-verification-page">

            <h1 className="page-title">
                Payroll Verification
            </h1>

            <p className="page-subtitle">
                Verify that Firestone payroll matches the completed repair.
            </p>

            <PayrollVerificationHistory
                repairRecord={repairRecord}
            />

            {pageMode === "actions" && (

                <PayrollVerificationActions
                    repairRecord={repairRecord}
                    onVerify={handleVerify}
                    onReportIssue={() =>
                        setPageMode("createIssue")
                    }
                    onEditVerification={() =>
                        setPageMode("editVerification")
                    }
                    onEditIssue={() =>
                        setPageMode("editIssue")
                    }
                    onResolveIssue={() =>
                        setPageMode("resolveIssue")
                    }
                    onViewResolution={() =>
                        setPageMode("viewResolution")
                    }
                />

            )}

            {pageMode === "editVerification" && (

                <PayrollVerificationForm
                    repairRecord={repairRecord}
                    onSave={handleSaveVerification}
                    onCancel={() =>
                        setPageMode("actions")
                    }
                />

            )}

            {pageMode === "createIssue" && (

                <PayrollIssueForm
                    onSave={handleSaveIssue}
                    onCancel={() =>
                        setPageMode("actions")
                    }
                />

            )}

            {pageMode === "editIssue" && (

                <PayrollIssueForm
                    initialIssueType={
                        repairRecord.payrollVerification.issueType
                    }
                    initialNotes={
                        repairRecord.payrollVerification.issueNotes
                    }
                    onSave={handleSaveIssue}
                    onCancel={() =>
                        setPageMode("actions")
                    }
                />

            )}

            {pageMode === "resolveIssue" && (

                <PayrollResolutionForm
                    issueType={
                        repairRecord.payrollVerification.issueType
                    }
                    issueNotes={
                        repairRecord.payrollVerification.issueNotes
                    }
                    onResolve={handleSaveResolution}
                    onCancel={() =>
                        setPageMode("actions")
                    }
                />

            )}

            {pageMode === "viewResolution" && (

                <PayrollResolutionForm
                    issueType={
                        repairRecord.payrollVerification.issueType
                    }
                    issueNotes={
                        repairRecord.payrollVerification.issueNotes
                    }
                    resolutionNotes={
                        repairRecord.payrollVerification.resolutionNotes
                    }
                    readOnly
                    onResolve={() => { }}
                    onCancel={() =>
                        setPageMode("actions")
                    }
                />

            )}

            <RepairSummarySection
                header={repairRecord.header}
                operations={repairRecord.operations}
            />

        </main>

    );

}