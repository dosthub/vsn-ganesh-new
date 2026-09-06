"use client";
import { useState } from "react";
import { Bell, CalendarDays, Info } from "lucide-react";
import { FilterSelect } from "@/components/common/FilterSelect";
import { EmptyState } from "@/components/common/Shared";
import { formatDate } from "@/utils/format";
import type { Announcement } from "@/types/community";
export function Announcements({
  items,
  preview = false,
}: {
  items: Announcement[];
  preview?: boolean;
}) {
  const [filter, setFilter] = useState("All");
  const shown = items
    .filter((a) => a.active && (filter === "All" || a.priority === filter))
    .slice(0, preview ? 3 : undefined);
  return (
    <>
      {!preview && (
        <div className="toolbar">
          <span className="muted">Community updates and notices</span>
          <FilterSelect
            label="Notice type"
            value={filter}
            options={["All", "General", "Important", "Event"].map((f) => ({
              value: f,
              label: f === "All" ? "All notices" : f,
            }))}
            onChange={setFilter}
          />
        </div>
      )}
      {shown.length ? (
        <div className={preview ? "announcements-grid" : "announcements-list"}>
          {shown.map((a) => {
            const Icon =
              a.priority === "Event"
                ? CalendarDays
                : a.priority === "Important"
                  ? Bell
                  : Info;
            return (
              <article className="announcement-card" key={a.id}>
                <div className="announcement-top">
                  <span className={"badge " + a.priority.toLowerCase()}>
                    <Icon size={13} />
                    {a.priority}
                  </span>
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                </div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No announcements in this category"
          description="Please check another category."
        />
      )}
    </>
  );
}
