<script lang="ts">
	import '../app.css';
	import { dev } from '$app/environment';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import SEOtags from '$lib/components/SEOtags.svelte';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { injectAnalytics } from '@vercel/analytics/sveltekit';

	import { page } from '$app/stores';

	injectSpeedInsights();
	injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
	{#if $page.route.id !== null}
		<SEOtags />
	{/if}
</svelte:head>

<div class="flex flex-col min-h-screen">
	<Header />
	{#if $page.route.id !== null}
		<Hero />
	{/if}

	<main class="flex-grow">
		<slot />
	</main>

	<Footer />
</div>
