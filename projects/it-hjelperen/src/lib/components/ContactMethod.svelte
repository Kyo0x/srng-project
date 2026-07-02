<script lang="ts">
	export let icon: string;
	export let title: string;
	export let value: string;
	export let href: string;
	export let subtitle: string;
</script>

<div class="flex items-start">
	<div class="flex-shrink-0 w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center transition-colors duration-300">
		{@html icon}
	</div>
	<div class="ml-4">
		<h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">
			{title}
		</h3>
		<a href={href} class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300">
			{value}
		</a>
		<p class="text-sm text-gray-600 dark:text-gray-400 mt-1 transition-colors duration-300">
			{subtitle}
		</p>
	</div>
</div>
