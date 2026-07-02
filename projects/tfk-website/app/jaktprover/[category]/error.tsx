'use client'

import Link from 'next/link'

export default function JaktproverCategoryError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md bg-white rounded-lg shadow p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Kunne ikke laste jaktprøver</h2>
        <button onClick={reset} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 mr-3">
          Prøv igjen
        </button>
        <Link href="/jaktprover">Tilbake</Link>
      </div>
    </div>
  )
}
