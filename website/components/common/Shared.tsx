import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Heart,
  Users,
  House,
  Info,
} from "lucide-react";
import { communityConfig } from "@/data/community";
export function PageHeading({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children}
    </div>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {href && (
        <Link className="text-link" href={href}>
          {linkLabel}
          <ArrowRight size={17} />
        </Link>
      )}
    </div>
  );
}
const icons = {
  wallet: Wallet,
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  heart: Heart,
  people: Users,
  home: House,
};
export function StatCard({
  label,
  value,
  note,
  icon = "wallet",
  featured = false,
}: {
  label: string;
  value: string;
  note?: string;
  icon?: keyof typeof icons;
  featured?: boolean;
}) {
  const Icon = icons[icon];
  return (
    <article className={"stat-card" + (featured ? " featured" : "")}>
      <div className="stat-top">
        <span>{label}</span>
        <Icon size={19} />
      </div>
      <strong>{value}</strong>
      {note && <small>{note}</small>}
    </article>
  );
}
export function DemoNote() {
  return communityConfig.isDemo ? (
    <div className="demo-note">
      <Info size={16} />
      <p>
        <strong>Festival accounts load from the Google Sheet.</strong> Donations,
        expenses, resident names and house numbers are fetched each time this
        page is opened or reloaded. Notices remain sample data. Colony cash
        records have not been supplied.
      </p>
    </div>
  ) : null;
}
export function TransparencyNote() {
  return (
    <div className="transparency-note">
      <span className="round-icon">
        <ShieldCheck size={25} />
      </span>
      <div>
        <h3>Shared funds. Shared responsibility.</h3>
        <p>
          Every total is calculated from the records below. Community and
          festival funds are tracked separately, so contributions are never
          counted twice.
        </p>
      </div>
    </div>
  );
}
export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty-state" role="status">
      <Info size={26} />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
