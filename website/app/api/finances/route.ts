import { NextResponse } from "next/server";
import { sheetConfig } from "@/lib/sheetConfig";

export const dynamic = "force-dynamic";

function csvUrl(sheetName: string) {
  return `https://docs.google.com/spreadsheets/d/${sheetConfig.spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}&t=${Date.now()}`;
}

function looksLikeCsv(text: string) {
  return Boolean(text) && !text.startsWith("<") && !/sign in|login required/i.test(text);
}

async function fetchCsv(names: readonly string[]) {
  let lastStatus = 0;
  for (const name of names) {
    const response = await fetch(csvUrl(name), { cache: "no-store" });
    const text = await response.text();
    lastStatus = response.status;
    if (response.ok && looksLikeCsv(text)) return text;
  }
  const error = new Error(
    lastStatus === 403 || lastStatus === 401
      ? "The Google Sheet is private. Share it as “Anyone with the link can view”."
      : "Google Sheet tabs could not be read.",
  );
  (error as Error & { status: number }).status =
    lastStatus === 403 || lastStatus === 401 ? 403 : 502;
  throw error;
}

export async function GET() {
  try {
    const [donationsCsv, expensesCsv] = await Promise.all([
      fetchCsv(sheetConfig.donationTabs),
      fetchCsv(sheetConfig.expenseTabs),
    ]);
    return NextResponse.json(
      {
        donationsCsv,
        expensesCsv,
        fetchedAt: new Date().toISOString(),
      },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    const status =
      error instanceof Error && "status" in error
        ? Number((error as Error & { status: number }).status)
        : 502;
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Sheet fetch failed",
        code: status === 403 ? "SHEET_FORBIDDEN" : "SHEET_UNAVAILABLE",
      },
      { status },
    );
  }
}
