import { sheetFinancials } from "./sheetSnapshot.ts";
import { residentsFromRecord } from "../lib/residentsFromSheet.ts";

export const residents = residentsFromRecord(sheetFinancials[0]);
export const committee: { role: string; residentId: string }[] = [];
