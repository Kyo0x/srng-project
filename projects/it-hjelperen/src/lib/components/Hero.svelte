<script lang="ts">
    import { page } from '$app/stores';
    
    $: heroContent = getHeroContent($page.route.id || '/');
    
    function getHeroContent(routeId: string) {
        const content: Record<string, { title: string; subtitle: string; image: string }> = {
            '/': {
                title: 'Du snakker rett med oss',
                subtitle: 'Lokal IT-hjelp i Tromsø, vi hjelper deg med alt fra PC og nettverk til ferdig nettside',
                image: '/img/motherboard.jpg'
            },
            '/tjenester': {
                title: 'Våre tjenester',
                subtitle: 'Fra PC-service til hjemmenettverk og WiFi-løsninger - vi fikser det meste i Tromsø',
                image: '/img/printer.jpg'
            },
            '/priser': {
                title: 'Priser',
                subtitle: 'Veiledende priser på IT-hjelp, nettsider og diverse tjenester i Tromsø',
                image: '/img/motherboard2.jpg'
            },
            '/om': {
                title: 'Om IT Hjelperen',
                subtitle: 'Personlig IT-hjelp med erfaring siden rundt 2014',
                image: '/img/pcbuild.jpg'
            },
            '/kontakt': {
                title: 'Kontakt oss',
                subtitle: 'Vi er her for å hjelpe deg i Tromsø. Ta kontakt i dag!',
                image: '/img/laptop.jpg'
            },
            '/nettsidebygging': {
                title: 'Nettsider laget for dine behov',
                subtitle: 'Vi lager nettsider over hele Norge – enkelt, ryddig og uten unødvendig kompleksitet',
                image: '/img/code.jpg'
            }
        };
        
        return content[routeId] || { ...content['/'] };
    }
</script>

<section class="relative text-white overflow-hidden -mt-[97px] pt-[97px]">
	<picture class="absolute inset-0">
		<source srcset={heroContent.image.replace('.jpg', '.webp')} type="image/webp" />
		<img
			src={heroContent.image}
			alt=""
			class="w-full h-full object-cover"
			loading="eager"
			fetchpriority="high"
			decoding="async"
		/>
	</picture>
	<div class="absolute inset-0 bg-gradient-to-br from-primary-900/85 via-primary-800/75 to-primary-700/60"></div>
	<div class="relative container-custom py-12 md:py-20">
		<div class="max-w-4xl mx-auto text-center">
			<h1 class="text-4xl md:text-6xl font-bold mb-4">
				{heroContent.title}
			</h1>
			<p class="text-xl text-primary-100 mb-8">
				{heroContent.subtitle}
			</p>
			{#if $page.route.id === '/'}
				<div class="flex flex-col sm:flex-row gap-4 justify-center">
					<a href="/kontakt" class="inline-block px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
						Ta kontakt
					</a>
					<a href="/tjenester" class="inline-block px-8 py-4 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 hover:scale-105 transition-all duration-300 backdrop-blur-sm">
						Se tjenester
					</a>
				</div>
			{/if}
		</div>
	</div>
</section>