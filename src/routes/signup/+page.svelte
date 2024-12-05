<script>
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import Icon from '$lib/component/Icon.svelte';
	let { data } = $props();
</script>

{#if data.code && data?.code !== 'OK'}
	<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
{/if}
<form
	method="POST"
	use:enhance={() => {
		invalidate('/register');
	}}
>
	<label
		>Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<label>
		Repeat Password
		<input name="repeatPassword" type="password" />
	</label>
	<button>Sign Up</button>
</form>
