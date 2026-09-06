import { getDataSource } from "@/services";
import { PageHeading, DemoNote } from "@/components/common/Shared";
import { FinanceDashboard } from "@/components/dashboard/FinanceDashboard";
export const metadata = {
  title: "Colony Budget",
  description: "Community income, expenses and year-by-year financial history.",
};
export default async function Page() {
  const records = await getDataSource().getFinancialYears();
  return (
    <div className="container page-container">
      <PageHeading
        eyebrow="EVERY RUPEE, ACCOUNTED FOR"
        title="Our community budget"
        description="Collections, common expenses and financial history — all in one place."
      />
      <DemoNote />
      <FinanceDashboard records={records} budgetOnly />
    </div>
  );
}
