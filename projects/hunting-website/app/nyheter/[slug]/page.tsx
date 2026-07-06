import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { nb } from 'date-fns/locale'
import { getNewsPost } from '@/lib/queries'
import { getOptimizedImageUrl } from '@/lib/sanity.image'
import { PortableText } from '@portabletext/react'
import PdfModal from '@/components/PdfModal'
import type { Metadata } from 'next'

export const revalidate = 60

interface NewsPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { getAllNews } = await import('@/lib/queries')
  const news = await getAllNews()
  
  return news.map((post) => ({
    slug: post.slug.current,
  }))
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { slug } = await params
  const news = await getNewsPost(slug)

  if (!news) {
    return {
      title: 'Nyhet ikke funnet',
    }
  }

  const imageUrl = getOptimizedImageUrl(news.image, 1200, 630)

  return {
    title: `${news.title} | Demo Hunting Club`,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      type: 'article',
      publishedTime: news.publishedAt,
      ...(imageUrl && { images: [{ url: imageUrl, width: 1200, height: 630 }] }),
    },
  }
}

export default async function NewsPage({ params }: NewsPageProps) {
  // would be cool to show related news at the bottom
  // maybe later when we have more content
  const { slug } = await params
  const news = await getNewsPost(slug)

  if (!news) {
    notFound()
  }

  const imageUrl = getOptimizedImageUrl(news.image, 1200, 600)

  if (news.pdfAsMainContent && news.pdf?.asset?.url) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex flex-col h-screen">
          <div className="bg-white border-b p-4 flex items-center justify-between">
            <div>
              <time dateTime={news.publishedAt} className="text-gray-500 text-sm block mb-2">
                {format(new Date(news.publishedAt), 'PPP', { locale: nb })}
              </time>
              <h1 className="text-2xl font-bold text-gray-900">{news.title}</h1>
            </div>
            <div className="flex items-center gap-3">
              {news.facebookLink && (
                <a
                  href={news.facebookLink}
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
              <Link href="/nyheter" className="text-gray-500 hover:text-gray-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Link>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <iframe
              src={`${news.pdf.asset.url}#toolbar=0&navpanes=0`}
              className="w-full h-full border-none"
              style={{
                transform: 'translateY(-40px)',
                height: 'calc(100% + 40px)',
              }}
              title={news.pdf.asset.originalFilename || 'PDF'}
            />
          </div>
          <div className="bg-white border-t p-4 flex items-center justify-between">
            <p className="text-gray-700">{news.excerpt}</p>
            <a
              href={news.pdf.asset.url}
              download={news.pdf.asset.originalFilename}
              className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium px-4 py-2 border-2 border-green-600 hover:border-green-700 rounded transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Last ned PDF
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {imageUrl && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={news.title}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start">
            <div>
              <time dateTime={news.publishedAt} className="text-gray-500 text-sm">
                {format(new Date(news.publishedAt), 'PPP', { locale: nb })}
              </time>
              <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">{news.title}</h1>
            </div>
            {news.facebookLink && (
              <a
                href={news.facebookLink}
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
          <p className="text-xl text-gray-700 mb-8 pb-8 border-b">{news.excerpt}</p>

          {!news.pdfAsMainContent && news.pdf?.asset?.url && (
            <div className="mb-8">
              <PdfModal pdfUrl={news.pdf.asset.url} filename={news.pdf.asset.originalFilename} />
            </div>
          )}

          {news.content && (
            <div className="prose">
              <PortableText value={news.content as any} />
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
