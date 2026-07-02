<script lang="ts">
	export let badge: string;
	export let title: string;
	export let description: string;
	export let marginBottom: string = 'mb-8';
</script>

<div class="text-center max-w-3xl mx-auto {marginBottom}">
	<span class="inline-block px-4 py-1.5 bg-primary-100 dark:bg-primary-900 dark:bg-opacity-30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-semibold mb-4 transition-colors duration-300">
		{badge}
	</span>
	<h2 class="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
		{title}
	</h2>
	<p class="text-lg text-gray-600 dark:text-gray-400 transition-colors duration-300">
		{description}
	</p>
</div>
