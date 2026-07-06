import type { Metadata } from 'next'
import Image from 'next/image'
import { getSponsors } from '@/lib/queries'
import { getOptimizedImageUrl } from '@/lib/sanity.image'

export const metadata: Metadata = {
  title: 'Om klubben | Demo Hunting Club',
  description: 'Demo Hunting Club er en aktiv og inkluderende klubb for fuglehundinteresserte.',
}

export const revalidate = 3600

export default async function OmKlubbenPage() {
  const sponsors = await getSponsors()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Om klubben</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            En aktiv og inkluderende klubb for fuglehundinteresserte
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured intro card */}
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-start gap-4">
                <svg className="w-12 h-12 flex-shrink-0 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-gray-900">Vårt mål</h2>
                  <p className="leading-relaxed text-gray-700">
                    Gjennom sitt arbeid bidrar klubben til å ivareta, utvikle og videreføre fuglehundsporten lokalt, samtidig som vi fungerer som en sosial arena der jaktglede, kunnskap og erfaring deles på tvers av raser, alder og erfaring.
                  </p>
                </div>
              </div>
            </div>

            {/* Info cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Vårt arbeid</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Klubben arbeider målrettet for å fremme interessen for stående fuglehunder gjennom helhetlig aktivitet som kombinerer trening, jaktprøver, kurs og sosialt fellesskap.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Aktiviteter</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Vi arrangerer jevnlig jaktprøver, klubbmesterskap, teorikvelder og andre tiltak som passer både nybegynnere og erfarne hundeførere.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Fellesskap</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Vi er et trygt, faglig sterkt og inkluderende fellesskap for alle som er glad i fuglehund og jakt.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Dugnad</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Vi legger stor vekt på frivillig innsats og dugnadsånd – en forutsetning for gode arrangementer og tilbud til medlemmene.
                </p>
              </div>
            </div>
          </div>

          {/* Sponsors sidebar - 1/3 width */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                Våre sponsorer
              </h2>
              
              {sponsors.length > 0 ? (
                <div className="space-y-4">
                  {sponsors.map((sponsor) => {
                    const imageUrl = getOptimizedImageUrl(sponsor.logo, 400)
                    
                    const sponsorContent = (
                      <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors h-[140px] border border-gray-100">
                        <div className="relative w-full h-full">
                          <Image
                            src={imageUrl!}
                            alt={sponsor.name}
                            fill
                            sizes="(max-width: 1024px) 100vw, 400px"
                            className="object-contain"
                          />
                        </div>
                      </div>
                    )

                    return sponsor.website ? (
                      <a
                        key={sponsor._id}
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        {sponsorContent}
                      </a>
                    ) : (
                      <div key={sponsor._id}>
                        {sponsorContent}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center">Ingen sponsorer lagt til ennå.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
