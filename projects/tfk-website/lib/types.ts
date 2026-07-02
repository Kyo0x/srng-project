export interface Event {
  _id: string
  _type: 'event'
  title: string
  slug: { current: string }
  category?: string
  date: string
  location?: string
  description?: string
  facebookLink?: string
  content?: unknown[]
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
}

export interface News {
  _id: string
  _type: 'news'
  title: string
  slug: { current: string }
  publishedAt: string
  excerpt: string
  content?: unknown[]
  facebookLink?: string
  showAsActivity?: boolean
  pdfAsMainContent?: boolean
  image?: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  pdf?: {
    asset: {
      _ref: string
      _type: 'reference'
      url?: string
      originalFilename?: string
      extension?: string
      size?: number
    }
  }
}

export interface Resource {
  _id: string
  _type: 'resource'
  title: string
  description?: string
  file?: {
    asset: {
      _ref: string
      _type: 'reference'
      url?: string
      originalFilename?: string
      extension?: string
      size?: number
    }
  }
  url?: string
  order?: number
}

export interface Clubhouse {
  _id: string
  _type: 'clubhouse'
  title: string
  description?: string
  contractFile?: {
    asset: {
      _ref: string
      _type: 'reference'
      url?: string
      originalFilename?: string
      size?: number
    }
  }
  contractButtonText?: string
  galleryImages?: Array<{
    alt?: string
    image?: {
      asset?: {
        _ref: string
        _type: 'reference'
        url?: string
      }
    }
  }>
  content?: unknown[]
  contactInfo?: string
}

export interface Service {
  _id: string
  _type: 'service'
  title: string
  description?: string
  icon?: string
  link?: string
  order?: number
}

export interface Result {
  _id: string
  _type: 'result'
  title: string
  date: string
  category: 'premierte' | 'partiliste'
  file: {
    asset: {
      _ref: string
      _type: 'reference'
      url?: string
      originalFilename?: string
      extension?: string
      size?: number
    }
  }
}

export interface Sponsor {
  _id: string
  _type: 'sponsor'
  name: string
  logo: {
    asset: {
      _ref: string
      _type: 'reference'
    }
  }
  website?: string
  order: number
}
