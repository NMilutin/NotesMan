<script>
	let { data = $bindable(), state } = $props();
	import Icon from '$lib/component/Icon.svelte';
	import { enhance } from '$app/forms';
</script>

<form
	method="POST"
	class="create-menu"
	action="?/none"
	use:enhance={({ formData, submitter, cancel }) => {
		if (submitter.dataset.isSubmitButton !== 'true') {
			cancel();
			return;
		}
		const taskIds = data.input.tasks.map((task) => task.id);
		formData.append('taskIds', JSON.stringify(taskIds));
		return async ({ result }) => {
			state.addGoal(result.data.goalId);
			state.hideOverlay();
		};
	}}
>
	<h1>New Goal</h1>
	<div class="input-container">
		<input name="name" type="text" placeholder="Name your goal..." bind:value={data.input.name} />
		<input name="date" type="date" bind:value={data.input.date} />
		<textarea name="text" placeholder="Your goal description..." bind:value={data.input.text}
		></textarea>
	</div>
	<div class="task-select__container">
		<div class="tasks__available">
			{#each data.tasks.filter((task) => !data.input.tasks.includes(task)) as task}
				<div class="goal-create__task">
					<span>{task.name}</span><button
						onclick={function () {
							state.addInputGoalTask(task);
						}}><Icon name="btn-move" width="1.5em"></Icon></button
					>
				</div>
			{/each}
		</div>
		<div class="tasks__selected">
			{#each data.input.tasks as task, i}<div class="goal-create__task">
					<span>{task.name}</span><button
						onclick={function () {
							state.removeInputGoalTask(i);
						}}><Icon name="btn-move" width="1.5em"></Icon></button
					>
				</div>{/each}
		</div>
	</div>
	<label>
		Background color
		<input name="backgroundColor" type="color" bind:value={data.input.backgroundColor} />
	</label>
	<label>
		Text color
		<input name="textColor" type="color" bind:value={data.input.textColor} />
	</label>
	<button data-is-submit-button="true" formaction="?/create_goal" class="btn__create-note"
		>Create Goal</button
	>
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
		.task-select__container {
			display: flex;
			flex: 3;
			width: 90%;
			.tasks__available,
			.tasks__selected {
				flex: 1;
				padding: 1em;
				overflow-y: auto;
				scrollbar-gutter: stable;
				margin: 0.5em;
				.goal-create__task {
					height: 3.5em;
					padding: 0.5em;
					display: flex;
					align-items: center;
					span {
						flex: 1;
						display: block;
					}
					button {
						flex: 0;
						background-color: rgba(0, 0, 0, 0.15);
						border-radius: 50%;
						width: 2.5em;
						height: 2.5em;
						padding: 0.3em;
						border: #343434 solid 2px;
						cursor: pointer;
					}
				}
			}
			.tasks__selected {
				direction: rtl;
				.goal-create__task {
					& > * {
						direction: ltr;
					}
				}
			}
		}
		input[type='color'] {
			outline: none;
		}
	}
</style>
