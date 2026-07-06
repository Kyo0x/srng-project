# Demo Hunting Club Website

Website for Demo Hunting Club built with Next.js and Sanity CMS.

## Tech Stack

- Next.js 14 (App Router)
- Sanity.io for CMS
- Tailwind CSS
- TypeScript
- Deployed on Vercel

## Setup

**Prerequisites:** Node.js 18+, npm, and a Sanity.io account

1. Clone and install:
```bash
git clone https://github.com/example/demo-hunting-club.git
cd demo-hunting-club
npm install
```

2. Create a Sanity project at [sanity.io](https://www.sanity.io/manage)

3. Copy `.env.example` to `.env.local` and add your Sanity credentials:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
```

4. Run the dev server:
```bash
npm run dev
```

Visit http://localhost:3000 for the site and http://localhost:3000/studio for the CMS.

5. Add CORS origins in Sanity dashboard (API → CORS Origins):
   - http://localhost:3000
   - Your production domain

## Content Management

Access the CMS at `/studio`. Main content types:

### Events (Arrangementer)
- Title, date, location, description
- Optional jaktprøve category (Apport, Bruksprøve, NKK, etc.)
- Future events automatically show on homepage

### News (Nyheter)
- Title, excerpt, full content
- Can be marked as activity to show on Activities page

### Resources (Ressurser)
- PDFs, documents, or external links
- Used on "Lover og regler" page

### Clubhouse (Utleie Klubbhus)
- Rental information and contract PDF

## Project Structure

```
app/                    # Next.js pages
├── arrangementer/      # Events
├── nyheter/           # News
├── jaktprover/        # Hunt trials by category
├── om-klubben/        # About
├── aktiviteter/       # Activities
├── lover-og-regler/   # Documents
├── utleie-klubbhus/   # Clubhouse rental
└── studio/            # Sanity CMS

components/            # React components
lib/                   # Utilities and Sanity queries
sanity/schemas/        # Content schemas
```

## Pages

- `/` - Homepage with hero, events, and news
- `/arrangementer` - All events
- `/nyheter` - All news
- `/jaktprover` - Hunt trials with category tabs
- `/om-klubben` - About page
- `/aktiviteter` - Activities
- `/lover-og-regler` - Documents and links
- `/utleie-klubbhus` - Clubhouse rental
- `/studio` - Content management

## Deployment

### Vercel (recommended)

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

Vercel auto-deploys on every push to main.

### Custom Domain (tfk.no)

In Vercel: Settings → Domains → Add `tfk.no`

Update DNS at Uniweb:
- A Record: `@` → Vercel IP
- CNAME: `www` → `cname.vercel-dns.com`

Add tfk.no to Sanity CORS origins after DNS propagates.

## For Content Editors

See CONTENT_GUIDE.md for detailed instructions on managing content through Sanity Studio.

Quick tips:
- Access CMS at `/studio`
- Changes publish immediately (updates within 60 seconds)
- Use landscape images (1200x800px recommended)
- Red asterisk (*) = required field

## License

© 2026 Demo Hunting Club
