import { getClubhouse } from '@/lib/queries'
import ClubhouseResourcesTabs from '@/components/ClubhouseResourcesTabs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Utleie av klubbhus | Demo Hunting Club',
  description:
    'Lei vårt trivelige selskapslokale/klubbhus til bursdag, konfirmasjon, møter, kurs og andre arrangement.',
}

export const revalidate = 3600

export default async function UtleieKlubbhusPage() {
  const clubhouses = await getClubhouse()

  const documents = clubhouses
    .map((clubhouse) => {
      const url = clubhouse?.contractFile?.asset?.url
      const text =
        clubhouse?.contractButtonText ||
        clubhouse?.contractFile?.asset?.originalFilename ||
        'Last ned fil'

      if (!url) {
        return null
      }

      return {
        id: clubhouse._id,
        url,
        text,
      }
    })
    .filter((doc): doc is { id: string; url: string; text: string } => doc !== null)

  const images = clubhouses.flatMap((clubhouse) =>
    (clubhouse.galleryImages || [])
      .map((item, index) => {
        const url = item?.image?.asset?.url
        if (!url) {
          return null
        }

        return {
          id: `${clubhouse._id}-${index}`,
          url,
          alt: item?.alt || 'Bilde av klubbhuset',
        }
      })
      .filter(
        (image): image is { id: string; url: string; alt: string } => image !== null
      )
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Utleie av klubbhus
          </h1>
          <div className="w-24 h-1 bg-green-600 mx-auto"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="mb-6">
              Demo Hunting Club tilbyr leie av lokaler gjennom vårt trivelige
              klubbhus. Her kan du leie selskapslokale til bursdager, konfirmasjoner, møter,
              jubileum eller andre sosiale arrangement.
            </p>
            <p className="mb-6">
              Lokalene ligger i rolige omgivelser og har sitteplass til omtrent 40 personer. Det er
              godt med dagslys, og en lun atmosfære som passer perfekt til både små og
              mellomstore selskap. Kjøkkenet er fullt utstyrt med komfyr, kjøleskap,
              oppvaskmaskin, kaffetrakter, servise og bestikk - alt klart til bruk.
            </p>
            <p className="mb-6">
              Leietakere står selv ansvarlig for rydding og renhold etter bruk, og vi ber om at alle
              tar godt vare på lokalene.
            </p>
            <h2 className="mt-10 mb-4">Praktisk informasjon og beliggenhet</h2>
            <p className="mb-4">
              Klubbhuset ligger i et rolig område, med enkel adkomst fra sentrum med bil. Det er gode
              parkeringsmuligheter rett ved lokalet, og kort avstand til offentlig transport.
            </p>
            <p className="mb-6">
              Adressen til klubbhuset er:
              <br />
              <strong>Demo Street 1, 0000 Demo City</strong>
            </p>
            <p className="mb-6">
              Pris for leie avtales ved forespørsel. Ønsker du å sikre deg dato eller har spørsmål om
              fasiliteter i lokalet, ta gjerne kontakt med oss - vi hjelper deg med å finne en god løsning.
            </p>
            <p className="mb-1">
              E-post:{' '}
              <a href="mailto:info@demo-club.example" className="text-green-700 hover:text-green-900">
                info@demo-club.example
              </a>
            </p>
            <p className="mb-4">
              Telefon:{' '}
              <a href="tel:+47XXXXXXXX" className="text-green-700 hover:text-green-900">
                XX XX XX XX
              </a>
            </p>
            <p>
              Velkommen til å leie klubbhuset hos Demo Hunting Club - et hyggelig lokale for
              bursdag, konfirmasjon, kurs og andre fine anledninger!
            </p>
          </div>
        </div>

        {clubhouses.length > 0 && <ClubhouseResourcesTabs documents={documents} images={images} />}
      </div>
    </div>
  )
}
