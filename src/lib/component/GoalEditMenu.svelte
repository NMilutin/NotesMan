<script>
	let { data = $bindable(), state } = $props();

	import Icon from '$lib/component/Icon.svelte';
</script>

<div
	class="goal"
	style={`--background-color:${data.activeObject.backgroundColor}; --text-color:${data.activeObject.textColor}`}
>
	<h2><input bind:value={data.input.name} /></h2>
	<h3><input type="date" bind:value={data.input.date} /></h3>
	<p><textarea resize="false" bind:value={data.input.text}></textarea></p>
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
	<button
		class="goal-del"
		onclick={function () {
			state.delGoal(data.activeObject);
		}}><Icon name="note-del" width="1.5em"></Icon></button
	>
	<button class="goal-accept" onclick={state.confirmGoalEdit}
		><Icon name="checkmark" width="1.5em"></Icon></button
	>
	<label>
		Background color
		<input type="color" bind:value={data.input.backgroundColor} />
	</label>
	<label>
		Text color
		<input type="color" bind:value={data.input.textColor} />
	</label>
</div>

<style lang="scss">
	.goal {
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
		* {
			color: var(--text-color);
		}
		& > * {
			min-height: 0;
		}
		h2 {
			font-size: 3em;
			input {
				font: inherit;
				background-color: inherit;
				outline: none;
				text-align: center;
			}
		}
		h3 {
			font-size: 1.3em;
			font-weight: 400;
			input {
				font: inherit;
				background-color: inherit;
				outline: none;
			}
		}
		p {
			height: 30%;
			textarea {
				font: inherit;
				resize: none;
				background-color: inherit;
				outline: none;
				text-align: center;
				min-width: 70%;
				height: 100%;
			}
		}
		.task-select__container {
			display: flex;
			.tasks__available,
			.tasks__selected {
				flex: 1;
				padding: 1em;
				overflow-y: auto;
				scrollbar-gutter: stable;
				margin: 0.5em;
				box-shadow: inset 1px 1px 10px 3px rgba(0, 0, 0, 0.3);
				border-radius: 1em;
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
		button {
			&.goal-del,
			&.goal-accept {
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
			&.goal-del {
				left: 0.75em;
			}
		}
		input[type='color'] {
			background-color: var(--background-color);
		}
	}
</style>
