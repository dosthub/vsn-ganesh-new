"use client";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  ArrowRight,
  Heart,
  ShieldCheck,
  Flower2,
  CalendarDays,
  Sparkles,
  Users,
  Leaf,
} from "lucide-react";
import { communityConfig } from "@/data/community";
import { useLiveFinancials } from "@/hooks/use-live-financials";
import { SheetLoadGate } from "@/components/common/SheetLoadGate";
import { summarize } from "@/utils/calculations";
import { formatINR } from "@/utils/format";
import type { Announcement, GalleryPhoto, YearRecord } from "@/types/community";
import { residentsFromRecord } from "@/lib/residentsFromSheet";
import {
  StatCard,
  SectionHeading,
  DemoNote,
  TransparencyNote,
} from "@/components/common/Shared";
import { IncomeChart } from "@/components/dashboard/FinancialCharts";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Announcements } from "@/components/community/Announcements";
import { Schedule } from "@/components/community/Schedule";

export function HomePage({
  records: initialRecords,
  photos,
  announcements,
  schedule,
}: {
  records: YearRecord[];
  photos: GalleryPhoto[];
  announcements: Announcement[];
  schedule: {
    day: string;
    title: string;
    time: string;
    description: string;
  }[];
}) {
  const live = useLiveFinancials(initialRecords);
  const records = live.records;
  const year = communityConfig.currentFestivalYear;
  const current = records.find((r) => r.year === year);
  if (!current) throw new Error("Current year data is missing");
  const s = summarize(current);
  const previous = records.find((r) => r.year === year - 1);
  const residents = residentsFromRecord(current);
  return (
    <>
      <section className="home-hero container">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="dot" /> ONE NEIGHBOURHOOD. MANY STORIES.
          </span>
          <h1>
            More than a colony.
            <br />A place we call <em>home.</em>
          </h1>
          <p>
            Celebrating together. Caring for one another. Building a stronger
            community, with every contribution and every shared moment.
          </p>
          <div className="button-row">
            <Link href="/dashboard" className="button primary">
              Community dashboard <ArrowUpRight size={18} />
            </Link>
            <Link href="/ganesh-chaturthi" className="button secondary">
              Explore our celebrations <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero-note">
            <Heart size={18} /> Rooted in togetherness, growing with trust.
          </div>
        </div>
        <div className="hero-photo">
          <Image
            src="/images/ganesh/community-group.jpeg"
            alt="Community members gathered in front of the Ganesh idol during a celebration"
            fill
            priority
            sizes="(max-width: 650px) 100vw, 45vw"
          />
          <div className="photo-caption">
            <span>THE MOMENTS THAT BRING US TOGETHER</span>
            <strong>Our people. Our celebrations.</strong>
          </div>
          <span className="photo-badge">
            <Heart size={16} /> Made of memories
          </span>
        </div>
      </section>
      <div className="container">
        <SheetLoadGate live={live}>
          <div className="home-stats">
            <StatCard
              label="Homes, connected"
              value={String(residents.length)}
              note="Contributor households from the sheet"
              icon="home"
            />
            <StatCard
              label="Families, together"
              value={String(residents.length)}
              note="Contributor households from the sheet"
              icon="people"
            />
            <StatCard
              label="Festival balance"
              value={formatINR(s.festivalBalance)}
              note={
                live.live
                  ? "From the Google Sheet on this page load"
                  : "Current available balance"
              }
              featured
            />
            <StatCard
              label="Ganesh contributions"
              value={formatINR(s.contributions)}
              note={s.paidCount + " paid contribution records"}
              icon="heart"
            />
          </div>
        </SheetLoadGate>
        <DemoNote />
        <Link href="/announcements" className="announcement-strip">
          <span>
            <CalendarDays size={18} />
            <strong>COMMUNITY UPDATE</strong>
          </span>
          <p>Ganesh celebrations: preparations are underway</p>
          <ArrowRight size={18} />
        </Link>
        <section className="home-section">
          <SectionHeading
            eyebrow="OPEN BOOKS. SHARED TRUST."
            title="Our celebration, in balance."
            description="Know what comes in, what goes out, and what we build together."
            href="/dashboard"
            linkLabel="Explore the dashboard"
          />
          <SheetLoadGate live={live}>
          <div className="home-finance-grid">
            <div className="balance-panel">
              <span className="balance-label">
                <ShieldCheck size={20} /> FESTIVAL FUND · {year}
              </span>
              <span className="muted">Available balance</span>
              <strong>{formatINR(s.festivalBalance)}</strong>
              <div className="balance-divider" />
              <div className="balance-detail">
                <span>Previous-year Laddu receipt</span>
                <b>{formatINR(s.donations)}</b>
              </div>
              <div className="balance-detail">
                <span>+ Current donations</span>
                <b>{formatINR(s.contributions)}</b>
              </div>
              <div className="balance-detail">
                <span>− Total expenses</span>
                <b>{formatINR(s.festivalExpenses)}</b>
              </div>
              <Link href="/budget">
                View all transactions <ArrowUpRight size={16} />
              </Link>
            </div>
            <IncomeChart
              income={s.festivalIncome}
              expenses={s.festivalExpenses}
            />
          </div>
          </SheetLoadGate>
        </section>
        <section className="festival-banner">
          <div className="festival-banner-copy">
            <span className="eyebrow">
              <Flower2 size={18} /> DEVOTION. JOY. TOGETHERNESS.
            </span>
            <h2>Ganpati Bappa Morya!</h2>
            <p>Vinayaka Chavithi {year}</p>
            <span>A celebration made special by every one of us.</span>
            <SheetLoadGate live={live}>
              <div className="festival-mini-stats">
                <div>
                  <strong>{formatINR(s.contributions)}</strong>
                  <span>Contributions received</span>
                </div>
                <div>
                  <strong>{formatINR(s.festivalExpenses)}</strong>
                  <span>Festival expenses</span>
                </div>
              </div>
            </SheetLoadGate>
            <Link className="button primary" href="/ganesh-chaturthi">
              Explore the celebrations <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="festival-banner-image">
            <Image
              src="/images/ganesh/ganesh-celebration.jpeg"
              fill
              sizes="(max-width:650px) 100vw, 45vw"
              alt="Decorated Ganesh idol and community members at the celebration"
            />
          </div>
        </section>
        <div className="festival-bottom">
          <span>
            <CalendarDays size={17} /> Festival dates & puja timings will be
            announced.
          </span>
          <Link href="/ganesh-chaturthi#contributors">
            View contributors <ArrowRight size={16} />
          </Link>
        </div>
        {previous?.auction && (
          <section className="laddu-highlight">
            <span className="round-icon gold-icon">
              <Sparkles size={27} />
            </span>
            <div>
              <span className="eyebrow">A TRADITION OF GENEROSITY</span>
              <h3>{previous.year} Ganesh Laddu auction</h3>
              <p>
                {previous.auction.winnerName} · {previous.auction.houseNo} ·
                Sample record
              </p>
            </div>
            <strong>{formatINR(previous.auction.amount)}</strong>
            <Link href="/ganesh-chaturthi" className="text-link">
              Auction history <ArrowUpRight size={16} />
            </Link>
          </section>
        )}
        <section className="home-section">
          <SectionHeading
            eyebrow="LET’S COME TOGETHER"
            title="Days to look forward to."
            description="A preview of our celebration programme. Dates will be confirmed by the committee."
            href="/ganesh-chaturthi#schedule"
            linkLabel="View programme"
          />
          <Schedule items={schedule.slice(0, 3)} />
        </section>
        <section className="home-section">
          <SectionHeading
            eyebrow="LITTLE MOMENTS. LASTING MEMORIES."
            title="The joy of being together."
            href="/gallery"
            linkLabel="Visit our gallery"
          />
          <GalleryGrid photos={photos} preview />
        </section>
        <section className="home-section">
          <SectionHeading
            eyebrow="FROM OUR COMMUNITY"
            title="On the notice board."
            href="/announcements"
            linkLabel="All announcements"
          />
          <Announcements items={announcements} preview />
        </section>
        <section className="values-section">
          <div>
            <span className="eyebrow">WHAT MAKES US, US</span>
            <h2>
              Good neighbours.
              <br />A better community.
            </h2>
          </div>
          {[
            {
              Icon: Users,
              title: "Togetherness",
              text: "Showing up for one another, in everyday life and celebrations.",
            },
            {
              Icon: ShieldCheck,
              title: "Transparency",
              text: "Open accounts and clear updates that build shared trust.",
            },
            {
              Icon: Leaf,
              title: "Care",
              text: "Looking after our common spaces and the people around us.",
            },
          ].map(({ Icon, title, text }) => (
            <div key={title}>
              <Icon size={23} />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </section>
        <TransparencyNote />
        <section className="contact-cta">
          <div>
            <h2>Have an idea for our community?</h2>
            <p>Good things begin with a conversation.</p>
          </div>
          <Link href="/contact" className="button primary">
            Get in touch <ArrowUpRight size={18} />
          </Link>
        </section>
      </div>
    </>
  );
}
