import type {
  Resident,
  YearRecord,
  GalleryPhoto,
  Announcement,
} from "@/types/community";
export interface CommunityDataSource {
  getResidents(): Promise<Resident[]>;
  getFinancialYears(): Promise<YearRecord[]>;
  getGallery(): Promise<GalleryPhoto[]>;
  getAnnouncements(): Promise<Announcement[]>;
  getCommittee(): Promise<{ role: string; residentId: string }[]>;
  getSchedule(): Promise<
    { day: string; title: string; time: string; description: string }[]
  >;
}
