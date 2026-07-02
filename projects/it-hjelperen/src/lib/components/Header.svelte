<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let mobileMenuOpen = false;
	let darkMode = false;
	let scrolled = false;

	const toggleMobileMenu = () => {
		mobileMenuOpen = !mobileMenuOpen;
	};

	const toggleDarkMode = () => {
		darkMode = !darkMode;
		if (darkMode) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('darkMode', 'true');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('darkMode', 'false');
		}
	};

	let ticking = false;
	const handleScroll = () => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				scrolled = window.scrollY > 20;
				ticking = false;
			});
			ticking = true;
		}
	};

	onMount(() => {
		darkMode = document.documentElement.classList.contains('dark');

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	const heroImages: Record<string, string> = {
		'/': '/img/motherboard.webp',
		'/tjenester': '/img/printer.webp',
		'/priser': '/img/motherboard2.webp',
		'/om': '/img/pcbuild.webp',
		'/kontakt': '/img/laptop.webp',
		'/nettsidebygging': '/img/code.webp'
	};

	function preloadHeroImage(href: string) {
		const src = heroImages[href];
		if (src) new Image().src = src;
	}

	const navigation = [
		{ name: 'Hjem', href: '/' },
		{ name: 'Tjenester', href: '/tjenester' },
		{ name: 'Priser', href: '/priser' },
		{ name: 'Om oss', href: '/om' },
		{ name: 'Kontakt', href: '/kontakt' },
		{ name: 'Nettsidebygging', href: '/nettsidebygging' }
	];
</script>

<header class="sticky top-0 z-50 py-4">
	<nav class="container-custom">
		<div
			class="border max-w-[calc(100%-50px)] xl:max-w-5xl mx-auto
				{scrolled
					? 'bg-light-bg/90 dark:bg-dark-bg/90 backdrop-blur-md rounded-2xl shadow-xl border-gray-200 dark:border-gray-800'
					: mobileMenuOpen
						? 'bg-primary-900/80 backdrop-blur-md rounded-2xl border-white/10'
						: 'bg-transparent border-transparent'}"
			style="transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
		>
			<div class="flex justify-between items-center px-4 sm:px-6" style="height: 65px;">
				<!-- Logo -->
				<div class="flex-shrink-0">
					<a href="/" class="flex items-center gap-1">
						<img src="/img/itvaktmesteren-logo.png" alt="" class="h-7 w-auto" loading="eager" decoding="async" style="transition: filter 0.3s cubic-bezier(0.4, 0, 0.2, 1); {scrolled ? 'filter: invert(38%) sepia(100%) saturate(500%) hue-rotate(173deg) brightness(58%);' : ''}" />
						<span class="text-xl sm:text-2xl font-extrabold transition-colors duration-300
							{scrolled ? 'text-primary-600 dark:text-primary-400' : 'text-white'}">
							<span class="hidden sm:inline">IT Hjelperen</span>
							<span class="sm:hidden">IT-H</span>
						</span>
					</a>
				</div>

				<!-- Desktop Navigation -->
				<div class="hidden nav:flex items-center space-x-2">
					{#each navigation as item}
						<a
							href={item.href}
							onmouseenter={() => preloadHeroImage(item.href)}
							class="px-4 py-2 font-semibold transition-all duration-300 rounded-lg
								{scrolled
									? ($page.url.pathname === item.href
										? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
										: 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20')
									: ($page.url.pathname === item.href
										? 'text-white bg-white/20'
										: 'text-white/90 hover:text-white hover:bg-white/15')}"
						>
							{item.name}
						</a>
					{/each}

					<!-- Dark Mode Toggle -->
					<button
						onclick={toggleDarkMode}
						class="p-2 rounded-lg transition-colors duration-300 ml-2
							{scrolled ? 'hover:bg-primary-50 dark:hover:bg-primary-900/20' : 'hover:bg-white/15'}"
						aria-label="Toggle dark mode"
					>
						{#if darkMode}
							<svg class="w-5 h-5 {scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
							</svg>
						{:else}
							<svg class="w-5 h-5 {scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
							</svg>
						{/if}
					</button>
				</div>

				<!-- Mobile buttons -->
				<div class="nav:hidden flex items-center gap-2">
					<button
						onclick={toggleDarkMode}
						class="p-0.5 pt-1 rounded-lg transition-colors duration-300
							{scrolled ? 'hover:bg-primary-50 dark:hover:bg-primary-900/20' : 'hover:bg-white/15'}"
						aria-label="Toggle dark mode"
					>
						{#if darkMode}
							<svg class="w-5 h-5 {scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
							</svg>
						{:else}
							<svg class="w-5 h-5 {scrolled ? 'text-gray-700 dark:text-gray-300' : 'text-white'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
							</svg>
						{/if}
					</button>

					<button
						onclick={toggleMobileMenu}
						class="focus:outline-none focus:ring-2 focus:ring-primary-500 p-2 rounded-md transition-colors duration-300
							{scrolled
								? 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
								: 'text-white hover:text-white/80'}"
						aria-label="Toggle menu"
					>
						{#if !mobileMenuOpen}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						{:else}
							<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
							</svg>
						{/if}
					</button>
				</div>
			</div>

			<!-- Mobile Navigation -->
			{#if mobileMenuOpen}
				<div class="nav:hidden pb-4 px-4 sm:px-6">
					<div class="flex flex-col space-y-2">
						{#each navigation as item}
							<a
								href={item.href}
								onmouseenter={() => preloadHeroImage(item.href)}
								class="px-3 py-2 rounded-md font-medium transition-colors duration-300
									{scrolled
										? ($page.url.pathname === item.href
											? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-800'
											: 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800')
										: ($page.url.pathname === item.href
											? 'text-white bg-white/20'
											: 'text-white/90 hover:text-white hover:bg-white/15')}"
								onclick={() => mobileMenuOpen = false}
							>
								{item.name}
							</a>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</nav>
</header>
