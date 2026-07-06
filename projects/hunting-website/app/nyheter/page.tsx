import { getRecentNews } from '@/lib/queries'
import NewsCard from '@/components/NewsCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nyheter | Demo Hunting Club',
  description: 'Les de siste nyhetene fra Demo Hunting Club',
}

export const revalidate = 3600

export default async function NyheterPage() {
  const news = await getRecentNews(100)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Nyheter</h1>
        
        {news.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((newsItem) => (
              <NewsCard key={newsItem._id} news={newsItem} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">Ingen nyheter ennå.</p>
        )}
      </div>
    </div>
  )
}
