import type { Transaction } from "@/types/community";
import { formatINR } from "@/utils/format";
export function IncomeChart({
  income,
  expenses,
}: {
  income: number;
  expenses: number;
}) {
  const max = Math.max(income, expenses, 1);
  return (
    <article className="panel chart-panel">
      <h3>Income & expenses</h3>
      <p className="muted">A simple view of this year’s movement</p>
      <div className="horizontal-chart">
        {[
          ["Income", income],
          ["Expenses", expenses],
        ].map(([label, value]) => (
          <div key={label}>
            <div className="bar-label">
              <span>{label}</span>
              <strong>{formatINR(Number(value))}</strong>
            </div>
            <div className="bar-track">
              <div
                className={label === "Income" ? "bar-fill" : "bar-fill gold"}
                style={{ width: (Number(value) / max) * 100 + "%" }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="chart-key">
        <span>
          <i /> Money received
        </span>
        <span>
          <i className="gold" /> Money spent
        </span>
      </div>
    </article>
  );
}
export function ExpenseChart({ expenses }: { expenses: Transaction[] }) {
  const totals = expenses.reduce<Record<string, number>>(
    (acc, item) => ({
      ...acc,
      [item.category]: (acc[item.category] ?? 0) + item.amount,
    }),
    {},
  );
  const entries = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const colors = [
    "#245b41",
    "#b58536",
    "#809573",
    "#d1b57a",
    "#91ada3",
    "#647b70",
    "#d8d7c5",
    "#94734e",
    "#b8c9b0",
    "#819c9b",
    "#ccc0a7",
    "#516e55",
  ];
  let progress = 0;
  const gradient = entries
    .map(([, v], i) => {
      const start = progress;
      progress += total ? (v / total) * 100 : 0;
      return colors[i % colors.length] + " " + start + "% " + progress + "%";
    })
    .join(",");
  return (
    <article className="panel chart-panel">
      <h3>Where the funds go</h3>
      <p className="muted">Expenses by category</p>
      <div className="expense-chart">
        <div
          className="donut"
          aria-hidden="true"
          style={{
            background: total ? "conic-gradient(" + gradient + ")" : "#e6ece5",
          }}
        >
          <div>
            <span>Total spent</span>
            <strong>{formatINR(total)}</strong>
          </div>
        </div>
        <ul className="chart-legend">
          {entries.map(([key, value], i) => (
            <li key={key}>
              <i style={{ background: colors[i % colors.length] }} />
              <span>{key}</span>
              <strong>{formatINR(value)}</strong>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
