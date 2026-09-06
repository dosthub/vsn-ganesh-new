import test from "node:test";
import assert from "node:assert/strict";
import { sheetFinancials } from "../data/sheetSnapshot.ts";
import { summarize } from "../utils/calculations.ts";
const r = sheetFinancials[0];
const s = summarize(r);
test("confirmed source donations reconcile to the sheet total", () => {
  assert.equal(r.contributions.length, 22);
  assert.equal(s.contributions, 51319);
  assert.equal(s.paidCount, 22);
});
test("previous-year Laddu receipt is included exactly once, outside current donations", () => {
  assert.equal(s.donations, 41750);
  assert.equal(s.auction, 0);
  assert.equal(s.festivalIncome, 93069);
  assert.equal(
    r.contributions.some((c) => c.contributorName.includes("Sagar")),
    false,
  );
});
test("all six expenditure rows reconcile and preserve payer and advance remarks", () => {
  assert.equal(r.festivalExpenses.length, 6);
  assert.equal(s.festivalExpenses, 23506);
  assert.equal(
    r.festivalExpenses.find((e) => e.description === "Band")?.paidBy,
    "parthiv reddy",
  );
  assert.equal(
    r.festivalExpenses.find((e) => e.description === "Band")?.remarks,
    "advance",
  );
  assert.equal(s.festivalBalance, 69563);
});
test("owner confirmation applies to the two blank-status rows without changing source dates", () => {
  for (const name of ["M. Vishwanath", "B.Venkateswarlu Charan"]) {
    const c = r.contributions.find((c) => c.contributorName === name)!;
    assert.equal(c.paymentStatus, "paid");
    assert.match(c.remarks!, /confirmed by owner/);
  }
  assert.equal(
    r.contributions.find((c) => c.contributorName === "B.Venkateswarlu Charan")
      ?.sourceDate,
    "",
  );
  assert.equal(r.contributions[0].sourceDate, "9-03-2026");
});
test("import preserves separate rows and does not invent colony transactions", () => {
  assert.equal(r.contributions.filter((c) => c.houseNo === "56").length, 2);
  assert.equal(new Set(r.contributions.map((c) => c.id)).size, 22);
  assert.equal(r.income.length, 0);
  assert.equal(r.expenses.length, 0);
});
