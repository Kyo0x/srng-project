<script lang="ts">
	export let title: string;
	export let features: string[];
	export let index: number;
	export let maxFeatures: number = 4;

</script>

<article
	class="group relative bg-light-surface dark:bg-dark-surface
		border border-slate-400 dark:border-slate-500
		rounded-2xl shadow-lg shadow-primary-900/5 dark:shadow-black/40
		p-8 grid grid-rows-[auto,1fr] gap-4 h-full
		transition-all duration-300 hover:-translate-y-1
		hover:border-primary-400 dark:hover:border-primary-500
		hover:shadow-primary-500/20
		md:col-span-2 xl:col-span-2"
>
	<div class="flex items-start gap-4">
		<div class="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-bold text-xl flex items-center justify-center transition-colors duration-300">
			{String(index + 1).padStart(2, '0')}
		</div>
		<div class="space-y-0.5">
			<p class="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">Tjeneste</p>
			<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300 leading-snug">
				{title}
			</h3>
		</div>
	</div>

	<ul class="space-y-3 self-start">
		{#each features.slice(0, maxFeatures) as feature (feature)}
			<li class="flex items-start gap-3">
				<svg class="w-5 h-5 mt-0 text-primary-600 dark:text-primary-400 flex-shrink-0 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
				<span class="text-gray-700 dark:text-gray-300 text-sm leading-snug transition-colors duration-300">
					{feature}
				</span>
			</li>
		{/each}
	</ul>
</article>
