import { MetadataRoute } from 'next'
import { getAllEvents, getAllNews } from '@/lib/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://hunting-dog-portal.srng.no'
  
  const [events, news] = await Promise.all([
    getAllEvents(),
    getAllNews(),
  ])
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/arrangementer`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/nyheter`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/jaktprover`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/om-klubben`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/lover-og-regler`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/utleie-klubbhus`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    ...events.map((event) => ({
      url: `${baseUrl}/arrangementer/${event.slug.current}`,
      lastModified: new Date(event.date),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...news.map((post) => ({
      url: `${baseUrl}/nyheter/${post.slug.current}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
