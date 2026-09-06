import { Mail, Phone, MapPin, MessageCircle, Users } from "lucide-react";
import { communityConfig } from "@/data/community";
import { PageHeading } from "@/components/common/Shared";
import { ContactForm } from "@/components/community/ContactForm";
export const metadata = {
  title: "Contact",
  description:
    "Get in touch with the community committee and share your ideas.",
};
export default function Page() {
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="LET’S KEEP IN TOUCH"
        title="Good things start with a conversation."
        description="Questions about our accounts, a suggestion for our neighbourhood, or an idea for the next celebration — we’re listening."
      />
      <div className="two-columns contact-grid">
        <div>
          <div className="panel contact-info">
            <span className="round-icon">
              <Users size={26} />
            </span>
            <h2>Community committee</h2>
            <p>
              Approved contact details will be published here once provided by
              the committee.
            </p>
            {communityConfig.phone && (
              <a href={"tel:" + communityConfig.phone}>
                <Phone />
                {communityConfig.phone}
              </a>
            )}
            {communityConfig.email && (
              <a href={"mailto:" + communityConfig.email}>
                <Mail />
                {communityConfig.email}
              </a>
            )}
            {communityConfig.whatsappNumber && (
              <a
                href={
                  "https://wa.me/" +
                  communityConfig.whatsappNumber.replace(/D/g, "")
                }
              >
                <MessageCircle />
                WhatsApp the committee
              </a>
            )}
            {communityConfig.googleMapsUrl && (
              <a href={communityConfig.googleMapsUrl}>
                <MapPin />
                View community location
              </a>
            )}
          </div>
          <div className="panel section-space">
            <h3>Useful community contacts</h3>
            <p className="muted">
              Secretary, treasurer, security and maintenance contacts are
              awaiting confirmation. No unverified phone numbers are listed.
            </p>
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}
