# VSN Community Website

The complete Next.js project is in [website](./website/README.md).

From this directory:

```sh
cd website
npm install
npm run dev
```

Open http://localhost:3000. The website includes the three supplied celebration photos. Community and financial records are clearly labeled sample data; configure real details before public use.

See [website/README.md](./website/README.md) for pages, testing, deployment and the live Google Sheets feed.

For Cloudflare, build the static site and deploy the Worker so `/api/finances` can refresh donations and expenses:

```sh
cd website && npm run build && cd ..
wrangler deploy
```

Share the Google Sheet as **Anyone with the link can view**, or the site will keep the last saved snapshot.
