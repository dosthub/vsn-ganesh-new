import type { LiveFinancialsState } from "@/hooks/use-live-financials";

export function SheetLoadGate({
  live,
  children,
}: {
  live: LiveFinancialsState;
  children: React.ReactNode;
}) {
  if (live.loading && !live.live) {
    return (
      <div className="sheet-loading" role="status" aria-live="polite">
        Loading the latest figures from the Google Sheet…
      </div>
    );
  }
  return children;
}
