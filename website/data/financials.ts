import type { YearRecord, Transaction } from "@/types/community";
import { residents } from "./residents.ts";
import { summarize } from "../utils/calculations.ts";
const colonyItems: [string, string, number, string][] = [
  ["Street light repairs", "Maintenance", 3500, "Replaced two lamps"],
  ["Water tank cleaning", "Cleaning", 2500, "Quarterly cleaning"],
  ["Security service — January", "Security", 6000, "Monthly service"],
  ["Water pump service", "Water", 4200, "Routine servicing"],
  ["Community garden care", "Maintenance", 1800, "Seasonal upkeep"],
  ["Security service — February", "Security", 6000, "Monthly service"],
  ["Common area cleaning", "Cleaning", 3000, "Cleaning supplies and labour"],
  ["Water pipeline repair", "Water", 5500, "Common supply line"],
  ["Security service — March", "Security", 6000, "Monthly service"],
  ["Street light electricity", "Maintenance", 3600, "Common area lighting"],
  ["Community meeting supplies", "Other", 1200, "Meeting arrangements"],
  ["Drain cleaning", "Cleaning", 4500, "Pre-monsoon work"],
  ["Security service — April", "Security", 6000, "Monthly service"],
  ["Water pump electricity", "Water", 3800, "Common water supply"],
  ["Notice board repair", "Maintenance", 2100, "Refurbishment"],
];
const festivalItems: [string, string, number][] = [
  ["Ganesh idol", "Ganesh Idol", 22000],
  ["Mandap decoration", "Decorations", 15500],
  ["Flower arrangements", "Flowers", 4200],
  ["Puja materials", "Puja Items", 5200],
  ["Festival lighting", "Lighting", 8000],
  ["Sound system", "Sound System", 6500],
  ["Annadanam provisions", "Annadanam", 18000],
  ["Cultural programme", "Cultural Programs", 3500],
  ["Transport arrangements", "Transport", 3500],
  ["Immersion vehicle", "Nimajjanam", 7000],
  ["Cleaning after celebration", "Cleaning", 1800],
  ["Miscellaneous supplies", "Other", 2300],
];
function entries(
  year: number,
  items: [string, string, number, string?][],
  festival = false,
): Transaction[] {
  return items.map(([description, category, amount, remarks], i) => ({
    id: (festival ? "festival-" : "colony-") + year + "-" + i,
    year,
    date:
      year +
      "-" +
      (festival ? "08" : String(1 + Math.floor(i / 3)).padStart(2, "0")) +
      "-" +
      String(5 + i).padStart(2, "0"),
    description,
    category,
    amount: Math.round(amount * (1 - (2026 - year) * 0.08)),
    vendor: "Sample vendor " + (i + 1),
    remarks: remarks ?? "Sample record",
  }));
}
let opening = 75000;
export const financials: YearRecord[] = [2023, 2024, 2025, 2026].map((year) => {
  const factor = 1 - (2026 - year) * 0.08;
  const record: YearRecord = {
    year,
    openingBalance: opening,
    income: [
      {
        id: "collections-" + year,
        year,
        date: year + "-02-01",
        description: "Annual community collections",
        category: "Collections",
        amount: Math.round(85000 * factor),
        remarks: "Sample annual collection",
      },
      {
        id: "other-" + year,
        year,
        date: year + "-05-10",
        description: "Community hall fund donation",
        category: "Other Income",
        amount: 10000,
        remarks: "Sample donation",
      },
    ],
    expenses: entries(year, colonyItems),
    contributions: Array.from({ length: 28 }, (_, i) => {
      const r = residents[i % residents.length];
      return {
        id: "contribution-" + year + "-" + i,
        year,
        houseNo: r.houseNo,
        contributorName: i < 20 ? r.ownerName : r.ownerName + " (family)",
        amount: Math.round((1500 + (i % 5) * 500) * factor),
        date: year + "-08-" + String(1 + i).padStart(2, "0"),
        paymentStatus: year === 2026 && i > 23 ? "pending" : "paid",
        paymentMode: i % 2 ? "UPI" : "Cash",
      };
    }),
    festivalExpenses: entries(year, festivalItems, true),
    festivalDonations: [
      {
        id: "donation-" + year,
        year,
        date: year + "-08-20",
        description: "Community festival sponsorship",
        category: "Other Donations",
        amount: 10000,
      },
    ],
    auction:
      year === 2026
        ? null
        : {
            year,
            winnerName: residents[(year - 2023) * 3].ownerName,
            houseNo: residents[(year - 2023) * 3].houseNo,
            amount: year === 2025 ? 51116 : year === 2024 ? 42116 : 35000,
            date: year + "-09-20",
          },
  };
  opening = summarize(record).balance;
  return record;
});
