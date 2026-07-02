'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { getOptimizedImageUrl } from '@/lib/sanity.image'
import PdfModal from './PdfModal'
import type { News } from '@/lib/types'

interface NewsCardProps {
  news: News
}

export default function NewsCard({ news }: NewsCardProps) {
  const imageUrl = getOptimizedImageUrl(news.image, 600, 400)
  // 600x400 seems to work well for cards

  return (
    <Link href={`/nyheter/${news.slug.current}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition h-full flex flex-col">
        {imageUrl && (
          <div className='relative h-48'>
            <Image
              src={imageUrl}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className='object-cover group-hover:scale-105 transition duration-300'
            />
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="text-sm text-gray-500 mb-2">
            {format(new Date(news.publishedAt), 'PPP', { locale: nb })}
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-700 transition">
            {news.title}
          </h3>
          <p className="text-gray-700 line-clamp-3 flex-1">{news.excerpt}</p>
          <div className="mt-4 text-green-700 font-semibold flex items-center gap-1">
            Les mer
            <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
