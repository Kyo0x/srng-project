import { notFound } from 'next/navigation'
import { getEventsByCategory } from '@/lib/queries'
import EventCard from '@/components/EventCard'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 60

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

const categories = {
  hostprove: 'Høstprøve',
  vinterprove: 'Vinterprøve',
  varprove: 'Vårprøve',
  sommerprove: 'Sommerprøve',
  eliteprove: 'Eliteprøve',
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryTitle = categories[category as keyof typeof categories]

  if (!categoryTitle) {
    return {
      title: 'Kategori ikke funnet',
    }
  }

  return {
    title: `${categoryTitle} | Demo Hunting Club`,
    description: `Se alle ${categoryTitle.toLowerCase()} arrangementer`,
  }
}

export default async function JaktproveCategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  
  const categoryTitle = categories[category as keyof typeof categories]
  
  if (!categoryTitle) {
    notFound()
  }

  const events = await getEventsByCategory(category)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link 
          href="/jaktprover" 
          className="inline-flex items-center text-green-700 hover:text-green-800 mb-6 font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Tilbake til jaktprøver
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">{categoryTitle}</h1>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ingen kommende {categoryTitle.toLowerCase()}
            </h3>
            <p className="text-gray-600">
              Det er ingen planlagte arrangementer i denne kategorien for øyeblikket.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
