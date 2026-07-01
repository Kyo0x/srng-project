import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Location',
  description: 'Visit NorthVenture on Bergen, just 14 minutes from Bergen Airport. Get directions by car, bus, or taxi to our RV rental location.',
  openGraph: {
    title: 'Our Location | NorthVenture',
    description: 'Find us on Bergen, 14 minutes from Bergen Airport.',
    images: [{ url: '/hero-image.jpg', width: 1200, height: 630 }],
  },
};

export default function LocationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
