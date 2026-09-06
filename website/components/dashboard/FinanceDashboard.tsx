"use client";
import { SheetFinanceOverview } from "./SheetFinanceOverview";
import { useState } from "react";
import { communityConfig } from "@/data/community";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { YearRecord } from "@/types/community";
import { useLiveFinancials } from "@/hooks/use-live-financials";
import { summarize, total } from "@/utils/calculations";
import { formatINR, formatDate } from "@/utils/format";
import {
  StatCard,
  SectionHeading,
  EmptyState,
  TransparencyNote,
} from "@/components/common/Shared";
import { FilterSelect } from "@/components/common/FilterSelect";
import { SheetLoadGate } from "@/components/common/SheetLoadGate";
import { RecordsTable } from "@/components/common/RecordsTable";
import { IncomeChart, ExpenseChart } from "./FinancialCharts";
export function FinanceDashboard({
  records: initialRecords,
  budgetOnly = false,
}: {
  records: YearRecord[];
  budgetOnly?: boolean;
}) {
  const live = useLiveFinancials(initialRecords);
  const records = live.records;
  const years = [...records].sort((a, b) => b.year - a.year);
  const [year, setYear] = useState(String(years[0]?.year ?? 2026));
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const record = records.find((r) => String(r.year) === year);
  if (!record)
    return (
      <EmptyState
        title="No financial records available"
        description="The community accounts will be updated soon."
      />
    );
  if (record.source === "sheet-snapshot" || record.source === "google-sheets")
    return (
      <SheetLoadGate live={live}>
        <SheetFinanceOverview
          record={record}
          budgetOnly={budgetOnly}
          live={live}
        />
      </SheetLoadGate>
    );
  const s = summarize(record);
  const previous = records.find((r) => r.year === record.year - 1);
  const prev = previous ? summarize(previous) : null;
  const rows = record.expenses.filter(
    (e) =>
      (category === "All" || e.category === category) &&
      [e.description, e.vendor, e.category]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="toolbar">
        <div>
          <span className="status-dot" /> Community accounts{" "}
          <span className="muted">
            · Updated {formatDate(communityConfig.lastUpdated)}
          </span>
        </div>
        <FilterSelect
          label="Financial year"
          value={year}
          options={years.map((y) => ({
            value: String(y.year),
            label: String(y.year),
          }))}
          onChange={(v) => {
            setYear(v);
            setCategory("All");
          }}
        />
      </div>
      {record.year === communityConfig.currentFestivalYear && (
        <div className="planned-budget">
          <div>
            <span className="eyebrow">PLANNED COLONY BUDGET</span>
            <strong>{formatINR(communityConfig.annualColonyBudget)}</strong>
          </div>
          <p>
            Budget set by the community. This spending plan is separate from
            money received and available cash.
          </p>
        </div>
      )}
      <div className="stats-grid">
        <StatCard
          label="Opening balance"
          value={formatINR(s.opening)}
          note="Carried from the previous year"
        />
        <StatCard
          label="Total income"
          value={formatINR(s.income)}
          note="Community collections & other income"
          icon="income"
        />
        <StatCard
          label="Total expenses"
          value={formatINR(s.expenses)}
          note="Common services & maintenance"
          icon="expense"
        />
        <StatCard
          label="Available balance"
          value={formatINR(s.balance)}
          note="Opening + income − expenses"
          featured
        />
      </div>
      <div className="two-columns section-space">
        <IncomeChart income={s.income} expenses={s.expenses} />
        <ExpenseChart expenses={record.expenses} />
      </div>
      <section className="section-space">
        <SectionHeading
          title={year + " community expenses"}
          description="A record of how our shared funds are used."
        />
        <div className="toolbar table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search expenses or vendor"
              aria-label="Search community expenses"
            />
          </label>
          <FilterSelect
            label="Category"
            value={category}
            options={[
              "All",
              ...new Set(record.expenses.map((e) => e.category)),
            ].map((c) => ({
              value: c,
              label: c === "All" ? "All categories" : c,
            }))}
            onChange={setCategory}
          />
        </div>
        {rows.length ? (
          <RecordsTable
            caption={year + " community expenses"}
            headers={["Date", "Description", "Category", "Amount", "Remarks"]}
            rows={rows.map((e) => [
              formatDate(e.date),
              <strong key="d">{e.description}</strong>,
              <span className="badge neutral" key="c">
                {e.category}
              </span>,
              <strong key="a">{formatINR(e.amount)}</strong>,
              e.remarks ?? "—",
            ])}
          />
        ) : (
          <EmptyState
            title="No matching expenses"
            description="Try another search or choose all categories."
          />
        )}
        <div className="table-summary">
          <span>
            {rows.length} of {record.expenses.length} records
          </span>
          <strong>Filtered total: {formatINR(total(rows))}</strong>
        </div>
      </section>
      <section className="section-space">
        <SectionHeading
          title="Community income"
          description="Collections and other income, recorded separately from festival funds."
        />
        <RecordsTable
          caption="Community income"
          headers={["Date", "Source", "Description", "Amount"]}
          rows={record.income.map((e) => [
            formatDate(e.date),
            e.category,
            e.description,
            formatINR(e.amount),
          ])}
        />
      </section>
      {!budgetOnly && (
        <section className="section-space">
          <SectionHeading
            eyebrow="CELEBRATING WITH CLARITY"
            title={year + " Ganesh festival accounts"}
            href="/ganesh-chaturthi"
            linkLabel="Festival details"
          />
          <div className="stats-grid">
            <StatCard
              label="Paid contributions"
              value={formatINR(s.contributions)}
              note={s.paidCount + " contribution records paid"}
              icon="heart"
            />
            <StatCard
              label="Festival expenses"
              value={formatINR(s.festivalExpenses)}
              icon="expense"
            />
            <StatCard
              label="Festival balance"
              value={formatINR(s.festivalBalance)}
              note={
                s.festivalBalance < 0
                  ? "Expenses currently exceed received income"
                  : "Festival income − expenses"
              }
              featured
            />
            <StatCard
              label="Laddu auction"
              value={record.auction ? formatINR(s.auction) : "Upcoming"}
              note={
                record.auction?.winnerName ?? "No auction income recorded yet"
              }
              icon="heart"
            />
          </div>
          <p className="account-note">
            Festival figures include {formatINR(s.donations)} in other
            donations. Pending pledges are excluded from money received.
          </p>
        </section>
      )}
      {previous && prev && (
        <section className="section-space">
          <SectionHeading
            title={previous.year + " financial summary"}
            description="Previous year closing position and festival history."
          />
          <div className="two-columns">
            <div className="panel calculation-card">
              <h3>Community fund</h3>
              {[
                ["Opening balance", prev.opening],
                [
                  "Community collections",
                  total(
                    previous.income.filter((i) => i.category === "Collections"),
                  ),
                ],
                [
                  "Other income",
                  total(
                    previous.income.filter((i) => i.category !== "Collections"),
                  ),
                ],
                ["Total expenses", prev.expenses],
                ["Closing balance", prev.balance],
              ].map(([label, value]) => (
                <div className="calculation-row" key={label}>
                  <span>{label}</span>
                  <strong>{formatINR(Number(value))}</strong>
                </div>
              ))}
            </div>
            <div className="panel calculation-card">
              <h3>Ganesh festival fund</h3>
              {[
                ["Paid contributions", prev.contributions],
                ["Other donations", prev.donations],
                ["Laddu auction", prev.auction],
                ["Festival expenses", prev.festivalExpenses],
                ["Festival balance", prev.festivalBalance],
              ].map(([label, value]) => (
                <div className="calculation-row" key={label}>
                  <span>{label}</span>
                  <strong>{formatINR(Number(value))}</strong>
                </div>
              ))}
            </div>
          </div>
          <div className="panel section-space">
            <h3>
              {previous.year} vs {year}
            </h3>
            <RecordsTable
              caption="Year comparison"
              headers={["Festival measure", String(previous.year), year]}
              rows={[
                [
                  "Paid contributions",
                  formatINR(prev.contributions),
                  formatINR(s.contributions),
                ],
                [
                  "Festival expenses",
                  formatINR(prev.festivalExpenses),
                  formatINR(s.festivalExpenses),
                ],
                [
                  "Laddu auction",
                  formatINR(prev.auction),
                  record.auction ? formatINR(s.auction) : "Upcoming",
                ],
              ]}
            />
          </div>
        </section>
      )}
      <TransparencyNote />
      {budgetOnly && (
        <Link href="/dashboard" className="button primary">
          View complete dashboard <ArrowUpRight size={17} />
        </Link>
      )}
    </>
  );
}
