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
        "\nTOTAL 7.4"
    );
    assert.equal(parsed.rows.length, 6);
    assert.equal(parsed.calculatedTotal, 7.4);
    assert.equal(parsed.printedTotal, 7.4);
    assert.equal(parsed.readyForComparison, false);
});

test("duplicate ROs trigger review", () => {
    const parsed = parseFrhPreview("RO 245194 0.8\nRO 245194 0.8\nTOTAL 1.6");
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
    const parsed = parseFrhPreview("RO 245194 0.8\nTOTAL 0.8");
    const repair = {
        id: "repair1", status: "active",
        header: { repairOrderNumber: "245194" },
        operations: [{ hours: 0.8 }],
        payrollVerification: { status: "pending" },
    };
    assert.equal(compareFrhToRepairs(parsed, [repair])[0].status, "review-required");
});

test("later 16.8 total sample does not silently accept inconsistent rows", () => {
    const text = [
        ...rows.map(row => `RO ${row.ro} ${row.hours.toFixed(1)}`),
        "RO 245229 1.8", "RO 245226 2.6", "RO 245227 1.2",
        "RO 245228 0.3", "RO 245236 0.6",
        "RO 245242 1.0", "RO 245244 0.7", "RO 245246 0.2",
        "RO 245249 1.0", "TOTAL 16.8",
    ].join("\n");
    const parsed = parseFrhPreview(text);
    assert.equal(parsed.calculatedTotal, 16.2);
    assert.ok(parsed.warnings.some(warning => warning.includes("differs from printed")));
});
