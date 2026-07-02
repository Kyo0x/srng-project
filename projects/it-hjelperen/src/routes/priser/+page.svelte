<script lang="ts">
	import Cta from '$lib/components/Cta.svelte';
	import type { PriceItem } from '$lib/data/pricing';
	import {
		BUSINESS_SUPPORT_AGREEMENTS,
		IT_SUPPORT_PACKAGES,
		MISC_PRICES,
		PRICE_PAGE_INTRO,
		WEBSITE_DELIVERY_NOTES,
		WEBSITE_REVISION_WINDOWS,
		WEBSITE_PACKAGES
	} from '$lib/data/pricing';

	const isLinkedItem = (item: PriceItem): item is Exclude<PriceItem, string> => typeof item !== 'string';
	const getRevisionWindow = (title: string) => WEBSITE_REVISION_WINDOWS.find(r => r.packageTitle === title);
</script>

<section class="section-padding bg-light-bg dark:bg-dark-bg transition-colors duration-300 pt-12">
	<div class="container-custom">
		<div class="max-w-4xl mb-10">
			<p class="text-xs font-semibold uppercase tracking-[0.2em] text-primary-700 dark:text-primary-300">
				{PRICE_PAGE_INTRO.badge}
			</p>
			<h1 class="mt-2 text-3xl md:text-5xl font-black text-gray-900 dark:text-gray-100 leading-tight">
				{PRICE_PAGE_INTRO.title}
			</h1>
			<p class="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
				{PRICE_PAGE_INTRO.description}
			</p>
			<p class="mt-3 text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
				Prisene er veiledende for oppdrag i Tromsø-området. Endelig pris settes etter en kort avklaring av behov og reell tidsbruk.
			</p>
		</div>

		<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">IT-hjelp</h3>
		<div class="bg-light-surface dark:bg-dark-surface border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden mb-10">
			{#each IT_SUPPORT_PACKAGES as pack (pack.title)}
				<article class="p-5 md:p-6 border-b border-slate-200 dark:border-slate-700">
					<h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">{pack.title}</h4>
					<p class="mt-2 text-primary-700 dark:text-primary-300 font-semibold">{pack.priceFrom}</p>
					<p class="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pack.description}</p>
					<ul class="mt-3 space-y-1.5">
						{#each pack.items as item (item)}
							<li class="text-sm text-gray-600 dark:text-gray-400">
								-
								{#if isLinkedItem(item)}
									{item.text}<a href={item.href} class="text-primary-700 dark:text-primary-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">{item.linkText}</a>
								{:else}
									{item}
								{/if}
							</li>
						{/each}
					</ul>
				</article>
			{/each}
			<div class="px-5 md:px-6 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
				<p class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">Bedriftsavtaler</p>
			</div>
			{#each BUSINESS_SUPPORT_AGREEMENTS as pack (pack.title)}
				<article class="p-5 md:p-6 border-b border-slate-200 dark:border-slate-700 last:border-b-0">
					<h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">{pack.title}</h4>
					<p class="mt-2 text-primary-700 dark:text-primary-300 font-semibold">{pack.priceFrom}</p>
					<p class="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pack.description}</p>
					<ul class="mt-3 space-y-1.5">
						{#each pack.items as item (item)}
							<li class="text-sm text-gray-600 dark:text-gray-400">
								-
								{#if isLinkedItem(item)}
									{item.text}<a href={item.href} class="text-primary-700 dark:text-primary-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">{item.linkText}</a>
								{:else}
									{item}
								{/if}
							</li>
						{/each}
					</ul>
				</article>
			{/each}
		</div>

		<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Nettsider</h3>
		<div class="bg-light-surface dark:bg-dark-surface border border-slate-300 dark:border-slate-600 rounded-xl overflow-hidden mb-4">
			{#each WEBSITE_PACKAGES as pack, index (pack.title)}
				{@const rev = getRevisionWindow(pack.title)}
				<details class="border-b border-slate-200 dark:border-slate-700 last:border-b-0" open={index === 0}>
					<summary class="list-none cursor-pointer px-5 md:px-6 py-4">
						<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
							<h4 class="text-lg font-bold text-gray-900 dark:text-gray-100">{pack.title}</h4>
							<p class="text-primary-700 dark:text-primary-300 font-semibold">{pack.priceFrom}</p>
						</div>
					</summary>
					<div class="px-5 md:px-6 pb-5">
						<p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{pack.description}</p>
						<ul class="mt-3 space-y-1.5">
							{#each pack.items as item (item)}
								<li class="text-sm text-gray-600 dark:text-gray-400">
									-
									{#if isLinkedItem(item)}
										{item.text}<a href={item.href} class="text-primary-700 dark:text-primary-300 underline underline-offset-2" target="_blank" rel="noopener noreferrer">{item.linkText}</a>
									{:else}
										{item}
									{/if}
								</li>
							{/each}
						</ul>
						{#if rev}
							<p class="mt-4 text-xs text-gray-400 dark:text-gray-500 border-t border-slate-200 dark:border-slate-700 pt-3">
								Revisjonsvindu: {rev.window} — {rev.description}
							</p>
						{/if}
					</div>
				</details>
			{/each}
		</div>

		<details class="mb-10 group">
			<summary class="list-none cursor-pointer text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
				Om levering, revisjoner og feilretting
			</summary>
			<div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
				{#each WEBSITE_DELIVERY_NOTES as note (note.title)}
					<div class="border-t border-slate-200 dark:border-slate-700 pt-3">
						<h5 class="text-sm font-semibold text-gray-900 dark:text-gray-100">{note.title}</h5>
						<p class="mt-2 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{note.description}</p>
					</div>
				{/each}
			</div>
		</details>

		<h3 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Diverse tjenester privat</h3>
		<div class="overflow-hidden rounded-xl border border-slate-300 dark:border-slate-600 mb-12">
			<table class="w-full text-left bg-light-surface dark:bg-dark-surface">
				<thead>
					<tr class="border-b border-slate-300 dark:border-slate-600">
						<th class="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Tjeneste</th>
						<th class="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Pris</th>
						<th class="p-4 text-sm font-semibold text-gray-900 dark:text-gray-100">Notat</th>
					</tr>
				</thead>
				<tbody>
					{#each MISC_PRICES as item (item.service)}
						<tr class="border-b border-slate-200 dark:border-slate-700 last:border-0 align-top">
							<td class="p-4 text-sm text-gray-800 dark:text-gray-200">{item.service}</td>
							<td class="p-4 text-sm font-semibold text-primary-700 dark:text-primary-300">{item.price}</td>
							<td class="p-4 text-sm text-gray-600 dark:text-gray-400">{item.notes}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

	</div>
</section>

<Cta />
