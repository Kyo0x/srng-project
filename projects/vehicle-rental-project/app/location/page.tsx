'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { CTASection } from '@/components/CTASection'
import { TransportationModal } from '@/components/TransportationModal'
import dynamic from 'next/dynamic'

const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl" />
  )
})

type ModalType = 'airport' | 'city' | null

export default function LocationPage() {
  const [openModal, setOpenModal] = useState<ModalType>(null)
  const address = 'Strandgaten 123, 5013 Bergen, Norway'
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">

        {/* HERO SECTION */}
        <section className="relative flex items-center justify-center overflow-hidden bg-cover bg-center bg-no-repeat" style={{ height: '40vh', backgroundImage: 'url(/location-hero.jpg)' }}>
          <div className="absolute inset-0 bg-black/55 z-0"></div>
          <div className="relative z-10 text-center text-white px-4 md:px-8 max-w-3xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90 mb-3">Location</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 tracking-tight leading-tight">
              Visit us
            </h1>
            <p className="text-lg md:text-xl text-white font-light drop-shadow">
              Located in Bergen city center
            </p>
          </div>
        </section>

        {/* MAP AND INFO SECTION */}
        <section className="bg-white py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
              {/* Map */}
              <div className="lg:col-span-3 h-[350px] md:h-[450px] rounded-xl overflow-hidden border border-gray-100 relative z-0">
                <Map />
              </div>

              {/* Info */}
              <div className="lg:col-span-2 flex flex-col justify-center space-y-10">
                {/* Address */}
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Address
                  </p>
                  <p className="text-lg text-gray-900 font-semibold leading-tight">Strandgaten 123</p>
                  <p className="text-lg text-gray-900 font-semibold leading-tight">5013 Bergen, Norway</p>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 text-primary-700 hover:text-[#1a4f7a] text-sm font-medium transition-colors"
                  >
                    Get directions
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>

                {/* Contact */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Contact
                  </p>
                  <p>
                    <a href="tel:+4755512345" className="text-lg text-gray-900 font-semibold hover:text-gray-600 transition-colors">
                      +47 555 12 345
                    </a>
                  </p>
                  <p className="pt-0.5">
                    <a href="mailto:hello@northventure-demo.com" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                      hello@northventure-demo.com
                    </a>
                  </p>
                </div>

                {/* Hours */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    Hours
                  </p>
                  <p className="text-lg text-gray-900 font-semibold">08:00 – 20:00</p>
                  <p className="text-gray-400 text-sm pt-0.5">Every day</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* GETTING HERE SECTION */}
        <section className="bg-gray-50 py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2 text-center">Directions</p>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 text-center tracking-tight">
              Getting here
            </h2>
            <p className="text-center text-gray-400 mb-10 text-sm">
              Easy access from Bergen Airport and city center
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setOpenModal('airport')}
                className="bg-white p-6 rounded-xl border border-gray-100 text-left hover:shadow-sm hover:border-gray-200 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3l14 9-14 9V3z" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-900">From the Airport</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">Approximately 30 minutes by taxi or airport bus</p>
                <span className="text-xs font-medium text-primary-700 group-hover:text-[#1a4f7a] transition-colors">View details →</span>
              </button>
              <button
                onClick={() => setOpenModal('city')}
                className="bg-white p-6 rounded-xl border border-gray-100 text-left hover:shadow-sm hover:border-gray-200 transition-all group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-900">From City Center</h3>
                </div>
                <p className="text-gray-500 text-sm mb-4">15 to 30 min by taxi or bus depending on choice</p>
                <span className="text-xs font-medium text-primary-700 group-hover:text-[#1a4f7a] transition-colors">View details →</span>
              </button>
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <h3 className="text-sm font-semibold text-gray-900">Easy Parking</h3>
                </div>
                <p className="text-gray-500 text-sm">Spacious parking area on site</p>
              </div>
            </div>
          </div>
        </section>

        {openModal && (
          <TransportationModal type={openModal} onClose={() => setOpenModal(null)} />
        )}

        <CTASection
          title="Ready to start your adventure?"
          subtitle="Book your Norwegian RV experience today"
          buttonText="Browse our fleet"
          buttonHref="/"
        />
      </main>

      <Footer />
    </div>
  )
}
