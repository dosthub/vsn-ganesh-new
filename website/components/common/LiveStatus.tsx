export function LiveStatus({
  live,
  loading,
  updatedAt,
  error,
}: {
  live: boolean;
  loading: boolean;
  updatedAt: string | null;
  error: string | null;
}) {
  const time = updatedAt
    ? new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(updatedAt))
    : null;
  const label = live
    ? `Loaded from Google Sheet${time ? ` · ${time}` : ""}`
    : loading
      ? "Loading Google Sheet…"
      : "Saved snapshot · sheet was not readable on this visit";
  return (
    <div>
      <span className={"status-dot" + (live ? " live" : " stale")} /> {label}
      {!live && error ? (
        <div className="sheet-blocked">
          <strong>New Excel rows are not on the website yet.</strong>
          The “web Donations received” tab is private, so this page cannot read
          it. In Google Sheets click Share → Anyone with the link → Viewer, then
          reload this page.
        </div>
      ) : null}
    </div>
  );
}
