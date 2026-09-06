export type PaymentStatus = "paid" | "pending" | "unpaid";
export type Resident = {
  id: string;
  houseNo: string;
  ownerName: string;
  familyName?: string;
  block?: string;
  residentSince?: number;
  publicPhone?: string;
  paymentStatus?: PaymentStatus;
};
export type Contribution = {
  id: string;
  year: number;
  houseNo: string;
  contributorName: string;
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
  paymentMode: string;
  sourceDate?: string;
  remarks?: string;
};
export type Transaction = {
  id: string;
  year: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  vendor?: string;
  paidBy?: string;
  remarks?: string;
};
export type Auction = {
  year: number;
  winnerName: string;
  houseNo: string;
  amount: number;
  date: string;
};
export type Announcement = {
  id: string;
  title: string;
  description: string;
  date: string;
  priority: "General" | "Important" | "Event";
  active: boolean;
};
export type GalleryPhoto = {
  id: string;
  year: number | null;
  category: string;
  image: string;
  caption: string;
  alt: string;
  width: number;
  height: number;
};
export type YearRecord = {
  source?: "sheet-snapshot" | "google-sheets";
  fetchedAt?: string;
  year: number;
  openingBalance: number;
  income: Transaction[];
  expenses: Transaction[];
  contributions: Contribution[];
  festivalExpenses: Transaction[];
  festivalDonations: Transaction[];
  auction: Auction | null;
};
