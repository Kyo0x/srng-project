# Vehicle Rental Project Demo Deployment

The vehicle rental platform demo is located in `/projects/vehicle-rental-project/`.

## Deploying to vehicle-rental.srng.no

### Option 1: Separate Vercel Deployment (Recommended)

1. Create a new Vercel project:
   ```bash
   cd projects/vehicle-rental-project
   vercel --prod
   ```

2. Configure the domain in Vercel:
   - Project Settings → Domains
   - Add domain: `vehicle-rental.srng.no`

3. Set up environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `RESEND_API_KEY`
   - `NEXTAUTH_SECRET`
   - `CRON_SECRET`

### Option 2: Local Development Demo

To demo locally on a different port:

```bash
cd projects/vehicle-rental-project
npm install
npm run dev -- -p 3001
```

Then access at: `http://localhost:3001`

## Portfolio Showcase

The portfolio showcase page at `projects.srng.no/vehicle-rental-project` describes the project and links to the live demo at `vehicle-rental.srng.no`.
