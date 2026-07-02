import type { Event, News, Resource, Clubhouse, Service, Result, Sponsor } from './types'

// Placeholder content shown in demo mode (no Sanity project configured).
// Shapes mirror real CMS documents so every page has something realistic to render.
// See lib/queries.ts, which serves this instead of hitting Sanity when SANITY_CONFIGURED is false.

const DEMO_IMAGE = { asset: { _ref: 'demo-placeholder-image', _type: 'reference' as const } }

function daysFromNow(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function daysAgo(days: number): string {
  return daysFromNow(-days)
}

export const mockEvents: Event[] = [
  {
    _id: 'demo-event-1',
    _type: 'event',
    title: 'Høstprøve for stående fuglehunder',
    slug: { current: 'hostprove-for-staende-fuglehunder' },
    category: 'hostprove',
    date: daysFromNow(12),
    location: 'Klubbens prøveterreng',
    description: 'Ordinær høstprøve for stående fuglehunder, åpen for alle klasser.',
    image: DEMO_IMAGE,
  },
  {
    _id: 'demo-event-2',
    _type: 'event',
    title: 'Høstprøve - Unghundklasse',
    slug: { current: 'hostprove-unghundklasse' },
    category: 'hostprove',
    date: daysFromNow(26),
    location: 'Klubbens prøveterreng',
    description: 'Unghundklasse - en fin arena for hunder som deltar på sin første prøve.',
    image: DEMO_IMAGE,
  },
  {
    _id: 'demo-event-3',
    _type: 'event',
    title: 'Vinterprøve - Klubbmesterskap',
    slug: { current: 'vinterprove-klubbmesterskap' },
    category: 'vinterprove',
    date: daysFromNow(70),
    location: 'Klubbhuset',
    description: 'Årets klubbmesterskap på vinterprøve, med premiering og sosialt samvær etterpå.',
    image: DEMO_IMAGE,
  },
  {
    _id: 'demo-event-4',
    _type: 'event',
    title: 'Vinterprøve - Åpen klasse',
    slug: { current: 'vinterprove-apen-klasse' },
    category: 'vinterprove',
    date: daysFromNow(84),
    location: 'Klubbens prøveterreng',
    description: 'Vinterprøve åpen for alle klasser og raser tilsluttet NKK.',
    image: DEMO_IMAGE,
  },
]

export const mockNews: News[] = [
  {
    _id: 'demo-news-1',
    _type: 'news',
    title: 'Velkommen til ny sesong',
    slug: { current: 'velkommen-til-ny-sesong' },
    publishedAt: daysAgo(2),
    excerpt: 'Vi gleder oss til en ny sesong med jaktprøver, trening og sosialt fellesskap.',
    image: DEMO_IMAGE,
    showAsActivity: true,
  },
  {
    _id: 'demo-news-2',
    _type: 'news',
    title: 'Påmelding til høstprøven er åpnet',
    slug: { current: 'pamelding-hostproven-apnet' },
    publishedAt: daysAgo(6),
    excerpt: 'Påmelding til årets høstprøve er nå åpen. Se arrangementssiden for detaljer.',
    image: DEMO_IMAGE,
  },
  {
    _id: 'demo-news-3',
    _type: 'news',
    title: 'Oppgradering av klubbhuset',
    slug: { current: 'oppgradering-av-klubbhuset' },
    publishedAt: daysAgo(15),
    excerpt: 'Klubbhuset har fått nytt kjøkken og oppgraderte fasiliteter for utleie.',
    image: DEMO_IMAGE,
    showAsActivity: true,
  },
  {
    _id: 'demo-news-4',
    _type: 'news',
    title: 'Rapport fra klubbmesterskapet',
    slug: { current: 'rapport-fra-klubbmesterskapet' },
    publishedAt: daysAgo(30),
    excerpt: 'Se resultatene fra dette årets klubbmesterskap på vinterprøve.',
  },
  {
    _id: 'demo-news-5',
    _type: 'news',
    title: 'Nytt styre valgt på årsmøtet',
    slug: { current: 'nytt-styre-valgt-pa-arsmotet' },
    publishedAt: daysAgo(45),
    excerpt: 'Årsmøtet er avholdt og nytt styre er på plass for kommende periode.',
  },
  {
    _id: 'demo-news-6',
    _type: 'news',
    title: 'Kurskveld for nye hundeførere',
    slug: { current: 'kurskveld-for-nye-hundeforere' },
    publishedAt: daysAgo(60),
    excerpt: 'Vi arrangerte en hyggelig kurskveld for medlemmer som er nye i sporten.',
    image: DEMO_IMAGE,
    showAsActivity: true,
  },
]

export const mockResults: Result[] = [
  {
    _id: 'demo-result-1',
    _type: 'result',
    title: 'Høstprøve - Premierte',
    date: daysAgo(20),
    category: 'premierte',
    file: { asset: { _ref: 'demo-file', _type: 'reference' } },
  },
  {
    _id: 'demo-result-2',
    _type: 'result',
    title: 'Høstprøve - Partiliste',
    date: daysAgo(20),
    category: 'partiliste',
    file: { asset: { _ref: 'demo-file', _type: 'reference' } },
  },
  {
    _id: 'demo-result-3',
    _type: 'result',
    title: 'Klubbmesterskap - Premierte',
    date: daysAgo(50),
    category: 'premierte',
    file: { asset: { _ref: 'demo-file', _type: 'reference' } },
  },
]

export const mockResources: Resource[] = [
  {
    _id: 'demo-resource-1',
    _type: 'resource',
    title: 'NKKs regelverk for jaktprøver',
    description: 'Offisielt regelverk for jaktprøver på stående fuglehund.',
    url: 'https://www.nkk.no/',
    order: 0,
  },
  {
    _id: 'demo-resource-2',
    _type: 'resource',
    title: 'Klubbens vedtekter',
    description: 'Gjeldende vedtekter for klubben, sist revidert på årsmøtet.',
    order: 1,
  },
  {
    _id: 'demo-resource-3',
    _type: 'resource',
    title: 'Ordensregler for prøveterreng',
    description: 'Regler for opptreden og sikkerhet på klubbens prøveterreng.',
    order: 2,
  },
]

export const mockClubhouse: Clubhouse[] = [
  {
    _id: 'demo-clubhouse-1',
    _type: 'clubhouse',
    title: 'Utleie klubbhus',
    description: 'Trivelig klubbhus med plass til ca. 40 personer og fullt utstyrt kjøkken.',
    contractButtonText: 'Last ned leieavtale',
    galleryImages: [
      {
        alt: 'Klubbhuset utenfra',
        image: { asset: { _ref: 'demo-image-1', _type: 'reference', url: '/homepage-picture.jpg' } },
      },
      {
        alt: 'Selskapslokalet innendørs',
        image: { asset: { _ref: 'demo-image-2', _type: 'reference', url: '/homepage-picture.jpg' } },
      },
    ],
  },
]

export const mockServices: Service[] = []

export const mockSponsors: Sponsor[] = [
  {
    _id: 'demo-sponsor-1',
    _type: 'sponsor',
    name: 'Demo Sport & Fritid',
    logo: DEMO_IMAGE,
    website: 'https://example.com',
    order: 0,
  },
  {
    _id: 'demo-sponsor-2',
    _type: 'sponsor',
    name: 'Demo Dyreklinikk',
    logo: DEMO_IMAGE,
    order: 1,
  },
]
