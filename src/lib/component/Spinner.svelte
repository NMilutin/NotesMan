<script>
	import Icon from '$lib/component/Icon.svelte';
	let { width, height = width } = $props();
</script>

<Icon class="spinner--icon" {width} {height} name="spinner"></Icon>

<style>
	:global(.spinner--icon) {
		animation: spin 1.5s infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
