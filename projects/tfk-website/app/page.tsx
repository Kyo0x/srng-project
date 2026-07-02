import Hero from '@/components/Hero'
import EventCard from '@/components/EventCard'
import NewsCard from '@/components/NewsCard'
import { getUpcomingEvents, getRecentNews, getResults } from '@/lib/queries'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo Hunting Club',
  description: 'Velkommen til Demo Hunting Club - en aktiv og inkluderende klubb for fuglehundinteresserte.',
}

export const revalidate = 3600

// pagination would be nice but not urgent
// we don't have THAT many events yet
export default async function Home() {
  // parallel fetch everything at once - faster loading
  const [events, news, results] = await Promise.all([
    getUpcomingEvents(3),
    getRecentNews(6),
    getResults(5),
  ])

  return (
    <main>
      <Hero />

      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nyheter</h2>
            <Link href="/nyheter" className="text-green-700 hover:text-green-800 font-semibold">
              Se alle →
            </Link>
          </div>

          {news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
              {news.map((newsItem) => (
                <NewsCard key={newsItem._id} news={newsItem} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">Ingen nyheter ennå.</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kommende arrangementer</h2>
            <Link href="/arrangementer" className="text-green-700 hover:text-green-800 font-semibold">
              Se alle →
            </Link>
          </div>

          {events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">Ingen kommende arrangementer for øyeblikket.</p>
          )}
        </div>
      </section>

      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Resultatservice jaktprøver</h2>
          </div>
          
          {results.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Premierte */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Premierte</h3>
                <div className="space-y-4">
                  {results
                    .filter((result) => result.category === 'premierte')
                    .map((result) => (
                      <div
                        key={result._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-green-600 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {result.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {new Date(result.date).toLocaleDateString('nb-NO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          {result.file?.asset?.url && (
                            <a
                              href={result.file.asset.url}
                              download
                              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors inline-flex items-center gap-2 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Last ned
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  {results.filter((result) => result.category === 'premierte').length === 0 && (
                    <p className="text-gray-500 text-center py-8">Ingen premierte resultater ennå.</p>
                  )}
                </div>
              </div>

              {/* Partiliste */}
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Partiliste</h3>
                <div className="space-y-4">
                  {results
                    .filter((result) => result.category === 'partiliste')
                    .map((result) => (
                      <div
                        key={result._id}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg hover:border-green-600 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">
                              {result.title}
                            </h4>
                            <p className="text-gray-600 text-sm">
                              {new Date(result.date).toLocaleDateString('nb-NO', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                          {result.file?.asset?.url && (
                            <a
                              href={result.file.asset.url}
                              download
                              className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors inline-flex items-center gap-2 text-sm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Last ned
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  {results.filter((result) => result.category === 'partiliste').length === 0 && (
                    <p className="text-gray-500 text-center py-8">Ingen partilister ennå.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-12">Ingen resultater tilgjengelig.</p>
          )}
        </div>
      </section>
    </main>
  )
}
