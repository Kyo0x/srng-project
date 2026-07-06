'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity.config'
import { SANITY_CONFIGURED } from '@/lib/env'

export default function StudioPage() {
  if (!SANITY_CONFIGURED) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50 p-8 text-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Studio ikke tilgjengelig i demo-modus
          </h1>
          <p className="text-gray-600">
            Dette er en portfolio-demo uten et tilkoblet Sanity-prosjekt.
          </p>
        </div>
      </div>
    )
  }

  return <NextStudio config={config} />
}
