import Image from "next/image";
import { Users, ShieldCheck, Leaf, Heart } from "lucide-react";
import { getDataSource } from "@/services";
import { communityConfig } from "@/data/community";
import {
  PageHeading,
  DemoNote,
  SectionHeading,
} from "@/components/common/Shared";
export const metadata = {
  title: "Our Colony",
  description: "Meet our community and explore the values we share.",
};
export default async function Page() {
  const residents = await getDataSource().getResidents();
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="ROOTED IN TOGETHERNESS"
        title={"Welcome to " + communityConfig.name}
        description="A neighbourhood is made of homes. A community is made of people who care."
      />
      <div className="about-grid">
        <div className="about-photo">
          <Image
            src="/images/ganesh/community-group.jpeg"
            fill
            priority
            sizes="(max-width:650px) 100vw, 45vw"
            alt="Our community together with the Ganesh idol"
          />
        </div>
        <div className="about-copy">
          <span className="eyebrow">OUR SHARED HOME</span>
          <h2>
            Every family adds
            <br />
            to our story.
          </h2>
          <p>
            Our community portal brings everyday information and celebration
            memories into one shared space. It is a place to stay connected,
            understand our accounts and take part in community life.
          </p>
          <p>
            Our history, location and facilities will be added once the
            committee confirms the details.
          </p>
          <div className="about-count">
            <strong>{residents.length}</strong>
            <span>Households from the festival sheet</span>
          </div>
        </div>
      </div>
      <DemoNote />
      <section className="section-space">
        <SectionHeading title="The values we share" />
        <div className="values-grid">
          {[
            {
              Icon: Users,
              title: "Unity",
              text: "Welcoming every family and celebrating what brings us together.",
            },
            {
              Icon: ShieldCheck,
              title: "Transparency",
              text: "Sharing financial records openly and keeping each other informed.",
            },
            {
              Icon: Leaf,
              title: "Cleanliness & safety",
              text: "Taking collective responsibility for our shared surroundings.",
            },
            {
              Icon: Heart,
              title: "Community support",
              text: "Offering a helping hand and making room for every neighbour.",
            },
          ].map(({ Icon, title, text }) => (
            <article className="panel" key={title}>
              <Icon size={27} />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
