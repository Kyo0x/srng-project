import { createClient } from 'next-sanity'
import { env } from './env'

// Harmless fallback values so createClient never throws when no real Sanity
// project is configured - lib/queries.ts short-circuits to mock data before
// these clients are ever actually called against in that case.
const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder'
const dataset = env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: true, // faster in prod
})

export const clientWithToken = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: env.SANITY_API_TOKEN,
})
