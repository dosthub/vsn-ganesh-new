import type { YearRecord } from "@/types/community";
import { sheetConfig } from "./sheetConfig.ts";
import {
  mapSheetFinancials,
  parseCsv,
  parseGvizResponse,
  type SheetTable,
} from "./sheetCsv.ts";

export type LiveSheetPayload = {
  donationsCsv: string;
  expensesCsv: string;
  fetchedAt: string;
};

type LoadedTables = {
  donations: SheetTable;
  expenses: SheetTable;
  fetchedAt: string;
};

async function readApi(url: string): Promise<LoadedTables | null> {
  const response = await fetch(url, { cache: "no-store" });
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  const payload = (await response.json()) as LiveSheetPayload & {
    error?: string;
    code?: string;
  };
  if (payload.code === "SHEET_FORBIDDEN" || response.status === 403) {
    throw new Error(
      payload.error ||
        "The Google Sheet is private. Share it as “Anyone with the link can view”, then reload.",
    );
  }
  if (!response.ok || payload.error || !payload.donationsCsv || !payload.expensesCsv) {
    return null;
  }
  return {
    donations: parseCsv(payload.donationsCsv),
    expenses: parseCsv(payload.expensesCsv),
    fetchedAt: payload.fetchedAt,
  };
}

async function loadTableFromApi(): Promise<LoadedTables | null> {
  for (const url of ["/api/finances/", "/api/finances"]) {
    try {
      const tables = await readApi(url);
      if (tables) return tables;
    } catch (error) {
      if (error instanceof Error && /private|Anyone with the link/i.test(error.message)) {
        throw error;
      }
    }
  }
  return null;
}

function fetchGvizTable(sheetName: string) {
  return new Promise<SheetTable>((resolve, reject) => {
    const callback = `__gviz_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement("script");
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("Timed out loading the Google Sheet"));
    }, 6_000);
    const cleanup = () => {
      window.clearTimeout(timer);
      script.remove();
      delete (window as unknown as Record<string, unknown>)[callback];
    };
    (window as unknown as Record<string, (response: unknown) => void>)[
      callback
    ] = (response) => {
      cleanup();
      try {
        resolve(parseGvizResponse(JSON.stringify(response)));
      } catch (error) {
        reject(error);
      }
    };
    const params = new URLSearchParams({
      tqx: `responseHandler:${callback}`,
      sheet: sheetName,
      t: String(Date.now()),
    });
    script.src = `https://docs.google.com/spreadsheets/d/${sheetConfig.spreadsheetId}/gviz/tq?${params.toString()}`;
    script.onerror = () => {
      cleanup();
      reject(
        new Error(
          "The Google Sheet is private. Share it as “Anyone with the link can view”, then reload.",
        ),
      );
    };
    document.head.appendChild(script);
  });
}

async function firstAvailableTable(names: readonly string[]) {
  let lastError: unknown;
  for (const name of names) {
    try {
      return await fetchGvizTable(name);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("Google Sheet tabs were not readable");
}

async function loadTableFromGoogle(): Promise<LoadedTables> {
  const [donations, expenses] = await Promise.all([
    firstAvailableTable(sheetConfig.donationTabs),
    firstAvailableTable(sheetConfig.expenseTabs),
  ]);
  return {
    donations,
    expenses,
    fetchedAt: new Date().toISOString(),
  };
}

export async function fetchLiveFinancials(): Promise<YearRecord> {
  const tables = (await loadTableFromApi()) ?? (await loadTableFromGoogle());
  if (!tables.donations.headers.length) {
    throw new Error("Donation sheet did not include a header row");
  }
  return mapSheetFinancials(tables.donations, tables.expenses, tables.fetchedAt);
}
