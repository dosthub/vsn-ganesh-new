import test from "node:test";
import assert from "node:assert/strict";
import {
  total,
  calculateBalance,
  calculateTotalContributions,
  calculatePendingContributionAmount,
  summarize,
} from "../utils/calculations.ts";
import { financials } from "../data/financials.ts";
test("pending pledges do not inflate received contributions", () => {
  const rows = [
    { amount: 2000, paymentStatus: "paid" },
    { amount: 1500, paymentStatus: "pending" },
  ];
  assert.equal(calculateTotalContributions(rows), 2000);
  assert.equal(calculatePendingContributionAmount(rows), 1500);
});
test("empty records produce zero totals", () => {
  assert.equal(total([]), 0);
  assert.equal(calculateTotalContributions([]), 0);
});
test("currency sums avoid floating point rounding errors", () => {
  assert.equal(total([{ amount: 0.1 }, { amount: 0.2 }]), 0.3);
  assert.equal(calculateBalance(0.1, 0.2, 0.3), 0);
});
test("overspending is shown as a negative balance", () => {
  assert.equal(calculateBalance(100, 200, 500), -200);
});
test("invalid financial amounts are rejected", () => {
  assert.throws(() => total([{ amount: NaN }]));
  assert.throws(() => total([{ amount: -1 }]));
  assert.throws(() => calculateBalance(Infinity, 0, 0));
});
for (const record of financials) {
  test(
    record.year + " sample accounts reconcile with every transaction",
    () => {
      const s = summarize(record);
      assert.equal(
        s.balance,
        record.openingBalance +
          record.income.reduce((v, r) => v + r.amount, 0) -
          record.expenses.reduce((v, r) => v + r.amount, 0),
      );
      assert.equal(
        s.contributions,
        record.contributions
          .filter((c) => c.paymentStatus === "paid")
          .reduce((v, c) => v + c.amount, 0),
      );
      assert.equal(
        s.festivalIncome,
        s.contributions + s.donations + (record.auction?.amount ?? 0),
      );
      assert.equal(
        s.festivalBalance,
        s.festivalIncome -
          record.festivalExpenses.reduce((v, e) => v + e.amount, 0),
      );
      assert.equal(
        s.pending,
        record.contributions
          .filter((c) => c.paymentStatus === "pending")
          .reduce((v, c) => v + c.amount, 0),
      );
    },
  );
}
test("each community year opens with the preceding closing balance", () => {
  for (let i = 1; i < financials.length; i++)
    assert.equal(
      financials[i].openingBalance,
      summarize(financials[i - 1]).balance,
    );
});
test("upcoming auction contributes no income", () => {
  const current = financials.find((r) => r.year === 2026)!;
  assert.equal(current.auction, null);
  assert.equal(summarize(current).auction, 0);
});
