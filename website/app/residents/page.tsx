import { getDataSource } from "@/services";
import { PageHeading, DemoNote } from "@/components/common/Shared";
import { ResidentDirectory } from "@/components/residents/ResidentDirectory";
export const metadata = {
  title: "Our Residents",
  description: "Festival contributors and plot numbers from the community sheet.",
};
export default async function Page() {
  const records = await getDataSource().getFinancialYears();
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="NEIGHBOURS, FRIENDS, FAMILY"
        title="Our colony residents"
        description="Every household from the ‘web Donations received’ sheet, including the paid and unpaid lists. A blank plot number is shown as -."
      />
      <DemoNote />
      <ResidentDirectory records={records} />
      <p className="account-note">
        This directory uses contributor names and plot numbers from the same
        Google Sheet as the festival accounts. Private phone numbers and
        personal documents are not displayed.
      </p>
    </div>
  );
}
