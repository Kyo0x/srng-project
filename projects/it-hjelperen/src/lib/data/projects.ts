export interface Project {
	title: string;
	description: string;
	url: string;
	category: string;
}

export const PROJECTS: Project[] = [
	{
		title: 'Fuglehundklubben',
		description: 'Nettsted for en lokal fuglehundklubb med informasjon om klubben, medlemskap, arrangementer og hundetrening.',
		url: 'https://example.com',
		category: 'Organisasjoner & klubber'
	},
	{
		title: 'Nordreise',
		description: 'Responsiv reiseportal for opplevelser og aktiviteter i Nord-Norge med booking-system, guidebeskrivelser og multi-language support.',
		url: 'https://example.com',
		category: 'Turisme & opplevelser'
	}
];

export const PROJECTS_PAGE_HEADER = {
	badge: 'Nettprosjekter',
	title: 'Noen av våre arbeid',
	description: 'Se eksempler på nettsider vi har laget for ulike bransjer - fra klubber til turisme og opplevelser.'
};
