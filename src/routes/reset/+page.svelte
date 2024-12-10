<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/component/Icon.svelte';
	let { data } = $props();
</script>

<form
	method="POST"
	action="?/send"
	use:enhance={() => {
		invalidateAll();
		return ({ cancel }) => {
			cancel();
		};
	}}
>
	<input name="email" type="email" />
	<button>Reset Password</button>
</form>
{#if !data.succes && data.code}
	<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
{/if}
{#if data.submitted}
	<div class="message"><span>Password reset email sent. Check your spam folder too.</span></div>
{/if}
