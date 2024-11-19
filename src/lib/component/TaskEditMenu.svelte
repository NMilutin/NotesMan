<script>
	let { data = $bindable(), state } = $props();

	import Icon from '$lib/component/Icon.svelte';
	import { enhance } from '$app/forms';
</script>

<form
	method="POST"
	class="task"
	action="?/update_task"
	use:enhance={({ formData }) => {
		formData.append('taskIdUpdate', data.activeObject.id);
		return async () => {
			state.confirmTaskEdit();
		};
	}}
	style={`--background-color:${data.activeObject.backgroundColor}; --text-color:${data.activeObject.textColor}`}
>
	<input name="name" type="text" bind:value={data.input.name} />
	<input name="date" type="date" bind:value={data.input.date} />
	<textarea name="text" resize="none" bind:value={data.input.text}></textarea>
	<label>
		Background color
		<input name="backgroundColor" type="color" bind:value={data.input.backgroundColor} />
	</label>
	<label>
		Text color
		<input name="textColor" type="color" bind:value={data.input.textColor} />
	</label>
	<button><Icon name="checkmark" width="1.5em"></Icon></button>
</form>

<style lang="scss">
	.task {
		margin: 5% 0;
		width: 50%;
		max-height: 95vh;
		text-align: center;
		border-radius: 1em;
		background-color: var(--background-color);
		box-shadow: rgba(0, 0, 0, 0.3) 0 0.2em 1em;
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 1em;
		position: relative;
	}
</style>
