<script lang="ts">
	let formData = {
		name: '',
		email: '',
		phone: '',
		message: ''
	};

	let isSubmitting = false;
	let submitStatus: 'idle' | 'success' | 'error' = 'idle';
	let errorMessage = '';

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		isSubmitting = true;
		submitStatus = 'idle';
		errorMessage = '';

		try {
			// Using Formspree for static form handling
			// Replace YOUR_FORM_ID with your actual Formspree form ID
			// Or use any other form service like Netlify Forms, Web3Forms, etc.
			const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(formData)
			});

			if (response.ok) {
				submitStatus = 'success';
				formData = { name: '', email: '', phone: '', message: '' };
			} else {
				submitStatus = 'error';
				errorMessage = 'Noe gikk galt. Vennligst prøv igjen senere.';
			}
		} catch (error) {
			submitStatus = 'error';
			errorMessage = 'Kunne ikke sende meldingen. Sjekk nettverkstilkoblingen din.';
		} finally {
			isSubmitting = false;
		}
	};
</script>

<form onsubmit={handleSubmit} class="space-y-6">
	<div>
		<label for="name" class="block text-sm font-medium text-gray-700 mb-2">Navn *</label>
		<input
			type="text"
			id="name"
			bind:value={formData.name}
			required
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			placeholder="Ditt navn"
		/>
	</div>

	<div>
		<label for="email" class="block text-sm font-medium text-gray-700 mb-2">E-post *</label>
		<input
			type="email"
			id="email"
			bind:value={formData.email}
			required
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			placeholder="din@epost.no"
		/>
	</div>

	<div>
		<label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
		<input
			type="tel"
			id="phone"
			bind:value={formData.phone}
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
			placeholder="+47 123 45 678"
		/>
	</div>

	<div>
		<label for="message" class="block text-sm font-medium text-gray-700 mb-2">Melding *</label>
		<textarea
			id="message"
			bind:value={formData.message}
			required
			rows="5"
			class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
			placeholder="Beskriv ditt problem eller spørsmål..."
		></textarea>
	</div>

	{#if submitStatus === 'success'}
		<div class="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
			Takk for din henvendelse! Vi tar kontakt så snart som mulig.
		</div>
	{/if}

	{#if submitStatus === 'error'}
		<div class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
			{errorMessage}
		</div>
	{/if}

	<button
		type="submit"
		disabled={isSubmitting}
		class="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
	>
		{isSubmitting ? 'Sender...' : 'Send melding'}
	</button>
</form>
