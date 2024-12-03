<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/component/Icon.svelte';
	let { data } = $props();
</script>

<p>
	Enter the code you recieved on {data.email}, it will expire after 10 minutes. Also check your spam
	folder.
</p>
{#if data?.code === 'BAD_LEN'}
	<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
{/if}
{#if data?.code === 'BAD_CHAR'}
	<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
{/if}
<form
	method="POST"
	action="?/activate"
	use:enhance={() => {
		invalidateAll();
	}}
>
	<input name="code" />
	<button>Activate account</button>
</form>
