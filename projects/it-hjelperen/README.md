# IT-Hjelperen

A modern, professional website for IT-Hjelperen - your reliable IT service provider.

## Features

- Modern, responsive design built with SvelteKit and TailwindCSS
- 5 main pages: Home, Services, Security, About, Contact
- Contact form with server-side validation
- Mobile-friendly navigation
- SEO optimized
- Static site generation for fast performance

## Tech Stack

- **Framework**: SvelteKit 2.0
- **Styling**: TailwindCSS 3.4
- **Language**: TypeScript
- **Build Tool**: Vite 5.0
- **Deployment**: Static adapter for Netlify/Vercel

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Development

### Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Project Structure

```
src/
├── routes/              # SvelteKit pages
│   ├── +layout.svelte   # Main layout wrapper
│   ├── +layout.ts       # Layout load function
│   ├── +page.svelte     # Homepage
│   ├── +error.svelte    # Custom error page (404, 500, etc.)
│   ├── tjenester/       # Services page
│   │   └── +page.svelte
│   ├── websitecreation/ # Website creation page
│   │   └── +page.svelte
│   ├── om/              # About page
│   │   └── +page.svelte
│   └── kontakt/         # Contact page
│       └── +page.svelte
│
├── lib/
│   ├── components/      # Reusable components
│   │   ├── Header.svelte           # Navigation header with dark mode toggle
│   │   ├── Footer.svelte           # Site footer
│   │   ├── Hero.svelte             # Dynamic hero section
│   │   ├── ServiceCard.svelte      # Service display card
│   │   ├── AvailabilityWidget.svelte  # Real-time availability status
│   │   ├── BusinessHoursRow.svelte # Business hours display
│   │   ├── ContactForm.svelte      # Contact form component
│   │   ├── ContactMethod.svelte    # Contact method display
│   │   ├── Cta.svelte              # Call-to-action section
│   │   ├── ExpertiseItem.svelte    # Expertise area item
│   │   ├── FAQItem.svelte          # FAQ accordion item
│   │   ├── FeatureCard.svelte      # Feature display card
│   │   ├── SEOtags.svelte          # SEO tags for all the sites
│   │   ├── SectionHeader.svelte    # Reusable section header
│   │   └── ValueCard.svelte        # Company values card
│   │
│   ├── data/            # Static data and content
│   │   ├── about.ts     # About page content
│   │   ├── contact.ts   # Contact page content
│   │   └── services.ts  # Services page content
│   │
│   └── utils/           # Utility functions and constants
│       └── constants.ts # Shared constants (phone, email, etc.)
│
├── app.html             # HTML template
└── app.css              # Global styles with theme system
```

## Building for Production

```bash
npm run build
```

The built files will be in the `build` directory, ready to deploy to any static hosting service.

## Deployment

This site is configured for static site generation and can be deployed to:

- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

### Environment Variables

For the contact form to send emails, you'll need to configure email service credentials (e.g., SendGrid, Mailgun, or SMTP settings).

## Contact Form Setup

The contact form currently logs submissions to the console. To enable email sending:

1. Choose an email service (SendGrid, Mailgun, Resend, etc.)
2. Install the necessary package (e.g., `npm install nodemailer`)
3. Update `src/routes/api/contact/+server.ts` with your email configuration
4. Add environment variables for API keys

## License

All rights reserved © IT-Hjelperen
