import Link from "next/link";
import { Flower2 } from "lucide-react";
import { communityConfig, navigation } from "@/data/community";
export function Footer() {
  return (
    <footer>
      <div className="container footer-main">
        <div>
          <div className="brand">
            <Flower2 />
            <span>{communityConfig.name}</span>
          </div>
          <p>Built for our community with unity and transparency.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navigation
            .filter(([href]) => href !== "/")
            .map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          <Link href="/dashboard">Financial Dashboard</Link>
        </nav>
      </div>
      <div className="container footer-bottom">
        <span>
          © {new Date().getFullYear()} {communityConfig.name}
        </span>
        <span>Festival accounts: Google Sheet on each page load · Other sections: sample</span>
      </div>
    </footer>
  );
}
