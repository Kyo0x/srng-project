import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/booking-details/'],
    },
    sitemap: 'https://www.arctictrail.no/sitemap.xml',
  };
}
