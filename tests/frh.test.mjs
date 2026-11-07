import test from "node:test";
import assert from "node:assert/strict";
import { parseFrhPreview } from "../src/features/payroll-verification/services/frhParser.ts";
import { diffFrhSnapshots } from "../src/features/payroll-verification/services/frhSnapshots.ts";
import { compareFrhToRepairs } from "../src/features/payroll-verification/services/frhReconciliation.ts";

const base = {
    id: "scan-1", technicianId: "09", storeId: "12345",
    from: "2026-11-02", to: "2026-11-04", printedAt: "2026-11-04",
};
const rows = [
    ["245194", 0.8], ["245200", 1.6], ["245154", 0.5],
    ["245190", 1.3], ["245198", 1.3], ["245202", 1.9],
].map(([ro, hours]) => ({ ro: String(ro), hours, sourceLine: "" }));

test("six sample ROs total 7.4", () => {
    assert.equal(rows.reduce((sum, row) => sum + row.hours, 0).toFixed(1), "7.4");
});

test("FRH preview stays non-authoritative", () => {
    const parsed = parseFrhPreview(
        "Tech 09\nStore 12345\nFrom 11/02/2026\nTo 11/04/2026\nPrinted 11/04/2026\n" +
        rows.map(row => `RO ${row.ro} ${row.hours.toFixed(1)}`).join("\n") +
        "\nTotal Hours 7.4"
    );
    assert.equal(parsed.rows.length, 6);
    assert.equal(parsed.calculatedTotal, 7.4);
    assert.equal(parsed.printedTotal, 7.4);
    assert.equal(parsed.readyForComparison, false);
});

test("duplicate ROs trigger review", () => {
    const parsed = parseFrhPreview("RO 245194 0.8\nRO 245194 0.8\nTotal Hours 1.6");
    assert.ok(parsed.warnings.some(warning => warning.includes("appears more than once")));
});

test("overlapping WTD snapshots only produce newly added ROs", () => {
    const next = { ...base, id: "scan-2", to: "2026-11-05",
        rows: [...rows, ...[
            ["245229", 1.8], ["245226", 2.6], ["245227", 1.2],
            ["245228", 0.3], ["245236", 0.6],
        ].map(([ro, hours]) => ({ ro: String(ro), hours, sourceLine: "" }))] };
    const changes = diffFrhSnapshots({ ...base, rows }, next);
    assert.equal(changes.length, 5);
    assert.ok(changes.every(change => change.kind === "new"));
});

test("changed and removed rows are flagged, not added", () => {
    const changes = diffFrhSnapshots({ ...base, rows }, {
        ...base, id: "scan-3", to: "2026-11-06",
        rows: [{ ...rows[0], hours: 1.0 }, ...rows.slice(2)],
    });
    assert.deepEqual(changes.map(change => change.kind).sort(), ["changed", "removed"]);
});

test("invalid overlapping window is rejected", () => {
    assert.throws(() => diffFrhSnapshots({ ...base, rows }, {
        ...base, from: "2026-11-03", rows,
    }));
});

test("comparison cannot mark an unvalidated OCR report as exact", () => {
    const parsed = parseFrhPreview("RO 245194 0.8\nTotal Hours 0.8");
    const repair = {
        id: "repair1", status: "active",
        header: { repairOrderNumber: "245194" },
        operations: [{ hours: 0.8 }],
        payrollVerification: { status: "pending" },
    };
    assert.equal(compareFrhToRepairs(parsed, [repair])[0].status, "review-required");
});

test("Nov 5 printed 13.3 total is flagged against listed 13.9 hours", () => {
    const text = [
        ...rows.map(row => `RO ${row.ro} ${row.hours.toFixed(1)}`),
        "RO 245229 1.8", "RO 245226 2.6", "RO 245227 1.2",
        "RO 245228 0.3", "RO 245236 0.6",
        "Total Hours 13.3",
    ].join("\n");
    const parsed = parseFrhPreview(text);
    assert.equal(parsed.calculatedTotal, 13.9);
    assert.ok(parsed.warnings.some(warning => warning.includes("differs from printed")));
});

test("actual Nov 6 Firestone report layout parses all 15 ROs and totals", () => {
    const report = [
        "FIRESTONE COMPLETE AUTO CARE",
        "Technician Daily FRH Workorder Summary",
        "Store # 023043 From 10/31/2026 06:21 PM To 11/06/2026 04:45 PM Print Date 11/06/2026",
        "09 REAMS, MARLIN",
        "Work Order Hours Date Posted",
        "245194 0.8 11/02/2026 10:50:10AM",
        "245200 1.6 11/02/2026 02:53:13PM",
        "245154 0.5 11/02/2026 11:20:50AM",
        "245190 1.3 11/02/2026 09:41:38AM",
        "245198 1.3 11/02/2026 12:00:26PM",
        "245202 1.9 11/02/2026 05:27:21PM",
        "245229 1.8 11/05/2026 02:06:24PM",
        "245226 2.6 11/05/2026 01:26:57PM",
        "245227 1.2 11/05/2026 08:33:13AM",
        "245228 0.3 11/05/2026 08:46:03AM",
        "245236 0.6 11/05/2026 04:28:59PM",
        "245242 1.0 11/06/2026 09:41:24AM",
        "245244 0.7 11/06/2026 10:32:02AM",
        "245246 0.2 11/06/2026 09:31:03AM",
        "245249 1.0 11/06/2026 03:00:26PM",
        "Total Hours 16.8",
        "Adjusted",
        "Work Order Hours Day Adjusted",
        "Week To Date Total 16.8",
        "Week To Date Total w/Adjustments 16.8",
    ].join("\n");
    const parsed = parseFrhPreview(report);
    assert.equal(parsed.header.technicianId, "09");
    assert.equal(parsed.header.storeId, "023043");
    assert.equal(parsed.header.from, "10/31/2026 06:21PM");
    assert.equal(parsed.header.to, "11/06/2026 04:45PM");
    assert.equal(parsed.header.printedAt, "11/06/2026");
    assert.equal(parsed.rows.length, 15);
    assert.equal(parsed.calculatedTotal, 16.8);
    assert.equal(parsed.printedTotal, 16.8);
    assert.deepEqual(parsed.warnings, []);
    assert.equal(parsed.readyForComparison, true);
});
