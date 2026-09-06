"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";
import type { YearRecord } from "@/types/community";
import { communityConfig } from "@/data/community";
import { summarize, total } from "@/utils/calculations";
import { formatINR, formatDate } from "@/utils/format";
import {
  StatCard,
  SectionHeading,
  EmptyState,
} from "@/components/common/Shared";
import { LiveStatus } from "@/components/common/LiveStatus";
import type { LiveFinancialsState } from "@/hooks/use-live-financials";
import { RecordsTable } from "@/components/common/RecordsTable";
import { IncomeChart, ExpenseChart } from "./FinancialCharts";
export function SheetFinanceOverview({
  record,
  budgetOnly,
  live,
}: {
  record: YearRecord;
  budgetOnly: boolean;
  live?: LiveFinancialsState;
}) {
  const [query, setQuery] = useState("");
  const s = summarize(record);
  const expenses = record.festivalExpenses.filter((e) =>
    [e.description, e.remarks, e.paidBy]
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="planned-budget">
        <div>
          <span className="eyebrow">PLANNED COLONY BUDGET · {record.year}</span>
          <strong>{formatINR(communityConfig.annualColonyBudget)}</strong>
        </div>
        <p>
          This is the confirmed colony spending plan. Colony collections and
          cash balances have not been supplied. The records below are for the
          Ganesh festival, tracked separately.
        </p>
      </div>
      {live ? (
        <div className="toolbar">
          <LiveStatus
            live={live.live}
            loading={live.loading}
            updatedAt={live.updatedAt}
            error={live.error}
          />
        </div>
      ) : null}
      <SectionHeading
        title={record.year + " festival financial overview"}
        description={
          live?.live
            ? "Loaded from the ‘web Donations received’ and ‘Expenditure’ tabs when this page opened."
            : "Could not read the Google Sheet on this visit. Showing the last saved snapshot."
        }
      />
      <div className="stats-grid">
        <StatCard
          label="Current donations received"
          value={formatINR(s.contributions)}
          note={s.paidCount + " received donation records"}
          icon="heart"
        />
        <StatCard
          label="Previous-year Laddu receipt"
          value={formatINR(s.donations)}
          note="Sagar · Received 20 Aug 2026"
          icon="income"
        />
        <StatCard
          label="Festival expenses"
          value={formatINR(s.festivalExpenses)}
          note={record.festivalExpenses.length + " expense records"}
          icon="expense"
        />
        <StatCard
          label="Festival balance"
          value={formatINR(s.festivalBalance)}
          note="Total receipts − recorded expenses"
          featured
        />
      </div>
      <div className="two-columns section-space">
        <IncomeChart income={s.festivalIncome} expenses={s.festivalExpenses} />
        <div className="panel calculation-card">
          <h3>Festival balance calculation</h3>
          {[
            ["Current donations", s.contributions],
            ["Prior-year Laddu receipt", s.donations],
            ["Total receipts", s.festivalIncome],
            ["Less: festival expenses", s.festivalExpenses],
            ["Remaining balance", s.festivalBalance],
          ].map(([label, amount]) => (
            <div key={label} className="calculation-row">
              <span>{label}</span>
              <strong>{formatINR(Number(amount))}</strong>
            </div>
          ))}
          <p className="account-note">
            The two blank-status donations are included as received with the
            owner’s confirmation. The source sheet was not changed.
          </p>
        </div>
      </div>
      <section className="section-space">
        <SectionHeading
          title="Festival expenditure"
          description="Amounts and descriptions preserved from the Expenditure tab."
        />
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Search imported expenses"
            placeholder="Search expenses, remarks or paid by"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <div className="section-space">
          {expenses.length ? (
            <RecordsTable
              caption="Imported festival expenses"
              headers={["Date", "Description", "Amount", "Remarks", "Paid by"]}
              rows={expenses.map((e) => [
                formatDate(e.date),
                e.description,
                formatINR(e.amount),
                e.remarks || "—",
                e.paidBy || "—",
              ])}
            />
          ) : (
            <EmptyState
              title="No matching expenses"
              description="Try a different expense or payer."
            />
          )}
        </div>
        <div className="table-summary">
          <span>
            {expenses.length} of {record.festivalExpenses.length} records
          </span>
          <strong>Filtered total: {formatINR(total(expenses))}</strong>
        </div>
      </section>
      {!budgetOnly && (
        <div className="section-space">
          <ExpenseChart expenses={record.festivalExpenses} />
        </div>
      )}
      <div className="button-row">
        <Link className="button primary" href="/ganesh-chaturthi#contributors">
          View received donations
        </Link>
        {budgetOnly && (
          <Link className="button secondary" href="/dashboard">
            Complete dashboard
          </Link>
        )}
      </div>
    </>
  );
}
