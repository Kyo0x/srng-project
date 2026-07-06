import { client } from './sanity.client'
import { SANITY_CONFIGURED } from './env'
import * as demo from './mockData'
import type { Event, News, Resource, Clubhouse, Service, Result, Sponsor } from './types'

// probably overkill with these constants but whatever
const DEFAULT_UPCOMING_EVENTS = 3
const DEFAULT_NEWS_LIMIT = 6
const DEFAULT_RESULTS_LIMIT = 10
const MAX_EVENTS_PER_CATEGORY = 100 // should be enough lol

export async function getUpcomingEvents(limit: number = DEFAULT_UPCOMING_EVENTS): Promise<Event[]> {
  const now = new Date().toISOString().slice(0, 10)

  if (!SANITY_CONFIGURED) {
    return demo.mockEvents
      .filter((event) => event.date >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit)
  }

  const events = await client.fetch<Event[]>(
    `*[_type == "event" && date >= $now] | order(date asc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      category,
      date,
      location,
      description,
      image
    }`,
    { now, limit }
  )
  return events || []
}

export async function getEventsByCategory(category: string, limit: number = MAX_EVENTS_PER_CATEGORY): Promise<Event[]> {
  const now = new Date().toISOString().slice(0, 10) // YYYY-MM-DD format

  if (!SANITY_CONFIGURED) {
    return demo.mockEvents
      .filter((event) => event.category === category && event.date >= now)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, limit)
  }

  const events = await client.fetch<Event[]>(
    `*[_type == "event" && category == $category && date >= $now] | order(date asc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      category,
      date,
      location,
      description,
      image
    }`,
    { category, now, limit }
  )
  return events || []
}

export async function getRecentNews(limit: number = DEFAULT_NEWS_LIMIT): Promise<News[]> {
  if (!SANITY_CONFIGURED) {
    return [...demo.mockNews]
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, limit)
  }

  const news = await client.fetch<News[]>(
    `*[_type == "news"] | order(publishedAt desc) [0...$limit] {
      _id,
      _type,
      title,
      slug,
      publishedAt,
      excerpt,
      image,
      pdfAsMainContent,
      pdf {
        asset-> {
          _ref,
          _type,
          url,
          originalFilename,
          extension,
          size
        }
      }
    }`,
    { limit }
  )
  return news || []
}

export async function getAllEvents(): Promise<Event[]> {
  if (!SANITY_CONFIGURED) {
    return [...demo.mockEvents].sort((a, b) => b.date.localeCompare(a.date))
  }

  // fetching ALL events - might get slow if we get hundreds of events
  const events = await client.fetch<Event[]>(
    `*[_type == "event"] | order(date desc) {
      _id,
      _type,
      title,
      slug,
      category,
      date,
      location,
      description,
      image
    }`
  )
  return events || []
}

export async function getEvent(slug: string): Promise<Event | null> {
  if (!SANITY_CONFIGURED) {
    return demo.mockEvents.find((event) => event.slug.current === slug) || null
  }

  return client.fetch(
    `*[_type == "event" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      category,
      date,
      location,
      description,
      facebookLink,
      content,
      image
    }`,
    { slug }
  )
}

export async function getNewsPost(slug: string): Promise<News | null> {
  if (!SANITY_CONFIGURED) {
    return demo.mockNews.find((news) => news.slug.current === slug) || null
  }

  return client.fetch(
    `*[_type == "news" && slug.current == $slug][0] {
      _id,
      _type,
      title,
      slug,
      publishedAt,
      excerpt,
      content,
      facebookLink,
      image,
      pdfAsMainContent,
      pdf {
        asset-> {
          _ref,
          _type,
          url,
          originalFilename,
          extension,
          size
        }
      }
    }`,
    { slug }
  )
}

export async function getAllNews(): Promise<News[]> {
  if (!SANITY_CONFIGURED) {
    return [...demo.mockNews].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }

  const news = await client.fetch<News[]>(
    `*[_type == "news"] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      publishedAt,
      excerpt,
      image,
      pdfAsMainContent,
      pdf {
        asset-> {
          _ref,
          _type,
          url,
          originalFilename,
          extension,
          size
        }
      }
    }`
  )
  return news || []
}

export async function getResources(): Promise<Resource[]> {
  if (!SANITY_CONFIGURED) {
    return [...demo.mockResources].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  const resources = await client.fetch<Resource[]>(
    `*[_type == "resource"] | order(order asc) {
      _id,
      _type,
      title,
      description,
      file {
        asset-> {
          _ref,
          _type,
          url,
          originalFilename,
          extension,
          size
        }
      },
      url,
      order
    }`
  )
  return resources || []
}

export async function getActivities(): Promise<News[]> {
  if (!SANITY_CONFIGURED) {
    return demo.mockNews
      .filter((news) => news.showAsActivity)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }

  const activities = await client.fetch<News[]>(
    `*[_type == "news" && showAsActivity == true] | order(publishedAt desc) {
      _id,
      _type,
      title,
      slug,
      publishedAt,
      excerpt,
      image
    }`
  )
  return activities || []
}

export async function getClubhouse(): Promise<Clubhouse[]> {
  if (!SANITY_CONFIGURED) {
    return demo.mockClubhouse
  }

  const clubhouses = await client.fetch<Clubhouse[]>(
    `*[_type == "clubhouse"] | order(_createdAt asc) {
      _id,
      _type,
      title,
      description,
      contractFile {
        asset-> {
          _ref,
          _type,
          url,
          originalFilename,
          size
        }
      },
      contractButtonText,
      galleryImages[] {
        alt,
        image {
          asset-> {
            _ref,
            _type,
            url
          }
        }
      },
      content,
      contactInfo
    }`
  )
  return clubhouses || []
}

export async function getServices(): Promise<Service[]> {
  if (!SANITY_CONFIGURED) {
    return demo.mockServices
  }

  const services = await client.fetch<Service[]>(
    `*[_type == "service"] | order(order asc) {
      _id,
      _type,
      title,
      description,
      icon,
      link,
      order
    }`
  )
  return services || []
}

export async function getResults(limit: number = DEFAULT_RESULTS_LIMIT): Promise<Result[]> {
  if (!SANITY_CONFIGURED) {
    return [...demo.mockResults]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, limit)
  }

  const results = await client.fetch<Result[]>(
    `*[_type == "result"] | order(date desc) [0...$limit] {
      _id,
      _type,
      title,
      date,
      category,
      file {
        asset-> {
          _ref,
          _type,
          url,
          originalFilename,
          extension,
          size
        }
      }
    }`,
    { limit }
  )
  return results || []
}

export async function getSponsors(): Promise<Sponsor[]> {
  if (!SANITY_CONFIGURED) {
    return [...demo.mockSponsors].sort((a, b) => a.order - b.order)
  }

  const sponsors = await client.fetch<Sponsor[]>(
    `*[_type == "sponsor"] | order(order asc) {
      _id,
      _type,
      name,
      logo,
      website,
      order
    }`
  )
  return sponsors || []
}
