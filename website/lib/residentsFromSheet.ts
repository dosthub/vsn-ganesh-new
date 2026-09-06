import type { Resident, YearRecord } from "../types/community.ts";

export function displayHouseNo(value: string | undefined) {
  const houseNo = value?.trim() ?? "";
  return houseNo || "-";
}

export function residentsFromRecord(record: YearRecord | undefined): Resident[] {
  if (!record) return [];
  const seen = new Set<string>();
  const residents: Resident[] = [];
  for (const contribution of record.contributions) {
    const ownerName = contribution.contributorName.trim();
    if (!ownerName) continue;
    const houseNo = displayHouseNo(contribution.houseNo);
    const key = ownerName.toLowerCase() + "|" + houseNo.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    residents.push({
      id: contribution.id,
      houseNo,
      ownerName,
      paymentStatus: contribution.paymentStatus,
    });
  }
  return residents.sort((a, b) =>
    a.ownerName.localeCompare(b.ownerName, "en", { sensitivity: "base" }),
  );
}
