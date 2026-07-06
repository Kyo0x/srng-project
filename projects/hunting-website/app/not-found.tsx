import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-9xl font-bold text-green-700 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Siden ble ikke funnet
        </h2>
        <p className="text-gray-600 mb-8">
          Beklager, vi kunne ikke finne siden du leter etter.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Tilbake til forsiden
        </Link>
      </div>
    </div>
  )
}
