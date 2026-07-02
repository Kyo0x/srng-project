<script lang="ts">
	export let title: string;
	export let description: string;
</script>

<div class="flex items-start space-x-3 bg-light-surface dark:bg-dark-surface border border-slate-300 dark:border-slate-500 p-4 rounded-xl transition-all duration-300 hover:shadow-lg">
	<svg class="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
	</svg>
	<div>
		<h3 class="font-bold text-gray-900 dark:text-gray-100 mb-1 transition-colors duration-300">
			{title}
		</h3>
		<p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed transition-colors duration-300">
			{description}
		</p>
	</div>
</div>
