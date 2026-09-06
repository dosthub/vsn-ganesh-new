export const communityConfig = {
  name: "VSN Community",
  shortName: "VSN",
  location: "Our neighbourhood, our home",
  establishedYear: null,
  currentFestivalYear: 2026,
  annualColonyBudget: 30000,
  lastUpdated: "2026-09-06",
  dataSource: "static" as const,
  isDemo: true,
  phone: "",
  email: "",
  whatsappNumber: "",
  googleMapsUrl: "",
  specialDonors: [
    {
      role: "Vigraha dhatha · Idol donor",
      names: "Karoju Subhash",
      detail: "₹21,000",
    },
    {
      role: "Annaprasadham donors",
      names: "Veeragoni Srikanth and Srihari",
      detail: "Annadanam",
    },
    {
      role: "Laddu donor",
      names: "N. Naveen Chary",
      detail: "21 kgs",
    },
  ],
};
export const navigation = [
  ["/", "Home"],
  ["/our-colony", "Our Colony"],
  ["/residents", "Residents"],
  ["/budget", "Budget"],
  ["/ganesh-chaturthi", "Ganesh Chaturthi"],
  ["/gallery", "Gallery"],
  ["/announcements", "Announcements"],
  ["/contact", "Contact"],
] as const;
