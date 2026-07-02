'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Noe gikk galt</h2>
        <p className="text-gray-600 mb-6">Beklager, det oppstod en feil</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-3"
        >
          Prøv igjen
        </button>
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          Forsiden
        </Link>
      </div>
    </div>
  )
}
