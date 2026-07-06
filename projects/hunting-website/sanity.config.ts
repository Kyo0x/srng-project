import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'
import { env } from './lib/env'

export default defineConfig({
  name: 'default',
  title: 'Demo Hunting Club',

  // Falls back to placeholder values in demo mode - the /studio route itself is
  // gated off (see app/studio/[[...tool]]/page.tsx) so these are never actually used.
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
