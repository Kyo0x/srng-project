<script lang="ts">
	export let day: string;
	export let hours: string;
	export let isLast: boolean = false;
</script>

<div class="flex justify-between items-center py-2 {isLast ? '' : 'border-b border-gray-200 dark:border-gray-700'} transition-colors duration-300">
	<span class="font-medium text-gray-900 dark:text-gray-100 transition-colors duration-300">
		{day}
	</span>
	<span class="text-gray-600 dark:text-gray-400 transition-colors duration-300">
		{hours}
	</span>
</div>
