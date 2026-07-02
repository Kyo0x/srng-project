import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CTASection } from '@/components/CTASection';

export const metadata = {
  title: 'Our Fleet - Demo',
  description: 'Demo vehicle specifications page',
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
  { label: 'Fuel tank', value: '70 L diesel' },
];

const FEATURES = {
  kitchen: [
    'Two-burner gas stove',
    '64L compressor refrigerator',
    'Sink with running water',
    'LED lighting',
    'Soft-close drawers',
  ],
  bathroom: [
    'Cassette toilet',
    'Fixed washbasin',
    'Shower',
    'Window for ventilation',
  ],
  sleeping: [
    'Rear bed: 201 × 147 cm',
    'Optional middle bed',
    'Quality foam mattresses',
    'Ambient lighting',
  ],
  climate: [
    'Diesel auxiliary heater',
    'Fresh water: 100 L',
    'Waste water: 90 L',
    'Hot water: 20 L',
  ],
};

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
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[30vh] sm:min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative z-10 text-center px-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 mb-3">Our Fleet</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              Premium Campervans
            </h1>
            <p className="mt-4 text-white/80 max-w-xl mx-auto">
              Arctic-ready 4x4 vehicles equipped for Norwegian adventures
            </p>
          </div>
        </section>

        {/* Quick Specs */}
        <section className="bg-white py-8 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {QUICK_SPECS.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technical Specifications */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Technical Specifications</h2>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <tbody className="divide-y divide-gray-100">
                  {TECH_SPECS.map(({ label, value }) => (
                    <tr key={label}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{label}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Interior & Features</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <SpecCard title="Kitchen" items={FEATURES.kitchen} />
              <SpecCard title="Bathroom" items={FEATURES.bathroom} />
              <SpecCard title="Sleeping" items={FEATURES.sleeping} />
              <SpecCard title="Climate Control" items={FEATURES.climate} />
            </div>
          </div>
        </section>

        {/* Demo Notice */}
        <section className="bg-yellow-50 border-y border-yellow-100 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="text-sm font-medium text-yellow-800">
              📋 Portfolio Demo - Sample vehicle specifications for demonstration purposes
            </p>
          </div>
        </section>

        <CTASection
          title="Ready for your Arctic adventure?"
          subtitle="Book your campervan rental today"
          buttonText="View Availability"
          buttonHref="/availability"
        />
      </main>
      <Footer />
    </>
  );
}
