<script lang="ts">
	import Cta from '$lib/components/Cta.svelte';
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { PROJECTS } from '$lib/data/projects';

	const highlights = [
		{ title: 'Mobiltilpasset', description: 'Fungerer godt på telefon, nettbrett og PC.' },
		{ title: 'Tydelig innhold', description: 'Ryddig oppsett som er lett å bruke og forstå.' },
		{ title: 'SEO-grunnlag', description: 'Titler, beskrivelser, struktur og lokal synlighet.' },
		{ title: 'Over hele Norge', description: 'Alt foregår digitalt – uansett hvor du holder til.' }
	];

	const process = [
		{
			title: 'Kort avklaring',
			description: 'Vi finner ut hva du trenger, hvem siden er for og hvilket nivå som passer.'
		},
		{
			title: 'Oppsett og innhold',
			description: 'Vi setter opp struktur, innhold og design – tydelig, raskt og mobiltilpasset.'
		},
		{
			title: 'Levering og justering',
			description: 'Du ser løsningen før publisering og kan gjøre mindre justeringer innen revisjonsperioden.'
		}
	];
</script>

<section class="section-padding bg-light-bg dark:bg-dark-bg transition-colors duration-300 pt-12">
	<div class="container-custom">

		<div class="max-w-4xl mb-10">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
				Nettsidebygging
			</p>
			<h1 class="mt-2 text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
				Enkle og profesjonelle nettsider – over hele Norge
			</h1>
			<p class="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
				Vi lager nettsider for privatpersoner, bedrifter, lag og foreninger som vil ha noe tydelig og ryddig uten unødvendig kompleksitet.
			</p>
			<p class="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
				Alt foregår digitalt, så det spiller ingen rolle hvor i Norge du holder til. Se veiledende priser på <a href="/priser" class="text-primary-700 dark:text-primary-300 underline underline-offset-2">prissiden</a>.
			</p>
		</div>

		<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Dette får du</h3>
		<div class="bg-light-surface dark:bg-dark-surface border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden mb-10">
			{#each highlights as item (item.title)}
				<article class="p-5 md:p-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
					<h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{item.title}</h4>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.description}</p>
				</article>
			{/each}
		</div>

		<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Slik foregår det</h3>
		<div class="bg-light-surface dark:bg-dark-surface border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden mb-10">
			{#each process as step, i (step.title)}
				<article class="p-5 md:p-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
					<h4 class="text-base font-bold text-gray-900 dark:text-gray-100">{i + 1}. {step.title}</h4>
					<p class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
				</article>
			{/each}
		</div>

		<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
			<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300">Eksempler på nettsider vi har laget</h3>

		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
			{#each PROJECTS.slice(0, 2) as project (project.title)}
				<ProjectCard {...project} />
			{/each}
		</div>

	</div>
</section>

<Cta />
