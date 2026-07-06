import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().optional(),
  NEXT_PUBLIC_SANITY_DATASET: z.string().optional(),
  SANITY_API_TOKEN: z.string().optional(),
  SANITY_REVALIDATE_SECRET: z.string().optional(),
})

function validateEnv() {
  const parsed = envSchema.parse({
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
    SANITY_REVALIDATE_SECRET: process.env.SANITY_REVALIDATE_SECRET,
  })
  return parsed
}

export const env = validateEnv()

// No Sanity project wired up (e.g. portfolio/demo deployment) - pages fall back
// to the bundled placeholder content in lib/mockData.ts instead of fetching.
export const SANITY_CONFIGURED = Boolean(
  env.NEXT_PUBLIC_SANITY_PROJECT_ID && env.NEXT_PUBLIC_SANITY_DATASET
)
