<script>
	let { data = $bindable(), state } = $props();
	import Icon from '$lib/component/Icon.svelte';
	import { enhance } from '$app/forms';
</script>

<form
	class="create-menu"
	method="POST"
	action="?/create_task"
	use:enhance={() => {
		return async ({ result }) => {
			state.addTask(result.data.taskId);
			state.hideOverlay();
		};
	}}
>
	<h1>New Task</h1>
	<div class="input-container">
		<input name="name" type="text" placeholder="Name your task..." bind:value={data.input.name} />
		<input name="date" type="date" bind:value={data.input.date} />
		<textarea name="text" placeholder="Your task description..." bind:value={data.input.text}
		></textarea>
	</div>
	<label>
		Background color
		<input name="backgroundColor" type="color" bind:value={data.input.backgroundColor} />
	</label>
	<label>
		Text color
		<input name="textColor" type="color" bind:value={data.input.textColor} />
	</label>
	<button class="btn__create-note">Create Task</button>
</form>

<style lang="scss">
	.create-menu {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 5vh 30em 10em;
		border-radius: 3em;
		box-shadow: rgba(0, 0, 0, 0.3) 0 0.2em 1em;
		border: 3px solid #ababab;
		background-color: #fff;
		max-height: 95vh;
		& > * {
			min-height: 0;
		}
		h1 {
			flex: 1;
			text-align: center;
			padding: 1em;
			font-size: 1.5em;
		}
		.input-container {
			flex: 3;
			padding: 0 10%;
			text-align: center;
			input {
				outline: none;
			}
			textarea {
				outline: none;
				resize: none;
				width: 100%;
				margin: 2em 0;
				max-width: 20em;
				text-align: center;
				min-height: 10em;
			}
		}
		.btn__create-note {
			flex: 1;
			padding: 2em;
			background-color: inherit;
		}
		input[type='color'] {
			outline: none;
		}
	}
</style>
