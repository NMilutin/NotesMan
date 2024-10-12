<script>
	export let menu = 'note';
</script>

{#if menu === 'note'}
	<div class="create-menu">
		<h1>New Note</h1>
		<div class="input-container">
			<input type="text" placeholder="Name your note..." bind:value={input.name} />
			<input type="date" bind:value={input.date} />
			<textarea placeholder="Your note content..." bind:value={input.text}></textarea>
		</div>
		<button class="btn__create-note" on:click={addNote}>Create Note</button>
	</div>
{/if}
{#if menu === 'task'}
	<div class="create-menu">
		<h1>New Task</h1>
		<div class="input-container">
			<input type="text" placeholder="Name your task..." bind:value={input.name} />
			<input type="date" bind:value={input.date} />
			<textarea placeholder="Your task description..." bind:value={input.text}></textarea>
		</div>
		<button class="btn__create-note" on:click={addTask}>Create Task</button>
	</div>
{/if}
{#if menu === 'goal'}
	<div class="create-menu">
		<h1>New Goal</h1>
		<div class="input-container">
			<input type="text" placeholder="Name your goal..." bind:value={input.name} />
			<input type="date" bind:value={input.date} />
			<textarea placeholder="Your goal description..." bind:value={input.text}></textarea>
		</div>
		<div class="task-select__container">
			<div class="tasks__available">
				{#each data.tasks.filter((task) => !input.goalTasks.includes(task)) as task}
					<div class="goal-create__task">
						<span>{task.name}</span><button
							on:click={function () {
								input.goalTasks.push(task);
								input = input;
							}}><Icon name="btn-move" width="1.5em"></Icon></button
						>
					</div>
				{/each}
			</div>
			<div class="tasks__selected">
				{#each input.goalTasks as task, i}<div class="goal-create__task">
						<span>{task.name}</span><button
							on:click={function () {
								input.goalTasks.splice(i, 1);
								input = input;
							}}><Icon name="btn-move" width="1.5em"></Icon></button
						>
					</div>{/each}
			</div>
		</div>
		<button class="btn__create-note" on:click={addGoal}>Create Goal</button>
	</div>
{/if}
