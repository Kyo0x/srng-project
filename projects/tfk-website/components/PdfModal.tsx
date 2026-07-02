'use client'

import { useState, useEffect } from 'react'

interface PdfModalProps {
  pdfUrl: string
  filename?: string
}

export default function PdfModal({ pdfUrl, filename }: PdfModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayUrl, setDisplayUrl] = useState('')

  useEffect(() => {
    if (pdfUrl) {
      // Add Google Docs Viewer as fallback for better PDF display
      const googleDocsViewerUrl = `https://docs.google.com/gviz/query?tqx=out:json&tq=&gid=0&range=A1:Z&key=${encodeURIComponent(pdfUrl)}&options=%7B%22allowHtml%22:true,%22cssClassNames%22:%7B%7D,%22pieHole%22:0,%22title%22:%22%22,%22curveType%22:%22function%22,%22hAxis%22:%7B%22title%22:%22%22,%22minValue%22:null,%22maxValue%22:null,%22viewWindowMinValue%22:null,%22viewWindowMaxValue%22:null,%22direction%22:1,%22format%22:%22%23,%23%23%23.###%22%7D,%22vAxis%22:%7B%22title%22:%22%22,%22minValue%22:null,%22maxValue%22:null,%22direction%22:1,%22format%22:%22%23,%23%23%23.###%22%7D%7D`
      // Try direct URL first
      setDisplayUrl(pdfUrl)
    }
  }, [pdfUrl])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium px-4 py-2 border-2 border-green-600 hover:border-green-700 rounded transition-colors duration-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Vis PDF
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-[80vw] h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {filename || 'PDF'}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {displayUrl ? (
                <iframe
                  src={`${displayUrl}#toolbar=0`}
                  className="flex-1 w-full h-full border-none"
                  title={filename || 'PDF'}
                  sandbox="allow-same-origin allow-scripts"
                />
              ) : (
                <div className="text-center text-gray-500">
                  <p>Laster PDF...</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-4 border-t bg-gray-50">
              <a
                href={pdfUrl}
                download={filename}
                className="inline-flex items-center gap-2 text-green-700 hover:text-green-900 font-medium px-4 py-2 border-2 border-green-600 hover:border-green-700 rounded transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Last ned
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
