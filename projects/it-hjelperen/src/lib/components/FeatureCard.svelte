<script lang="ts">
	export let icon: string;
	export let title: string;
	export let description: string;
</script>

<div class="bg-light-bg dark:bg-dark-bg border border-slate-300 dark:border-slate-500 p-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl">
	<div class="flex items-start space-x-3 mb-2">
		<div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300">
			{@html icon}
		</div>
		<h3 class="font-bold text-gray-900 dark:text-gray-100 text-xl transition-colors duration-300 mt-1.5">
			{title}
		</h3>
	</div>
	<p class="text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-300 text-sm text-justify">
		{description}
	</p>
</div>
