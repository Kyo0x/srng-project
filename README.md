# SRNG Base App

Baseline Next.js setup for srng.no with two patterns:

- Root domain landing page (currently under construction)
- Scalable service routes and subdomain routing for separate app areas

## Routing model

- `app/page.tsx`: root page for `srng.no`
- `app/[service]/dashboard/page.tsx`: service dashboard pattern like `/deltabot/dashboard`
- `app/s/[subdomain]/...`: internal routes used by host rewrites

## Subdomain handling

`proxy.ts` rewrites requests from subdomains into internal app routes:

- `deltabot.srng.no` -> `/s/deltabot`
- `deltabot.srng.no/settings` -> `/s/deltabot/settings`

For local development, it also supports hosts like:

- `deltabot.localhost:3000`

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the root under-construction page.

To test local subdomains, map test hosts in your local hosts setup and open them in the browser.

## Portfolio Projects

### Vehicle Rental Project Demo

Full-featured campervan rental booking platform located in `/projects/vehicle-rental-project/`.

**Quick Start:**
```bash
# Run demo on port 3001
./start-demo.sh

# Or manually
cd projects/vehicle-rental-project
npm install
npm run dev -- -p 3001
```

**Demo Pages (No Database Required):**

We've created dummy versions of key pages that work without database connections:
- Fleet page: Shows vehicle specifications
- Admin dashboard: Shows booking management interface

```bash
# Enable demo mode (swaps to dummy data pages)
./toggle-demo.sh enable

# Disable demo mode (restore original pages)
./toggle-demo.sh disable
```

See `projects/vehicle-rental-project/DEMO_PAGES.md` for details.

### TFK Hunting Club Demo

Content-driven website for a hunting dog club (events, news, hunt trials, clubhouse rental), built on Next.js + Sanity CMS, located in `/projects/tfk-website/`.

**Quick Start:**
```bash
# Run demo on port 3002
./start-tfk-demo.sh

# Or manually
cd projects/tfk-website
cp .env.example .env.local  # add your Sanity project id/dataset
npm install
npm run dev -- -p 3002
```

Showcase page: `projects.srng.no/tfk-website` (linked from the "HUNTING.DOG.PORTAL" card). Live demo target: `hunting-dog-portal.srng.no` — see `projects/tfk-website/DEPLOYMENT.md` for deploying it there.

### IT-Hjelperen Demo

IT support & PC-building service marketing site (services, pricing, about, contact), built with SvelteKit + TailwindCSS, located in `/projects/it-hjelperen/`.

**Quick Start:**
```bash
# Run demo on port 3003
./start-it-hjelperen-demo.sh

# Or manually
cd projects/it-hjelperen
npm install
npm run dev -- --port 3003
```

Showcase page: `projects.srng.no/it-hjelperen` (linked from the "IT.SOLUTIONS" card). Live demo target: `it-website.srng.no` — see `projects/it-hjelperen/DEPLOYMENT.md` for deploying it there.

## Next steps

- Add auth and access control for dashboard routes
- Replace placeholder subdomain pages with real app modules
- Add API routes per service
