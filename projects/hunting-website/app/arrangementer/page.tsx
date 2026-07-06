import { getUpcomingEvents } from '@/lib/queries'
import EventCard from '@/components/EventCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Arrangementer | Demo Hunting Club',
  description: 'Se våre kommende arrangementer og jaktprøver',
}

export const revalidate = 3600

export default async function ArrangementerPage() {
  const events = await getUpcomingEvents(100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Arrangementer</h1>
          <p className="text-xl text-gray-600">
            Se våre kommende arrangementer
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-6"></div>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border-t-4 border-gray-300">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Ingen arrangementer ennå
            </h3>
            <p className="text-gray-600 text-lg">
              Arrangementer vil vises her når de publiseres.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
