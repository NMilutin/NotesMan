<script>
	let { data = $bindable(), state } = $props();

	import Icon from '$lib/component/Icon.svelte';
	import { enhance } from '$app/forms';
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<h1 onclick={state.toggleTaskDatePicker}>
	{#if data.taskDatePickerOn}<input
			type="date"
			bind:value={data.taskDate}
			onchange={state.onTaskDayChange}
		/>{/if}
	{#if !data.taskDatePickerOn}{new Date(data.taskDate).toDateString()}{/if}
</h1>
<div class="tasks__container">
	{#each data.tasks as task, i}
		{#if new Date(data.taskDate).getDate() === task.date.getDate() && new Date(data.taskDate).getMonth() === task.date.getMonth() && new Date(data.taskDate).getFullYear() === task.date.getFullYear()}
			<form
				method="POST"
				use:enhance={({ formData, submitter, cancel }) => {
					if (submitter.classList.contains('task-del')) {
						formData.append('deleteTaskId', data.tasks.at(+submitter.dataset.i).id);
						state.delTask(+submitter.dataset.i);
					} else if (submitter.classList.contains('task-do')) {
					} else {
						cancel();
						return;
					}
				}}
				action="?/none"
				class="task"
				style={`--background-color:${task.backgroundColor};
        --text-color:${task.textColor};`}
				data-i={i}
			>
				<div class="task-title">
					<button
						class="task-do"
						onclick={function () {
							state.doTask(i);
						}}
						>{#if task.done}<Icon name="checkmark" width="1.5em"></Icon>{/if}</button
					>
					<h2>{task.name}</h2>
					<button class="task-del" formaction="?/delete_task"
						><Icon name="note-del" width="1.5em"></Icon></button
					>
				</div>
				<p>{task.text}</p>
			</form>
		{/if}
	{/each}
</div>
<button
	class="task-prev"
	onclick={function () {
		state.changeTaskDay(
			new Date(new Date(data.taskDate).setDate(new Date(data.taskDate).getDate() - 1))
				.toISOString()
				.slice(0, 10)
		);
	}}><Icon name="btn-prev" width="1.5em"></Icon></button
>
<button
	class="task-next"
	onclick={function () {
		state.changeTaskDay(
			new Date(new Date(data.taskDate).setDate(new Date(data.taskDate).getDate() + 1))
				.toISOString()
				.slice(0, 10)
		);
	}}><Icon name="btn-next" width="1.5em"></Icon></button
>

<style lang="scss">
	.tasks__container {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3em;
		padding: 5em;
		.task {
			width: 50%;
			text-align: center;
			border-radius: 1em;
			background-color: var(--background-color);
			* {
				color: var(--text-color);
			}
			.task-title {
				display: flex;
				position: relative;
				background-color: rgba(0, 0, 0, 0.1);
				border-top-left-radius: 1em;
				border-top-right-radius: 1em;
				h2 {
					width: 100%;
					font-size: 1.5em;
					padding: 0.75em;
				}
				button {
					position: absolute;
					top: 0.75em;
					right: 0.75em;
					background-color: rgba(255, 255, 255, 0.25);
					border-radius: 50%;
					width: 2.5em;
					height: 2.5em;
					padding: 0.3em;
					border: #343434 solid 2px;
					cursor: pointer;
				}
				.task-do {
					left: 0.75em;
				}
			}
			p {
				padding: 1em;
			}
		}
	}
	.task-prev,
	.task-next {
		position: absolute;
		top: 2.5em;
		background-color: rgba(0, 0, 0, 0.15);
		width: 2.5em;
		height: 2.5em;
		padding: 0.3em;
		border: #343434 solid 2px;
		border-radius: 50%;
	}
	.task-prev {
		left: 35%;
	}
	.task-next {
		right: 35%;
	}
	h1 {
		font-size: 2em;
		text-align: center;
		padding: 1em;
		cursor: pointer;
		user-select: none;
	}
</style>
