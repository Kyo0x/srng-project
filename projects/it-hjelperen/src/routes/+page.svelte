<script lang="ts">
	import Cta from '$lib/components/Cta.svelte';
	import ServiceModal from '$lib/components/ServiceModal.svelte';
	import { SERVICES } from '$lib/data/services';
	import type { Service } from '$lib/data/services';

	let selectedService = $state<Service | null>(null);
	let triggerEl = $state<HTMLElement | null>(null);

	function openModal(service: Service, el: HTMLElement) {
		selectedService = service;
		triggerEl = el;
	}

	function closeModal() {
		selectedService = null;
		setTimeout(() => triggerEl?.focus(), 300);
	}
</script>

{#if selectedService}
	<ServiceModal service={selectedService} onclose={closeModal} />
{/if}

<!-- Services Overview -->
<section class="bg-light-bg dark:bg-dark-bg pt-12 md:pt-12 md:pb-24 transition-colors duration-300">
	<div class="container-custom">
		<div class="max-w-4xl mb-10 md:mb-12">
			<h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight transition-colors duration-300">
				Våre tjenester
			</h2>
			<p class="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
				Vi tar det meste, stort og smått.
			</p>
		</div>

		<div class="rounded-2xl border border-slate-300 dark:border-slate-600 bg-light-surface dark:bg-dark-surface overflow-hidden">
			<div class="grid grid-cols-1 md:grid-cols-2">
				{#each SERVICES.slice(0, 6) as service, i}
					<div
						class="group px-5 py-5 md:px-7 md:py-6
							border-b border-slate-200 dark:border-slate-700
							md:[&:nth-child(odd)]:border-r
							md:last:border-b-0 md:[&:nth-last-child(2):nth-child(odd)]:border-b-0
							transition-colors duration-300 hover:bg-primary-50/60 dark:hover:bg-primary-900/10
							cursor-pointer"
						role="button"
						tabindex="0"
						aria-label="Vis detaljer for {service.title}"
						onclick={(e) => openModal(service, e.currentTarget as HTMLElement)}
						onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(service, e.currentTarget as HTMLElement); } }}
					>
						<h3 class="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 leading-snug">
							{service.title}
						</h3>
						<p class="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
							{service.description ?? ''}
						</p>
					</div>
				{/each}
			</div>
		</div>

		<div class="text-center mt-10 md:mt-12">
			<a href="/tjenester" class="btn-primary">
				Se alle tjenester
			</a>
		</div>
	</div>
</section>

<!-- Proof Section -->
<section class="py-16 md:py-24 bg-light-surface dark:bg-dark-surface transition-colors duration-300">
	<div class="container-custom">
		<div class="max-w-4xl mb-12 md:mb-14">
			<h2 class="text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight transition-colors duration-300">
				Arbeid og oppdrag
			</h2>
			<p class="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl">
				Se hva vi leverer og hva vi ofte løser.
			</p>
		</div>

		<div class="mb-8 md:mb-10 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-600 shadow-lg shadow-primary-900/5 dark:shadow-black/30">
			<div class="relative">
				<img
					src="/img/hero.jpg"
					alt="IT-utstyr klart for feilsøking og oppsett"
					class="w-full h-56 md:h-72 object-cover"
					loading="lazy"
					decoding="async"
				/>
				<div class="absolute inset-0 bg-gradient-to-r from-primary-900/65 via-primary-900/35 to-transparent"></div>
				<div class="absolute left-4 right-4 bottom-4 md:left-6 md:right-auto md:max-w-xl">
					<p class="text-white font-semibold text-base md:text-lg leading-snug">
						Praktisk IT-hjelp i Tromsø - fra feilsøking og nettverk til ferdige nettsider.
					</p>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
			<div class="bg-light-bg dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-2xl p-8 shadow-sm">
				<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Siste nettprosjekter</h3>
				<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
					Du kan se to ulike typer leveranser her:
				</p>
				<ul class="mt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<li>
						- Enkel nettside:
						<a href="https://example.com" class="text-primary-700 dark:text-primary-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">eksempel her</a>
					</li>
					<li>
						- Skreddersydd løsning:
						<a href="https://example.com" class="text-primary-700 dark:text-primary-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">eksempel her</a>
					</li>
				</ul>
			</div>

			<div class="bg-light-bg dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-2xl p-8 shadow-sm">
				<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Typiske oppdrag</h3>
				<ul class="space-y-2 text-sm text-gray-700 dark:text-gray-300">
					<li>- Treg PC som trenger opprydding og optimalisering</li>
					<li>- WiFi som faller ut i deler av huset</li>
					<li>- Ny PC-oppsett med overføring av filer og e-post</li>
					<li>- Nettverksutstyr som må settes riktig opp</li>
				</ul>
				<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
					Hvis det haster, finner vi ofte en løsning samme dag.
				</p>
			</div>

			<div class="bg-light-bg dark:bg-dark-bg border border-slate-300 dark:border-slate-600 rounded-2xl p-8 shadow-sm">
				<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Direkte og personlig hjelp</h3>
				<p class="text-gray-600 dark:text-gray-400 leading-relaxed">
					Ingen supportkø eller videresending. Du snakker rett med oss hele veien –
					vi forklarer på vanlig norsk og rydder opp til problemet er løst.
				</p>
				<a href="/kontakt" class="inline-block mt-4 text-sm font-semibold text-primary-700 dark:text-primary-300 underline underline-offset-2">
					Send melding direkte
				</a>
			</div>
		</div>
	</div>
</section>

<Cta />
