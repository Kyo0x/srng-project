<script lang="ts">
	import { CONTACT_PHONE, CONTACT_PHONE_DISPLAY, EMAIL_ADRESS } from '$lib/utils/constants';

	const currentYear = new Date().getFullYear();
</script>

<footer class="bg-gray-900 dark:bg-gray-950 text-gray-300 dark:text-gray-400 transition-colors duration-300">
	<div class="container-custom py-8">
		<div class="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto">
			<!-- Company Info -->
			<div>
				<a href="/" class="inline-flex items-center mb-3" aria-label="IT Hjelperen hjem">
					<img
						src="/img/itvaktmesteren-logo.png"
						alt="IT Hjelperen logo"
						class="h-14 w-auto"
						loading="lazy"
						decoding="async"
					/>
				</a>
				<p class="text-sm mb-4">
					PC-bygging, reparasjon og IT-hjelp for privatpersoner og små bedrifter i Tromsø. <br>Vi tar oss av alt det tekniske!
				</p>
			</div>

			<!-- Contact Info -->
			<div class="md:ml-auto">
				<h3 class="text-white dark:text-gray-100 text-lg font-bold mb-3 transition-colors duration-300">Kontakt oss</h3>
				<ul class="space-y-2 text-sm">
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
						</svg>
						<a href="tel:{CONTACT_PHONE}" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-300">{CONTACT_PHONE_DISPLAY}</a>
					</li>
					<li class="flex items-center">
						<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
						</svg>
						<a href="mailto:{EMAIL_ADRESS}" class="hover:text-white dark:hover:text-gray-200 transition-colors duration-300">{EMAIL_ADRESS}</a>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Bar -->
		<div class="border-t border-gray-800 dark:border-gray-900 mt-6 pt-4 text-sm text-center transition-colors duration-300">
			<p><a class="hover:text-white dark:hover-text-gray-200 transtition-colors duration-300" href="/">&copy; {currentYear} IT Hjelperen.</a> Alle rettigheter reservert.</p>
		</div>
	</div>
</footer>
