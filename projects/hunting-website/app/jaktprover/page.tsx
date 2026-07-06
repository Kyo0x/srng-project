import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jaktprøver | Demo Hunting Club',
  description: 'Informasjon om jaktprøver og fuglehundprøver',
}

const categories = [
  { title: 'Høstprøve', value: 'hostprove', description: 'Jaktprøver på høsten' },
  { title: 'Vinterprøve', value: 'vinterprove', description: 'Jaktprøver på vinteren' },
]

export default function JaktproverPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Jaktprøver</h1>
          <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600">
            Velg en kategori for å se kommende jaktprøver
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/jaktprover/${category.value}`}
              className="group"
            >
              <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-all h-full border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-2xl font-bold text-gray-900 group-hover:text-green-700 transition">
                    {category.title}
                  </h2>
                  <svg 
                    className="w-6 h-6 text-gray-400 group-hover:text-green-700 group-hover:translate-x-1 transition" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Om jaktprøver</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Jaktprøver, ofte kalt fuglehundprøver, er prøver der hundens jaktlige egenskaper vurderes i felt under kontrollerte former. Prøvene er godkjent av NKK og arrangeres i henhold til fastsatt regelverk.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Regelverk og organisering</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>NKK har egne regler for jaktprøver som gjelder for fuglehundprøver, retrieverprøver og andre jaktprøver under klubb/forbund tilsluttet NKK.</li>
              <li>Regelverket omfatter alt fra søknad om arrangering til krav til dokumentasjon, rapportering og resultatføring etter at prøven er gjennomført.</li>
              <li>Arrangementer skal registreres elektronisk gjennom NKK sine systemer, og terminliste for prøver godkjennes gjennom klubbene og NKK.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Hvordan prøvene gjennomføres</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>For stående fuglehunder beskriver NKKs regelverk hvordan prøvene skal arrangeres, og hva som kreves for at en prøve er anerkjent.</li>
              <li>NKK-representanten har ansvar for at prøven avvikles i tråd med reglene, og det stilles krav til korrekt registrering av resultater og kritikker.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Deltakelse og krav</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hunder må være registrert i NKK eller et NKK-godkjent register for å delta.</li>
              <li>Hunder må ha gyldig vaksinering og være ID-merket, og det gjelder egne helse- og alderskrav i regelverket.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Praktisk informasjon fra NKK</h3>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>På nkk.no finnes oversikt over regelverk, terminlister, påmelding, arrangementer og formelle krav under «Prøver og konkurranser».</li>
              <li>Der finnes også detaljerte regler for ulike typer jaktprøver (f.eks. fuglehund, retriever og halsende fuglehund) som klubber og deltakere må følge.</li>
            </ul>

            <p className="mt-6">
              Prøvene gir verdifull erfaring for både nye og erfarne hundeførere, og er en viktig arena for utvikling og læring.
            </p>
            <p className="font-semibold">
              Alle medlemmer er velkommen til å delta. Ta gjerne kontakt med klubben for mer informasjon om kommende prøver og påmelding.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
