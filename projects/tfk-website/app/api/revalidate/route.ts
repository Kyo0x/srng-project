import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

const PATHS_BY_TYPE: Record<string, string[]> = {
  news:      ['/', '/nyheter', '/aktiviteter'],
  event:     ['/', '/arrangementer', '/jaktprover/hostprove', '/jaktprover/vinterprove'],
  clubhouse: ['/utleie-klubbhus'],
  resource:  ['/lover-og-regler'],
  result:    ['/'],
  sponsor:   ['/om-klubben'],
}

const ALL_PATHS = [...new Set(Object.values(PATHS_BY_TYPE).flat())]

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (!env.SANITY_REVALIDATE_SECRET || secret !== env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let paths = ALL_PATHS

  try {
    const body = await req.json()
    const docType = body?._type as string | undefined
    if (docType && PATHS_BY_TYPE[docType]) {
      paths = PATHS_BY_TYPE[docType]
    }
  } catch {
    // body parse failure — revalidate everything
  }

  for (const path of paths) {
    revalidatePath(path)
  }

  return NextResponse.json({ revalidated: true, paths })
}
