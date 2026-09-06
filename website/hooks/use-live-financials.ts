"use client";
import { useEffect, useRef, useState } from "react";
import type { YearRecord } from "@/types/community";
import { fetchLiveFinancials } from "@/lib/fetchLiveSheet";

export type LiveFinancialsState = {
  records: YearRecord[];
  live: boolean;
  loading: boolean;
  updatedAt: string | null;
  error: string | null;
};

export function useLiveFinancials(initial: YearRecord[]): LiveFinancialsState {
  const fallback = useRef(initial);
  const [state, setState] = useState<LiveFinancialsState>({
    records: initial,
    live: false,
    loading: true,
    updatedAt: null,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const record = await Promise.race([
          fetchLiveFinancials(),
          new Promise<never>((_, reject) =>
            window.setTimeout(
              () =>
                reject(
                  new Error(
                    "Timed out reading the Google Sheet. Share it as “Anyone with the link can view”, then reload.",
                  ),
                ),
              8_000,
            ),
          ),
        ]);
        if (cancelled) return;
        setState({
          records: [record],
          live: true,
          loading: false,
          updatedAt: record.fetchedAt ?? new Date().toISOString(),
          error: null,
        });
      } catch (error) {
        if (cancelled) return;
        setState({
          records: fallback.current,
          live: false,
          loading: false,
          updatedAt: null,
          error:
            error instanceof Error
              ? error.message
              : "Could not read the Google Sheet on this page load",
        });
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
