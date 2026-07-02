'use client'

import Link from 'next/link'

export default function NewsError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <svg
          className="w-16 h-16 mx-auto text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Kunne ikke laste nyhet
        </h2>
        <p className="text-gray-600 mb-6">
          Kunne ikke laste inn nyheten. Den eksisterer kanskje ikke lenger.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-3"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Prøv igjen
        </button>
        <Link
          href="/nyheter"
          className="block w-full text-gray-600 hover:text-gray-900 transition"
        >
          Se alle nyheter
        </Link>
      </div>
    </div>
  )
}
