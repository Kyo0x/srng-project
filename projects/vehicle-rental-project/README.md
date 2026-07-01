# Vehicle Rental Project

**Portfolio Demo** - This is an anonymized demonstration version of a campervan rental booking platform.

Full-featured RV rental booking platform. Features include:
- Vehicle booking and availability management
- Stripe payment integration
- Email notifications
- Admin dashboard for managing bookings and fleet
- Calendar integration

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS
- **Database**: Neon (PostgreSQL)
- **Payments**: Stripe
- **Email**: Resend
- **Hosting**: Vercel

## Environment Variables

```
DATABASE_URL=postgresql://...@neon.tech/...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
RESEND_API_KEY=re_...
NEXTAUTH_SECRET=...
CRON_SECRET=...
```

## Development

```bash
npm install
npm run dev
```

## Deployment

Push to main branch - Vercel auto-deploys.

## Portfolio Notes

This is an anonymized version for portfolio demonstration. Fictional/placeholder information has been used throughout the application:

- **Company Name**: Generic placeholder names
- **Domain**: Demo domain for portfolio purposes
- **Location**: Generic Norwegian location
- **Contact Information**: All contact details are fictional placeholders
- **Branding**: Generic branding and imagery

### Demo Purpose

This project demonstrates:
- Full-stack Next.js application architecture
- Payment processing integration (Stripe)
- Database design and management (PostgreSQL)
- Email automation workflows
- Admin dashboard functionality
- Real-time booking and availability system
- Modern UI/UX with TypeScript and Tailwind CSS
