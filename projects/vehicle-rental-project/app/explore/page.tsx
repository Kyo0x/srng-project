import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CTASection } from '@/components/CTASection'

export const metadata: Metadata = {
  title: 'Road Trip Northern Norway - Destinations from Bergen',
  description: 'Plan your northern Norway road trip from Bergen. Campervan destinations include Senja island, Lyngen Alps, Sommarøy, and the best Northern Lights spots in Arctic Norway.',
  keywords: ['road trip northern Norway', 'northern Norway campervan destinations', 'Senja road trip', 'Lyngen Alps campervan', 'Bergen road trip', 'northern lights Norway road trip', 'campervan Norway destinations'],
  openGraph: {
    title: 'Road Trip Northern Norway | NorthVenture - Campervan Rental Bergen',
    description: 'Plan your northern Norway road trip from Bergen. Senja, Lyngen Alps, Sommarøy, and more - all reachable by campervan.',
    images: [{ url: '/hero-image.jpg', width: 1200, height: 630 }],
  },
}

interface ExploreLocation {
  id: string
  name: string
  description: string
  images: string[]
  distance: string
  highlights: string[]
}

const locations: ExploreLocation[] = [
  {
    id: 'sommaroy',
    name: 'Sommarøy',
    description: 'A picturesque island village with white sandy beaches and crystal-clear waters. Perfect for experiencing the midnight sun in summer or northern lights in winter.',
    images: [],
    distance: '1 hour drive',
    highlights: ['Sandy beaches', 'Midnight sun', 'Northern Lights', 'Fishing village'],
  },
  {
    id: 'senja',
    name: 'Senja Island',
    description: "Norway's second-largest island offers dramatic mountain peaks, scenic coastal roads, and the famous Tungeneset viewpoint. A must-visit for landscape photographers.",
    images: [],
    distance: '2.5 hour drive',
    highlights: ['Dramatic mountains', 'Scenic Route', 'Tungeneset', 'Wildlife'],
  },
  {
    id: 'kvaloya',
    name: 'Kvaløya',
    description: 'The island where we are located! Explore fjords, mountains, and authentic Norwegian fishing villages just minutes from Bergen.',
    images: [],
    distance: '15 min drive',
    highlights: ['Fjord views', 'Hiking trails', 'Local villages', 'Easy access'],
  },
  {
    id: 'lyngen',
    name: 'Lyngen Alps',
    description: 'Stunning alpine scenery with glaciers, steep peaks, and the beautiful Lyngenfjord. Popular for skiing in winter and hiking in summer.',
    images: [],
    distance: '2 hour drive',
    highlights: ['Alpine peaks', 'Glaciers', 'Skiing', 'Hiking'],
  },
  {
    id: 'skibotn',
    name: 'Skibotn',
    description: 'A gateway to the Finnish border with excellent northern lights viewing conditions due to low light pollution and clear inland skies.',
    images: [],
    distance: '1.5 hour drive',
    highlights: ['Northern Lights', 'Low light pollution', 'Mountain views', 'Border crossing'],
  },
  {
    id: 'grotfjord',
    name: 'Grøtfjord',
    description: 'A beautiful beach area on Kvaløya with opportunities for camping, fishing, and witnessing spectacular sunsets over the Norwegian Sea.',
    images: [],
    distance: '30 min drive',
    highlights: ['Beach camping', 'Sunsets', 'Fishing', 'Peaceful'],
  },
]

function LocationCard({ location }: { location: ExploreLocation }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-all overflow-hidden group">
      {/* Placeholder Image */}
      <div className="h-48 bg-slate-100 flex items-center justify-center border-b border-slate-200">
        <svg
          className="w-14 h-14 text-slate-400 group-hover:text-slate-500 group-hover:scale-110 transition-all"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-gray-900">{location.name}</h3>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {location.distance}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4 leading-relaxed line-clamp-3">{location.description}</p>

        {/* Highlights */}
        <div className="flex flex-wrap gap-2">
          {location.highlights.map((highlight) => (
            <span
              key={highlight}
              className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm"
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ height: '40vh', backgroundImage: 'url(/explore-hero.jpg)' }}>
          <div className="absolute inset-0 bg-black/55 z-0"></div>
          <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-3">Destinations</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight leading-tight">
              Road Trip Northern Norway
            </h1>
            <p className="text-lg md:text-xl text-white/70 font-light">
              Campervan destinations from Bergen across the most spectacular landscapes in Arctic Norway
            </p>
          </div>
        </section>

        {/* INTRO SECTION */}
        <section className="bg-white py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">The region</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4 tracking-tight">
              Your northern Norway road trip starts in Bergen
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Northern Norway offers some of the most spectacular road trip routes in the world.
              Pick up your campervan in Bergen and drive through pristine beaches, dramatic mountain peaks,
              and world-class Northern Lights territory. Every destination below is within easy reach and perfect for exploring by campervan.
            </p>
          </div>
        </section>

        {/* LOCATIONS GRID */}
        <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Locations</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center tracking-tight">
              Places to visit
            </h2>
            <p className="text-center text-gray-400 mb-10 text-sm">
              Each location offers unique experiences and breathtaking scenery
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((location) => (
                <LocationCard key={location.id} location={location} />
              ))}
            </div>
          </div>
        </section>

        <CTASection
          title="Ready to explore?"
          subtitle="Book your campervan and start your Arctic adventure today"
          buttonText="View Our fleet"
          buttonHref="/our-cars"
        />
      </main>

      <Footer />
    </div>
  )
}
