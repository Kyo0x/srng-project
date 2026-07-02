'use client'

import Link from 'next/link'

export default function EventError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Kunne ikke laste arrangement</h2>
        <p className="text-gray-600 mb-6">Fant ikke dette arrangementet</p>
        <button onClick={reset} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-3">
          Prøv igjen
        </button>
        <Link href="/arrangementer" className="text-gray-600 hover:text-gray-900">Alle arrangementer</Link>
      </div>
    </div>
  )
}
