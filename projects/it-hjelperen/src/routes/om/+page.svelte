<script lang="ts">
	import Cta from '$lib/components/Cta.svelte';
	import SectionHeader from '$lib/components/SectionHeader.svelte';
	import FeatureCard from '$lib/components/FeatureCard.svelte';
	import { FEATURES, SECTION_HEADERS } from '$lib/data/about';

	const { about, features } = SECTION_HEADERS;
</script>

<!-- About Content -->
<section class="section-padding pt-12 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
	<div class="container-custom">
		<div class="text-center max-w-3xl mx-auto mb-8">
			<span class="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900 dark:bg-opacity-30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold mb-4 transition-colors duration-300">
				{about.badge}
			</span>
			<h2 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
				{about.title}
			</h2>
			<p class="text-lg text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
				{about.description}
			</p>
		</div>
		<div class="max-w-3xl mx-auto">
			<div class="bg-light-surface dark:bg-dark-surface border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 transition-colors duration-300">
				<p class="text-gray-700 dark:text-gray-300 leading-relaxed transition-colors duration-300 text-justify">
					Enten du trenger akutt support, planlagt vedlikehold eller omfattende IT-infrastruktur,
					står vi klare til å hjelpe. Vår tilnærming er alltid kundefokusert, og vi tar oss tid til å
					forstå dine spesifikke behov før vi foreslår løsninger.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Company highlights with hardware photos -->
<section class="section-padding pt-12 bg-light-surface dark:bg-dark-surface transition-colors duration-300">
    <div class="container-custom">
        <div class="grid md:grid-cols-2 gap-8">
            <!-- How it started -->
            <div>
                <img src="/img/switch.jpg" alt="Nettverkssvitsj som brukes i IT-oppsett" class="rounded-lg shadow-lg scale-95 w-full h-64 object-cover" loading="lazy" decoding="async">
            </div>
            <div class="text-center md:text-justify">
                <h3 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300 mt-2">Slik startet det</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300 md:text-justify text-justify pr-4 pl-4 md:pr-12 md:pl-0">
					Jeg har holdt på med IT-tjenester siden rundt 2014, og IT Hjelperen ble til i 2025
					da jeg la merke til noe mange kjenner seg igjen i:
                    eldre slektninger og småbedrifter slet med ting som burde vært enkelt, trege PC-er,
                    nett som ikke ville koble til, printere som nektet å samarbeide. Det fantes ikke mange
                    rimelige og tilgjengelige alternativer, så jeg bestemte meg for å fylle det gapet selv.
                </p>
            </div>

            <!-- What we do today -->
            <div>
                <img src="/img/motherboard.jpg" alt="Hovedkort under PC-bygging" class="rounded-lg shadow-lg scale-95 w-full h-64 object-cover" loading="lazy" decoding="async">
            </div>
            <div class="text-center md:text-justify">
                <h3 class="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300 mt-2">Hva vi gjør i dag</h3>
                <p class="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300 md:text-justify text-justify pr-4 pl-4 md:pr-12 md:pl-0">
                    I dag hjelper IT Hjelperen privatpersoner og småbedrifter i Tromsø med alt fra
                    PC-reparasjon og nettverksoppsett til telefoner, TVer og skrivere, i praksis alt
                    som har en skjerm eller en strømkontakt. Jeg tror på ærlig hjelp, forklaringer
                    uten sjargong, og at teknologi skal fungere for deg, ikke omvendt.
                </p>
            </div>
        </div>
    </div>
</section>

<!-- Why Choose Us -->
<section class="section-padding pt-12 bg-light-bg dark:bg-dark-bg transition-colors duration-300">
	<div class="container-custom">
		<SectionHeader
			badge={features.badge}
			title={features.title}
			description={features.description}
		/>
		<div class="max-w-4xl mx-auto grid md:grid-cols-2 gap-4">
			{#each FEATURES as feature (feature.title)}
				<FeatureCard {...feature} />
			{/each}
		</div>
	</div>
</section>

<Cta />
