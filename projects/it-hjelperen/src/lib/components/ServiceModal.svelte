<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import type { Service } from '$lib/data/services';

	let { service, onclose }: { service: Service; onclose: () => void } = $props();

	$effect(() => {
		document.body.style.overflow = 'hidden';
		return () => {
			document.body.style.overflow = '';
		};
	});

	$effect(() => {
		const panel = document.getElementById('service-modal-panel');
		if (!panel) return;

		const focusableSelectors = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
		const focusable = Array.from(panel.querySelectorAll<HTMLElement>(focusableSelectors));
		const first = focusable[0];
		const last = focusable[focusable.length - 1];

		first?.focus();

		function trapTab(e: KeyboardEvent) {
			if (e.key !== 'Tab') return;
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last?.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
		}

		panel.addEventListener('keydown', trapTab);
		return () => panel.removeEventListener('keydown', trapTab);
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onclose();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') onclose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	class="fixed inset-0 z-60 bg-black/50 backdrop-blur-sm
		flex items-end sm:items-center justify-center"
	role="presentation"
	transition:fade={{ duration: 200 }}
	onclick={handleBackdropClick}
>
	<div
		id="service-modal-panel"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		class="relative w-full sm:max-w-lg
			bg-light-surface dark:bg-dark-surface
			rounded-t-2xl sm:rounded-2xl
			border border-slate-200 dark:border-slate-700
			shadow-2xl
			max-h-[85vh] overflow-y-auto
			p-6 sm:p-8
			focus:outline-none"
		transition:fly={{ y: 24, duration: 280, easing: cubicOut }}
	>
		<button
			onclick={onclose}
			class="absolute top-4 right-4 p-2 rounded-lg
				text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100
				hover:bg-slate-100 dark:hover:bg-slate-700
				transition-colors duration-200"
			aria-label="Lukk"
		>
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>

		<h2
			id="modal-title"
			class="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 pr-10 leading-snug"
		>
			{service.title}
		</h2>

		{#if service.description}
			<p class="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
				{service.description}
			</p>
		{/if}

		<ul class="mt-5 space-y-3">
			{#each service.features as feature (feature)}
				<li class="flex items-start gap-2.5">
					<svg
						class="w-4 h-4 mt-0.5 text-primary-600 dark:text-primary-400 flex-shrink-0"
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

		<div class="mt-6 pt-5 border-t border-slate-200 dark:border-slate-700">
			<a
				href="/kontakt"
				onclick={onclose}
				class="btn-primary w-full text-center block"
			>
				Ta kontakt
			</a>
			<a
				href="/tjenester"
				onclick={onclose}
				class="mt-3 block text-center text-sm text-primary-700 dark:text-primary-300
					font-semibold underline underline-offset-2"
			>
				Se alle tjenester
			</a>
		</div>
	</div>
</div>
