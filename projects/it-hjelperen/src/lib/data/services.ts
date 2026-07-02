export interface Service {
	title: string;
	features: string[];
	icon?: string;
	description?: string;
}

export const SERVICES: Service[] = [
	{
		title: 'PC-Service',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>',
		description: 'Rask og effektiv reparasjon av datamaskiner. Vi løser alt fra virusproblemer til maskinvarefeil.',
		features: [
			'Feilsøking av maskinvare og programvare',
			'Fjerning av virus og skadevare',
			'Datagjenoppretting der det er mulig',
			'Rask reparasjon samme dag'
		]
	},
	{
		title: 'Oppsett og Installasjon',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
		description: 'Ny PC, skriver eller programvare? Vi setter opp alt og lærer deg å bruke det.',
		features: [
			'Ferdig oppsett av PC, Mac og utstyr',
			'Installasjon av programvare',
			'Overføring av filer og profiler',
			'Kort opplæring og tips'
		]
	},
	{
		title: 'Hjemmenettverk og WiFi',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>',
		description: 'Få WiFi i hele huset. Vi setter opp og optimaliserer hjemmenettverket ditt for best dekning.',
		features: [
			'Optimal plassering av ruter/mesh',
			'Dekning i hele boligen',
			'Sikret nettverk med gjestenett',
			'Feilsøking av tregt nett'
		]
	},
	{
		title: 'Datasikkerhet og Backup',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
		description: 'Beskytt dine viktige filer og minner. Vi setter opp backup og sikrer PC-en din mot virus og trusler.',
		features: [
			'Automatisk sky- eller diskbackup',
			'Oppsett av sikkerhetsprogram',
			'Ransomware- og phishing-beskyttelse',
			'Passordhåndtering og rutiner'
		]
	},
	{
		title: 'Mobil og Skrivere',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>',
		description: 'Problemer med mobil, nettbrett eller skriver? Vi feilsøker og setter opp alt som hører til.',
		features: [
			'Feilsøking av mobil og nettbrett',
			'Oppsett og installasjon av skriver',
			'Nettverksskriver for hele husstanden',
			'Feilsøking av utskriftsproblemer'
		]
	},
	{
		title: 'Nettsidebygging',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>',
		description: 'Vi bygger raske, moderne nettsider tilpasset din bedrift — fra design til publisering.',
		features: [
			'Responsivt design for mobil og desktop',
			'Rask ytelse og grunnleggende SEO-oppsett',
			'Integrasjon med kontaktskjema og kart',
			'Enkel publisering og vedlikehold'
		]
	},
	{
		title: 'Fjernhjelp',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>',
		description: 'Få hjelp hjemmefra! Vi løser problemer eksternt via sikker tilkobling raskt og enkelt.',
		features: [
			'Sikker tilkobling på få minutter',
			'Løser programvaretrøbbel raskt',
			'Installasjoner og oppdateringer',
			'Lav pris siden vi jobber eksternt'
		]
	},
	{
		title: 'PC-Bygging',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
		description: 'Skreddersydde gaming- og arbeidsmaskiner. Vi bygger PC-en du drømmer om fra bunnen av.',
		features: [
			'Skreddersydd gaming- og arbeidsmaskin',
			'Komponentvalg og budsjettplan',
			'Profesjonell montering',
			'Full testing før levering'
		]
	},
	{
		title: 'PC-Oppgradering',
		icon: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/></svg>',
		description: 'Pust nytt liv i gammel maskinvare. Mer RAM, raskere SSD eller nytt skjermkort — vi fikser det.',
		features: [
			'Bytte til lynrask SSD',
			'Mer RAM for bedre flyt',
			'Oppgradering av skjermkort/CPU',
			'Rens og nytt kjølepasta'
		]
	}
];

export const SERVICES_PAGE_HEADER = {
	badge: 'Alt du trenger samlet i én oversikt',
	title: 'Velg tjenesten som passer deg',
	description: 'Hver flis beskriver hva vi leverer, hva du får inkludert og hvordan vi jobber. Finn det som matcher behovet ditt og ta kontakt, så fikser vi resten.'
} as const;

export const DISPLAY_FEATURE_COUNT = 4;
