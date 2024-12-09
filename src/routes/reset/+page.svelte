<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
</script>

<form method="POST">
	<input name="email" type="email" />
	<button>Reset Password</button>
</form>
