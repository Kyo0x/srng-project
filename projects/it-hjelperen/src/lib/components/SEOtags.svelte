<script lang="ts">
    import { page } from '$app/stores';
    import { SITE_URL, CONTACT_PHONE, EMAIL_ADRESS } from '$lib/utils/constants';

    $: SEOContent = getSEOContent($page.route.id || '/');
    $: isHome = ($page.route.id || '/') === '/';
    $: routeId = $page.route.id || '/';
    $: pageUrl = SITE_URL + (routeId === '/' ? '' : routeId);
    $: ogImageUrl = `${SITE_URL}/img/motherboard.jpg`;

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "IT Hjelperen",
        "description": "PC-bygging, reparasjon, IT-support og teknisk hjelp i Tromsø",
        "telephone": CONTACT_PHONE,
        "email": EMAIL_ADRESS,
        "url": SITE_URL,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Tromsø",
            "addressCountry": "NO"
        },
        "openingHours": "Mo-Fr 09:00-18:00",
        "serviceArea": { "@type": "City", "name": "Tromsø" }
    };

    function getSEOContent(routeId: string) {
        const content: Record<string, { title: string; og_seo_title: string; og_description: string; meta_description: string; }> = {
            '/': {
                title:'IT-hjelp i Tromsø | PC-bygging, reparasjon og support',
                og_seo_title: 'IT-hjelp i Tromsø | IT Hjelperen',
                og_description: 'PC-bygging, reparasjon, oppgradering og IT-hjelp i Tromsø for privatpersoner og små bedrifter.',
                meta_description:'IT Hjelperen tilbyr PC-bygging, reparasjon, oppgradering og IT-hjelp i Tromsø for privatpersoner og små bedrifter.'
            },
            '/tjenester': {
                title:'Tjenester | PC-reparasjon og IT-hjelp i Tromsø',
                og_seo_title: 'Tjenester | IT Hjelperen Tromsø',
                og_description: 'PC-bygging, PC-reparasjon, oppgradering, datasikkerhet, hjemmenettverk og fjernhjelp i Tromsø.',
                meta_description:'Se tjenester fra IT Hjelperen i Tromsø: PC-bygging, PC-reparasjon, oppgradering, datasikkerhet, hjemmenettverk og fjernhjelp.'
            },
            '/priser': {
                title:'Priser | IT-hjelp og nettsider i Tromsø',
                og_seo_title: 'Priser | IT Hjelperen Tromsø',
                og_description: 'Se veiledende priser for IT-hjelp, nettsidebygging og diverse tjenester i Tromsø.',
                meta_description:'Se veiledende priser for IT-hjelp, nettsidebygging og diverse tjenester fra IT Hjelperen i Tromsø.'
            },
            '/om': {
                title:'Om oss | IT Hjelperen i Tromsø',
                og_seo_title: 'Om oss | IT Hjelperen',
                og_description: 'Les mer om IT Hjelperen og erfaringen bak IT-support, sikkerhet og tekniske løsninger i Tromsø.',
                meta_description:'Les mer om IT Hjelperen, din lokale IT-partner i Tromsø for IT-support, sikkerhet og tekniske løsninger.'
            },
            '/kontakt': {
                title:'Kontakt | Få IT-hjelp i Tromsø',
                og_seo_title: 'Kontakt | IT Hjelperen Tromsø',
                og_description: 'Ta kontakt med IT Hjelperen for IT-support og teknisk hjelp i Tromsø.',
                meta_description:'Kontakt IT Hjelperen for IT-support og teknisk hjelp i Tromsø. Se tilgjengelighet og ta kontakt på telefon eller e-post.'
            },
            '/nettsidebygging': {
                title:'Nettsidebygging | Få nettside laget i Tromsø',
                og_seo_title: 'Nettsidebygging | IT Hjelperen Tromsø',
                og_description: 'Vi lager enkle, profesjonelle og skreddersydde nettsider for privatpersoner, små bedrifter og organisasjoner i Tromsø.',
                meta_description:'Trenger du nettside i Tromsø? IT Hjelperen lager enkle, profesjonelle og skreddersydde nettsider for privatpersoner, små bedrifter og organisasjoner.'
            }
        };

        return content[routeId] || content['/'];
    }
</script>

<title>{SEOContent.title}</title>
<meta name="description" content="{SEOContent.meta_description}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{pageUrl}">
{#if isHome} <!-- keywords are not often used anymore but why not (they are only for main page) -->
    <meta name="keywords"
        content="it-support, pc-reparasjon, datamaskin, dataservice, pc-hjelp, virusfjerning, nettverk, backup, datasikkerhet, gaming-pc, oppgradering, fjernhjelp, hjemmenettverk, installasjon, teknisk support, it-tjenester, maskinvare, programvare, feilsøking, it-konsulent, nettsidebygging">
    {@html `<script type="application/ld+json">${JSON.stringify(localBusinessSchema)}</script>`}
{/if}
<meta property="og:title" content="{SEOContent.og_seo_title}">
<meta property="og:description" content="{SEOContent.og_description}">
<meta property="og:type" content="website">
<meta property="og:url" content="{pageUrl}">
<meta property="og:site_name" content="IT Hjelperen">
<meta property="og:locale" content="nb_NO">
<meta property="og:image" content="{ogImageUrl}">
<meta property="og:image:alt" content="IT Hjelperen tilbyr IT-hjelp og nettsidebygging i Tromsø">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{SEOContent.og_seo_title}">
<meta name="twitter:description" content="{SEOContent.og_description}">
<meta name="twitter:image" content="{ogImageUrl}">
