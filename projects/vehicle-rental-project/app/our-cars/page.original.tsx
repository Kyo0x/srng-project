import type { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';

export const metadata: Metadata = {
  title: 'Our Fleet',
  description: 'Explore our premium Sunlight Cliff 590 4x4 Greentrek camper van. Arctic-ready with 4WD, diesel heating, and full amenities for Norwegian winter adventures.',
  openGraph: {
    title: 'Our Fleet | NorthVenture',
    description: 'Premium Arctic-ready RVs for your Norwegian adventure.',
    images: [{ url: '/hero-image.jpg', width: 1200, height: 630 }],
  },
};

const QUICK_SPECS = [
  { value: '4', label: 'Seats' },
  { value: '598 cm', label: 'Length' },
  { value: '2+1', label: 'Sleeping Spots' },
  { value: '4x4', label: 'Drive' },
  { value: '3,500 kg', label: 'Max Weight' },
];

const TECH_SPECS = [
  { label: 'Chassis', value: 'Ford Transit' },
  { label: 'Engine', value: '2.0L / 170 HP' },
  { label: 'Transmission', value: '6-speed manual' },
  { label: 'Drivetrain', value: '4x4 (All-wheel drive)' },
  { label: 'Dimensions', value: '598 × 206 × 284 cm' },
  { label: 'Interior height', value: '199 cm' },
  { label: 'Curb weight', value: '~3,067 kg' },
  { label: 'Max weight', value: '3,500 kg' },
  { label: 'Tow capacity', value: '2,800 kg (braked)' },
  { label: 'Fuel tank', value: '70 L diesel' },
  { label: 'Tire size', value: '235/60 R17' },
];

const KITCHEN_ITEMS = [
  'Two-burner gas stove with piezo ignition',
  '64L compressor refrigerator',
  'Sink with running water',
  'LED lighting',
  'Soft-close drawers',
  'Ample countertop workspace',
];

const BATHROOM_ITEMS = [
  'Cassette toilet (Thetford C223)',
  'Fixed washbasin',
  'Shower',
  'Window for ventilation',
  'Clothing rod',
];

const SLEEPING_ITEMS = [
  'Rear bed: 201–189 × 147 cm',
  'Optional middle bed: 169 × 87 cm',
  'Quality foam mattresses with slatted base',
  'Isofix child seat points',
  'Ambient lighting in overhead cabinets',
  'Full wraparound storage',
  'Insect screen door',
];

const CLIMATE_ITEMS = [
  'Diesel auxiliary heater (Webasto/Combi)',
  'Fresh water tank: 100 L',
  'Waste water tank: 90 L',
  'Hot water: 20 L',
  '3× 230V outlets',
  '2× double USB-A ports',
  '12V outlet',
];

const SAFETY_ITEMS = [
  'Adaptive cruise control with lane-keeping',
  'Dual front airbags',
  'ABS, ESC, traction control',
  'Hill-start assist, side-wind stability',
  'Pre-collision warning + fatigue detection',
  'Rear parking sensors',
  '12" touchscreen with Apple CarPlay & Android Auto',
  'DAB radio, Bluetooth',
  'Swivel captain\'s seats with armrests',
  'Tire pressure monitoring',
];

function SpecCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 hover:shadow-sm transition-all">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Details</p>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <svg className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="2,8 6,12 14,4" />
            </svg>
            <span className="text-gray-600">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function OurCarsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/fleet-hero.jpg)'}}>
          <div className="absolute inset-0 bg-black/55 z-0"></div>
          <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-3xl mx-auto py-10 sm:py-0">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 mb-3">Our Fleet</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold mb-3 md:mb-4 tracking-tight leading-tight">
              Sunlight Cliff 590 4x4 Greentrek
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white font-light drop-shadow">
              Arctic-ready camper van built for Norwegian winter adventures
            </p>
          </div>
        </section>

        {/* QUICK SPECS BAR */}
        <section className="bg-gray-50 border-b border-gray-100 py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <div className="min-w-[720px] bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-5 divide-x divide-gray-100">
                {QUICK_SPECS.map((spec) => (
                  <div key={spec.label} className="p-4 sm:p-5 text-center">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">{spec.label}</p>
                    <p className="text-xl sm:text-2xl font-semibold text-gray-900 tabular-nums">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SPEC SECTIONS */}
        <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto space-y-4">

            {/* Technical Specifications */}
            <div className="bg-white rounded-xl border border-gray-100 p-6 sm:p-8 hover:shadow-sm transition-all">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Details</p>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Technical Specifications</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TECH_SPECS.map((spec) => (
                  <div key={spec.label} className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">{spec.label}</span>
                    <span className="font-semibold text-gray-900">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <SpecCard title="Kitchen" items={KITCHEN_ITEMS} />
            <SpecCard title="Bathroom" items={BATHROOM_ITEMS} />
            <SpecCard title="Sleeping & Living" items={SLEEPING_ITEMS} />
            <SpecCard title="Climate & Heating" items={CLIMATE_ITEMS} />
            <SpecCard title="Chassis & Safety Features" items={SAFETY_ITEMS} />

          </div>
        </section>

        <CTASection
          title="Ready to book?"
          subtitle="Select your dates and start your Arctic adventure today"
          buttonText="Check Availability"
          buttonHref="/#booking"
        />
      </main>

      <Footer />
    </div>
  );
}
