<script lang="ts">
	import Cta from '$lib/components/Cta.svelte';
	import { SERVICES, SERVICES_PAGE_HEADER } from '$lib/data/services';
</script>

<section class="section-padding bg-light-bg dark:bg-dark-bg transition-colors duration-300 pt-12">
	<div class="container-custom">
		<div class="max-w-4xl mb-10 md:mb-12">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
				{SERVICES_PAGE_HEADER.badge}
			</p>
			<h1 class="mt-2 text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
				{SERVICES_PAGE_HEADER.title}
			</h1>
			<p class="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
				{SERVICES_PAGE_HEADER.description}
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
			{#each SERVICES as service}
				<article
					class="group bg-light-surface dark:bg-dark-surface
						border border-slate-300 dark:border-slate-600
						rounded-2xl shadow-lg shadow-primary-900/5 dark:shadow-black/30
						p-6
						transition-all duration-300
						hover:-translate-y-1 hover:border-primary-400 dark:hover:border-primary-500
						hover:shadow-primary-500/20"
				>
					<h3
						class="text-lg font-bold text-gray-900 dark:text-gray-100
							leading-snug mb-4 transition-colors duration-300"
					>
						{service.title}
					</h3>

					<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
						{service.description ?? ''}
					</p>

					<ul class="space-y-2">
						{#each service.features as feature (feature)}
							<li class="flex items-start gap-2.5">
								<svg
									class="w-4 h-4 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0 transition-colors duration-300"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
								</svg>
								<span class="text-sm text-gray-700 dark:text-gray-300 leading-snug">
									{feature}
								</span>
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<div class="mt-10 md:mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
			<p class="text-sm font-semibold text-gray-900 dark:text-gray-100">Usikker på hva som passer?</p>
			<p class="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
				Send en kort melding om problemet, så peker vi deg i riktig retning uten noe styr.
			</p>
			<a
				href="/kontakt"
				class="inline-block mt-3 text-sm font-semibold text-primary-700 dark:text-primary-300 underline underline-offset-2"
			>
				Kontakt oss
			</a>
		</div>
	</div>
</section>

<Cta />
