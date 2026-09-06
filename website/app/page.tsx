import { getDataSource } from "@/services";
import { HomePage } from "@/components/home/HomePage";

export default async function Home() {
  const ds = getDataSource();
  const [records, photos, announcements, schedule] = await Promise.all([
    ds.getFinancialYears(),
    ds.getGallery(),
    ds.getAnnouncements(),
    ds.getSchedule(),
  ]);
  return (
    <HomePage
      records={records}
      photos={photos}
      announcements={announcements}
      schedule={schedule}
    />
  );
}
