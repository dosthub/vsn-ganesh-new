import { getDataSource } from "@/services";
import { PageHeading, DemoNote } from "@/components/common/Shared";
import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard";
export const metadata = {
  title: "Community Dashboard",
  description:
    "Transparent community and festival finances, expenses and previous year summaries.",
};
export default async function Page() {
  const records = await getDataSource().getFinancialYears();
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="OPEN BOOKS. SHARED TRUST."
        title="Community dashboard"
        description="A clear view of our community funds, celebrations and shared activities."
      />
      <DemoNote />
      <FinanceDashboard records={records} />
    </div>
  );
}
