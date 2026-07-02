export interface ValueItem {
	icon: string;
	title: string;
	description: string;
}

export interface ExpertiseItem {
	title: string;
	description: string;
}

export interface FeatureItem {
	icon: string;
	title: string;
	description: string;
}

export const VALUES: ValueItem[] = [
	{
		icon: '<svg class="w-8 h-8 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
		title: 'Pålitelighet',
		description: 'Vi leverer det vi lover, til avtalt tid. Våre kunder kan stole på oss for konsistent kvalitet og profesjonalitet.'
	},
	{
		icon: '<svg class="w-8 h-8 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>',
		title: 'Kompetanse',
		description: 'Vi holder oss oppdatert på nyeste teknologi og beste praksis for å gi deg de beste løsningene.'
	},
	{
		icon: '<svg class="w-8 h-8 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
		title: 'Kundefokus',
		description: 'Ditt behov står alltid i sentrum. Vi lytter, tilpasser oss og leverer løsninger som fungerer for deg.'
	}
];

export const EXPERTISE_AREAS: ExpertiseItem[] = [
	{
		title: 'Windows & macOS Support',
		description: 'Feilsøking, optimalisering og vedlikehold av både Windows og Mac-systemer.'
	},
	{
		title: 'Nettverksadministrasjon',
		description: 'Oppsett, konfigurasjon og vedlikehold av bedriftsnettverk.'
	},
	{
		title: 'Cybersikkerhet',
		description: 'Implementering av sikkerhetstiltak og beskyttelse mot trusler.'
	},
	{
		title: 'Cloud-tjenester',
		description: 'Microsoft 365, Google Workspace og andre sky-baserte løsninger.'
	},
	{
		title: 'Backup & Gjenoppretting',
		description: 'Implementering av robuste backup-strategier og disaster recovery.'
	},
	{
		title: 'Maskinvare',
		description: 'Rådgivning, innkjøp, installasjon og oppgradering av IT-utstyr.'
	}
];

export const FEATURES: FeatureItem[] = [
	{
		icon: '<svg class="w-5 h-5 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
		title: 'Samme dag service',
		description: 'Ved akutte problemer kommer vi ofte samme dag. Både hjemmebesøk og rask fjernhjelp tilgjengelig.'
	},
	{
		icon: '<svg class="w-5 h-5 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
		title: 'Du når alltid rett person',
		description: 'Du snakker alltid direkte med den som faktisk hjelper deg. Ingen callsenter, ingen viderekobling, Det er mitt ansvar å sørge for at du er fornøyd.'
	},
	{
		icon: '<svg class="w-5 h-5 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>',
		title: 'Fjernhjelp når det passer',
		description: 'Mange problemer løser vi eksternt via sikre forbindelser – ofte raskere og billigere enn oppmøte.'
	},
	{
		icon: '<svg class="w-5 h-5 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>',
		title: 'Enkel kommunikasjon',
		description: 'Vi forklarer IT på vanlig norsk, slik at du forstår hva som skjer med PC-en din.'
	}
];

export const SECTION_HEADERS = {
	about: {
		badge: 'Hvem vi er',
		title: 'Din pålitelige IT-partner',
		description: 'IT Hjelperen er en profesjonell IT-tjenesteleverandør som hjelper bedrifter og privatpersoner med alle aspekter av informasjonsteknologi. Vi kombinerer teknisk ekspertise med praktisk problemløsning for å levere effektive og pålitelige IT-løsninger.'
	},
	values: {
		badge: 'Det vi står for',
		title: 'Våre verdier',
		description: 'Disse prinsippene styrer alt vi gjør og sikrer at du får best mulig service.'
	},
	expertise: {
		badge: 'Hva vi kan',
		title: 'Våre kompetanseområder',
		description: 'Bred erfaring med moderne IT-systemer og teknologi som holder bedriften din i gang.'
	},
	features: {
		badge: 'Hvorfor velge oss',
		title: 'Det som gjør oss unike',
		description: 'Vi gjør IT-hjelp enkelt, rimelig og pålitelig – uten unødvendig sjargong.'
	}
} as const;
