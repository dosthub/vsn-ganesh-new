import { getDataSource } from "@/services";
import { PageHeading, DemoNote } from "@/components/common/Shared";
import { Announcements } from "@/components/community/Announcements";
export const metadata = {
  title: "Community Announcements",
  description: "Community notices, event updates and important announcements.",
};
export default async function Page() {
  const items = await getDataSource().getAnnouncements();
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="STAY IN THE KNOW"
        title="Our notice board"
        description="The latest from our community, all in one place."
      />
      <DemoNote />
      <Announcements items={items} />
    </div>
  );
}
