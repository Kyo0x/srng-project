import { getActivities } from '@/lib/queries'
import NewsCard from '@/components/NewsCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aktiviteter | Demo Hunting Club',
  description: 'Se våre aktiviteter og nyheter fra klubben',
}

export const revalidate = 3600

export default async function AktiviteterPage() {
  const activities = await getActivities()

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Aktiviteter</h1>
          <p className="text-xl text-gray-600">
            Se hva som skjer i klubben
          </p>
          <div className="w-24 h-1 bg-green-600 mx-auto mt-6"></div>
        </div>

        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => (
              <NewsCard key={activity._id} news={activity} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border-t-4 border-gray-300">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">
              Ingen aktiviteter ennå
            </h3>
            <p className="text-gray-600 text-lg">
              Aktiviteter vil vises her når de publiseres.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

