<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/component/Icon.svelte';
	let { data } = $props();
</script>

<form
	method="POST"
	use:enhance={() => {
		invalidateAll();
	}}
>
	{#if data?.code === 'NOT_EXIST'}
		<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
	{/if}
	<label
		>Email
		<input name="email" type="email" />
	</label>
	{#if data?.code === 'WRONG_PAS'}
		<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
	{/if}
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Log In</button>
	{#if data?.code === 'NOT_ACT'}
		<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
	{/if}
</form>
