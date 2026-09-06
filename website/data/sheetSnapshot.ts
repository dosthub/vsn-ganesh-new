import type { YearRecord } from "../types/community";
// Read-only browser import. Source cells have not been edited.
export const sheetSnapshotMetadata = {
  spreadsheetId: "1gfGm1bGOEE0IT1Kg97IGE1nsBfTxURS5NO7LfAZh-BY",
  donationsTab: "web Donations received",
  expensesTab: "Expenditure",
  importedOn: "2026-09-06",
  automaticSync: true,
  confirmation:
    "The owner confirmed that the two amounts with blank payment status are received.",
};
const donations: [string, number, string, string][] = [
  ["K. Srinivas Reddy", 1116, "9-03-2026", "20"],
  ["Sripathi SiddiRamulu", 1116, "9-03-2026", "2-A/36"],
  ["S. Sashi Kumar", 1000, "9-06-2026", "56"],
  ["W.Sudhakar", 5000, "9-02-2026", "2-A/73"],
  ["K. Nagaraju", 1000, "9-03-2026", "2-A/80"],
  ["M. Vishwanath", 5115, "9-05-2026", "82"],
  ["B. Mahesh", 2016, "9-03-2026", "2-A/87"],
  ["Mohan Reddy", 3116, "9-02-2026", "2-A/102NP"],
  ["G. Parthiv Reddy", 5116, "9-03-2026", "116"],
  ["G. Anand", 1111, "9-02-2026", "2-A/126"],
  ["P. Krishna Ram", 1000, "9-04-2026", "2-A/127"],
  ["B. Tirupathi", 1116, "9-04-2026", "2-A/130"],
  ["B.Venkateswarlu Charan", 5016, "", "204"],
  ["Krupakar", 1001, "9-04-2026", "168"],
  ["K. Vijaya Laxmi", 1000, "9-02-2026", "174"],
  ["Vemireddy. Nagarjuna Reddy", 5116, "9-04-2026", "2-A/186"],
  ["Ajmeer. Malya", 5000, "30-08-2026", "2-A/198"],
  ["N. Thirumala Reddy", 1016, "9-06-2026", "2-A/248"],
  ["Dayyala Vamshi Krishna", 1116, "3-09-2026", "-"],
  ["Tirupati", 1116, "4-09-2026", "130"],
  ["Karnati Prasad", 2116, "5-09-2026", "-"],
  ["S Shashi Kumar", 1000, "6-09-2026", "56"],
];
const expenseRows: [string, number, string, string, string][] = [
  ["Lighting and speakers", 5000, "2026-08-30", "advance", ""],
  ["shed mesh", 2050, "2026-09-04", "", ""],
  ["tags mesh cutter", 456, "2026-09-04", "", ""],
  ["Band", 4000, "2026-09-04", "advance", "parthiv reddy"],
  ["Decoration cloth and materials", 8000, "2026-09-05", "", ""],
  ["lights", 4000, "2026-09-05", "", ""],
];
export const sheetFinancials: YearRecord[] = [
  {
    source: "sheet-snapshot",
    year: 2026,
    openingBalance: 0,
    income: [],
    expenses: [],
    contributions: donations.map(
      ([contributorName, amount, sourceDate, houseNo], i) => ({
        id: "sheet-contribution-" + i,
        year: 2026,
        contributorName,
        amount,
        date: "",
        sourceDate,
        houseNo,
        paymentStatus: "paid",
        paymentMode: "",
        remarks: ["M. Vishwanath", "B.Venkateswarlu Charan"].includes(
          contributorName,
        )
          ? "Received — confirmed by owner; sheet status left unchanged"
          : "",
      }),
    ),
    festivalExpenses: expenseRows.map(
      ([description, amount, date, remarks, paidBy], i) => ({
        id: "sheet-expense-" + i,
        year: 2026,
        description,
        amount,
        date,
        remarks,
        paidBy,
        category: "Festival preparations",
      }),
    ),
    festivalDonations: [
      {
        id: "prior-laddu-receipt",
        year: 2026,
        date: "2026-08-20",
        description: "Sagar last year laddu amount",
        category: "Prior-year Laddu receipt",
        amount: 41750,
      },
    ],
    auction: null,
  },
];
