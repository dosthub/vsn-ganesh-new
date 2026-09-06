const DEFAULT_SHEET_ID = "1gfGm1bGOEE0IT1Kg97IGE1nsBfTxURS5NO7LfAZh-BY";
const DONATION_TABS = [
  "web Donations received",
  "Donations received",
  "Donations received ",
];
const EXPENSE_TABS = ["Expenditure"];

function csvUrl(spreadsheetId, sheetName) {
  return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
}

function looksLikeCsv(text) {
  return Boolean(text) && !text.startsWith("<") && !/sign in|login required/i.test(text);
}

async function fetchCsv(spreadsheetId, names) {
  let lastStatus = 0;
  for (const name of names) {
    const response = await fetch(csvUrl(spreadsheetId, name), {
      cache: "no-store",
    });
    const text = await response.text();
    lastStatus = response.status;
    if (response.ok && looksLikeCsv(text)) return text;
  }
  if (lastStatus === 403 || lastStatus === 401) {
    throw Object.assign(
      new Error(
        "The Google Sheet is private. Share it as “Anyone with the link can view”.",
      ),
      { status: 403 },
    );
  }
  throw Object.assign(
    new Error("Google Sheet tabs could not be read."),
    { status: 502 },
  );
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": "*",
    },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (path === "/api/finances") {
      try {
        const spreadsheetId = env.GOOGLE_SHEET_ID || DEFAULT_SHEET_ID;
        const [donationsCsv, expensesCsv] = await Promise.all([
          fetchCsv(spreadsheetId, DONATION_TABS),
          fetchCsv(spreadsheetId, EXPENSE_TABS),
        ]);
        return json({
          donationsCsv,
          expensesCsv,
          fetchedAt: new Date().toISOString(),
        });
      } catch (error) {
        return json(
          {
            error: error instanceof Error ? error.message : "Sheet fetch failed",
            code: error?.status === 403 ? "SHEET_FORBIDDEN" : "SHEET_UNAVAILABLE",
          },
          error?.status === 403 ? 403 : 502,
        );
      }
    }
    return env.ASSETS.fetch(request);
  },
};
