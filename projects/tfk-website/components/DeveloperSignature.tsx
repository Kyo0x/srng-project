'use client'

import { useEffect } from 'react'

export default function DeveloperSignature() {
  useEffect(() => {
    console.log(
      '%cDemo Hunting Club',
      'color: #15803d; font-size: 24px; font-weight: bold;'
    )
    console.log(
      '%cWebsite developed by Developer',
      'color: #4ade80; font-size: 14px;'
    )
    console.log(
      '%cGitHub: github.com/example',
      'color: #86efac; font-size: 12px;'
    )
    console.log('')
    console.log(
      '%c┌─────────────────────────────────┐',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│         Tech Stack              │',
      'color: #86efac; font-size: 12px; font-weight: bold;'
    )
    console.log(
      '%c├─────────────────────────────────┤',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│ • Next.js 15 (App Router)       │',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│ • React 19                      │',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│ • TypeScript                    │',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│ • Sanity CMS                    │',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│ • Tailwind CSS                  │',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c│ • Vercel (Hosting)              │',
      'color: #86efac; font-size: 12px;'
    )
    console.log(
      '%c└─────────────────────────────────┘',
      'color: #86efac; font-size: 12px;'
    )
  }, [])

  return null
}
