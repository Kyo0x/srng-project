import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about NorthVenture, your trusted partner for campervan rental in Norway since 2025. Based in Bergen, we help you plan the perfect road trip.',
  keywords: ['about NorthVenture', 'campervan rental Bergen Norway', 'Norway campervan company', 'fjord road trip rental'],
  openGraph: {
    title: 'About NorthVenture | Campervan Rental Norway',
    description: 'Based in Bergen since 2025. Premium campervan rental for road trips across Norway.',
    images: [{ url: '/hero-image.jpg', width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ height: '60vh', backgroundImage: 'url(/about-scenic.jpg)' }}>
          <div className="absolute inset-0 bg-black/55 z-0"></div>
          <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 mb-3">Company</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight leading-tight">
              About NorthVenture
            </h1>
            <p className="text-lg md:text-xl text-white font-light drop-shadow">
              Your trusted partner for Norwegian adventures since 2025
            </p>
          </div>
        </section>

        {/* OUR STORY SECTION */}
        <section className="bg-white py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Background</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Our story
            </h2>
            <div className="space-y-5 text-gray-600 text-base leading-relaxed">
              <p>
                NorthVenture was born from a passion for Norwegian nature and a desire to share its magic with travelers from around the world. Founded in 2025 in Bergen, we started with a dream: to help adventurers experience the fjords and northern landscapes in the most immersive way possible.
              </p>
              <p>
                What began as a personal passion has grown into a trusted name in campervan rentals. Years of exploring the region's hidden gems, from secluded fjords to the best scenic viewing spots, means we can pass that knowledge on to every guest who rents with us.
              </p>
              <p>
                Our carefully curated fleet of premium campervans helps travelers create unforgettable memories exploring the stunning Norwegian landscapes.
              </p>
            </div>
          </div>
        </section>

        {/* TEAM SECTION */}
        <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Team</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center tracking-tight">
              Meet the founder
            </h2>
            <p className="text-center text-gray-400 mb-10 text-sm">
              The passionate person behind your Arctic adventure
            </p>

            <div className="flex justify-center">
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center max-w-md w-full hover:shadow-sm transition-all">
                <div className="w-24 h-24 mx-auto mb-5 relative overflow-hidden rounded-full ring-1 ring-gray-100 bg-gray-200">
                  {/* Placeholder for anonymized portfolio */}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Alex Nordström</h3>
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Founder</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  A passionate nature enthusiast with a love for Norway's wilderness. Dedicated to helping travelers experience the magic of Norwegian landscapes through premium campervan adventures.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VALUES/MISSION SECTION */}
        <section className="bg-white py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Mission</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center tracking-tight">
              Our values
            </h2>
            <p className="text-center text-gray-400 mb-10 text-sm">
              The principles that guide everything we do
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Safety First</h3>
                <p className="text-gray-500 text-sm leading-relaxed">Every vehicle in our fleet undergoes rigorous maintenance and safety checks. We equip all campervans with winter tires, emergency kits, and satellite communication for peace of mind.</p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Authentic Experiences</h3>
                <p className="text-gray-500 text-sm leading-relaxed">We're not just renting campervans, we're sharing our home. Our local knowledge and insider tips help you discover the real Norway, beyond the tourist trails.</p>
              </div>
              <div className="bg-gray-50 rounded-xl border border-gray-100 p-6 hover:shadow-sm transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Sustainable Tourism</h3>
                <p className="text-gray-500 text-sm leading-relaxed">We're committed to preserving Norway's pristine beauty. Our eco-friendly practices include fuel-efficient vehicles and partnerships with local conservation efforts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT/LOCATION SECTION */}
        <section className="bg-gray-50 py-14 md:py-16 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Find Us</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-8 text-center tracking-tight">
              Visit us
            </h2>
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm max-w-4xl mx-auto overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                <div className="p-6 md:p-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Location</p>
                  <div className="space-y-1.5 text-gray-700">
                    <p className="leading-relaxed">NorthVenture</p>
                    <p className="leading-relaxed">Strandgaten 123</p>
                    <p className="leading-relaxed">5013 Bergen, Norway</p>
                  </div>
                </div>
                <div className="p-6 md:p-8 text-center">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Contact</p>
                  <div className="space-y-1.5 text-gray-700">
                    <p className="leading-relaxed">
                      <a href="tel:+4755512345" className="hover:text-gray-900 transition-colors">
                      +47 555 12 345
                      </a>
                    </p>
                    <p className="leading-relaxed">
                      <a href="mailto:hello@northventure-demo.com" className="hover:text-gray-900 transition-colors">
                      hello@northventure-demo.com
                      </a>
                    </p>
                    <p className="leading-relaxed text-gray-600 pt-1">Open daily: 08:00 - 20:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to start your adventure?"
          subtitle="Join our community of Arctic explorers and create memories that will last a lifetime"
          buttonText="Browse Our Fleet"
          buttonHref="/"
        />
      </main>

      <Footer />
    </div>
  );
}
