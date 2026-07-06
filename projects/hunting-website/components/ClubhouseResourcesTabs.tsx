'use client'

import Image from 'next/image'
import { useState } from 'react'

type DocumentItem = {
  id: string
  url: string
  text: string
}

type ImageItem = {
  id: string
  url: string
  alt: string
}

interface ClubhouseResourcesTabsProps {
  documents: DocumentItem[]
  images: ImageItem[]
}

export default function ClubhouseResourcesTabs({ documents, images }: ClubhouseResourcesTabsProps) {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)

  const hasDocuments = documents.length > 0
  const hasImages = images.length > 0

  if (!hasDocuments && !hasImages) {
    return null
  }

  return (
    <>
      <section className="flex flex-wrap justify-center gap-4">
        {documents.map((doc) => (
          <a
            key={doc.id}
            href={doc.url}
            download
            className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium px-6 py-3 border-2 border-green-600 hover:border-green-700 rounded-md transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {doc.text}
          </a>
        ))}

        <button
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium px-6 py-3 border-2 border-green-600 hover:border-green-700 rounded-md transition-colors duration-200"
          aria-label="Vis bilder av klubbhuset"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm3 8l3-3 2 2 4-4 3 3"
            />
          </svg>
          Bilder av lokalet ({images.length})
        </button>
      </section>

      {isGalleryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 p-4 sm:p-8"
          onClick={() => setIsGalleryOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsGalleryOpen(false)
            }
          }}
          aria-label="Lukk bildegalleri"
        >
          <button
            type="button"
            onClick={() => setIsGalleryOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 rounded-full bg-white p-2 text-gray-700 shadow-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
            aria-label="Lukk bildegalleri"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="mx-auto h-full max-w-6xl rounded-xl bg-white shadow-2xl flex flex-col overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b px-4 py-3 sm:px-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Bilder av klubbhuset</h2>
              <button
                type="button"
                onClick={() => setIsGalleryOpen(false)}
                className="rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
                aria-label="Lukk bildegalleri"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {hasImages ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image) => (
                    <a
                      key={image.id}
                      href={image.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block overflow-hidden rounded-lg border border-gray-200 hover:border-green-500 transition-colors duration-200"
                    >
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">Ingen bilder tilgjengelig ennå.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
