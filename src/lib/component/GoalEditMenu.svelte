<script>
	export let data;
	export let state;

	import Icon from '$lib/component/Icon.svelte';
</script>

<div class="goal">
	<h2><input bind:value={data.input.name} /></h2>
	<h3><input type="date" bind:value={data.input.date} /></h3>
	<p><textarea resize="false" bind:value={data.input.text}></textarea></p>
	<div class="task-select__container">
		<div class="tasks__available">
			{#each data.tasks.filter((task) => !data.input.tasks.includes(task)) as task}
				<div class="goal-create__task">
					<span>{task.name}</span><button
						on:click={function () {
							state.addInputGoalTask(task);
						}}><Icon name="btn-move" width="1.5em"></Icon></button
					>
				</div>
			{/each}
		</div>
		<div class="tasks__selected">
			{#each data.input.tasks as task, i}<div class="goal-create__task">
					<span>{task.name}</span><button
						on:click={function () {
							state.removeInputGoalTask(i);
						}}><Icon name="btn-move" width="1.5em"></Icon></button
					>
				</div>{/each}
		</div>
	</div>
</div>

<style lang="scss">
	.goal {
		width: 50%;
		text-align: center;
		border-radius: 1em;
		background-color: #dfdfcf;
		padding: 1em;
		display: flex;
		flex-direction: column;
		gap: 1em;
		h2 {
			font-size: 3em;
		}
		h3 {
			font-size: 1.5em;
		}
	}
</style>
