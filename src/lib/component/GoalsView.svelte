<script>
	let { data = $bindable(), state } = $props();

	import Icon from '$lib/component/Icon.svelte';
	import { enhance } from '$app/forms';

	const isSameDay = function (date1, date2) {
		return (
			date1.getDate() === date2.getDate() &&
			date1.getMonth() === date2.getMonth() &&
			date1.getFullYear() === date2.getFullYear()
		);
	};
</script>

<div class="goals__container">
	{#each data.goals as goal, i}
		<div
			class="goal"
			style={`--background-color:${goal.backgroundColor};
        --text-color:${goal.textColor};`}
			data-i={i}
		>
			<h2>{goal.name}</h2>
			<h3>
				{isSameDay(goal.date, new Date())
					? 'Today'
					: goal.date - new Date() > 0
						? 'Finish until ' + goal.date.toDateString()
						: 'Was due ' + goal.date.toDateString()}
			</h3>
			<p>{goal.text}</p>
			<form
				method="POST"
				action="?/do_task"
				use:enhance={({ formData, submitter }) => {
					const taskId = +submitter.closest('.task').dataset.id;
					const task = data.tasks.find((task) => task.id === taskId);
					const taskIndex = data.tasks.indexOf(task);
					state.doTask(taskIndex);
					formData.append('doTaskId', task.id);
					formData.append('done', task.done);
					return;
				}}
				class="goal__tasks"
			>
				{#each goal.tasks as task}
					<div class="task" data-id={task.id}>
						<h4>{task.name}</h4>
						<p>{task.text}</p>
						<button
							>{#if task.done}<Icon name="checkmark" width="1.5em"></Icon>{/if}</button
						>
					</div>
				{/each}
			</form>
			<button
				class="goal-edit"
				onclick={function () {
					state.showGoalEditMenu(goal);
				}}><Icon name="note-edit" width="1.5em"></Icon></button
			>
		</div>
	{/each}
</div>

<style lang="scss">
	.goals__container {
		display: flex;
		flex-direction: column;
		gap: 2em;
		padding: 2em 0;
		align-items: center;
		.goal {
			width: 50%;
			text-align: center;
			border-radius: 1em;
			background-color: #dfdfcf;
			padding: 1em;
			display: flex;
			flex-direction: column;
			gap: 1em;
			position: relative;
			background-color: var(--background-color);
			* {
				color: var(--text-color);
			}
			h2 {
				font-size: 3em;
			}
			h3 {
				font-size: 1.5em;
			}
			.goal__tasks {
				display: flex;
				flex-wrap: wrap;
				gap: 1em;
				justify-content: center;
				.task {
					width: 40%;
					margin-top: 1em;
					padding: 1em;
					border-radius: 1em;
					background-color: rgba(0, 0, 0, 0.15);
					position: relative;
					h4 {
						font-size: 1.3em;
						margin-bottom: 1em;
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
				}
			}
			.goal-edit {
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
		}
	}
</style>
