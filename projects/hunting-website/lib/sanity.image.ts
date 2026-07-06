import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url'
import { client } from './sanity.client'
import { SANITY_CONFIGURED } from './env'

const builder = createImageUrlBuilder(client)

// Bundled stand-in used everywhere a Sanity CDN image would normally render (demo mode).
const DEMO_PLACEHOLDER_IMAGE = '/homepage-picture.jpg'

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

export function getOptimizedImageUrl(
  source: SanityImageSource | null | undefined,
  width?: number,
  height?: number
): string | null {
  if (!source) return null

  if (!SANITY_CONFIGURED) {
    return DEMO_PLACEHOLDER_IMAGE
  }

  // sanity's image optimization is pretty good
  let imageBuilder = urlFor(source).auto('format').fit('max').quality(85)

  if (width) {
    imageBuilder = imageBuilder.width(width)
  }

  if (height) {
    imageBuilder = imageBuilder.height(height)
  }

  return imageBuilder.url()
}
