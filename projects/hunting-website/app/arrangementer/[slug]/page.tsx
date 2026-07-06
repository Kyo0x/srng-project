import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { getEvent } from '@/lib/queries'
import { getOptimizedImageUrl } from '@/lib/sanity.image'
import { PortableText } from '@portabletext/react'
import type { Metadata } from 'next'

export const revalidate = 60

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { getAllEvents } = await import('@/lib/queries')
  const events = await getAllEvents()
  
  return events.map((event) => ({
    slug: event.slug.current,
  }))
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    return {
      title: 'Arrangement ikke funnet',
    }
  }

  const imageUrl = event.image
    ? getOptimizedImageUrl(event.image, 1200, 630)
    : null

  return {
    title: `${event.title} | Demo Hunting Club`,
    description: event.description || `Bli med på ${event.title}`,
    openGraph: {
      title: event.title,
      description: event.description || undefined,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) {
    notFound()
  }

  const imageUrl = event.image
    ? getOptimizedImageUrl(event.image, 1200, 600)
    : null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.date,
    location: event.location ? {
      '@type': 'Place',
      name: event.location,
    } : undefined,
    description: event.description,
    image: imageUrl,
    organizer: {
      '@type': 'Organization',
      name: 'Demo Hunting Club',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-gray-50">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {imageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>
            
            {event.facebookLink && (
              <a
                href={event.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-md hover:bg-[#0C63D4] transition-colors whitespace-nowrap"
                aria-label="Se på Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Se på Facebook
              </a>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time dateTime={event.date}>
                {format(new Date(event.date), 'PPPP', { locale: nb })}
              </time>
            </div>

            {event.location && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{event.location}</span>
              </div>
            )}
          </div>

          {event.description && (
            <div className="text-xl text-gray-700 mb-8 pb-8 border-b">
              {event.description}
            </div>
          )}

          {event.content && (
            <div className="prose">
              <PortableText value={event.content as any} />
            </div>
          )}
        </div>
      </article>
      </div>
    </>
  )
}
