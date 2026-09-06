import { residents } from "@/data/residents";
import { sheetFinancials } from "@/data/sheetSnapshot";
import { gallery } from "@/data/gallery";
import { announcements, schedule } from "@/data/announcements";
import type { CommunityDataSource } from "./communityDataSource";
export const staticDataSource: CommunityDataSource = {
  getResidents: async () => residents,
  getFinancialYears: async () => sheetFinancials,
  getGallery: async () => gallery,
  getAnnouncements: async () => announcements.filter((a) => a.active),
  getCommittee: async () => [],
  getSchedule: async () => schedule,
};
