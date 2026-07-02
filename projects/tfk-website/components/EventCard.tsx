import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { getOptimizedImageUrl } from '@/lib/sanity.image'
import type { Event } from '@/lib/types'

interface EventCardProps {
  event: Event
}

function EventCard({ event }: EventCardProps) {
  // need to find a better placeholder image at some point
  const imageUrl = event.image
    ? getOptimizedImageUrl(event.image, 800, 600)
    : "/homepage-picture.jpg"

  return (
    <Link href={`/arrangementer/${event.slug.current}`} className="group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
        {imageUrl && (
          <div className="relative h-48">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center gap-2 text-sm text-green-700 font-semibold mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{format(new Date(event.date), 'PPP', { locale: nb })}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{event.location}</span>
            </div>
          )}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-700 transition">
            {event.title}
          </h3>
          {event.description && (
            <p className="text-gray-700 line-clamp-2">{event.description}</p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default EventCard
