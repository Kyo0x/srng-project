import { getResources } from '@/lib/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lover og regler | Demo Hunting Club',
  description: 'Les våre lover, regler og andre viktige dokumenter',
}

export const revalidate = 60

function formatFileSize(bytes?: number) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  if (mb < 1) {
    return `${(bytes / 1024).toFixed(0)} KB`
  }
  return `${mb.toFixed(1)} MB`
}

export default async function LoverOgReglerPage() {
  const resources = await getResources()

  return (
    <div className="bg-gradient-to-b from-green-50 to-white pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Lover og regler</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            Last ned klubbens lover, regler og dokumenter
          </p>
        </div>

        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((resource) => {
              const fileUrl = resource.file?.asset?.url
              const filename = resource.file?.asset?.originalFilename || 'Dokument'
              const fileSize = resource.file?.asset?.size
              const externalUrl = resource.url
              
              const hasFile = !!fileUrl
              const hasLink = !!externalUrl
              
              return (
                <div key={resource._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {resource.title}
                      </h2>
                      {resource.description && (
                        <p className="text-gray-600 text-sm">{resource.description}</p>
                      )}
                    </div>
                    
                    {(hasFile || hasLink) && (
                      <div className="flex items-center gap-3">
                        {hasFile && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Last ned
                          </a>
                        )}
                        
                        {hasLink && (
                          <a
                            href={externalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-lg transition font-medium text-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            Åpne
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Ingen ressurser ennå
            </h3>
            <p className="text-gray-600">
              Dokumenter og lenker som lastes opp vil vises her.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
