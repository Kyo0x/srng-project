<script lang="ts">
	export let question: string;
	export let answer: string;
</script>

<div class="bg-white dark:bg-gray-800/50 rounded-lg p-6 transition-all duration-300 border border-slate-300 dark:border-slate-500 hover:shadow-md hover:border-primary-400 dark:hover:border-primary-500">
	<h3 class="font-bold text-gray-900 dark:text-gray-100 mb-3 transition-colors duration-300 text-[18px]">
		{question}
	</h3>
	<p class="text-gray-600 dark:text-gray-400 transition-colors duration-300 text-justify">
		{@html answer}
	</p>
</div>
