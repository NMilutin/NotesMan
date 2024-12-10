<script>
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import Icon from '$lib/component/Icon.svelte';
	let { data } = $props();
</script>

{#if data.email}
	<p>Reset the password for {data.email}</p>
{/if}
<form
	method="POST"
	action="?/reset"
	use:enhance={() => {
		invalidateAll();
	}}
>
	<label>
		New Password
		<input type="password" name="newPassword" />
	</label>
	<label>
		Repeat Password
		<input type="password" name="repeatPassword" />
	</label>
	<button>Reset Password</button>
</form>
{#if !data.succes && data.code}
	<div class="error"><Icon name="error"></Icon><span>{data?.message}</span></div>
{/if}
{#if data.succes}
	<div class="message"><span>Password sent successfuly</span></div>
{/if}
