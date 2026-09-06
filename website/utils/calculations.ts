type Amount = { amount: number };
export function total(items: readonly Amount[]): number {
  return (
    items.reduce((sum, item) => {
      if (!Number.isFinite(item.amount) || item.amount < 0)
        throw new Error("Amounts must be finite and non-negative");
      return sum + Math.round(item.amount * 100);
    }, 0) / 100
  );
}
export function calculateTotalContributions(
  items: readonly (Amount & { paymentStatus: string })[],
) {
  return total(items.filter((i) => i.paymentStatus === "paid"));
}
export function calculatePendingContributionAmount(
  items: readonly (Amount & { paymentStatus: string })[],
) {
  return total(items.filter((i) => i.paymentStatus === "pending"));
}
export function calculatePaidContributors(
  items: readonly { paymentStatus: string }[],
) {
  return items.filter((i) => i.paymentStatus === "paid").length;
}
export const calculateTotalExpenses = total;
export const calculateTotalIncome = total;
export function calculateBalance(
  opening: number,
  income: number,
  expenses: number,
) {
  if (![opening, income, expenses].every(Number.isFinite))
    throw new Error("Invalid balance inputs");
  return Math.round((opening + income - expenses) * 100) / 100;
}
export function calculateGaneshBalance(
  contributions: number,
  donations: number,
  auction: number,
  expenses: number,
) {
  return calculateBalance(0, contributions + donations + auction, expenses);
}
export function summarize(record: {
  openingBalance: number;
  income: Amount[];
  expenses: Amount[];
  contributions: (Amount & { paymentStatus: string })[];
  festivalDonations: Amount[];
  festivalExpenses: Amount[];
  auction: { amount: number } | null;
}) {
  const income = total(record.income),
    expenses = total(record.expenses),
    contributions = calculateTotalContributions(record.contributions),
    donations = total(record.festivalDonations),
    auction = record.auction?.amount ?? 0,
    festivalExpenses = total(record.festivalExpenses);
  return {
    opening: record.openingBalance,
    income,
    expenses,
    balance: calculateBalance(record.openingBalance, income, expenses),
    contributions,
    donations,
    auction,
    festivalIncome: contributions + donations + auction,
    festivalExpenses,
    festivalBalance: calculateGaneshBalance(
      contributions,
      donations,
      auction,
      festivalExpenses,
    ),
    paidCount: calculatePaidContributors(record.contributions),
    pending: calculatePendingContributionAmount(record.contributions),
  };
}
