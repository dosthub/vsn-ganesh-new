"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Flower2 } from "lucide-react";
import { useState } from "react";
import { communityConfig, navigation } from "@/data/community";
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topline">
        <span>A place to belong. A community to grow with.</span>
        <span>Unity · Devotion · Transparency</span>
      </div>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-icon">
              <Flower2 size={28} />
            </span>
            <span>
              {communityConfig.name}
              <small>TOGETHER, WE THRIVE</small>
            </span>
          </Link>
          <button
            className="menu-toggle icon-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="main-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
          <nav
            id="main-nav"
            aria-label="Main navigation"
            className={open ? "navigation is-open" : "navigation"}
          >
            {navigation.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                aria-current={path === href ? "page" : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
          <Link className="dashboard-link" href="/dashboard">
            Dashboard <ArrowUpRight size={16} />
          </Link>
        </div>
      </header>
    </>
  );
}
