"use client";
import { useState } from "react";
import { Search } from "lucide-react";
import type { YearRecord } from "@/types/community";
import { summarize, total } from "@/utils/calculations";
import { formatINR, formatDate } from "@/utils/format";
import {
  SectionHeading,
  StatCard,
  EmptyState,
} from "@/components/common/Shared";
import { LiveStatus } from "@/components/common/LiveStatus";
import { useLiveFinancials } from "@/hooks/use-live-financials";
import { FilterSelect } from "@/components/common/FilterSelect";
import { SheetLoadGate } from "@/components/common/SheetLoadGate";
import { RecordsTable } from "@/components/common/RecordsTable";
import { ExpenseChart } from "@/components/dashboard/FinancialCharts";
import { communityConfig } from "@/data/community";
export function FestivalDashboard({
  records: initialRecords,
}: {
  records: YearRecord[];
}) {
  const live = useLiveFinancials(initialRecords);
  const records = live.records;
  const years = [...records].sort((a, b) => b.year - a.year);
  const [year, setYear] = useState(String(years[0]?.year ?? 2026));
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [expenseCategory, setExpenseCategory] = useState("All");
  const r = records.find((r) => String(r.year) === year);
  if (!r)
    return (
      <EmptyState
        title="Contribution details will be updated soon"
        description="No financial records are available for this celebration."
      />
    );
  const s = summarize(r);
  const contributors = r.contributions.filter(
    (c) =>
      (status === "all" || c.paymentStatus === status) &&
      [c.houseNo, c.contributorName]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const expenses = r.festivalExpenses.filter(
    (e) => expenseCategory === "All" || e.category === expenseCategory,
  );
  return (
    <SheetLoadGate live={live}>
      <div className="toolbar">
        <LiveStatus
          live={live.live}
          loading={live.loading}
          updatedAt={live.updatedAt}
          error={live.error}
        />
        <FilterSelect
          label="Festival year"
          value={year}
          options={years.map((y) => ({
            value: String(y.year),
            label: String(y.year),
          }))}
          onChange={(v) => {
            setYear(v);
            setExpenseCategory("All");
          }}
        />
      </div>
      <div className="stats-grid three">
        <StatCard
          label="Paid contributions"
          value={formatINR(s.contributions)}
          icon="heart"
        />
        <StatCard
          label="Previous-year Laddu receipt"
          value={formatINR(s.donations)}
          icon="income"
        />
        <StatCard
          label="Laddu auction"
          value={r.auction ? formatINR(s.auction) : "Upcoming"}
          note={r.auction?.winnerName ?? "Not included until recorded"}
          icon="heart"
        />
        <StatCard
          label="Total festival income"
          value={formatINR(s.festivalIncome)}
          note="Current donations + prior-year receipt + current auction"
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
              ? "Expenses exceed received income"
              : "Available after recorded expenses"
          }
          featured
        />
      </div>
      <p className="account-note">
        {live.live
          ? "These figures were read from the Google Sheet when this page loaded. Reload the page to pick up new rows. Blank payment status is treated as received. Donation dates are shown exactly as entered because the sheet uses mixed date formats. Separate rows are preserved, including similarly named donors. Blank contribution amounts are not treated as pledges."
          : "Could not read the Google Sheet on this visit. Share it as “Anyone with the link can view”, then reload. Blank payment status is treated as received."}
      </p>
      <section id="contributors" className="section-space">
        <SectionHeading
          eyebrow="EVERY CONTRIBUTION COUNTS"
          title={year + " festival contributors"}
          description="Thank you for making our celebrations possible."
        />
        <div className="contributor-stats">
          <div>
            <strong>{r.contributions.length}</strong>
            <span>Households on the sheet</span>
          </div>
          <div>
            <strong>{s.paidCount}</strong>
            <span>Paid contributions</span>
          </div>
          <div>
            <strong>
              {formatINR(s.paidCount ? s.contributions / s.paidCount : 0)}
            </strong>
            <span>Average paid contribution</span>
          </div>
          <div>
            <strong>{formatINR(s.pending)}</strong>
            <span>Pending pledges</span>
          </div>
        </div>
        <div className="special-donors">
          {communityConfig.specialDonors.map((donor) => (
            <article className="special-donor-card" key={donor.role}>
              <span className="eyebrow">{donor.role}</span>
              <h3>{donor.names}</h3>
              <strong>{donor.detail}</strong>
            </article>
          ))}
        </div>
        <div className="toolbar table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input
              aria-label="Search contributors"
              placeholder="Search house number or contributor"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <FilterSelect
            label="Payment status"
            value={status}
            options={[
              { value: "all", label: "Paid and unpaid" },
              { value: "paid", label: "Paid" },
              { value: "unpaid", label: "Unpaid" },
              { value: "pending", label: "Pending" },
            ]}
            onChange={setStatus}
          />
        </div>
        {contributors.length ? (
          <RecordsTable
            caption={year + " Ganesh contributors"}
            headers={[
              "S.No",
              "House no.",
              "Contributor",
              "Contribution",
              "Status",
              "Date",
            ]}
            rows={contributors.map((c) => [
              r.contributions.indexOf(c) + 1,
              c.houseNo || "-",
              <strong key="n">{c.contributorName}</strong>,
              c.paymentStatus === "unpaid" ? "—" : formatINR(c.amount),
              <span key="s" className={"badge " + c.paymentStatus}>
                {c.paymentStatus === "paid"
                  ? "Paid"
                  : c.paymentStatus === "unpaid"
                    ? "Unpaid"
                    : "Pending"}
              </span>,
              c.sourceDate !== undefined
                ? c.sourceDate || "Not recorded"
                : formatDate(c.date),
            ])}
          />
        ) : (
          <EmptyState
            title="No matching contributors"
            description="Try another name, house number or payment status."
          />
        )}
        <div className="table-summary">
          <span>{contributors.length} matching records</span>
          <strong>
            Paid total:{" "}
            {formatINR(
              total(contributors.filter((c) => c.paymentStatus === "paid")),
            )}
          </strong>
        </div>
      </section>
      <section className="section-space">
        <SectionHeading
          title={year + " festival expenses"}
          description="From the idol and decorations to meals and transport."
        />
        <div className="toolbar">
          <span className="muted">{expenses.length} recorded expenses</span>
          <FilterSelect
            label="Expense category"
            value={expenseCategory}
            options={[
              "All",
              ...new Set(r.festivalExpenses.map((e) => e.category)),
            ].map((c) => ({
              value: c,
              label: c === "All" ? "All categories" : c,
            }))}
            onChange={setExpenseCategory}
          />
        </div>
        {expenses.length ? (
          <RecordsTable
            caption="Festival expense records"
            headers={["Date", "Expense", "Paid by", "Remarks", "Amount"]}
            rows={expenses.map((e) => [
              formatDate(e.date),
              <strong key="d">{e.description}</strong>,
              e.paidBy || "—",
              e.remarks || "—",
              formatINR(e.amount),
            ])}
          />
        ) : (
          <EmptyState
            title="No expenses recorded"
            description="Expense details will be shared here."
          />
        )}
        <div className="table-summary">
          <span>Filtered expense total</span>
          <strong>{formatINR(total(expenses))}</strong>
        </div>
      </section>
      <div className="two-columns section-space">
        <ExpenseChart expenses={r.festivalExpenses} />
        <div className="panel calculation-card">
          <h3>Every rupee, accounted for</h3>
          <p className="muted">{year} festival financial summary</p>
          {[
            ["Paid contributions", s.contributions],
            ["Previous-year Laddu receipt", s.donations],
            ["Laddu auction", s.auction],
            ["Total income", s.festivalIncome],
            ["Less: festival expenses", s.festivalExpenses],
            ["Festival balance", s.festivalBalance],
          ].map(([label, value]) => (
            <div className="calculation-row" key={label}>
              <span>{label}</span>
              <strong>{formatINR(Number(value))}</strong>
            </div>
          ))}
          <p className="account-note">
            Pending pledges of {formatINR(s.pending)} are not included in
            income.
          </p>
        </div>
      </div>
      {years.some((y) => y.auction) && (
        <section className="section-space">
          <SectionHeading
            eyebrow="A CHERISHED TRADITION"
            title="Ganesh Laddu auction history"
            description="Celebrating the generosity that brings our community together."
          />
          <div className="auction-grid">
            {years
              .filter((y) => y.auction)
              .map((y) => (
                <article className="auction-card" key={y.year}>
                  <span className="eyebrow">{y.year} CELEBRATION</span>
                  <span className="muted">Winning bid</span>
                  <strong>{formatINR(y.auction!.amount)}</strong>
                  <h3>{y.auction!.winnerName}</h3>
                  <p>{y.auction!.houseNo} · Sample record</p>
                </article>
              ))}
          </div>
          <RecordsTable
            caption="Laddu auction history"
            headers={["Year", "Winner", "House no.", "Auction amount"]}
            rows={years
              .filter((y) => y.auction)
              .map((y) => [
                y.year,
                y.auction!.winnerName,
                y.auction!.houseNo,
                formatINR(y.auction!.amount),
              ])}
          />
        </section>
      )}
      <section className="thanks-panel section-space">
        <span className="eyebrow">WITH GRATITUDE</span>
        <h2>Thank you to our community contributors</h2>
        <p>Every contribution helps us celebrate together as one community.</p>
        <div className="contributor-names">
          {Array.from(
            new Set(
              r.contributions
                .filter((c) => c.paymentStatus === "paid")
                .map((c) => c.contributorName),
            ),
          )
            .sort()
            .map((name) => (
              <span key={name}>{name}</span>
            ))}
        </div>
      </section>
    </SheetLoadGate>
  );
}
