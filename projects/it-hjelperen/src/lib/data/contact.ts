import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, EMAIL_ADRESS, WORKING_HOURS_SETTINGS } from '$lib/utils/constants';

export interface ContactMethod {
	icon: string;
	title: string;
	value: string;
	href: string;
	subtitle: string;
}

export interface BusinessHour {
	day: string;
	hours: string;
}

export interface FAQItem {
	question: string;
	answer: string;
}

export const CONTACT_METHODS: ContactMethod[] = [
	{
		icon: '<svg class="w-6 h-6 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>',
		title: 'Telefon',
		value: CONTACT_PHONE_DISPLAY,
		href: `tel:${CONTACT_PHONE}`,
		subtitle: `Hverdager ${WORKING_HOURS_SETTINGS.open.display} - ${WORKING_HOURS_SETTINGS.close.display}. Ta gjerne kontakt utenfor åpningstid.`
	},
	{
		icon: '<svg class="w-6 h-6 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
		title: 'E-post',
		value: EMAIL_ADRESS,
		href: `mailto:${EMAIL_ADRESS}`,
		subtitle: 'Vi svarer innen 24 timer, men ofte raskere'
	}
];

export const BUSINESS_HOURS: BusinessHour[] = [
	{ day: 'Mandag - Fredag:', hours: `${WORKING_HOURS_SETTINGS.open.display} - ${WORKING_HOURS_SETTINGS.close.display}` },
	{ day: 'Lørdag:', hours: 'Etter avtale' },
	{ day: 'Søndag:', hours: 'Etter avtale' }
];

export const FAQ_ITEMS: FAQItem[] = [
	{
		question: 'Hvor raskt kan dere komme?',
		answer: 'For akutte problemer i Tromsø kommer vi som regel samme dag eller neste virkedag. Planlagte oppdrag avtales etter din tidsplan.'
	},
	{
		question: 'Hva koster det?',
		answer: 'Se <a href="/priser" class="text-primary-600 dark:text-primary-400 hover:underline">prissiden</a> vår for en full oversikt. Endelig pris avtales etter en kort gjennomgang av behov og omfang.'
	},
	{
		question: 'Tilbyr dere fjernhjelp?',
		answer: 'Ja! Mange problemer kan løses eksternt via sikre forbindelser, noe som ofte er raskere og billigere enn oppmøte.'
	},
	{
		question: 'Jobber dere med både bedrifter og privatpersoner?',
		answer: 'Ja, vi hjelper både bedrifter, organisasjoner og privatpersoner med alle typer IT-utfordringer.'
	}
];

export const CONTACT_PAGE_CONTENT = {
	title: 'Hvordan kan vi hjelpe?',
	description: 'Har du spørsmål om våre tjenester, trenger teknisk support eller ønsker en uforpliktende samtale? Vi hjelper kunder i Tromsø med rask og tydelig IT-support. Velg den kontaktmetoden som passer deg best.',
	responseNote: '<strong>Rask respons:</strong> Vi svarer normalt på henvendelser samme dag. For akutte problemer i Tromsø, ring oss direkte.',
	availabilityTitle: 'Vår tilgjengelighet',
	businessHoursTitle: 'Åpningstider',
	businessHoursNote: 'Vi tar også imot henvendelser utenfor åpningstid. Ring gjerne, så hjelper vi deg så raskt vi kan.',
	faqTitle: 'Ofte stilte spørsmål'
} as const;
