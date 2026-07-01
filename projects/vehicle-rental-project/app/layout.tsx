import type { Metadata } from 'next';
import '../styles/globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: {
    default: 'Campervan Rental Bergen | NorthVenture Norway',
    template: '%s | NorthVenture Norway',
  },
  description: 'Campervan and RV rental in Bergen, Norway. Rent your campervan at our Bergen rental station. Fully-equipped camper & RV rental for fjord adventures and Arctic road trips.',
  keywords: [
    'campervan rental Bergen',
    'camper van rental Bergen',
    'RV rental Bergen',
    'RV rental Norway',
    'campervan rental Norway',
    'camper rental Norway',
    'motorhome rental Norway',
    'Northern Lights campervan',
    'road trip Norway',
    'campervan road trip Norway',
    'Arctic road trip Norway',
    'fjord campervan trip',
  ],
  authors: [{ name: 'NorthVenture' }],
  creator: 'NorthVenture',
  metadataBase: new URL('https://www.northventure-demo.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.northventure-demo.com',
    siteName: 'NorthVenture - Bergen',
    title: 'Campervan & RV Rental Bergen, Norway | NorthVenture',
    description: 'Camper van and RV rental at our Bergen rental station. Rent your campervan for fjord adventures and Arctic road trips.',
    images: [
      {
        url: '/hero-image.jpg',
        width: 1200,
        height: 630,
        alt: 'NorthVenture campervan in Bergen, Norway',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Campervan & RV Rental Bergen, Norway | NorthVenture',
    description: 'Camper van and RV rental from Bergen. Start your Arctic road trip today.',
    images: ['/hero-image.jpg'],
  },
  icons: {
    icon: '/favicon-round.png',
    apple: '/favicon-round.png',
  },
  alternates: {
    canonical: 'https://www.northventure-demo.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': 'https://www.northventure-demo.com',
  name: 'NorthVenture | Campervan & RV Rental Bergen',
  description: 'Camper van and RV rental in Bergen, Norway. Rent your campervan at our Bergen rental station. Fully equipped campervans for fjord adventures and Arctic road trips.',
  url: 'https://www.northventure-demo.com',
  telephone: '+47 555 12 345',
  email: 'hello@northventure-demo.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Bergen',
    addressRegion: 'Vestland',
    addressCountry: 'NO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 60.3913,
    longitude: 5.3221,
  },
  areaServed: {
    '@type': 'Place',
    name: 'Northern Norway',
  },
  priceRange: '$$',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '09:00',
    closes: '18:00',
  },
  sameAs: [],
  offers: [
    {
      '@type': 'Offer',
      priceCurrency: 'NOK',
      priceSpecification: {
        '@type': 'PriceSpecification',
        minPrice: '1990',
        maxPrice: '4990',
        priceCurrency: 'NOK',
      },
      itemOffered: {
        '@type': 'Service',
        name: 'Campervan & RV Rental Bergen',
        description: 'Rent your campervan or RV at our Bergen rental station. Fully equipped camper vans for fjord adventures and Arctic road trips.',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-gray-900">
        <AuthProvider>
          {children}
        </AuthProvider>
        <WhatsAppButton />
        <Analytics />
      </body>
    </html>
  );
}
