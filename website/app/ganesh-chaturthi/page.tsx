import Image from "next/image";
import { Flower2 } from "lucide-react";
import { getDataSource } from "@/services";
import { communityConfig } from "@/data/community";
import {
  DemoNote,
  SectionHeading,
  TransparencyNote,
} from "@/components/common/Shared";
import { FestivalDashboard } from "@/components/ganesh/FestivalDashboard";
import { Schedule } from "@/components/community/Schedule";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
export const metadata = {
  title: "Vinayaka Chavithi Celebrations",
  description:
    "Ganesh Chaturthi contributions, expenses, Laddu auction history and community programme.",
};
export default async function Page() {
  const ds = getDataSource();
  const [records, schedule, photos] = await Promise.all([
    ds.getFinancialYears(),
    ds.getSchedule(),
    ds.getGallery(),
  ]);
  return (
    <div className="container page-container">
      <section className="festival-banner festival-page-hero">
        <div className="festival-banner-copy">
          <span className="eyebrow">
            <Flower2 size={18} /> GANPATI BAPPA MORYA
          </span>
          <h1>
            Vinayaka Chavithi
            <br />
            {communityConfig.currentFestivalYear}
          </h1>
          <p>Celebrating devotion, unity and togetherness.</p>
          <span>
            Festival dates, venue and puja timings will be announced by our
            committee.
          </span>
          <div className="button-row">
            <a href="#contributors" className="button primary">
              View contributions
            </a>
            <a href="#schedule" className="button secondary">
              Celebration programme
            </a>
          </div>
        </div>
        <div className="festival-banner-image">
          <Image
            src="/images/ganesh/ganesh-celebration.jpeg"
            fill
            priority
            sizes="(max-width:650px) 100vw, 45vw"
            alt="Ganesh idol surrounded by festive decorations and community members"
          />
        </div>
      </section>
      <DemoNote />
      <FestivalDashboard records={records} />
      <section id="schedule" className="section-space">
        <SectionHeading
          eyebrow="A CELEBRATION FOR EVERYONE"
          title="The celebration programme"
          description="Programme preview. Confirmed dates, venue and timings will be published here."
        />
        <Schedule items={schedule} />
      </section>
      <section className="section-space">
        <SectionHeading
          title="Memories we share"
          href="/gallery"
          linkLabel="All photos"
        />
        <GalleryGrid photos={photos} preview />
      </section>
      <TransparencyNote />
    </div>
  );
}
