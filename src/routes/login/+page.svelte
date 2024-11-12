<script>
	let { data, form } = $props();
</script>

<form method="POST">
	<label
		>Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Log In</button>
</form>

{#if form?.succes}
	<p>You are logged in! You will be redirected shortly.</p>
{/if}
