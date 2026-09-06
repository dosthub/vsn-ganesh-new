import type { Contribution, Transaction, YearRecord } from "../types/community.ts";
import { sheetConfig } from "./sheetConfig.ts";

export type SheetTable = {
  headers: string[];
  rows: string[][];
};

const LADDU_NAME = /sagar/i;
const LADDU_HINT = /last year|laddu/i;
const TOTAL_LABEL = /^(total|sum|grand total|overall)?$/i;

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function findColumn(headers: string[], aliases: string[]) {
  const normalized = headers.map(normalizeHeader);
  for (const alias of aliases) {
    const index = normalized.indexOf(alias);
    if (index >= 0) return index;
  }
  return -1;
}

function cell(row: string[], index: number) {
  return index >= 0 ? (row[index] ?? "").trim() : "";
}

function parseAmount(value: string) {
  const cleaned = value.replace(/[₹,\s]/g, "");
  if (!cleaned) return null;
  const amount = Number(cleaned);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  return Math.round(amount * 100) / 100;
}

function isExcelSerial(value: string) {
  if (!/^\d{5}(?:\.0+)?$/.test(value.trim())) return false;
  const n = Number(value);
  return n >= 30000 && n <= 80000;
}

function excelSerialToUtcDate(serial: number) {
  return new Date(Date.UTC(1899, 11, 30) + Math.round(serial) * 86_400_000);
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatSourceDate(date: Date) {
  return `${date.getUTCDate()}-${pad(date.getUTCMonth() + 1)}-${date.getUTCFullYear()}`;
}

function formatIsoDate(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function parseLooseDate(value: string): Date | null {
  const text = value.trim();
  if (!text) return null;
  if (isExcelSerial(text)) return excelSerialToUtcDate(Number(text));
  const iso = text.match(
    /^(\d{4})[-/](\d{1,2})[-/](\d{1,2})(?:[T\s].*)?$/,
  );
  if (iso) {
    return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  }
  const dmy = text.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return new Date(Date.UTC(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1])));
  }
  return null;
}

export function parseCsv(text: string): SheetTable {
  const source = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') {
      quoted = true;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      continue;
    }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && source[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((value) => value.trim())) rows.push(row);
      row = [];
      field = "";
      continue;
    }
    field += ch;
  }
  if (field || row.length) {
    row.push(field);
    if (row.some((value) => value.trim())) rows.push(row);
  }
  if (!rows.length) return { headers: [], rows: [] };
  return {
    headers: rows[0].map((header) => header.trim()),
    rows: rows.slice(1),
  };
}

export function parseGvizResponse(text: string): SheetTable {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("Google Sheet response was empty");
  const sanitized = text
    .slice(start, end + 1)
    .replace(/:Date\((\d+),(\d+),(\d+)(?:,(\d+),(\d+),(\d+))?\)/g, (_, y, m, d) => {
      const date = new Date(Date.UTC(Number(y), Number(m), Number(d)));
      return `:"${formatSourceDate(date)}"`;
    });
  const data = JSON.parse(sanitized) as {
    status?: string;
    errors?: { detailed_message?: string; message?: string }[];
    table?: {
      cols: { label?: string; id?: string }[];
      rows?: { c?: ({ v?: unknown; f?: string } | null)[] }[];
    };
  };
  if (data.status && data.status !== "ok") {
    throw new Error(
      data.errors?.[0]?.detailed_message ??
        data.errors?.[0]?.message ??
        "Google Sheet query failed",
    );
  }
  const table = data.table;
  if (!table) throw new Error("Google Sheet table was missing");
  return {
    headers: table.cols.map((col) => String(col.label || col.id || "").trim()),
    rows: (table.rows ?? []).map((row) =>
      (row.c ?? []).map((cellValue) => {
        if (!cellValue) return "";
        if (cellValue.f != null && String(cellValue.f).trim() !== "") {
          return String(cellValue.f).trim();
        }
        if (cellValue.v == null) return "";
        return String(cellValue.v).trim();
      }),
    ),
  };
}

