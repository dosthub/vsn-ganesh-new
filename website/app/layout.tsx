import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { communityConfig } from "@/data/community";
export const metadata: Metadata = {
  title: {
    default: communityConfig.name + " | Together, we thrive",
    template: "%s | " + communityConfig.name,
  },
  description:
    "Our community portal for transparent finances, residents, announcements and Ganesh Chaturthi memories.",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
