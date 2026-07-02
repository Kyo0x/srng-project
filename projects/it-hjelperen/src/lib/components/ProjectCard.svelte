<script lang="ts">
	export let title: string;
	export let description: string;
	export let url: string;
	export let category: string;
</script>

<article
	class="group relative bg-light-surface dark:bg-dark-surface
		border border-slate-400 dark:border-slate-500
		rounded-2xl shadow-lg shadow-primary-900/5 dark:shadow-black/40
		p-8 grid grid-rows-[auto,1fr,auto] gap-4 h-full
		transition-all duration-300 hover:-translate-y-1
		hover:border-primary-400 dark:hover:border-primary-500
		hover:shadow-primary-500/20"
>
	<div class="space-y-2">
		<p class="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 dark:text-gray-400">
			{category}
		</p>
		<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 transition-colors duration-300 leading-snug">
			{title}
		</h3>
	</div>

	<p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
		{description}
	</p>

	<a
		href={url}
		target="_blank"
		rel="noopener noreferrer"
		class="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold
			hover:text-primary-700 dark:hover:text-primary-300
			transition-colors duration-300
			group/link"
	>
		Besøk prosjektet
		<svg
			class="w-5 h-5 transition-transform duration-300 group-hover/link:translate-x-1"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 7l5 5m0 0l-5 5m5-5H6"
			/>
		</svg>
	</a>
</article>
