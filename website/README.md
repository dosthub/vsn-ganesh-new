# VSN Community portal

## Current financial data

Festival figures load from Google Sheet `1gfGm1bGOEE0IT1Kg97IGE1nsBfTxURS5NO7LfAZh-BY`, tabs **web Donations received** and **Expenditure**, each time a page is opened or reloaded. If the sheet is still private, pages keep the last saved snapshot in `data/sheetSnapshot.ts` and show that the sheet was not readable.

- Current received donations: INR 51,319 (22 rows).
- Prior-year Laddu receipt from Sagar: INR 41,750, received 20 August 2026; kept separate from current donations and the current-year auction.
- Six festival expenses: INR 23,506.
- Total receipts: INR 93,069; remaining festival balance: INR 69,563.
- The owner explicitly confirmed the INR 5,115 and INR 5,016 donations with blank status as received.
- Donation dates are preserved as raw source text because day/month order is mixed. A missing date stays missing. Similar-name rows are not deduplicated.
- Blank contribution amounts are omitted from received records, not converted into zero-valued pending pledges.
- The Expenditure paid-by field is preserved as payer, not vendor; advance remarks are shown.
- The INR 30,000 colony budget is a spending plan, not cash income. No colony transactions were supplied, so the live dashboard does not display fabricated colony cash totals.
- Historical sample financials remain only as development fixtures and are no longer returned by the active data source. Residents, committee and notices remain explicitly marked sample data.

The setup notes below describe the original scaffold and future live integration. This section supersedes earlier references to sample festival records or pending first import.

A responsive Next.js 16.3.4 App Router website with React, TypeScript, Tailwind CSS and Lucide icons. Includes nine routes, shared financial calculations, a resident directory, announcements, festival records and the three supplied gallery photos.

## Run locally

Use Node.js 22.13 or newer. From this website directory:

```sh
npm install
npm run dev
```

Open http://localhost:3000. Run npm run build for a static export in out/. Upload out/ to a static host, or import this website directory as the Root Directory in Vercel. No database or login is needed. npm run start is for a server deployment only; the current static export should be served with a static host.

## Validate

- npm run typecheck
- npm run lint
- npm test
- npm run build

Financial tests cover pending pledges, missing auctions, negative balances, currency rounding, invalid amounts, all four sample years and annual carry-forward reconciliation.

## Routes

Home (/), Our Colony (/our-colony), Residents (/residents), Budget (/budget), Dashboard (/dashboard), Ganesh Chaturthi (/ganesh-chaturthi), Gallery (/gallery), Announcements (/announcements), Contact (/contact).

## Replace the sample information

All financial records, residents, committee names and announcements are sample data, marked in the interface. VSN Community is a provisional name based on the project folder; configure the real name and contact information in data/community.ts. No real location, phone number, festival date or facility has been invented. The contact form is a clearly marked preview and does not send or store messages.

- data/community.ts: branding, contacts, current year and demo flag.
- data/residents.ts: approved public households and committee members.
- data/financials.ts: sample transactions for 2023–2026. Replace generated sample records with verified entries.
- data/announcements.ts: notices and tentative programme.
- data/gallery.ts: captions, categories, dimensions and years.

The three JPEGs under public/images/ganesh are unchanged copies of the supplied files. Their celebration years are unknown, so year is null. Change the year after confirmation. Do not infer the event year from a WhatsApp download filename. The gallery defaults to all years and includes a full-size lightbox with next, previous, arrow-key and Escape controls.

## Financial conventions

Community and festival accounts are separate. Community balance = opening + community income − community expenses. Festival balance = paid contributions + donations + completed auction − festival expenses. Pending pledges never count as income. An upcoming auction is null, not a completed zero-rupee auction. Negative balances are intentionally shown when expenses exceed received income. Contribution counts refer to payment records, not unique people. Historical opening balances carry forward prior community closing balances. Do not add festival proceeds to community income unless an explicit inter-fund transfer is recorded consistently.

All totals use utils/calculations.ts. UI pages obtain records through services/communityDataSource.ts, with services/staticDataSource.ts providing the current implementation. Components receive typed records, not imports of financial fixtures.

## How to connect Google Sheets

The live festival feed is already wired. It only needs the sheet to be readable without a Google login:

1. Open [the festival sheet](https://docs.google.com/spreadsheets/d/1gfGm1bGOEE0IT1Kg97IGE1nsBfTxURS5NO7LfAZh-BY).
2. Click **Share** → **General access** → **Anyone with the link** → **Viewer**.
3. Keep the **web Donations received** and **Expenditure** tabs. Those are the only tabs the website reads.
4. Rebuild and redeploy the Cloudflare Worker (`npm run build` in `website/`, then `wrangler deploy` from the repo root) so `/api/finances` can proxy the sheet.
5. After sharing, open or reload Home, Dashboard, Budget or Ganesh Chaturthi. Those pages fetch the current sheet rows on that visit. No site rebuild is needed for later row changes.

Do not put service-account credentials in `NEXT_PUBLIC_` variables or browser files. The Worker only reads the public CSV export; it does not write back to the sheet.

Recommended tabs:

| Tab                   | Columns                                                                       |
| --------------------- | ----------------------------------------------------------------------------- |
| Residents             | Id, HouseNo, OwnerName, FamilyName, Block, ResidentSince, PublicPhone, Status |
| ColonyIncome          | Id, Date, Year, Source, Description, Amount, PaymentMode, Remarks             |
| ColonyExpenses        | Id, Date, Year, Category, Description, Vendor, Amount, Remarks                |
| GaneshContributions   | Id, Year, Date, HouseNo, ContributorName, Amount, PaymentStatus, PaymentMode  |
| GaneshExpenses        | Id, Year, Date, Category, Description, Vendor, Amount, Remarks                |
| FestivalDonations     | Id, Year, Date, Description, Amount                                           |
| LadduAuction          | Year, WinnerName, HouseNo, Amount, Date                                       |
| AnnualOpeningBalances | Year, OpeningBalance                                                          |
| Announcements         | Id, Title, Description, Date, Priority, Active                                |
| Gallery               | Id, Year, Category, Image, Caption, Alt, Width, Height                        |
| Committee             | Role, ResidentId                                                              |
| Schedule              | Day, Title, Time, Description                                                 |

Keep private phone numbers, emails, identity documents and bank details out of the public data source. PublicPhone is opt-in only.

## Future additions

The data-source interface can support authenticated administration without rewriting display components. Annual report downloads can be added using the same reconciled records. Neither authentication, payments, report generation nor a connected contact form is implemented in this static version.

## Project structure

app/ — page routes, loading/error states and shared theme
components/ — community, dashboard, festival, gallery and directory UI
components/ui/ — bundled accessible interface primitives
services/ — data-source abstraction
utils/ — totals and Indian currency/date formatting
data/ — centralized sample records
public/images/ganesh/ — real supplied photos
tests/ — financial reconciliation tests

Private Sites publishing uses .openai/hosting.json and the static out/ output.

## Confirmed budget and pending Sheet connection

The user confirmed a planned colony budget of INR 30,000, kept separate from opening balance and money received. The live source is Google Sheet 1gfGm1bGOEE0IT1Kg97IGE1nsBfTxURS5NO7LfAZh-BY, tabs “web Donations received” and “Expenditure”. Share that sheet as “Anyone with the link can view” so Cloudflare can refresh the public totals.
