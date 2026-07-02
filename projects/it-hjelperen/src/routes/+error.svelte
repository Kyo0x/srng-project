<script lang="ts">
	import { page } from '$app/state';

	$: errorMessage = getErrorMessage(page.status);

	function getErrorMessage(status: number): string {
		switch (status) {
			case 404:
				return "Siden ble ikke funnet!";
			case 500:
				return "Intern serverfeil oppstod!";
			case 403:
				return "Tilgang forbudt!";
			case 401:
				return "Autentisering kreves!";
			case 503:
				return "Tjenesten er midlertidig utilgjengelig!";
			default:
				return "Uhhh... noe fungerer ikke som det skal!";
		}
	}
</script>

<svelte:head>
	<title>Error page - IT Hjelperen</title>
	<meta name="description" content="IT Hjelperen er din pålitelige IT-partner med omfattende erfaring innen IT-support, sikkerhet og tekniske løsninger." />
</svelte:head>

<div class="flex justify-center items-center min-h-screen">
    <div class="text-center mb-48">
        <p class="text-6xl font-semibold">Oops, noe gikk galt!</p>
        <p class="pt-7 text-3xl font-semibold mb-5">{errorMessage}</p>
        <a
            href="/"
            class="pt-2 px-5 py-2 mt-5 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 transition shadow-sm text-center"
        >
            Gå tilbake!
        </a>
    </div>
</div>