function donationColumns(headers: string[]) {
  return {
    serial: findColumn(headers, ["sno", "serial", "slno", "sl"]),
    name: findColumn(headers, ["contributor", "contributorname", "name"]),
    amount: findColumn(headers, ["contribution", "amount", "donated"]),
    date: findColumn(headers, ["date"]),
    house: findColumn(headers, [
      "plotnumber",
      "plotno",
      "plot",
      "houseno",
      "hno",
      "house",
      "housenumber",
    ]),
    status: findColumn(headers, ["status", "paymentstatus"]),
  };
}

function expenseColumns(headers: string[]) {
  return {
    description: findColumn(headers, ["description", "expense", "particulars"]),
    amount: findColumn(headers, ["amount"]),
    date: findColumn(headers, ["date"]),
    remarks: findColumn(headers, ["remarks", "remark", "notes"]),
    paidBy: findColumn(headers, ["paidby", "payer", "paid"]),
  };
}

function isLadduReceipt(name: string) {
  return LADDU_NAME.test(name) && LADDU_HINT.test(name);
}

export function mapSheetFinancials(
  donations: SheetTable,
  expenses: SheetTable,
  fetchedAt = new Date().toISOString(),
): YearRecord {
  const year = sheetConfig.year;
  const donationCols = donationColumns(donations.headers);
  const expenseCols = expenseColumns(expenses.headers);
  const contributions: Contribution[] = [];
  const festivalDonations: Transaction[] = [];

  donations.rows.forEach((row, index) => {
    const contributorName = cell(row, donationCols.name);
    if (!contributorName || TOTAL_LABEL.test(contributorName)) return;
    const amount = parseAmount(cell(row, donationCols.amount));
    const rawDate = cell(row, donationCols.date);
    const parsedDate = parseLooseDate(rawDate);
    const sourceDate = isExcelSerial(rawDate)
      ? parsedDate
        ? formatSourceDate(parsedDate)
        : ""
      : rawDate;
    const statusText = cell(row, donationCols.status);
    if (isLadduReceipt(contributorName)) {
      if (amount == null) return;
      festivalDonations.push({
        id: "sheet-donation-" + index,
        year,
        date: parsedDate ? formatIsoDate(parsedDate) : "2026-08-20",
        description: contributorName,
        category: "Prior-year Laddu receipt",
        amount,
      });
      return;
    }
    const serial = Number(cell(row, donationCols.serial));
    const forcePaid =
      Number.isInteger(serial) &&
      (sheetConfig.paidSerialNumbers as readonly number[]).includes(serial);
    const pending = /pending|unpaid|due/i.test(statusText);
    const unpaid = amount == null && !pending && !forcePaid;
    contributions.push({
      id: "sheet-contribution-" + index,
      year,
      contributorName,
      amount: amount ?? 0,
      date: "",
      sourceDate,
      houseNo: cell(row, donationCols.house) || "-",
      paymentStatus: pending && !forcePaid ? "pending" : unpaid ? "unpaid" : "paid",
      paymentMode: "",
      remarks: forcePaid && amount == null
        ? "Marked paid"
        : unpaid
          ? "No contribution recorded"
          : statusText
            ? ""
            : "Received — confirmed by owner; sheet status left unchanged",
    });
  });

  const festivalExpenses: Transaction[] = [];
  expenses.rows.forEach((row, index) => {
    const description = cell(row, expenseCols.description);
    if (!description || TOTAL_LABEL.test(description)) return;
    const amount = parseAmount(cell(row, expenseCols.amount));
    if (amount == null) return;
    const rawDate = cell(row, expenseCols.date);
    const parsedDate = parseLooseDate(rawDate);
    festivalExpenses.push({
      id: "sheet-expense-" + index,
      year,
      description,
      amount,
      date: parsedDate ? formatIsoDate(parsedDate) : rawDate,
      remarks: cell(row, expenseCols.remarks),
      paidBy: cell(row, expenseCols.paidBy),
      category: "Festival preparations",
    });
  });

  return {
    source: "google-sheets",
    year,
    openingBalance: 0,
    income: [],
    expenses: [],
    contributions,
    festivalExpenses,
    festivalDonations,
    auction: null,
    fetchedAt,
  };
}
