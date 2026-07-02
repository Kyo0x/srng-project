<script lang="ts">
	import AvailabilityWidget from '$lib/components/AvailabilityWidget.svelte';
	import ContactMethod from '$lib/components/ContactMethod.svelte';
	import BusinessHoursRow from '$lib/components/BusinessHoursRow.svelte';
	import FAQItem from '$lib/components/FAQItem.svelte';
	import {
		CONTACT_METHODS,
		BUSINESS_HOURS,
		FAQ_ITEMS,
		CONTACT_PAGE_CONTENT
	} from '$lib/data/contact';
</script>

<!-- Contact Section -->
<section class="section-padding bg-light-bg dark:bg-dark-bg transition-colors duration-300">
	<div class="container-custom">
		<div class="grid lg:grid-cols-2 gap-12">
			<!-- Contact Information -->
			<div>
				<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">
					{CONTACT_PAGE_CONTENT.title}
				</h2>
				<p class="text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
					{CONTACT_PAGE_CONTENT.description}
				</p>

				<!-- Contact Methods -->
				<div class="space-y-6">
					{#each CONTACT_METHODS as method (method.title)}
						<ContactMethod {...method} />
					{/each}
				</div>

				<!-- Response Time -->
				<div class="mt-8 bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 dark:border-primary-500 p-4 rounded transition-colors duration-300">
					<div class="flex">
						<div class="flex-shrink-0">
							<svg class="h-5 w-5 text-primary-600 dark:text-primary-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
							</svg>
						</div>
						<div class="ml-3">
							<p class="text-sm text-primary-800 dark:text-primary-200 transition-colors duration-300">
								{@html CONTACT_PAGE_CONTENT.responseNote}
							</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Availability Widget -->
			<div>
				<div class="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-8 border border-slate-300 dark:border-slate-500 transition-colors duration-300">
					<h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 transition-colors duration-300">
						{CONTACT_PAGE_CONTENT.availabilityTitle}
					</h2>
					<AvailabilityWidget />
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Business Hours -->
<section class="section-padding bg-light-surface dark:bg-dark-surface transition-colors duration-300">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto">
			<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 text-center transition-colors duration-300">
				{CONTACT_PAGE_CONTENT.businessHoursTitle}
			</h2>
			<div class="bg-light-surface dark:bg-dark-surface rounded-lg shadow-md p-8 border border-slate-300 dark:border-slate-500 transition-all duration-300 hover:border-primary-400 dark:hover:border-primary-500">
				<div class="space-y-4">
					{#each BUSINESS_HOURS as hour, index (hour.day)}
						<BusinessHoursRow
							day={hour.day}
							hours={hour.hours}
							isLast={index === BUSINESS_HOURS.length - 1}
						/>
					{/each}
				</div>
				<div class="mt-1 pt-6 border-t border-slate-300 dark:border-slate-500 transition-colors duration-300">
					<p class="text-sm text-gray-600 dark:text-gray-400 text-center transition-colors duration-300 italic">
						{CONTACT_PAGE_CONTENT.businessHoursNote}
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- FAQ Section -->
<section class="section-padding bg-light-bg dark:bg-dark-bg transition-colors duration-300">
	<div class="container-custom">
		<div class="max-w-3xl mx-auto">
			<h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 transition-colors duration-300 text-center">
				{CONTACT_PAGE_CONTENT.faqTitle}
			</h2>
			<div class="space-y-6">
				{#each FAQ_ITEMS as faq (faq.question)}
					<FAQItem
						question={faq.question}
						answer={faq.answer}
					/>
				{/each}
			</div>
		</div>
	</div>
</section>
