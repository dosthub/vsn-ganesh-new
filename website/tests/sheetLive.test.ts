import test from "node:test";
import assert from "node:assert/strict";
import { mapSheetFinancials, parseCsv } from "../lib/sheetCsv.ts";
import { residentsFromRecord } from "../lib/residentsFromSheet.ts";
import { summarize } from "../utils/calculations.ts";

const donationsCsv = `S.No,Contributor,Contribution,Date,House no.,Status
,Sagar last year amount,41750,46254,,
,K. Srinivas Reddy,1116,9-03-2026,20,
,Sripathi SiddiRamulu,1116,9-03-2026,2-A/36,
,S. Sashi Kumar,1000,9-06-2026,56,
,W.Sudhakar,5000,9-02-2026,2-A/73,
,K. Nagaraju,1000,9-03-2026,2-A/80,
,M. Vishwanath,5115,9-05-2026,82,
,B. Mahesh,2016,9-03-2026,2-A/87,
,Mohan Reddy,3116,9-02-2026,2-A/102NP,
,G. Parthiv Reddy,5116,9-03-2026,116,
,G. Anand,1111,9-02-2026,2-A/126,
,P. Krishna Ram,1000,9-04-2026,2-A/127,
,B. Tirupathi,1116,9-04-2026,2-A/130,
,B.Venkateswarlu Charan,5016,,204,
,Krupakar,1001,9-04-2026,168,
,K. Vijaya Laxmi,1000,9-02-2026,174,
,Vemireddy. Nagarjuna Reddy,5116,9-04-2026,2-A/186,
,Ajmeer. Malya,5000,30-08-2026,2-A/198,
,N. Thirumala Reddy,1016,9-06-2026,2-A/248,
,Dayyala Vamshi Krishna,1116,3-09-2026,,
,Tirupati,1116,4-09-2026,130,
,Karnati Prasad,2116,5-09-2026,,
,S Shashi Kumar,1000,6-09-2026,56,
,Blank amount row,,,20,
,Total,999999,,
`;

const expensesCsv = `Description,Amount,Date,Remarks,paid by
Lighting and speakers,5000,46264,advance,
shed mesh,2050,2026-09-04,,
tags mesh cutter,456,4-09-2026,,
Band,4000,2026-09-04,advance,parthiv reddy
Decoration cloth and materials,8000,2026-09-05,,
lights,4000,2026-09-05,,
`;

const record = mapSheetFinancials(parseCsv(donationsCsv), parseCsv(expensesCsv));
const s = summarize(record);

test("live parser splits the prior-year Laddu receipt from current donations", () => {
  assert.equal(record.source, "google-sheets");
  assert.equal(
    record.contributions.filter((c) => c.paymentStatus === "paid").length,
    22,
  );
  assert.equal(s.contributions, 51319);
  assert.equal(s.donations, 41750);
  assert.equal(record.festivalDonations[0]?.category, "Prior-year Laddu receipt");
  assert.equal(record.festivalDonations[0]?.date, "2026-08-20");
});

test("blank amounts stay on the unpaid list and do not count as income", () => {
  const blank = record.contributions.find(
    (c) => c.contributorName === "Blank amount row",
  );
  assert.equal(blank?.paymentStatus, "unpaid");
  assert.equal(blank?.amount, 0);
  assert.equal(
    record.contributions.some((c) => c.contributorName === "Total"),
    false,
  );
  assert.equal(s.contributions, 51319);
});

test("live parser keeps mixed donation dates and converts expense serials", () => {
  assert.equal(
    record.contributions.find((c) => c.contributorName === "K. Srinivas Reddy")
      ?.sourceDate,
    "9-03-2026",
  );
  assert.equal(
    record.contributions.find(
      (c) => c.contributorName === "B.Venkateswarlu Charan",
    )?.sourceDate,
    "",
  );
  assert.equal(
    record.festivalExpenses.find((e) => e.description === "Lighting and speakers")
      ?.date,
    "2026-08-30",
  );
  assert.equal(
    record.festivalExpenses.find((e) => e.description === "Band")?.paidBy,
    "parthiv reddy",
  );
  assert.equal(s.festivalExpenses, 23506);
  assert.equal(s.festivalBalance, 69563);
});

test("quoted CSV fields keep commas inside names", () => {
  const table = parseCsv(
    `Contributor,Contribution,Date,House no.,Status\n"Reddy, Anand",1111,9-02-2026,126,\n`,
  );
  const mapped = mapSheetFinancials(table, parseCsv(expensesCsv));
  assert.equal(mapped.contributions[0]?.contributorName, "Reddy, Anand");
});

test("plot number maps to house no and blank plots become -", () => {
  const table = parseCsv(
    `Contributor,Contribution,Date,Plot number,Status\nNew Donor,1500,6-09-2026,,\nPlot Resident,2000,6-09-2026,2-A/12,\n`,
  );
  const mapped = mapSheetFinancials(table, parseCsv(expensesCsv));
  assert.equal(
    mapped.contributions.find((c) => c.contributorName === "New Donor")
      ?.houseNo,
    "-",
  );
  assert.equal(
    mapped.contributions.find((c) => c.contributorName === "Plot Resident")
      ?.houseNo,
    "2-A/12",
  );
});

test("configured S.No rows are shown as paid even without an amount", () => {
  const csv = `S.No,Contributor,Contribution,Date,House no.,Status
48,Someone Else,,,2-A/80,
50,Karoju Subhash,,,2-A/92,
54,Naveen Chary,,,101/1,
70,V. Sreekanth,,,2-A/120,
71,V. SriHari,,,2-A/120,
`;
  const mapped = mapSheetFinancials(parseCsv(csv), parseCsv(expensesCsv));
  const people = residentsFromRecord(mapped);
  assert.equal(
    people.find((r) => r.ownerName === "Someone Else")?.paymentStatus,
    "unpaid",
  );
  for (const name of [
    "Karoju Subhash",
    "Naveen Chary",
    "V. Sreekanth",
    "V. SriHari",
  ]) {
    assert.equal(people.find((r) => r.ownerName === name)?.paymentStatus, "paid");
  }
});

test("residents directory uses contributor names and plot numbers", () => {
  const people = residentsFromRecord(record);
  assert.equal(people.length, 23);
  assert.equal(
    people.find((r) => r.ownerName === "K. Srinivas Reddy")?.houseNo,
    "20",
  );
  assert.equal(
    people.find((r) => r.ownerName === "Dayyala Vamshi Krishna")?.houseNo,
    "-",
  );
  assert.equal(
    people.find((r) => r.ownerName === "Blank amount row")?.paymentStatus,
    "unpaid",
  );
  assert.equal(
    people.some((r) => r.ownerName.includes("Sagar")),
    false,
  );
});
