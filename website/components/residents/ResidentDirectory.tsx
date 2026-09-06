"use client";
import { useState } from "react";
import { Search, House } from "lucide-react";
import type { PaymentStatus, YearRecord } from "@/types/community";
import { useLiveFinancials } from "@/hooks/use-live-financials";
import { residentsFromRecord } from "@/lib/residentsFromSheet";
import { LiveStatus } from "@/components/common/LiveStatus";
import { SheetLoadGate } from "@/components/common/SheetLoadGate";
import { FilterSelect } from "@/components/common/FilterSelect";
import { EmptyState } from "@/components/common/Shared";

function statusLabel(status: PaymentStatus | undefined) {
  if (status === "unpaid") return "Unpaid";
  if (status === "pending") return "Pending";
  return "Paid";
}

export function ResidentDirectory({ records }: { records: YearRecord[] }) {
  const live = useLiveFinancials(records);
  const year = live.records[0]?.year;
  const residents = residentsFromRecord(
    live.records.find((record) => record.year === year) ?? live.records[0],
  );
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const matches = residents.filter(
    (resident) =>
      (status === "all" || resident.paymentStatus === status) &&
      [resident.houseNo, resident.ownerName]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const paidCount = residents.filter((r) => r.paymentStatus === "paid").length;
  const unpaidCount = residents.filter((r) => r.paymentStatus === "unpaid").length;
  return (
    <SheetLoadGate live={live}>
      <div className="toolbar table-toolbar">
        <LiveStatus
          live={live.live}
          loading={live.loading}
          updatedAt={live.updatedAt}
          error={live.error}
        />
        <label className="search-field">
          <Search size={18} />
          <input
            aria-label="Search residents"
            placeholder="Search house number or resident name"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <FilterSelect
          label="List"
          value={status}
          options={[
            { value: "all", label: "Paid and unpaid" },
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
          ]}
          onChange={setStatus}
        />
      </div>
      <p className="result-count" role="status">
        {matches.length} of {residents.length} households · {paidCount} paid ·{" "}
        {unpaidCount} unpaid
      </p>
      {matches.length ? (
        <div className="resident-grid">
          {matches.map((resident) => (
            <article className="resident-card" key={resident.id}>
              <div className="resident-top">
                <span className="house-tag">
                  <House size={18} />
                  {resident.houseNo}
                </span>
                <span
                  className={
                    "badge " + (resident.paymentStatus ?? "paid")
                  }
                >
                  {statusLabel(resident.paymentStatus)}
                </span>
              </div>
              <h3>{resident.ownerName}</h3>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching households"
          description="Try another name, house number or list."
        />
      )}
    </SheetLoadGate>
  );
}
