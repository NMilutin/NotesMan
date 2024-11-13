<script>
	import Icon from '$lib/component/Icon.svelte';
	import { Note } from '$lib/class/Note.svelte.js';
	import { Task } from '$lib/class/Task.svelte.js';
	import { Goal } from '$lib/class/Goal.svelte.js';
	import NotesView from '$lib/component/NotesView.svelte';
	import TasksView from '$lib/component/TasksView.svelte';
	import GoalsView from '$lib/component/GoalsView.svelte';
	import NoteCreateMenu from '$lib/component/NoteCreateMenu.svelte';
	import TaskCreateMenu from '$lib/component/TaskCreateMenu.svelte';
	import GoalCreateMenu from '$lib/component/GoalCreateMenu.svelte';
	import NoteMenu from '$lib/component/NoteMenu.svelte';
	import GoalEditMenu from '$lib/component/GoalEditMenu.svelte';
	import '$lib/style.scss';
	import * as stateJs from '$lib/state.svelte.js';
	const { data: loadData } = $props();
	let data = $state(stateJs.data);
	loadData.notes = loadData.notes.map((note) => JSON.parse(note));
	loadData.tasks = loadData.tasks.map((tasks) => JSON.parse(tasks));
	loadData.goals = loadData.goals.map((goal) => JSON.parse(goal));
	data.notes = loadData.notes.map(({ id, name, text, date, backgroundColor, textColor }) => {
		return new Note(id, name, text, date, backgroundColor, textColor);
	});
	data.tasks = loadData.tasks.map(({ id, name, text, date, backgroundColor, textColor, done }) => {
		return new Task(id, name, text, date, backgroundColor, textColor, done);
	});
	data.goals = loadData.goals.map(
		({ id, name, text, date, backgroundColor, textColor, tasks: tasksJSON }) => {
			const tasks = tasksJSON
				.map((task) => JSON.parse(task))
				.map(({ id: taskId }) => data.tasks.find((task) => task.id === taskId));
			return new Goal(id, name, text, date, backgroundColor, textColor, ...tasks);
		}
	);
</script>

<header>
	<div class="note__types">
		{#each data.types as type}
			<button
				data-type={type.name}
				class="note-type"
				class:note-type__active={type.active}
				onclick={function (e) {
					stateJs.changeType(e);
				}}
			>
				{type.name}
			</button>
		{/each}
	</div>
	<button
		class={`note-add ${data.types.find((type) => type.name === 'All')?.active ? 'effect__disabled' : ''}`}
		onclick={stateJs.showCreateMenu}
		><Icon name="note-add" class="note-add__icon" height="100%" width="3em"></Icon></button
	>
</header>
<main>
	{#if data.types.find((type) => type.name === 'Notes').active}<NotesView {data} state={stateJs}
		></NotesView>{/if}
	{#if data.types.find((type) => type.name === 'Tasks').active}<TasksView {data} state={stateJs}
		></TasksView>{/if}
	{#if data.types.find((type) => type.name === 'Goals').active}<GoalsView {data} state={stateJs}
		></GoalsView>{/if}
</main>
{#if data.overlayOn}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore event_directive_deprecated -->
	<div
		class="overlay"
		onclick={function (e) {
			if (e.target.classList.contains('overlay')) {
				stateJs.hideOverlay();
				stateJs.clearInput();
			}
		}}
	>
		{#if data.noteCreateMenuOn}<NoteCreateMenu {data} state={stateJs}></NoteCreateMenu>{/if}
		{#if data.taskCreateMenuOn}<TaskCreateMenu {data} state={stateJs}></TaskCreateMenu>{/if}
		{#if data.goalCreateMenuOn}<GoalCreateMenu {data} state={stateJs}></GoalCreateMenu>{/if}
		{#if data.noteMenuOn}<NoteMenu {data} state={stateJs}></NoteMenu>{/if}
		{#if data.goalEditMenuOn}<GoalEditMenu {data} state={stateJs}></GoalEditMenu>{/if}
	</div>
{/if}

<!-- TODO: baza podataka, login i signup, backup podataka-->
<style lang="scss">
	header {
		display: flex;
		width: 100%;
		.note__types {
			display: flex;
			flex: 9;
			.note-type {
				flex: 1;
				text-align: center;
				padding: 20px;
				border-bottom: #fff solid 5px;
				transition: border-color 0.3s ease-in-out;
				user-select: none;
				background-color: inherit;
				&:hover:not(&__active) {
					border-color: #ababab;
				}
				&__active {
					border-color: #343434;
				}
			}
		}
		.note-add {
			flex: 1;
			background-color: inherit;
			&.effect__disabled {
				filter: opacity(0.3);
			}
		}
	}
	main {
		position: relative;
	}

	.overlay {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		backdrop-filter: blur(2px);
		animation: fadein 0.3s ease-in-out;
		display: flex;
		justify-content: center;
	}

	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
