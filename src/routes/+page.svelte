<script>
	import Icon from '$lib/component/Icon.svelte';
</script>

<header>
	<nav>
		<div class="logo">
			<Icon name="notepad" width="4em"></Icon>
			<h1>NotesMan</h1>
		</div>
		<div class="links">
			<a href="/signup">Sign Up</a>
			<a href="/login">Log In</a>
		</div>
	</nav>
</header>

<style lang="scss">
	header {
		font-family: 'sans';
		nav {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding-right: 5em;
			.logo {
				display: flex;
				align-items: center;
			}
			.links {
				display: flex;
				justify-content: center;
				gap: 2em;
				a {
					color: inherit;
					text-decoration: none;
				}
			}
		}
	}
</style>
