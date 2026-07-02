<script lang="ts">
	export let icon: string;
	export let title: string;
	export let description: string;
</script>

<div class="bg-light-bg dark:bg-dark-bg border border-slate-300 dark:border-slate-500 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
	<div class="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
		{@html icon}
	</div>
	<h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 transition-colors duration-300">
		{title}
	</h3>
	<p class="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300">
		{description}
	</p>
</div>
