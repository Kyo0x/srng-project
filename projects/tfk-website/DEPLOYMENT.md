# TFK Hunting Club Demo Deployment

The hunting dog club platform demo is located in `/projects/tfk-website/`.

## Deploying to hunting-dog-portal.srng.no

### Option 1: Separate Vercel Deployment (Recommended)

1. Create a new Vercel project:
   ```bash
   cd projects/tfk-website
   vercel --prod
   ```

2. Configure the domain in Vercel:
   - Project Settings → Domains
   - Add domain: `hunting-dog-portal.srng.no`
   - Add a CNAME record at your DNS provider: `hunting-dog-portal` → `cname.vercel-dns.com`

3. Set up environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `SANITY_API_TOKEN` (optional, needed for on-demand revalidation)
   - `SANITY_REVALIDATE_SECRET` (optional, needed for on-demand revalidation)

4. In the Sanity project dashboard (API → CORS Origins), add:
   - `https://hunting-dog-portal.srng.no`

### Option 2: Local Development Demo

To demo locally on a different port:

```bash
cd projects/tfk-website
cp .env.example .env.local  # fill in Sanity project id/dataset
npm install
npm run dev -- -p 3002
```

Then access at: `http://localhost:3002` (studio at `http://localhost:3002/studio`).

## Portfolio Showcase

The portfolio showcase page at `projects.srng.no/tfk-website` describes the project and links to the live demo at `hunting-dog-portal.srng.no`.
