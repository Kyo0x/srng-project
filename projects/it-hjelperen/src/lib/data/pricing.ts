export interface LinkedPriceItem {
	text: string;
	linkText: string;
	href: string;
}

export type PriceItem = string | LinkedPriceItem;

export interface PricePackage {
	title: string;
	priceFrom: string;
	description: string;
	items: PriceItem[];
}

export interface MiscPriceItem {
	service: string;
	price: string;
	notes: string;
}

export interface DeliveryNote {
	title: string;
	description: string;
}

export interface RevisionWindow {
	packageTitle: string;
	window: string;
	description: string;
}

export const PRICE_PAGE_INTRO = {
	badge: 'Priser 2026',
	title: 'Tydelige priser uten overraskelser',
	description:
		'Veiledende priser basert på tidsbruk, kompleksitet og hvor mye som faktisk må bygges og tilpasses.'
};

export const IT_SUPPORT_PACKAGES: PricePackage[] = [
	{
		title: 'Fjernhjelp',
		priceFrom: 'fra 549 kr',
		description: 'Rask hjelp via sikker fjernstyring når problemet kan løses uten oppmøte.',
		items: [
			'Inntil 30 minutter: 549 kr',
			'Per ekstra 30 minutter: 490 kr'
		]
	},
	{
		title: 'Hjemmebesøk',
		priceFrom: 'fra 1 350 kr',
		description: 'For problemer som krever fysisk oppmøte, testing av utstyr eller installasjon.',
		items: [
			'Oppmøte + første time: 1 350 kr',
			'Per påbegynt halvtime etter første: 450 kr'
		]
	},
	{
		title: 'Bedriftssupport',
		priceFrom: 'fra 1 350 kr/time',
		description: 'Prioritert support for mindre bedrifter med behov for raske avklaringer.',
		items: [
			'Timepris ved løpende behov: 1 350 kr/time',
			'Prioritert responstid i avtalt arbeidstid',
			'Kan kombineres med egne serviceavtaler ved fast behov'
		]
	}
];

export const BUSINESS_SUPPORT_AGREEMENTS: PricePackage[] = [
	{
		title: 'Månedsavtale',
		priceFrom: '4 900 kr/mnd',
		description: 'Fast avtale for bedrifter som vil ha jevnlig oppfølging og forutsigbare kostnader.',
		items: [
			'3 fjernhjelpsøkter inkludert',
			'Vedlikehold av nettside',
			'Inntil 5 timer arbeid totalt'
		]
	}
];

export const WEBSITE_PACKAGES: PricePackage[] = [
	{
		title: 'Mini-nettside',
		priceFrom: 'fra 5 900 kr',
		description: 'For privatpersoner og små behov der alt kan lages raskt og enkelt uten mye spesialtilpasning eller mange runder.',
		items: [
			'Typisk 3-6 timers arbeid totalt',
			'Enkel og mobiltilpasset nettside med det viktigste på plass',
			'Passer når tekst, bilder og innhold er ganske klart fra start'
		]
	},
	{
		title: 'Enkel nettside',
		priceFrom: 'fra 9 900 kr',
		description: 'For deg som vil ha en ryddig og profesjonell nettside, men fortsatt holde løsningen enkel og rimelig.',
		items: [
			'Typisk 6-12 timers arbeid',
			'Mer tilpasning i oppsett, innhold og uttrykk',
			'Mobiltilpasset og klar for publisering',
			{
				text: 'Eksempel ',
				linkText: 'her',
				href: 'https://example.com'
			}
		]
	},
	{
		title: 'Profesjonell nettside',
		priceFrom: 'fra 19 900 kr',
		description: 'For bedrifter og organisasjoner som vil ha en gjennomarbeidet nettside med tydelig profil, god struktur og høyere kvalitet i design og innhold.',
		items: [
			'Typisk 15-25 timers arbeid',
			'Mer gjennomarbeidet design og bedre flyt i innholdet',
			'SEO-grunnlag, ytelse og finpuss før levering',
			'Passer best når du ikke trenger innlogging, booking eller spesialfunksjoner'
		]
	},
	{
		title: 'Skreddersydd løsning',
		priceFrom: 'Kontakt oss for pris på ditt prosjekt',
		description: 'For prosjekter med spesielle behov som ikke passer inn i en vanlig nettsidepakke. Omfang og pris vurderes individuelt ut fra funksjonalitet, integrasjoner og hvor mye som faktisk må bygges.',
		items: [
			'Adminpanel, innlogging og annen spesialtilpasset funksjonalitet',
			'Bookingløsninger, medlemsløsninger og integrasjoner',
			'Dedikert prosjektoppfølging',
			'3 måneder teknisk støtte for spørsmål og mindre oppfølging etter levering',
			{
				text: 'Eksempel ',
				linkText: 'her',
				href: 'https://example.com'
			}
		]
	}
];

export const WEBSITE_DELIVERY_NOTES: DeliveryNote[] = [
	{
		title: 'Revisjoner',
		description:
			'Mindre justeringer i tekst, bilder og oppsett er inkludert innen revisjonsfristen for valgt pakke. Større endringer avtales separat.'
	},
	{
		title: 'Feilretting',
		description:
			'Feilretting gjelder feil i levert løsning, altså noe som ikke fungerer som avtalt. Dette rettes uten ekstra kostnad i opptil 30 dager etter levering for vanlige nettsider og 60 dager for skreddersydde løsninger.'
	},
	{
		title: 'Nye funksjoner',
		description:
			'Nye ønsker etter levering, som booking, innlogging, nye seksjoner eller andre tillegg, regnes som nytt arbeid og prises separat.'
	}
];

export const WEBSITE_REVISION_WINDOWS: RevisionWindow[] = [
	{
		packageTitle: 'Mini-nettside',
		window: '7 dager',
		description: '1 mindre revisjonsrunde etter levering.'
	},
	{
		packageTitle: 'Enkel nettside',
		window: '14 dager',
		description: 'Inntil 2 mindre revisjonsrunder etter levering.'
	},
	{
		packageTitle: 'Profesjonell nettside',
		window: '30 dager',
		description: 'Inntil 2 revisjonsrunder med mindre justeringer.'
	},
	{
		packageTitle: 'Skreddersydd løsning',
		window: 'Etter avtale',
		description: 'Revisjoner og oppfølging avtales ut fra prosjektets omfang.'
	}
];

export const MISC_PRICES: MiscPriceItem[] = [
	{
		service: 'PC-bygging',
		price: 'fra 1 350 kr',
		notes: 'Inkluderer montering, OS-installasjon og testing. Bygges hos deg? Faktureres som hjemmebesøk.'
	},
	{
		service: 'Virusfjerning og sikkerhetssjekk',
		price: 'fra 1 350 kr',
		notes: 'Avhenger av omfang og om data må gjenopprettes.'
	},
	{
		service: 'Ny PC-oppsett og overføring',
		price: 'fra 1 350 kr',
		notes: 'Inkluderer flytting av filer, e-post og grunnoppsett.'
	},
	{
		service: 'Nettverksoppsett og ruterinstallasjon',
		price: 'fra 1 350 kr',
		notes: 'Oppsett av ruter, mesh-system eller nettverk. Utstyr kommer i tillegg ved behov.'
	},
	{
		service: 'SEO-tekst per side',
		price: 'fra 1 350 kr',
		notes: 'Basert på tema, lengde og researchbehov.'
	},
	{
		service: 'Månedlig vedlikehold nettside',
		price: 'fra 1 099 kr/mnd',
		notes: 'Oppdateringer, backup, overvåking og feilretting.'
	}
];

