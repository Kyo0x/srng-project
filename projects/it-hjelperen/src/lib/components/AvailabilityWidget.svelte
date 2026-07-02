<script lang="ts">
	import { onMount } from 'svelte';
	import { CONTACT_PHONE, EMAIL_ADRESS, WORKING_HOURS_SETTINGS } from '$lib/utils/constants';

	let currentStatus: 'available' | 'offline' = 'offline';
	let nextAvailable = '';

	// Function to determine availability based on business hours
	function checkAvailability() {
		const now = new Date();
		const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
		const hour = now.getHours();
		const minute = now.getMinutes();
		const currentTime = hour * 60 + minute; // Convert to minutes since midnight

		// Business hours: Monday-Friday | hours set in constants
		const isWeekday = day >= 1 && day <= 5;
		const startTime = WORKING_HOURS_SETTINGS.open.minutes; // set in constants
		const endTime = WORKING_HOURS_SETTINGS.close.minutes; // set in constants

		if (isWeekday && currentTime >= startTime && currentTime < endTime) {
			currentStatus = 'available';
			nextAvailable = 'Tilgjengelig nå';
		} else if (isWeekday && currentTime >= endTime) {
			currentStatus = 'offline';
			nextAvailable = `I morgen kl. ${WORKING_HOURS_SETTINGS.open.display}`;
		} else if (day === 5 && currentTime >= endTime) {
			// Friday after hours
			currentStatus = 'offline';
			nextAvailable = `Mandag kl. ${WORKING_HOURS_SETTINGS.open.display}`;
		} else if (day === 6) {
			// Saturday
			currentStatus = 'offline';
			nextAvailable = `Mandag kl. ${WORKING_HOURS_SETTINGS.open.display}`;
		} else if (day === 0) {
			// Sunday
			currentStatus = 'offline';
			nextAvailable = `Mandag kl. ${WORKING_HOURS_SETTINGS.open.display}`;
		} else {
			// Weekday before business hours
			currentStatus = 'offline';
			nextAvailable = `I dag kl. ${WORKING_HOURS_SETTINGS.open.display}`;
		}
	}

	onMount(() => {
		checkAvailability();
		// Update status every minute
		const interval = setInterval(checkAvailability, 60000);
		return () => clearInterval(interval);
	});

	$: statusConfig = {
		available: {
			color: 'bg-green-500',
			text: 'Tilgjengelig nå',
			icon: '✓',
			bgClass: 'bg-green-50 dark:bg-green-900/20',
			borderClass: 'border-green-200 dark:border-green-800',
			textClass: 'text-green-800 dark:text-green-200'
		},
		offline: {
			color: 'bg-gray-500',
			text: 'Utenfor åpningstid',
			icon: '○',
			bgClass: 'bg-gray-50 dark:bg-gray-800/50',
			borderClass: 'border-slate-300 dark:border-slate-500',
			textClass: 'text-gray-800 dark:text-gray-200'
		}
	}[currentStatus];
</script>

<div class="space-y-6">
	<!-- Status Indicator -->
	<div class="flex items-center justify-between p-5 {statusConfig.bgClass} border {statusConfig.borderClass} rounded-lg transition-colors duration-300">
		<div class="flex items-center space-x-3">
			<div class="relative">
				<div class="{statusConfig.color} w-4 h-4 rounded-full"></div>
				{#if currentStatus === 'available'}
					<div class="{statusConfig.color} w-4 h-4 rounded-full absolute top-0 left-0 animate-ping opacity-75"></div>
				{/if}
			</div>
			<div>
				<div class="font-semibold {statusConfig.textClass} transition-colors duration-300">
					{statusConfig.text}
				</div>
				<div class="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
					{nextAvailable}
				</div>
			</div>
		</div>
	</div>

	<!-- Contact Actions -->
	<div class="space-y-3">
		<a
			href="tel:{CONTACT_PHONE}"
			class="block w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
		>
			<div class="flex items-center justify-center space-x-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
				</svg>
				<span>Ring oss nå</span>
			</div>
		</a>

		<a
			href="mailto:{EMAIL_ADRESS}"
			class="block w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold py-3 px-6 rounded-lg transition-colors duration-300 text-center"
		>
			<div class="flex items-center justify-center space-x-2">
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
				</svg>
				<span>Send e-post</span>
			</div>
		</a>
	</div>

	<!-- Service Promise -->
	<div class="bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-600 dark:border-primary-500 p-4 rounded transition-colors duration-300">
		<div class="space-y-2">
			<div class="flex items-start space-x-2">
				<svg class="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
				</svg>
				<p class="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
					Samme dag service ved akutte problemer
				</p>
			</div>
			<div class="flex items-start space-x-2">
				<svg class="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
				</svg>
				<p class="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
					Ingen skjulte kostnader
				</p>
			</div>
		</div>
	</div>
</div>
